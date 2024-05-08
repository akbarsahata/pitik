import { JobsOptions } from 'bullmq';
import { Inject, Service } from 'fastify-decorators';
import { AlertTriggeredDAO } from '../../dao/alertTriggered.dao';
import { SlackDAO } from '../../dao/external/slack.dao';
import { FarmingCycleDAO } from '../../dao/farmingCycle.dao';
import { FarmingCycleAlertDDAO } from '../../dao/farmingCycleAlertD.dao';
import { FarmingCycleMemberDDAO } from '../../dao/farmingCycleMemberD.dao';
import { QUEUE_ISSUE_CREATED } from '../../libs/constants/queue';
import { targetPage } from '../../libs/constants/targetPage';
import { constructAdditionalNotificationCoop } from '../../libs/utils/helpers';
import { Logger } from '../../libs/utils/logger';
import { PushNotificationQueue } from '../queues/push-notification.queue';
import { BaseWorker } from './base.worker';

@Service()
export class IssueCreatedWorker extends BaseWorker {
  @Inject(AlertTriggeredDAO)
  private alertTriggeredDAO: AlertTriggeredDAO;

  @Inject(FarmingCycleMemberDDAO)
  private farmingCycleMemberDDAO: FarmingCycleMemberDDAO;

  @Inject(FarmingCycleDAO)
  private farmingCycleDAO: FarmingCycleDAO;

  @Inject(FarmingCycleAlertDDAO)
  private farmingCycleAlertDDAO: FarmingCycleAlertDDAO;

  @Inject(SlackDAO)
  private slackDAO!: SlackDAO;

  @Inject(PushNotificationQueue)
  private pushNotificationQueue: PushNotificationQueue;

  @Inject(Logger)
  private logger: Logger;

  protected workerName = QUEUE_ISSUE_CREATED;

  protected async handle(
    data: any,
    attemptsMade: number,
    opts: JobsOptions,
    jobId?: string,
  ): Promise<void> {
    try {
      await this.alertTriggeredDAO.createAlertTriggered({
        farmingCycleId: data.farmingCycleId,
        farmingCycleAlertId: data.farmingCycleAlertId,
        issueId: data.id,
      });

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

      const [farmingCycleMembers] = await this.farmingCycleMemberDDAO.getMany({
        where: {
          farmingCycleId: data.farmingCycleId,
        },
      });

      const notificationReceiverMap: { [key: string]: boolean } = {};

      notificationReceiverMap[farmingCycle.farm.userOwnerId] = true;

      farmingCycleMembers.forEach((fcm) => {
        notificationReceiverMap[fcm.userId] = true;
      });

      const farmingCycleAlertD = await this.farmingCycleAlertDDAO.getOne({
        where: {
          id: data.farmingCycleAlertId,
        },
        relations: {
          alert: true,
        },
      });

      await this.pushNotificationQueue.sendNotificationToApp('ppl', {
        appTarget: 'ppl',
        userReceivers: Object.keys(notificationReceiverMap),
        content: {
          id: data.id,
          headline: farmingCycleAlertD.alert.alertName,
          subHeadline: farmingCycleAlertD.alert.alertName,
          body: farmingCycleAlertD.alert.alertDescription
            .split('{coopName}')
            .join(farmingCycle.coop.coopName),
          type: 'issue',
          target: targetPage.android.ppl.issueReportPage,
          additionalParameters: {
            farmingCycleId: farmingCycle.id,
            coopId: farmingCycle.coopId,
            coop: constructAdditionalNotificationCoop(farmingCycle),
          },
        },
        notification: {
          subjectId: 'System',
          notificationType: 'issue',
          headline: farmingCycleAlertD.alert.alertName,
          subHeadline: farmingCycleAlertD.alert.alertDescription
            .split('{coopName}')
            .join(farmingCycle.coop.coopName),
          referenceId: `issue-id: ${data.id}`,
          icon: '',
          iconPath: '',
          target: targetPage.android.ppl.issueReportPage,
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
