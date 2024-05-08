import { captureException } from '@sentry/node';
import { format } from 'date-fns';
import { Inject, Service } from 'fastify-decorators';
import { In } from 'typeorm';
import { CoopMemberDDAO } from '../../dao/coopMemberD.dao';
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

  @Inject(PushNotificationQueue)
  private pushNotificationQueue: PushNotificationQueue;

  @Inject(Logger)
  private logger: Logger;

  protected workerName = QUEUE_HARVEST_REQUEST_REJECTED;

  protected async handle(harvestRequest: HarvestRequest): Promise<void> {
    try {
      const farmingCycle = await this.farmingCycleDAO.getOneStrict({
        where: {
          id: harvestRequest.farmingCycleId,
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
        `${format(new Date(harvestRequest.datePlanned), 'd MMM')} ditolak`;

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
        `Rentang BW ${harvestRequest.minWeight} - ${harvestRequest.maxWeight} kg ` +
        `dengan jumlah ${harvestRequest.quantity} ekor`;

      await this.pushNotificationQueue.addJob({
        userReceivers: Object.keys(notificationReceiverMap),
        content: {
          id: harvestRequest.id,
          headline,
          body,
          subHeadline: body,
          type: 'harvest-request',
          target: targetPage.android.harvestActivity,
          additionalParameters: {
            coop: constructAdditionalNotificationCoop(farmingCycle),
          },
        },
        notification: {
          subjectId: 'System',
          notificationType: 'harvest-request',
          headline,
          subHeadline: body,
          referenceId: `harvest - request - id: ${harvestRequest.id} `,
          icon: '',
          iconPath: '',
          target: targetPage.android.harvestActivity,
          additionalParameters: {
            coop: constructAdditionalNotificationCoop(farmingCycle),
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
