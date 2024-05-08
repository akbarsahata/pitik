import { captureException } from '@sentry/node';
import { Inject, Service } from 'fastify-decorators';
import { ErpDAO } from '../../dao/erp.dao';
import { FarmingCycleFeedStockDDAO } from '../../dao/farmingCycleFeedStockD.dao';
import { TransferRequestDAO } from '../../dao/transferRequest.dao';
import { TransferRequest } from '../../datasources/entity/pgsql/TransferRequest.entity';
import { QUEUE_TRANSFER_REQUEST_APPROVED } from '../../libs/constants/queue';
import { BaseWorker } from './base.worker';

// FIXME: please remove import env once flow with ODOO is ready
import env from '../../config/env';
import { AutoNumbering } from '../../datasources/entity/pgsql/AutoNumbering.entity';
import { AUTO_NUMBERING_TRX_TYPE } from '../../libs/constants';
import { generateErpCode } from '../../libs/utils/helpers';
import { Logger } from '../../libs/utils/logger';

@Service()
export class TransferRequestApprovedWorker extends BaseWorker<TransferRequest> {
  @Inject(TransferRequestDAO)
  private transferRequestDAO: TransferRequestDAO;

  @Inject(ErpDAO)
  private erpDAO: ErpDAO;

  @Inject(FarmingCycleFeedStockDDAO)
  private farmingCycleFeedStockDDAO: FarmingCycleFeedStockDDAO;

  @Inject(Logger)
  private logger: Logger;

  protected workerName = QUEUE_TRANSFER_REQUEST_APPROVED;

  protected async handle(data: TransferRequest) {
    try {
      const transferReq = await this.transferRequestDAO.getOne({
        where: {
          id: data.id,
        },
        select: {
          id: true,
          coopSourceId: true,
          coopTargetId: true,
          subcategoryCode: true,
          quantity: true,
          logisticOption: true,
          isApproved: true,
          coopSource: {
            coopName: true,
            coopCode: true,
            activeFarmingCycleId: true,
          },
          coopTarget: {
            coopCode: true,
            coopName: true,
          },
          userRequester: {
            fullName: true,
            phoneNumber: true,
          },
          userApprover: {
            fullName: true,
            phoneNumber: true,
          },
        },
        relations: {
          coopSource: true,
          coopTarget: true,
          userRequester: true,
          userApprover: true,
        },
      });

      if (!transferReq) return;

      // FIXME:  please remove conditional USE_ERP feature flag once flow with ODOO is ready
      if (env.USE_ERP) {
        const erpCode = await this.erpDAO.createTransferRequest(transferReq);

        await this.transferRequestDAO.updateOne(
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
        );
      } else {
        const queryRunner = await this.transferRequestDAO.startTransaction();

        try {
          const numberingTR = await queryRunner.manager.findOneOrFail(AutoNumbering, {
            where: {
              transactionType: AUTO_NUMBERING_TRX_TYPE.TRANSFER_REQUEST,
            },
          });

          const erpCodePR = generateErpCode(
            numberingTR.lastNumber,
            numberingTR.digitCount,
            numberingTR.prefix,
          );

          await this.transferRequestDAO.updateOneWithTx(
            {
              id: transferReq.id,
            },
            {
              erpCode: erpCodePR,
            },
            {
              id: transferReq.userApprover.id,
              role: transferReq.userApprover.userType,
            },
            queryRunner,
          );

          await queryRunner.manager.update(AutoNumbering, numberingTR.id, {
            lastNumber: () => 'last_number + 1',
          });

          await this.transferRequestDAO.commitTransaction(queryRunner);
        } catch (error) {
          this.logger.error(error);

          await this.transferRequestDAO.rollbackTransaction(queryRunner);

          throw error;
        }
      }

      if (transferReq.isApproved) {
        // await this.pushNotificationQueue.addJob({ userReceivers, content, notification });

        // minus feed stock from coop source
        if (
          transferReq.subcategoryCode === 'PAKAN' &&
          transferReq.coopSource.activeFarmingCycleId
        ) {
          await this.farmingCycleFeedStockDDAO.upsert(
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
          );
        }
      }
    } catch (error) {
      this.logger.error(error);

      captureException(error);

      throw error;
    }
  }
}
