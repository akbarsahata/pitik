import { JobsOptions } from 'bullmq';
import { Inject, Service } from 'fastify-decorators';
import { SlackDAO } from '../../dao/external/slack.dao';
import { PurchaseRequestDAO } from '../../dao/purchaseRequest.dao';
import { USER_TYPE } from '../../libs/constants';
import { QUEUE_PURCHASE_REQUEST_REJECTED } from '../../libs/constants/queue';
import { targetPage } from '../../libs/constants/targetPage';
import { PurchaseRequestRejectedJobData } from '../../libs/interfaces/job-data';
import { constructAdditionalNotificationCoop } from '../../libs/utils/helpers';
import { Logger } from '../../libs/utils/logger';
import { UserService as UserCoreService } from '../../services/usermanagement/userCore.service';
import { PushNotificationQueue } from '../queues/push-notification.queue';
import { BaseWorker } from './base.worker';

@Service()
export class PurchaseRequestRejectedWorker extends BaseWorker<PurchaseRequestRejectedJobData> {
  @Inject(PurchaseRequestDAO)
  private prDAO!: PurchaseRequestDAO;

  @Inject(UserCoreService)
  private userCoreService: UserCoreService;

  @Inject(Logger)
  private logger: Logger;

  @Inject(SlackDAO)
  private slackDAO!: SlackDAO;

  @Inject(PushNotificationQueue)
  private pushNotificationQueue!: PushNotificationQueue;

  protected workerName = QUEUE_PURCHASE_REQUEST_REJECTED;

  protected async handle(
    data: PurchaseRequestRejectedJobData,
    attemptsMade: number,
    opts: JobsOptions,
    jobId?: string,
  ) {
    try {
      const purchaseReq = await this.prDAO.getOneStrict({
        where: {
          id: data.id,
        },
        relations: {
          farmingCycle: {
            farm: {
              city: true,
              district: true,
            },
            coop: {
              coopMembers: true,
            },
          },
          products: true,
        },
      });

      if (!purchaseReq || !purchaseReq?.products.length) return;

      const internalUserIds =
        purchaseReq.farmingCycle.coop.coopMembers
          ?.filter((cm) => cm.isInternal)
          .map((u) => u.userId) || [];

      if (!internalUserIds.length) {
        return;
      }

      const [internalUsers] = await this.userCoreService.search({ cmsIds: internalUserIds });

      const userReceivers = internalUsers.reduce((prev, user) => {
        if (user.cmsId && user.roles?.find((role) => role.name === USER_TYPE.PPL)) {
          prev.push(user.cmsId);
        }
        return prev;
      }, [] as string[]);

      await this.pushNotificationQueue.sendNotificationToApp('ppl', {
        appTarget: 'ppl',
        userReceivers,
        content: {
          headline: 'Pengajuan Ditolak',
          subHeadline: 'Pengajuan Ditolak',
          body: `Pengajuan ${purchaseReq.products[0]?.categoryCode || 'baru'} anda pada ${
            purchaseReq.farmingCycle.coop.coopName
          } telah ditolak`,
          type: 'purchase-request',
          target: targetPage.android.ppl.notificationPage,
          additionalParameters: {
            farmingCycleId: purchaseReq.farmingCycle.id,
            coopId: purchaseReq.farmingCycle.coopId,
            coop: constructAdditionalNotificationCoop(purchaseReq.farmingCycle),
          },
        },
        notification: {
          subjectId: 'purchase-request',
          notificationType: 'purchase-request',
          headline: 'Pengajuan Ditolak',
          subHeadline: `Pengajuan ${purchaseReq.products[0]?.categoryCode || 'baru'} anda pada ${
            purchaseReq.farmingCycle.coop.coopName
          } telah ditolak`,
          referenceId: `purchase-request-id: ${data.id}`,
          icon: '',
          iconPath: '',
          target: targetPage.android.ppl.notificationPage,
          additionalParameters: {
            farmingCycleId: purchaseReq.farmingCycle.id,
            coopId: purchaseReq.farmingCycle.coopId,
            coop: constructAdditionalNotificationCoop(purchaseReq.farmingCycle),
          },
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
