import { captureException } from '@sentry/node';
import { Inject, Service } from 'fastify-decorators';
import { AlertTriggeredDAO } from '../../dao/alertTriggered.dao';
import { FarmingCycleDAO } from '../../dao/farmingCycle.dao';
import { FarmingCycleAlertDDAO } from '../../dao/farmingCycleAlertD.dao';
import { FarmingCycleMemberDDAO } from '../../dao/farmingCycleMemberD.dao';
import { Issue } from '../../datasources/entity/pgsql/Issue.entity';
import { QUEUE_ISSUE_CREATED } from '../../libs/constants/queue';
import { targetPage } from '../../libs/constants/targetPage';
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

  @Inject(PushNotificationQueue)
  private pushNotificationQueue: PushNotificationQueue;

  @Inject(Logger)
  private logger: Logger;

  protected workerName = QUEUE_ISSUE_CREATED;

  protected async handle(data: Issue): Promise<void> {
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
          farm: true,
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

      await this.pushNotificationQueue.addJob({
        userReceivers: Object.keys(notificationReceiverMap),
        content: {
          id: data.id,
          headline: farmingCycleAlertD.alert.alertName,
          subHeadline: farmingCycleAlertD.alert.alertName,
          body: farmingCycleAlertD.alert.alertDescription
            .split('{coopName}')
            .join(farmingCycle.coop.coopName),
          type: 'issue',
          target: targetPage.android.issueReport,
          additionalParameters: {
            coopId: farmingCycle.coopId,
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
          target: targetPage.android.issueReport,
          additionalParameters: {
            coopId: farmingCycle.coopId,
          },
        },
      });
    } catch (error) {
      this.logger.error(error);

      captureException(error);

      throw error;
    }
  }
}
