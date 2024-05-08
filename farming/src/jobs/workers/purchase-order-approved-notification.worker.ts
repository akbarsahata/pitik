import { JobsOptions } from 'bullmq';
import { Inject, Service } from 'fastify-decorators';
import { SlackDAO } from '../../dao/external/slack.dao';
import { FarmingCycleDAO } from '../../dao/farmingCycle.dao';
import { PurchaseOrder } from '../../datasources/entity/pgsql/PurchaseOrder.entity';
import { USER_TYPE } from '../../libs/constants';
import { QUEUE_PURCHASE_ORDER_APPROVED_NOTIFICATION } from '../../libs/constants/queue';
import { targetPage } from '../../libs/constants/targetPage';
import { PurchaseOrderApprovedJobData } from '../../libs/interfaces/job-data';
import { constructAdditionalNotificationCoop } from '../../libs/utils/helpers';
import { Logger } from '../../libs/utils/logger';
import { UserService as UserCoreService } from '../../services/usermanagement/userCore.service';
import { PushNotificationQueue } from '../queues/push-notification.queue';
import { BaseWorker } from './base.worker';

@Service()
export class PurchaseOrderApprovedNotificationWorker extends BaseWorker<PurchaseOrderApprovedJobData> {
  @Inject(FarmingCycleDAO)
  private fcDAO!: FarmingCycleDAO;

  @Inject(PushNotificationQueue)
  private pushNotificationQueue: PushNotificationQueue;

  @Inject(UserCoreService)
  private userCoreService: UserCoreService;

  @Inject(SlackDAO)
  private slackDAO!: SlackDAO;

  @Inject(Logger)
  private logger: Logger;

  protected workerName = QUEUE_PURCHASE_ORDER_APPROVED_NOTIFICATION;

  protected async handle(
    data: PurchaseOrder,
    attemptsMade: number,
    opts: JobsOptions,
    jobId?: string,
  ): Promise<void> {
    if (!data.isApproved) return;

    try {
      const farmingCycle = await this.fcDAO.getOneStrict({
        where: {
          id: data.farmingCycleId,
        },
        select: {
          id: true,
          chickTypeId: true,
          coop: {
            coopTypeId: true,
          },
        },
        relations: {
          coop: {
            coopMembers: true,
          },
          farm: {
            city: true,
            district: true,
          },
        },
      });

      // get role of internal user
      const coopMembers = farmingCycle.coop.coopMembers || [];
      const internalUserIds = coopMembers.filter((cm) => cm.isInternal).map((u) => u.userId);

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
          id: `purchase-order-approved-${data.id}`,
          headline: 'PO sudah dikirim',
          subHeadline: 'PO sudah dikirim',
          body: `Nomor DO ${data.erpCode} sudah dikirim, lakukan Penerimaan sesuai dengan barang yang diterima`,
          type: 'purchase-order-approved',
          target: targetPage.android.ppl.notificationPage,
          additionalParameters: {
            coopId: farmingCycle.coopId,
            farmingCycleId: farmingCycle.id,
            coop: constructAdditionalNotificationCoop(farmingCycle),
          },
        },
        notification: {
          subjectId: 'System',
          notificationType: 'purchase-order-approved',
          headline: 'PO sudah dikirim',
          subHeadline: `Nomor DO ${data.erpCode} sudah dikirim, lakukan Penerimaan sesuai dengan barang yang diterima`,
          referenceId: `purchase-order-id: ${data.id}`,
          icon: '',
          iconPath: '',
          target: targetPage.android.ppl.notificationPage,
          additionalParameters: {
            coopId: farmingCycle.coopId,
            farmingCycleId: farmingCycle.id,
            coop: constructAdditionalNotificationCoop(farmingCycle),
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
