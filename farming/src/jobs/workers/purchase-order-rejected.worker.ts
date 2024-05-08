import { JobsOptions } from 'bullmq';
import { Inject, Service } from 'fastify-decorators';
import { CoopMemberDDAO } from '../../dao/coopMemberD.dao';
import { SlackDAO } from '../../dao/external/slack.dao';
import { FarmingCycleDAO } from '../../dao/farmingCycle.dao';
import { PurchaseOrder } from '../../datasources/entity/pgsql/PurchaseOrder.entity';
import { QUEUE_PURCHASE_ORDER_REJECTED } from '../../libs/constants/queue';
import { targetPage } from '../../libs/constants/targetPage';
import { PurchaseOrderRejectedJobData } from '../../libs/interfaces/job-data';
import { CoopCacheUtil } from '../../libs/utils/coopCache';
import { Logger } from '../../libs/utils/logger';
import { PushNotificationQueue } from '../queues/push-notification.queue';
import { BaseWorker } from './base.worker';

@Service()
export class PurchaseOrderRejectedWorker extends BaseWorker<PurchaseOrderRejectedJobData> {
  @Inject(FarmingCycleDAO)
  private fcDAO!: FarmingCycleDAO;

  @Inject(CoopMemberDDAO)
  private coopMemberDDAO!: CoopMemberDDAO;

  @Inject(PushNotificationQueue)
  private pushNotificationQueue!: PushNotificationQueue;

  @Inject(CoopCacheUtil)
  private coopCacheUtil!: CoopCacheUtil;

  @Inject(SlackDAO)
  private slackDAO!: SlackDAO;

  @Inject(Logger)
  private logger: Logger;

  protected workerName = QUEUE_PURCHASE_ORDER_REJECTED;

  protected async handle(
    data: PurchaseOrder,
    attemptsMade: number,
    opts: JobsOptions,
    jobId?: string,
  ): Promise<void> {
    if (!data.isDoc) return;

    if (data.isApproved) return;

    const queryRunner = await this.fcDAO.startTransaction();

    try {
      const farmingCycle = await this.fcDAO.getOneStrict({
        where: {
          id: data.farmingCycleId,
        },
        relations: {
          coop: true,
          farm: {
            city: true,
            district: true,
          },
        },
      });

      const [coopMembers, count] = await this.coopMemberDDAO.getMany({
        where: {
          coopId: farmingCycle.coopId,
          isInternal: true,
        },
      });

      await this.coopCacheUtil.invalidateCoopCache(farmingCycle.coopId, 'both');

      if (count === 0) return;

      const notificationReceiverMap: { [key: string]: boolean } = {};

      coopMembers.forEach((coopMember) => {
        notificationReceiverMap[coopMember.userId] = true;
      });

      const userReceivers = Object.keys(notificationReceiverMap);

      await this.pushNotificationQueue.sendNotificationToApp('ppl', {
        appTarget: 'ppl',
        userReceivers,
        content: {
          headline: `Permintaan DOC-in pada Kandang ${farmingCycle.coop.coopName} Ditolak oleh Procurement, silahkan ajukan kembali`,
          subHeadline: 'Terus pantau status DOC-in-nya ya',
          body: `Permintaan DOC-in pada Kandang ${farmingCycle.coop.coopName} Ditolak oleh Procurement, silahkan ajukan kembali`,
          type: 'chick-in-request',
          target: targetPage.android.ppl.listCoopPageKandangRehatTab,
          additionalParameters: {},
        },
        notification: {
          subjectId: 'chick-in-request',
          notificationType: 'chick-in-request',
          headline: `Permintaan DOC-in pada Kandang ${farmingCycle.coop.coopName} Ditolak oleh Procurement, silahkan ajukan kembali`,
          subHeadline: 'Terus pantau status DOC-in-nya ya',
          referenceId: `chick-in-request-id: ${data.id}`,
          icon: 'task-icon',
          iconPath: '/task-icon',
          target: targetPage.android.ppl.listCoopPageKandangRehatTab,
          additionalParameters: {},
        },
      });

      await this.fcDAO.commitTransaction(queryRunner);
    } catch (error) {
      this.logger.error(error);

      await this.fcDAO.rollbackTransaction(queryRunner);

      if (attemptsMade === opts.attempts) {
        await this.slackDAO.alertFailedJobs(this.workerName, error, data, jobId);
      }

      throw error;
    }
  }
}
