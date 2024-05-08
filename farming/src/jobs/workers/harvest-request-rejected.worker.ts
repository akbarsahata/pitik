import { JobsOptions } from 'bullmq';
import { format } from 'date-fns';
import { Inject, Service } from 'fastify-decorators';
import { In } from 'typeorm';
import { CoopMemberDDAO } from '../../dao/coopMemberD.dao';
import { SlackDAO } from '../../dao/external/slack.dao';
import { FarmingCycleDAO } from '../../dao/farmingCycle.dao';
import { HarvestRequest } from '../../datasources/entity/pgsql/HarvestRequest.entity';
import { USER_TYPE_APPROVER_GROUP, USER_TYPE_REQUESTER_GROUP } from '../../libs/constants';
import { QUEUE_HARVEST_REQUEST_REJECTED } from '../../libs/constants/queue';
import { targetPage } from '../../libs/constants/targetPage';
import { constructAdditionalNotificationCoop } from '../../libs/utils/helpers';
import { Logger } from '../../libs/utils/logger';
import { PushNotificationQueue } from '../queues/push-notification.queue';
import { BaseWorker } from './base.worker';

@Service()
export class HarvestRequestRejectedWorker extends BaseWorker<HarvestRequest> {
  @Inject(FarmingCycleDAO)
  private farmingCycleDAO: FarmingCycleDAO;

  @Inject(CoopMemberDDAO)
  private coopMemberDDAO: CoopMemberDDAO;

  @Inject(SlackDAO)
  private slackDAO!: SlackDAO;

  @Inject(PushNotificationQueue)
  private pushNotificationQueue: PushNotificationQueue;

  @Inject(Logger)
  private logger: Logger;

  protected workerName = QUEUE_HARVEST_REQUEST_REJECTED;

  protected async handle(
    data: HarvestRequest,
    attemptsMade: number,
    opts: JobsOptions,
    jobId?: string,
  ): Promise<void> {
    try {
      const farmingCycle = await this.farmingCycleDAO.getOneStrict({
        where: {
          id: data.farmingCycleId,
        },
        relations: {
          farm: {
            city: true,
            district: true,
          },
          coop: true,
        },
      });

      const productionTeam = [...USER_TYPE_REQUESTER_GROUP, ...USER_TYPE_APPROVER_GROUP];

      const headline =
        `[INFO] Pengajuan panen kandang ${farmingCycle.coop.coopName} ` +
        `${format(new Date(data.datePlanned), 'd MMM')} ditolak`;

      const [userReceivers] = await this.coopMemberDDAO.getMany({
        where: {
          coopId: farmingCycle.coopId,
          user: {
            userType: In(productionTeam),
          },
        },
        relations: {
          user: true,
        },
      });

      const notificationReceiverMap: { [key: string]: boolean } = {};

      userReceivers.forEach((ur) => {
        notificationReceiverMap[ur.userId] = true;
      });

      const body =
        `Rentang BW ${data.minWeight} - ${data.maxWeight} kg ` +
        `dengan jumlah ${data.quantity} ekor`;

      await this.pushNotificationQueue.sendNotificationToApp('ppl', {
        appTarget: 'ppl',
        userReceivers: Object.keys(notificationReceiverMap),
        content: {
          id: data.id,
          headline,
          body,
          subHeadline: body,
          type: 'harvest-request',
          target: targetPage.android.ppl.harvestActivityPage,
          additionalParameters: {
            farmingCycleId: farmingCycle.id,
            coopId: farmingCycle.coopId,
            coop: constructAdditionalNotificationCoop(farmingCycle),
          },
        },
        notification: {
          subjectId: 'System',
          notificationType: 'harvest-request',
          headline,
          subHeadline: body,
          referenceId: `harvest - request - id: ${data.id} `,
          icon: '',
          iconPath: '',
          target: targetPage.android.ppl.harvestActivityPage,
          additionalParameters: {
            farmingCycleId: farmingCycle.id,
            coopId: farmingCycle.coopId,
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
