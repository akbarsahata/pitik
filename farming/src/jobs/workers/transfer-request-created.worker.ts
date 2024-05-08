import { JobsOptions } from 'bullmq';
import { Inject, Service } from 'fastify-decorators';
import { CoopMemberDDAO } from '../../dao/coopMemberD.dao';
import { SlackDAO } from '../../dao/external/slack.dao';
import { FarmingCycleDAO } from '../../dao/farmingCycle.dao';
import { FarmingCycleFeedStockSummaryDAO } from '../../dao/farmingCycleFeedStockSummary.dao';
import { FarmingCycleOvkStockSummaryDAO } from '../../dao/farmingCycleOvkStockSummary.dao';
import { TransferRequestDAO } from '../../dao/transferRequest.dao';
import {
  ERR_FEED_STOCK_SUMMARY_NOT_FOUND,
  ERR_OVK_STOCK_SUMMARY_NOT_FOUND,
} from '../../libs/constants/errors';
import { QUEUE_TRANSFER_REQUEST_CREATED } from '../../libs/constants/queue';
import { targetPage } from '../../libs/constants/targetPage';
import { TransferRequestCreatedJobData } from '../../libs/interfaces/job-data';
import { constructAdditionalNotificationCoop } from '../../libs/utils/helpers';
import { Logger } from '../../libs/utils/logger';
import { PushNotificationQueue } from '../queues/push-notification.queue';
import { BaseWorker } from './base.worker';

@Service()
export class TransferRequestCreatedWorker extends BaseWorker<TransferRequestCreatedJobData> {
  @Inject(TransferRequestDAO)
  private transferRequestDAO: TransferRequestDAO;

  @Inject(FarmingCycleDAO)
  private farmingCycleDAO: FarmingCycleDAO;

  @Inject(FarmingCycleFeedStockSummaryDAO)
  private farmingCycleFeedStockSummaryDAO: FarmingCycleFeedStockSummaryDAO;

  @Inject(FarmingCycleOvkStockSummaryDAO)
  private farmingCycleOvkStockSummaryDAO: FarmingCycleOvkStockSummaryDAO;

  @Inject(CoopMemberDDAO)
  private coopMemberDDAO: CoopMemberDDAO;

  @Inject(SlackDAO)
  private slackDAO!: SlackDAO;

  @Inject(PushNotificationQueue)
  private pushNotificationQueue: PushNotificationQueue;

  @Inject(Logger)
  private logger: Logger;

  protected workerName = QUEUE_TRANSFER_REQUEST_CREATED;

  protected async handle(
    data: TransferRequestCreatedJobData,
    attemptsMade: number,
    opts: JobsOptions,
    jobId?: string,
  ) {
    try {
      const transferRequest = await this.transferRequestDAO.getOneStrict({
        where: {
          id: data.id,
        },
        select: {
          id: true,
          coopSourceId: true,
          coopTargetId: true,
          branchSourceId: true,
          branchTargetId: true,
          farmingCycleId: true,
          route: true,
          coopSource: {
            coopName: true,
          },
          coopTarget: {
            coopName: true,
          },
          createdBy: true,
        },
        relations: {
          coopSource: true,
          coopTarget: true,
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

              await this.farmingCycleFeedStockSummaryDAO.incrementBookedQuantityWithTx(
                {
                  id: summary.id,
                },
                product.quantity,
                user,
                queryRunner,
              );
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

              await this.farmingCycleOvkStockSummaryDAO.incrementBookedQuantityWithTx(
                {
                  id: summary.id,
                },
                product.quantity,
                user,
                queryRunner,
              );
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

      if (transferRequest.coopSourceId && transferRequest.coopSource) {
        const [coopSourceMembers, countSourceMembers] = await this.coopMemberDDAO.getMany({
          where: {
            coopId: transferRequest.coopSourceId,
            isInternal: true,
          },
        });

        if (!coopSourceMembers && countSourceMembers === 0) return;

        const notificationReceiverMap: { [key: string]: boolean } = {};

        coopSourceMembers.forEach((coopSourceMember) => {
          notificationReceiverMap[coopSourceMember.userId] = true;
        });

        await this.pushNotificationQueue.sendNotificationToApp('ppl', {
          appTarget: 'ppl',
          userReceivers: Object.keys(notificationReceiverMap),
          content: {
            headline: `Request Transfer di Kandang ${transferRequest.coopSource.coopName}`,
            subHeadline: 'Terus pantau status transfer-nya ya',
            body: 'Ada permintaan transfer dari rekanmu coba cek ya',
            type: 'transfer-request',
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
            subjectId: 'Transfer',
            notificationType: 'request-transfer',
            headline: 'Hey ada permintaan transfer dari rekanmu',
            subHeadline: 'Terus pantau status transfer-nya ya',
            referenceId: `transfer-id: ${data.id}`,
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
      }

      if (transferRequest.coopTargetId && transferRequest.coopTarget) {
        const [coopTargetMembers, countTargetMembers] = await this.coopMemberDDAO.getMany({
          where: {
            coopId: transferRequest.coopTargetId!,
            isInternal: true,
          },
        });

        if (!coopTargetMembers && countTargetMembers === 0) return;

        const notificationTargetReceiverMap: { [key: string]: boolean } = {};

        coopTargetMembers.forEach((coopTargetMember) => {
          notificationTargetReceiverMap[coopTargetMember.userId] = true;
        });

        await this.pushNotificationQueue.sendNotificationToApp('ppl', {
          appTarget: 'ppl',
          userReceivers: Object.keys(notificationTargetReceiverMap),
          content: {
            headline: `Request Transfer di Kandang ${transferRequest.coopTarget.coopName}`,
            subHeadline: 'Terus pantau status transfer-nya ya',
            body: 'Ada permintaan transfer dari rekanmu coba cek ya',
            type: 'transfer-request',
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
            subjectId: 'Transfer',
            notificationType: 'request-transfer',
            headline: 'Hey ada permintaan transfer dari rekanmu',
            subHeadline: 'Terus pantau status transfer-nya ya',
            referenceId: `transfer-id: ${data.id}`,
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
      }
    } catch (error) {
      this.logger.error(error);

      if (attemptsMade === opts.attempts) {
        await this.slackDAO.alertFailedJobs(this.workerName, error, data, jobId);
      }

      throw error;
    }
  }
}
