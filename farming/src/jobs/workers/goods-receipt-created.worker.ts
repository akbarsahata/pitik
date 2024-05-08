import { JobsOptions } from 'bullmq';
import { Inject, Service } from 'fastify-decorators';
import { QueryRunner } from 'typeorm';
import { BranchSapronakStockDAO } from '../../dao/branchSapronakStock.dao';
import { ErpDAO } from '../../dao/erp.dao';
import { SlackDAO } from '../../dao/external/slack.dao';
import { FarmingCycleDAO } from '../../dao/farmingCycle.dao';
import { FarmingCycleFeedStockDDAO } from '../../dao/farmingCycleFeedStockD.dao';
import { FarmingCycleFeedStockSummaryDAO } from '../../dao/farmingCycleFeedStockSummary.dao';
import { FarmingCycleOvkStockLogDAO } from '../../dao/farmingCycleOvkStockLog.dao';
import { FarmingCycleOvkStockSummaryDAO } from '../../dao/farmingCycleOvkStockSummary.dao';
import { GoodsReceiptDAO } from '../../dao/goodsReceipt.dao';
import { TransferRequestDAO } from '../../dao/transferRequest.dao';
import { FarmChickCategory } from '../../datasources/entity/pgsql/Farm.entity';
import { FeedStockOperatorEnum } from '../../datasources/entity/pgsql/FarmingCycleFeedStockD.entity';
import { OvkStockOperatorEnum } from '../../datasources/entity/pgsql/FarmingCycleOvkStockLog.entity';
import { GoodsReceipt } from '../../datasources/entity/pgsql/GoodsReceipt.entity';
import { GoodsReceiptProduct } from '../../datasources/entity/pgsql/GoodsReceiptProduct.entity';
import { QUEUE_GOODS_RECEIPT_CREATED } from '../../libs/constants/queue';
import { GoodsReceiptCreatedJobData } from '../../libs/interfaces/job-data';
import { RequestUser } from '../../libs/types/index.d';
import { Logger } from '../../libs/utils/logger';
import { DailyMonitoringService } from '../../services/dailyMonitoring.service';
import { BaseWorker } from './base.worker';

@Service()
export class GoodsReceiptCreatedWorker extends BaseWorker<GoodsReceiptCreatedJobData> {
  @Inject(GoodsReceiptDAO)
  private grDAO: GoodsReceiptDAO;

  @Inject(DailyMonitoringService)
  private dailyMonitoringService: DailyMonitoringService;

  @Inject(ErpDAO)
  private erpDAO: ErpDAO;

  @Inject(FarmingCycleFeedStockDDAO)
  private farmingCycleFeedStockDDAO: FarmingCycleFeedStockDDAO;

  @Inject(FarmingCycleFeedStockSummaryDAO)
  private fcFeedStockSummaryDAO: FarmingCycleFeedStockSummaryDAO;

  @Inject(SlackDAO)
  private slackDAO!: SlackDAO;

  @Inject(FarmingCycleOvkStockLogDAO)
  private fcOvkStockLogDAO: FarmingCycleOvkStockLogDAO;

  @Inject(FarmingCycleOvkStockSummaryDAO)
  private fcOvkStockSummaryDAO: FarmingCycleOvkStockSummaryDAO;

  @Inject(TransferRequestDAO)
  private transferRequestDAO: TransferRequestDAO;

  @Inject(BranchSapronakStockDAO)
  private branchSapronakStockDAO: BranchSapronakStockDAO;

  @Inject(Logger)
  private logger: Logger;

  @Inject(FarmingCycleDAO)
  private farmingCycleDAO!: FarmingCycleDAO;

  protected workerName = QUEUE_GOODS_RECEIPT_CREATED;

  protected async handle(
    data: GoodsReceiptCreatedJobData,
    attemptsMade: number,
    opts: JobsOptions,
    jobId?: string,
  ): Promise<void> {
    const queryRunner = await this.grDAO.startTransaction();

    try {
      const gr = await this.grDAO.getOneStrict({
        where: {
          id: data.id,
        },
        select: {
          id: true,
          purchaseOrderId: true,
          transferRequestId: true,
          purchaseOrder: {
            id: true,
            farmingCycleId: true,
            erpCode: true,
            purchaseOrderProducts: true,
            createdDate: true,
          },
          transferRequest: {
            erpCode: true,
            farmingCycleId: true,
            coopSource: {
              activeFarmingCycleId: true,
            },
            coopTarget: {
              activeFarmingCycleId: true,
            },
            farmingCycleTargetId: true,
            createdDate: true,
            transferRequestProducts: true,
          },
          userReporter: {
            id: true,
            userType: true,
            phoneNumber: true,
          },
        },
        relations: {
          purchaseOrder: {
            purchaseOrderProducts: true,
          },
          transferRequest: {
            coopSource: true,
            coopTarget: true,
            transferRequestProducts: true,
          },
          goodsReceiptProducts: true,
          userReporter: true,
        },
        relationLoadStrategy: 'join',
      });

      const user = {
        id: gr.userReporter.id,
        role: gr.userReporter.userType,
      };

      const farmingCycleReceiverId =
        gr.purchaseOrder?.farmingCycleId || gr.transferRequest?.farmingCycleTargetId!;

      const erpCode = await this.erpDAO.createGoodsReceipt(gr);

      await this.grDAO.updateOneWithTx(
        {
          id: gr.id,
        },
        {
          erpCode,
        },
        {
          id: gr.userReporter.id,
          role: gr.userReporter.userType,
        },
        queryRunner,
      );

      await gr.goodsReceiptProducts.reduce(async (prev, val) => {
        await prev;

        switch (val.categoryCode.toUpperCase()) {
          case 'PAKAN':
            if (!val.isReturned) {
              await this.receiveFeedStock(gr, val, farmingCycleReceiverId, user, queryRunner);
            } else if (val.isReturned && gr.transferRequestId) {
              await this.returnTransferRequestFeedStock(
                gr,
                val,
                gr.transferRequest?.farmingCycleId!,
                queryRunner,
              );
            }
            break;
          case 'OVK':
            if (!val.isReturned) {
              await this.receiveOvkStock(gr, val, farmingCycleReceiverId, user, queryRunner);
            } else if (val.isReturned && gr.transferRequestId) {
              await this.returnTransferRequestOvkStock(
                gr,
                val,
                gr.transferRequest?.farmingCycleId!,
                queryRunner,
              );
            }
            break;
          default:
            break;
        }
      }, Promise.resolve());

      await this.grDAO.commitTransaction(queryRunner);

      const calculateDailyMonitoringPromises = [
        this.dailyMonitoringService.manualTriggerDailyMonitoringCalculation(
          gr.purchaseOrder?.farmingCycleId || gr.transferRequest?.coopSource?.activeFarmingCycleId!,
        ),
      ];

      if (gr.transferRequest?.farmingCycleId) {
        calculateDailyMonitoringPromises.push(
          this.dailyMonitoringService.manualTriggerDailyMonitoringCalculation(
            gr.transferRequest.farmingCycleId,
          ),
        );
      }

      await Promise.all(calculateDailyMonitoringPromises);
    } catch (error) {
      await this.grDAO.rollbackTransaction(queryRunner);

      this.logger.error(error);

      if (attemptsMade === opts.attempts) {
        await this.slackDAO.alertFailedJobs(this.workerName, error, data, jobId);
      }

      throw error;
    }
  }

  private async receiveFeedStock(
    gr: GoodsReceipt,
    val: GoodsReceiptProduct,
    farmingCycleId: string,
    user: RequestUser,
    queryRunner: QueryRunner,
  ): Promise<void> {
    const productDetail = `${val.subcategoryCode}:${val.subcategoryName}:${val.productCode}:${val.productName}`;
    const { farm } = await this.farmingCycleDAO.getOneStrict({
      where: { farmingCycleId },
      relations: { farm: true },
      select: { farm: { category: true } },
    });
    const uom = farm.category === FarmChickCategory.LAYER ? 'kilogram' : 'karung';

    // for layer it is assumed the qty received is already in kilogram
    await this.farmingCycleFeedStockDDAO.upsertOneWithTx(
      {
        farmingCycleId,
        qty: val.quantity,
        operator: FeedStockOperatorEnum.PLUS,
        notes: `feed_stock_plus - gr_id:${gr.id}`,
        productDetail,
      },
      {
        farmingCycleId,
        qty: val.quantity,
        operator: FeedStockOperatorEnum.PLUS,
        notes: `feed_stock_plus - gr_id:${gr.id}`,
        productDetail,
        uom,
      },
      user,
      queryRunner,
    );

    const feedStockSummary = await this.fcFeedStockSummaryDAO.getOneWithTx(
      {
        where: {
          farmingCycleId,
          subcategoryCode: val.subcategoryCode,
          subcategoryName: val.subcategoryCode,
          productCode: val.productCode,
        },
      },
      queryRunner,
    );

    if (!feedStockSummary) {
      await this.fcFeedStockSummaryDAO.createOneWithTx(
        {
          farmingCycleId,
          subcategoryCode: val.subcategoryCode,
          subcategoryName: val.subcategoryCode,
          productCode: val.productCode,
          productName: val.productName,
          remainingQuantity: val.quantity,
          bookedQuantity: 0,
          uom,
        },
        user,
        queryRunner,
      );
    } else {
      await this.fcFeedStockSummaryDAO.incrementRemainingQuantityWithTx(
        {
          farmingCycleId,
          subcategoryCode: feedStockSummary.subcategoryCode,
          subcategoryName: feedStockSummary.subcategoryName,
          productCode: feedStockSummary.productCode,
          productName: feedStockSummary.productName,
        },
        val.quantity,
        user,
        queryRunner,
      );
    }
  }

  private async receiveOvkStock(
    gr: GoodsReceipt,
    val: GoodsReceiptProduct,
    farmingCycleId: string,
    user: RequestUser,
    queryRunner: QueryRunner,
  ): Promise<void> {
    await this.fcOvkStockLogDAO.upsertStockWithTx(
      {
        farmingCycleId,
        quantity: val.quantity,
        operator: OvkStockOperatorEnum.PLUS,
        notes: `ovk_stock_plus - gr_id:${gr.id}`,
        subcategoryCode: val.subcategoryCode,
        subcategoryName: val.subcategoryName,
        productCode: val.productCode,
        productName: val.productName,
        uom: val.uom || 'buah',
      },
      user,
      queryRunner,
    );

    const ovkStockSummary = await this.fcOvkStockSummaryDAO.getOneWithTx(
      {
        where: {
          farmingCycleId,
          subcategoryCode: val.subcategoryCode,
          subcategoryName: val.subcategoryCode,
          productCode: val.productCode,
          productName: val.productName,
          uom: val.uom,
        },
      },
      queryRunner,
    );

    if (!ovkStockSummary) {
      await this.fcOvkStockSummaryDAO.createOneWithTx(
        {
          farmingCycleId,
          subcategoryCode: val.subcategoryCode,
          subcategoryName: val.subcategoryCode,
          productCode: val.productCode,
          productName: val.productName,
          remainingQuantity: val.quantity,
          bookedQuantity: 0,
          uom: val.uom,
        },
        user,
        queryRunner,
      );
    } else {
      await this.fcOvkStockSummaryDAO.incrementRemainingQuantityWithTx(
        {
          farmingCycleId,
          subcategoryCode: ovkStockSummary.subcategoryCode,
          subcategoryName: ovkStockSummary.subcategoryName,
          productCode: ovkStockSummary.productCode,
          productName: ovkStockSummary.productName,
          uom: val.uom,
        },
        val.quantity,
        user,
        queryRunner,
      );
    }
  }

  private async returnTransferRequestFeedStock(
    gr: GoodsReceipt,
    val: GoodsReceiptProduct,
    farmingCycleId: string,
    queryRunner: QueryRunner,
  ): Promise<void> {
    const transferRequest = await this.transferRequestDAO.getOneStrict({
      where: {
        id: gr.transferRequestId,
      },
    });

    switch (transferRequest.route) {
      case 'COOP-TO-COOP':
        await this.fcFeedStockSummaryDAO.incrementRemainingQuantityWithTx(
          {
            farmingCycleId,
            subcategoryCode: val.subcategoryCode,
            subcategoryName: val.subcategoryName,
            productCode: val.productCode,
            productName: val.productName,
          },
          val.quantity,
          {
            id: gr.userReporter.id,
            role: gr.userReporter.userType,
          },
          queryRunner,
        );

        await this.farmingCycleFeedStockDDAO.deleteManyWithTx(
          {
            farmingCycleId,
            operator: '-',
            notes: `feed_stock_minus - tr_id:${transferRequest.id}`,
            productDetail: `${val.subcategoryCode}:${val.subcategoryName}:${val.productCode}:${val.productName}`,
          },
          queryRunner,
        );

        break;
      case 'BRANCH-TO-COOP':
        await this.branchSapronakStockDAO.incrementQuantityWithTx(
          {
            branchId: transferRequest.branchSourceId!,
            productCode: val.productCode,
          },
          1 * val.quantity,
          {
            id: transferRequest.userRequester.id,
            role: transferRequest.userRequester.userType,
          },
          queryRunner,
        );

        break;
      default:
        break;
    }
  }

  private async returnTransferRequestOvkStock(
    gr: GoodsReceipt,
    val: GoodsReceiptProduct,
    farmingCycleId: string,
    queryRunner: QueryRunner,
  ): Promise<void> {
    const transferRequest = await this.transferRequestDAO.getOneStrict({
      where: {
        id: gr.transferRequestId,
      },
    });

    switch (transferRequest.route) {
      case 'COOP-TO-COOP':
        await this.fcOvkStockSummaryDAO.incrementRemainingQuantityWithTx(
          {
            farmingCycleId,
            subcategoryCode: val.subcategoryCode,
            subcategoryName: val.subcategoryName,
            productCode: val.productCode,
            productName: val.productName,
          },
          val.quantity,
          {
            id: gr.userReporter.id,
            role: gr.userReporter.userType,
          },
          queryRunner,
        );

        await this.fcOvkStockLogDAO.deleteManyWithTx(
          {
            farmingCycleId,
            operator: OvkStockOperatorEnum.MINUS,
            notes: `ovk_stock_minus - tr_id:${transferRequest.id}`,
            productCode: val.productCode,
          },
          queryRunner,
        );

        break;
      case 'BRANCH-TO-COOP':
        await this.branchSapronakStockDAO.incrementQuantityWithTx(
          {
            branchId: transferRequest.branchSourceId!,
            productCode: val.productCode,
          },
          1 * val.quantity,
          {
            id: transferRequest.userRequester.id,
            role: transferRequest.userRequester.userType,
          },
          queryRunner,
        );

        break;
      default:
        break;
    }
  }
}
