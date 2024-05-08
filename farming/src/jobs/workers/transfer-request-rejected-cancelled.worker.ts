import { JobsOptions } from 'bullmq';
import { Inject, Service } from 'fastify-decorators';
import { SlackDAO } from '../../dao/external/slack.dao';
import { FarmingCycleDAO } from '../../dao/farmingCycle.dao';
import { FarmingCycleFeedStockSummaryDAO } from '../../dao/farmingCycleFeedStockSummary.dao';
import { FarmingCycleOvkStockSummaryDAO } from '../../dao/farmingCycleOvkStockSummary.dao';
import { TransferRequestDAO } from '../../dao/transferRequest.dao';
import { USER_TYPE } from '../../libs/constants';
import {
  ERR_FEED_STOCK_SUMMARY_NOT_FOUND,
  ERR_OVK_STOCK_SUMMARY_NOT_FOUND,
} from '../../libs/constants/errors';
import { QUEUE_TRANSFER_REQUEST_REJECTED_CANCELLED } from '../../libs/constants/queue';
import { targetPage } from '../../libs/constants/targetPage';
import { constructAdditionalNotificationCoop, isRoleAllowed } from '../../libs/utils/helpers';
import { Logger } from '../../libs/utils/logger';
import { PushNotificationQueue } from '../queues/push-notification.queue';
import { TransferRequestCancelPayload } from '../queues/transfer-request-rejected-cancelled.queue';
import { BaseWorker } from './base.worker';

@Service()
// eslint-disable-next-line max-len
export class TransferRequestRejectedCancelledWorker extends BaseWorker<TransferRequestCancelPayload> {
  @Inject(TransferRequestDAO)
  private transferRequestDAO: TransferRequestDAO;

  @Inject(FarmingCycleDAO)
  private farmingCycleDAO: FarmingCycleDAO;

  @Inject(FarmingCycleFeedStockSummaryDAO)
  private farmingCycleFeedStockSummaryDAO: FarmingCycleFeedStockSummaryDAO;

  @Inject(FarmingCycleOvkStockSummaryDAO)
  private farmingCycleOvkStockSummaryDAO: FarmingCycleOvkStockSummaryDAO;

  @Inject(SlackDAO)
  private slackDAO!: SlackDAO;

  @Inject(Logger)
  private logger!: Logger;

  @Inject(PushNotificationQueue)
  private pushNotificationQueue: PushNotificationQueue;

  protected workerName = QUEUE_TRANSFER_REQUEST_REJECTED_CANCELLED;

  protected async handle(
    data: TransferRequestCancelPayload,
    attemptsMade: number,
    opts: JobsOptions,
    jobId?: string,
  ) {
    try {
      const transferRequest = await this.transferRequestDAO.getOneStrict({
        where: {
          id: data.transferRequestId,
        },
        relations: {
          cancellationRequester: true,
          coopSource: {
            coopMembers: {
              user: true,
            },
          },
          coopTarget: {
            coopMembers: {
              user: true,
            },
          },
          branchSource: true,
          branchTarget: true,
          transferRequestProducts: true,
        },
      });

      if (transferRequest.route !== 'BRANCH-TO-COOP') {
        const queryRunner = await this.transferRequestDAO.startTransaction();

        const user = {
          id: transferRequest.createdBy,
          role: '',
        };

        try {
          await transferRequest.transferRequestProducts.reduce(async (prev, product) => {
            await prev;

            if (product.categoryCode.toUpperCase() === 'PAKAN') {
              const summary = await this.farmingCycleFeedStockSummaryDAO.getOneWithTx(
                {
                  where: {
                    farmingCycleId: transferRequest.farmingCycleId,
                    productCode: product.productCode,
                  },
                },
                queryRunner,
              );

              if (!summary) {
                throw ERR_FEED_STOCK_SUMMARY_NOT_FOUND(
                  `FARMING CYCLE ID: ${transferRequest.farmingCycleId}`,
                  `PRODUCT CODE: ${product.productCode}`,
                );
              }

              if (transferRequest.isApproved) {
                await this.farmingCycleFeedStockSummaryDAO.incrementRemainingQuantityWithTx(
                  {
                    id: summary.id,
                  },
                  product.quantity,
                  user,
                  queryRunner,
                );
              } else {
                await this.farmingCycleFeedStockSummaryDAO.incrementBookedQuantityWithTx(
                  {
                    id: summary.id,
                  },
                  -1 * product.quantity,
                  user,
                  queryRunner,
                );
              }
            }

            if (product.categoryCode.toUpperCase() === 'OVK') {
              const summary = await this.farmingCycleOvkStockSummaryDAO.getOneWithTx(
                {
                  where: {
                    farmingCycleId: transferRequest.farmingCycleId,
                    productCode: product.productCode,
                  },
                },
                queryRunner,
              );

              if (!summary) {
                throw ERR_OVK_STOCK_SUMMARY_NOT_FOUND(
                  `FARMING CYCLE ID: ${transferRequest.farmingCycleId}`,
                  `PRODUCT CODE: ${product.productCode}`,
                );
              }

              if (transferRequest.isApproved) {
                await this.farmingCycleOvkStockSummaryDAO.incrementRemainingQuantityWithTx(
                  {
                    id: summary.id,
                  },
                  product.quantity,
                  user,
                  queryRunner,
                );
              } else {
                await this.farmingCycleOvkStockSummaryDAO.incrementBookedQuantityWithTx(
                  {
                    id: summary.id,
                  },
                  -1 * product.quantity,
                  user,
                  queryRunner,
                );
              }
            }
          }, Promise.resolve());

          await this.transferRequestDAO.commitTransaction(queryRunner);
        } catch (error) {
          await this.transferRequestDAO.rollbackTransaction(queryRunner);

          throw error;
        }
      }

      const farmingCycle = await this.farmingCycleDAO.getOne({
        where: {
          id: transferRequest.farmingCycleId,
        },
        relations: {
          farm: {
            city: true,
            district: true,
          },
          coop: true,
        },
      });

      const transferFrom = transferRequest.branchSource
        ? `Unit ${transferRequest.branchSource.name}`
        : `Kandang ${transferRequest.coopSource?.coopName || ''}`;

      const transferTo = transferRequest.branchTarget
        ? `Unit ${transferRequest.branchTarget.name}`
        : `Kandang ${transferRequest.coopTarget?.coopName || ''}`;

      const transferType = transferRequest.type
        ? transferRequest.type[0].toUpperCase() + transferRequest.type.slice(1)
        : 'Pakan';

      const uom = transferRequest.type === 'pakan' ? 'karung' : 'buah';

      const quantity = transferRequest.transferRequestProducts.reduce(
        (total, trp) => total + trp.quantity,
        0,
      );

      const receivers = transferRequest.coopSource?.coopMembers || [];
      if (data.isApproved) {
        receivers.push(...(transferRequest.coopTarget?.coopMembers || []));
      }

      const receiverIds = receivers.reduce((prev, item) => {
        if (
          isRoleAllowed(item.user.userType, [
            USER_TYPE.BU,
            USER_TYPE.PPL,
            USER_TYPE.MM,
            USER_TYPE.AM,
          ])
        ) {
          prev.push(item.userId);
        }
        return prev;
      }, [] as string[]);

      const uniqueReceiverIds = receiverIds.filter((val, idx, arr) => arr.indexOf(val) === idx);

      await this.pushNotificationQueue.sendNotificationToApp('ppl', {
        appTarget: 'ppl',
        userReceivers: uniqueReceiverIds,
        content: {
          id: `transfer-request-cancel:${data.transferRequestId}`,
          headline: `Transfer ${transferType} Dibatalkan`,
          subHeadline: `Transfer ${transferType} Dibatalkan`,
          body: `Dari ${transferFrom} ke ${transferTo} dengan total pakan ${quantity} ${uom}`,
          type: 'android',
          target: targetPage.android.ppl.notificationPage,
          additionalParameters: farmingCycle
            ? {
                farmingCycleId: farmingCycle.id,
                coopId: farmingCycle.coopId,
                coop: constructAdditionalNotificationCoop(farmingCycle),
              }
            : {},
        },
        notification: {
          subjectId: 'TransferRequest',
          notificationType: 'transfer-request-cancel',
          headline: `Transfer ${transferType} Dibatalkan`,
          subHeadline: `Dari kandang ${transferFrom} ke ${transferTo} dengan total pakan ${quantity} ${uom}`,
          referenceId: `transfer-request-id: ${data.transferRequestId}`,
          icon: '',
          iconPath: '',
          target: targetPage.android.ppl.notificationPage,
          additionalParameters: farmingCycle
            ? {
                farmingCycleId: farmingCycle.id,
                coopId: farmingCycle.coopId,
                coop: constructAdditionalNotificationCoop(farmingCycle),
              }
            : {},
        },
      });
    } catch (error) {
      this.logger.error(error);

      if (attemptsMade === opts.attempts) {
        await this.slackDAO.alertFailedJobs(this.workerName, error, data, jobId);
      }

      throw error;
    }
  }
}
