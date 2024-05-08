import { JobsOptions } from 'bullmq';
import { Inject, Service } from 'fastify-decorators';
import { IsNull } from 'typeorm';
import { SlackDAO } from '../../dao/external/slack.dao';
import { PurchaseRequestDAO } from '../../dao/purchaseRequest.dao';
import { USER_TYPE } from '../../libs/constants';
import { QUEUE_PURCHASE_REQUEST_CREATED } from '../../libs/constants/queue';
import { targetPage } from '../../libs/constants/targetPage';
import { PurchaseRequestCreatedJobData } from '../../libs/interfaces/job-data';
import { constructAdditionalNotificationCoop } from '../../libs/utils/helpers';
import { Logger } from '../../libs/utils/logger';
import { UserService as UserCoreService } from '../../services/usermanagement/userCore.service';
import { PushNotificationQueue } from '../queues/push-notification.queue';
import { BaseWorker } from './base.worker';

@Service()
export class PurchaseRequestCreatedWorker extends BaseWorker<PurchaseRequestCreatedJobData> {
  @Inject(PurchaseRequestDAO)
  private prDAO!: PurchaseRequestDAO;

  @Inject(UserCoreService)
  private userCoreService: UserCoreService;

  @Inject(SlackDAO)
  private slackDAO!: SlackDAO;

  @Inject(Logger)
  private logger!: Logger;

  @Inject(PushNotificationQueue)
  private pushNotificationQueue: PushNotificationQueue;

  protected workerName = QUEUE_PURCHASE_REQUEST_CREATED;

  protected async handle(
    data: PurchaseRequestCreatedJobData,
    attemptsMade: number,
    opts: JobsOptions,
    jobId?: string,
  ): Promise<void> {
    try {
      const purchaseReq = await this.prDAO.getOne({
        where: {
          id: data.id,
          erpCode: IsNull(),
        },
        select: {
          id: true,
        },
        relations: {
          farmingCycle: {
            coop: {
              coopMembers: true,
            },
            farm: {
              city: true,
              district: true,
            },
          },
          products: true,
          userCreator: true,
        },
      });

      if (!purchaseReq) return;

      // get role of internal user
      const coopMembers = purchaseReq.farmingCycle.coop.coopMembers || [];
      const internalUserIds = coopMembers.filter((cm) => cm.isInternal).map((u) => u.userId);

      const [internalUsers] = await this.userCoreService.search({ cmsIds: internalUserIds });
      const userReceivers = internalUsers.reduce((prev, user) => {
        if (user.cmsId && user.roles?.find((role) => role.name === USER_TYPE.MM)) {
          prev.push(user.cmsId);
        }

        return prev;
      }, [] as string[]);

      await this.pushNotificationQueue.sendNotificationToApp('ppl', {
        appTarget: 'ppl',
        userReceivers,
        content: {
          id: `purchase-request-created-${purchaseReq.id}`,
          headline: `Pengajuan Baru dari ${purchaseReq.userCreator.fullName}`,
          subHeadline: `Pengajuan Baru dari ${purchaseReq.userCreator.fullName}`,
          body: `Pengajuan baru telah dilakukan di ${purchaseReq.farmingCycle.coop.coopName}, silakan cek detail pengajuan pada menu Order.`,
          type: 'purchase-request-created',
          target: targetPage.android.ppl.notificationPage,
          additionalParameters: {
            coopId: purchaseReq.farmingCycle.coopId,
            farmingCycleId: purchaseReq.farmingCycleId,
            coop: constructAdditionalNotificationCoop(purchaseReq.farmingCycle),
          },
        },
        notification: {
          subjectId: 'System',
          notificationType: 'purchase-request-created',
          headline: `Pengajuan Baru dari ${purchaseReq.userCreator.fullName}`,
          subHeadline: `Pengajuan baru telah dilakukan di ${purchaseReq.farmingCycle.coop.coopName}, silakan cek detail pengajuan pada menu Order.`,
          referenceId: `purchase-request-id: ${purchaseReq.id}`,
          icon: '',
          iconPath: '',
          target: targetPage.android.ppl.notificationPage,
          additionalParameters: {
            coopId: purchaseReq.farmingCycle.coopId,
            farmingCycleId: purchaseReq.farmingCycleId,
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
