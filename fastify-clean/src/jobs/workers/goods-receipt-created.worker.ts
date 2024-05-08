import { captureException } from '@sentry/node';
import { Inject, Service } from 'fastify-decorators';
import { ErpDAO } from '../../dao/erp.dao';
import { GoodsReceiptDAO } from '../../dao/goodsReceipt.dao';
import { GoodsReceipt } from '../../datasources/entity/pgsql/GoodsReceipt.entity';
import { QUEUE_GOODS_RECEIPT_CREATED } from '../../libs/constants/queue';
import { BaseWorker } from './base.worker';
import { FarmingCycleFeedStockDDAO } from '../../dao/farmingCycleFeedStockD.dao';
import { PurchaseOrderDAO } from '../../dao/purchaseOrder.dao';

// FIXME: please remove import env once flow with ODOO is ready
import env from '../../config/env';
import { AutoNumbering } from '../../datasources/entity/pgsql/AutoNumbering.entity';
import { generateErpCode } from '../../libs/utils/helpers';
import { Logger } from '../../libs/utils/logger';
import { DailyMonitoringService } from '../../services/dailyMonitoring.service';
import { AUTO_NUMBERING_TRX_TYPE } from '../../libs/constants';

@Service()
export class GoodsReceiptCreatedWorker extends BaseWorker<GoodsReceipt> {
  @Inject(GoodsReceiptDAO)
  private grDAO: GoodsReceiptDAO;

  @Inject(PurchaseOrderDAO)
  private poDAO: PurchaseOrderDAO;

  @Inject(DailyMonitoringService)
  private dailyMonitoringService: DailyMonitoringService;

  @Inject(ErpDAO)
  private erpDAO: ErpDAO;

  @Inject(FarmingCycleFeedStockDDAO)
  private farmingCycleFeedStockDDAO: FarmingCycleFeedStockDDAO;

  @Inject(Logger)
  private logger: Logger;

  protected workerName = QUEUE_GOODS_RECEIPT_CREATED;

  protected async handle(data: GoodsReceipt): Promise<void> {
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
          },
          goodsReceiptProducts: true,
          userReporter: {
            id: true,
            userType: true,
          },
        },
        relations: {
          purchaseOrder: {
            purchaseOrderProducts: true,
          },
          transferRequest: {
            coopSource: true,
            coopTarget: true,
          },
          goodsReceiptProducts: true,
          userReporter: true,
        },
        relationLoadStrategy: 'join',
      });

      const promises = [];

      // FIXME:  please remove conditional USE_ERP feature flag once flow with ODOO is ready
      if (env.USE_ERP) {
        const erpCode = await this.erpDAO.createGoodsReceipt(gr);
        promises.push(
          this.grDAO.updateOne(
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
          ),
        );
      } else {
        const queryRunner = await this.grDAO.startTransaction();

        try {
          const numberingGR = await queryRunner.manager.findOneOrFail(AutoNumbering, {
            where: {
              transactionType: AUTO_NUMBERING_TRX_TYPE.GOODS_RECEIPT,
            },
          });

          const erpCodePR = generateErpCode(
            numberingGR.lastNumber,
            numberingGR.digitCount,
            numberingGR.prefix,
          );

          await this.grDAO.updateOneWithTx(
            {
              id: gr.id,
            },
            {
              erpCode: erpCodePR,
            },
            {
              id: gr.userReporter.id,
              role: gr.userReporter.userType,
            },
            queryRunner,
          );

          await queryRunner.manager.update(AutoNumbering, numberingGR.id, {
            lastNumber: () => 'last_number + 1',
          });

          await this.grDAO.commitTransaction(queryRunner);
        } catch (error) {
          await this.grDAO.rollbackTransaction(queryRunner);

          throw error;
        }
      }

      gr.goodsReceiptProducts.forEach((val) => {
        if (
          val.categoryCode.toUpperCase() === 'PAKAN' ||
          (gr.transferRequestId && gr.transferRequest?.coopTarget?.activeFarmingCycleId)
        ) {
          promises.push(
            this.farmingCycleFeedStockDDAO.upsert(
              {
                farmingCycleId:
                  gr.purchaseOrder?.farmingCycleId ||
                  gr.transferRequest.coopTarget.activeFarmingCycleId!,
                qty: val.quantity,
                operator: '+',
                notes: `feed_stock_plus - gr_id:${gr.id}`,
              },
              {
                id: gr.userReporter.id,
                role: gr.userReporter.userType,
              },
            ),
          );
        }
      });

      await Promise.all(promises);

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

      /**
       * TODO: omit this part till catch (error) when odoo is fully integrated
       *
       * due to postponed odoo integration,
       * purchase order fulfillment status will be updated internally
       */
      if (!gr.purchaseOrderId && gr.transferRequestId) return;

      const { purchaseOrder } = gr;

      const purcaseOrderProductQuantityMap: {
        [key: string]: { request: number; receive: number };
      } = {};

      purchaseOrder.purchaseOrderProducts.forEach((pop) => {
        purcaseOrderProductQuantityMap[pop.productName] = {
          request: Number(pop.quantity),
          receive: 0,
        };
      });

      const [purchaseOrderGRs] = await this.grDAO.getMany({
        where: {
          purchaseOrderId: gr.purchaseOrderId,
        },
        relations: {
          goodsReceiptProducts: true,
        },
      });

      purchaseOrderGRs.forEach((pogr) => {
        pogr.goodsReceiptProducts.forEach((pogrp) => {
          purcaseOrderProductQuantityMap[pogrp.productName].receive += Number(pogrp.quantity);
        });
      });

      let isFulfilled = true;

      Object.keys(purcaseOrderProductQuantityMap).forEach((productName) => {
        const { request, receive } = purcaseOrderProductQuantityMap[productName];
        if (request > receive) {
          isFulfilled = false;
        }
      });

      if (isFulfilled) {
        await this.poDAO.updateOne(
          {
            id: purchaseOrder.id,
          },
          {
            isFulfilled: true,
          },
          {
            id: gr.userReporter.id,
            role: gr.userReporter.userType,
          },
        );
      }
    } catch (error) {
      this.logger.error(error);

      captureException(error);

      throw error;
    }
  }
}
