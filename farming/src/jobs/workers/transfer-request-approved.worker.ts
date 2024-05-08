import { JobsOptions } from 'bullmq';
import { Inject, Service } from 'fastify-decorators';
import { BranchSapronakStockDAO } from '../../dao/branchSapronakStock.dao';
import { ErpDAO } from '../../dao/erp.dao';
import { SlackDAO } from '../../dao/external/slack.dao';
import { FarmingCycleFeedStockDDAO } from '../../dao/farmingCycleFeedStockD.dao';
import { FarmingCycleFeedStockSummaryDAO } from '../../dao/farmingCycleFeedStockSummary.dao';
import { FarmingCycleOvkStockLogDAO } from '../../dao/farmingCycleOvkStockLog.dao';
import { FarmingCycleOvkStockSummaryDAO } from '../../dao/farmingCycleOvkStockSummary.dao';
import { TransferRequestDAO } from '../../dao/transferRequest.dao';
import { ErpTransferRequestCreate } from '../../datasources/entity/erp/ERPProduct';
import { OvkStockOperatorEnum } from '../../datasources/entity/pgsql/FarmingCycleOvkStockLog.entity';
import { QUEUE_TRANSFER_REQUEST_APPROVED } from '../../libs/constants/queue';
import { TransferRequestApprovedJobData } from '../../libs/interfaces/job-data';
import { GoodsReceiptUtil } from '../../libs/utils/goodsReceipt';
import { Logger } from '../../libs/utils/logger';
import { BaseWorker } from './base.worker';

@Service()
export class TransferRequestApprovedWorker extends BaseWorker<TransferRequestApprovedJobData> {
  @Inject(TransferRequestDAO)
  private transferRequestDAO: TransferRequestDAO;

  @Inject(ErpDAO)
  private erpDAO: ErpDAO;

  @Inject(FarmingCycleFeedStockDDAO)
  private farmingCycleFeedStockDDAO: FarmingCycleFeedStockDDAO;

  @Inject(FarmingCycleFeedStockSummaryDAO)
  private farmingCycleFeedStockSummaryDAO: FarmingCycleFeedStockSummaryDAO;

  @Inject(BranchSapronakStockDAO)
  private branchSapronakStockDAO: BranchSapronakStockDAO;

  @Inject(FarmingCycleOvkStockSummaryDAO)
  private fcOvkStockSummaryDAO: FarmingCycleOvkStockSummaryDAO;

  @Inject(FarmingCycleOvkStockLogDAO)
  private fcOvkStockLogDAO: FarmingCycleOvkStockLogDAO;

  @Inject(SlackDAO)
  private slackDAO: SlackDAO;

  @Inject(GoodsReceiptUtil)
  private goodsReceiptUtil: GoodsReceiptUtil;

  @Inject(Logger)
  private logger: Logger;

  protected workerName = QUEUE_TRANSFER_REQUEST_APPROVED;

  protected async handle(
    data: TransferRequestApprovedJobData,
    attemptsMade: number,
    opts: JobsOptions,
    jobId?: string,
  ) {
    const queryRunner = await this.transferRequestDAO.startTransaction();

    try {
      const transferReq = await this.transferRequestDAO.getOneWithTx(
        {
          where: {
            id: data.id,
          },
          relations: {
            coopSource: {
              farm: {
                branch: true,
              },
            },
            coopTarget: {
              farm: {
                branch: true,
              },
            },
            branchSource: true,
            branchTarget: true,
            userRequester: true,
            userApprover: true,
            transferRequestProducts: true,
          },
        },
        queryRunner,
      );

      if (!transferReq || !transferReq.isApproved) return;

      const transferRequestErpPayload: ErpTransferRequestCreate = {
        transferRequestId: transferReq.id,
        coopCodeSource: transferReq.coopSource?.coopCode || '',
        coopCodeTarget: transferReq.coopTarget?.coopCode || '',
        branchCodeSource: transferReq.branchSource?.code || '',
        branchCodeTarget: transferReq.branchTarget?.code || '',
        requestedBy: transferReq.userRequester.fullName,
        approvedBy: transferReq.userApprover.fullName,
        logistic: transferReq.logisticOption,
        details: (transferReq.transferRequestProducts || []).map((trp) => ({
          categoryCode: trp.categoryCode || '',
          subcategoryCode: trp.subcategoryCode || '',
          productCode: trp.productCode || '',
          quantity: trp.quantity || 0,
        })),
      };

      const erpCode = await this.erpDAO.createTransferRequest(transferRequestErpPayload);

      await this.transferRequestDAO.updateOneWithTx(
        {
          id: transferReq.id,
        },
        {
          erpCode,
        },
        {
          id: transferReq.userApprover.id,
          role: transferReq.userApprover.userType,
        },
        queryRunner,
      );

      if (transferReq.type === 'pakan') {
        // minus feed stock from coop source
        if (transferReq.coopSource && transferReq.coopSource?.activeFarmingCycleId) {
          if (!transferReq.transferRequestProducts.length) {
            await this.farmingCycleFeedStockDDAO.upsertStockWithTx(
              {
                farmingCycleId: transferReq.coopSource.activeFarmingCycleId,
                qty: transferReq.quantity,
                operator: '-',
                notes: `feed_stock_minus - tr_id:${transferReq.id}`,
              },
              {
                id: transferReq.userApprover.id,
                role: transferReq.userApprover.userType,
              },
              queryRunner,
            );

            await this.farmingCycleFeedStockSummaryDAO.incrementRemainingQuantityWithTx(
              {
                farmingCycleId: transferReq.coopSource.activeFarmingCycleId,
                subcategoryCode: transferReq.subcategoryCode,
                productName: transferReq.productName || undefined,
              },
              -1 * transferReq.quantity,
              {
                id: transferReq.userApprover.id,
                role: transferReq.userApprover.userType,
              },
              queryRunner,
            );

            await this.farmingCycleFeedStockSummaryDAO.incrementBookedQuantityWithTx(
              {
                farmingCycleId: transferReq.coopSource.activeFarmingCycleId,
                subcategoryCode: transferReq.subcategoryCode,
                productName: transferReq.productName || undefined,
              },
              -1 * transferReq.quantity,
              {
                id: transferReq.userApprover.id,
                role: transferReq.userApprover.userType,
              },
              queryRunner,
            );
          }

          await transferReq.transferRequestProducts.reduce(async (last, trp) => {
            await last;

            const productDetail = `${trp.subcategoryCode}:${trp.subcategoryName}:${trp.productCode}:${trp.productName}`;

            await this.farmingCycleFeedStockDDAO.upsertStockWithTx(
              {
                farmingCycleId: transferReq.coopSource!.activeFarmingCycleId!,
                qty: trp.quantity,
                operator: '-',
                notes: `feed_stock_minus - tr_id:${transferReq.id}`,
                productDetail,
              },
              {
                id: transferReq.userApprover.id,
                role: transferReq.userApprover.userType,
              },
              queryRunner,
            );

            await this.farmingCycleFeedStockSummaryDAO.incrementRemainingQuantityWithTx(
              {
                farmingCycleId: transferReq.coopSource!.activeFarmingCycleId!,
                productCode: trp.productCode,
              },
              -1 * trp.quantity,
              {
                id: transferReq.userApprover.id,
                role: transferReq.userApprover.userType,
              },
              queryRunner,
            );

            await this.farmingCycleFeedStockSummaryDAO.incrementBookedQuantityWithTx(
              {
                farmingCycleId: transferReq.coopSource!.activeFarmingCycleId!,
                productCode: trp.productCode,
              },
              -1 * trp.quantity,
              {
                id: transferReq.userApprover.id,
                role: transferReq.userApprover.userType,
              },
              queryRunner,
            );
          }, Promise.resolve());
        }
      }

      if (transferReq.type === 'ovk') {
        if (transferReq.route === 'BRANCH-TO-COOP') {
          /**
           * 1. decrement branch sapronak bookedQuantity
           * 2. decrement  branch sapronak quantity
           */
          await transferReq.transferRequestProducts.reduce(async (last, trp) => {
            await last;

            await this.branchSapronakStockDAO.incrementBookedQuantityWithTx(
              {
                branchId: transferReq.branchSourceId!,
                productCode: trp.productCode,
              },
              -1 * trp.quantity,
              {
                id: transferReq.userRequester.id,
                role: transferReq.userRequester.userType,
              },
              queryRunner,
            );

            await this.branchSapronakStockDAO.incrementQuantityWithTx(
              {
                branchId: transferReq.branchSourceId!,
                productCode: trp.productCode,
              },
              -1 * trp.quantity,
              {
                id: transferReq.userRequester.id,
                role: transferReq.userRequester.userType,
              },
              queryRunner,
            );
          }, Promise.resolve());
        } else if (transferReq.route === 'COOP-TO-BRANCH') {
          /**
           * 0. upsert branch sapronak stock
           * 1. increment branch sapronak quantity
           * 2. decrement ovk stock summary quantity
           * 3. insert log ovk stock log
           * 4. create GR + sync to odoo
           */
          await transferReq.transferRequestProducts.reduce(async (last, trp) => {
            await last;

            await this.branchSapronakStockDAO.upsertOneWithTx(
              {
                branchId: transferReq.branchTargetId!,
                categoryCode: trp.categoryCode,
                categoryName: trp.categoryName,
                subcategoryCode: trp.subcategoryCode,
                subcategoryName: trp.subcategoryName,
                productCode: trp.productCode,
                productName: trp.productName,
                uom: trp.uom,
              },
              {
                id: transferReq.userRequester.id,
                role: transferReq.userRequester.userType,
              },
              queryRunner,
            );

            await this.transferRequestDAO.commitTransaction(queryRunner, false);

            await this.branchSapronakStockDAO.incrementQuantityWithTx(
              {
                branchId: transferReq.branchTargetId!,
                productCode: trp.productCode,
              },
              1 * trp.quantity,
              {
                id: transferReq.userRequester.id,
                role: transferReq.userRequester.userType,
              },
              queryRunner,
            );

            await this.fcOvkStockSummaryDAO.incrementRemainingQuantityWithTx(
              {
                farmingCycleId: transferReq.farmingCycleId,
                productCode: trp.productCode,
              },
              -1 * trp.quantity,
              {
                id: transferReq.userRequester.id,
                role: transferReq.userRequester.userType,
              },
              queryRunner,
            );

            await this.fcOvkStockSummaryDAO.incrementBookedQuantityWithTx(
              {
                farmingCycleId: transferReq.farmingCycleId,
                productCode: trp.productCode,
              },
              -1 * trp.quantity,
              {
                id: transferReq.userRequester.id,
                role: transferReq.userRequester.userType,
              },
              queryRunner,
            );

            await this.fcOvkStockLogDAO.upsertStockWithTx(
              {
                farmingCycleId: transferReq.farmingCycleId,
                quantity: trp.quantity,
                operator: OvkStockOperatorEnum.MINUS,
                notes: `ovk_stock_minus - tr_id:${transferReq.id}`,
                subcategoryCode: trp.subcategoryCode,
                subcategoryName: trp.subcategoryName,
                productCode: trp.productCode,
                productName: trp.productName,
                uom: trp.uom || 'buah',
              },
              {
                id: transferReq.userRequester.id,
                role: transferReq.userRequester.userType,
              },
              queryRunner,
            );
          }, Promise.resolve());

          await this.goodsReceiptUtil.createGoodsReceiptFromTransferRequest(
            transferReq.id,
            {
              id: transferReq.userRequester.id,
              role: transferReq.userRequester.userType,
            },
            queryRunner,
          );
        } else {
          /**
           * 1. decrement ovk stock summary quantity
           * 2. insert log ovk stock log
           */
          await transferReq.transferRequestProducts.reduce(async (last, trp) => {
            await last;

            await this.fcOvkStockSummaryDAO.incrementRemainingQuantityWithTx(
              {
                farmingCycleId: transferReq.farmingCycleId,
                productCode: trp.productCode,
              },
              -1 * trp.quantity,
              {
                id: transferReq.userRequester.id,
                role: transferReq.userRequester.userType,
              },
              queryRunner,
            );

            await this.fcOvkStockSummaryDAO.incrementBookedQuantityWithTx(
              {
                farmingCycleId: transferReq.farmingCycleId,
                productCode: trp.productCode,
              },
              -1 * trp.quantity,
              {
                id: transferReq.userRequester.id,
                role: transferReq.userRequester.userType,
              },
              queryRunner,
            );

            await this.fcOvkStockLogDAO.upsertStockWithTx(
              {
                farmingCycleId: transferReq.farmingCycleId,
                quantity: trp.quantity,
                operator: OvkStockOperatorEnum.MINUS,
                notes: `ovk_stock_minus - tr_id:${transferReq.id}`,
                subcategoryCode: trp.subcategoryCode,
                subcategoryName: trp.subcategoryName,
                productCode: trp.productCode,
                productName: trp.productName,
                uom: trp.uom || 'buah',
              },
              {
                id: transferReq.userRequester.id,
                role: transferReq.userRequester.userType,
              },
              queryRunner,
            );
          }, Promise.resolve());
        }
      }

      await this.transferRequestDAO.commitTransaction(queryRunner);
    } catch (error) {
      this.logger.error(error);

      await this.transferRequestDAO.rollbackTransaction(queryRunner);

      if (attemptsMade === opts.attempts) {
        await this.slackDAO.alertFailedJobs(this.workerName, error, data, jobId);
      }

      throw error;
    }
  }
}
