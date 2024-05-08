import { captureException } from '@sentry/node';
import { format } from 'date-fns';
import { Inject, Service } from 'fastify-decorators';
import { In } from 'typeorm';
import { CoopMemberDDAO } from '../../dao/coopMemberD.dao';
import { FarmingCycleDAO } from '../../dao/farmingCycle.dao';
import { HarvestDealDAO } from '../../dao/harvestDeal.dao';
import { HarvestRealization } from '../../datasources/entity/pgsql/HarvestRealization.entity';
import { USER_TYPE } from '../../libs/constants';
import { QUEUE_HARVEST_REALIZATION_SUBMITTED } from '../../libs/constants/queue';
import { targetPage } from '../../libs/constants/targetPage';
import { constructAdditionalNotificationCoop } from '../../libs/utils/helpers';
import { Logger } from '../../libs/utils/logger';
import { PushNotificationQueue } from '../queues/push-notification.queue';
import { BaseWorker } from './base.worker';

@Service()
export class HarvestRealizationSubmittedWorker extends BaseWorker<HarvestRealization> {
  @Inject(PushNotificationQueue)
  private pushNotificationQueue: PushNotificationQueue;

  @Inject(CoopMemberDDAO)
  private coopMemberDDAO: CoopMemberDDAO;

  @Inject(FarmingCycleDAO)
  private farmingCycleDAO: FarmingCycleDAO;

  @Inject(HarvestDealDAO)
  private harvestDealDAO: HarvestDealDAO;

  @Inject(Logger)
  private logger: Logger;

  protected workerName = QUEUE_HARVEST_REALIZATION_SUBMITTED;

  protected async handle(harvestRealization: HarvestRealization): Promise<void> {
    try {
      const farmingCycle = await this.farmingCycleDAO.getOneStrict({
        where: {
          id: harvestRealization.farmingCycleId,
        },
        relations: {
          farm: {
            city: true,
            district: true,
          },
          coop: true,
        },
      });

      const harvestDeal = await this.harvestDealDAO.getOneStrict({
        where: {
          id: harvestRealization.harvestDealId,
        },
      });

      const userTypes = [USER_TYPE.BU, USER_TYPE.PPL, USER_TYPE.MM];
      const headline =
        `[INFO] Laporan realisasi panen kandang ${farmingCycle.coop.coopName} ` +
        `${format(new Date(harvestRealization.harvestDate), 'd MMM')}`;

      const [userReceivers] = await this.coopMemberDDAO.getMany({
        where: {
          coopId: farmingCycle.coopId,
          user: {
            userType: In(userTypes),
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
        `Rentang BW ${harvestDeal.minWeight} - ${harvestDeal.maxWeight} kg ` +
        `, jumlah ${harvestDeal.quantity} ekor, total tonase ${harvestRealization.tonnage} kg`;

      await this.pushNotificationQueue.addJob({
        userReceivers: Object.keys(notificationReceiverMap),
        content: {
          id: harvestRealization.id,
          headline,
          body,
          subHeadline: body,
          type: 'harvest-realization',
          target: targetPage.android.harvestActivity,
          additionalParameters: {
            coop: constructAdditionalNotificationCoop(farmingCycle),
          },
        },
        notification: {
          subjectId: 'System',
          notificationType: 'harvest-realization',
          headline,
          subHeadline: body,
          referenceId: `harvest - realization - id: ${harvestRealization.id} `,
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
