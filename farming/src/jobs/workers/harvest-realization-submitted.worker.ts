import { JobsOptions } from 'bullmq';
import { format } from 'date-fns';
import { Inject, Service } from 'fastify-decorators';
import { In } from 'typeorm';
import { CoopMemberDDAO } from '../../dao/coopMemberD.dao';
import { SlackDAO } from '../../dao/external/slack.dao';
import { FarmingCycleDAO } from '../../dao/farmingCycle.dao';
import { HarvestRealizationDAO } from '../../dao/harvestRealization.dao';
import {
  HarvestRealization,
  RealizationStatusEnum,
} from '../../datasources/entity/pgsql/HarvestRealization.entity';
import { USER_TYPE } from '../../libs/constants';
import { QUEUE_HARVEST_REALIZATION_SUBMITTED } from '../../libs/constants/queue';
import { targetPage } from '../../libs/constants/targetPage';
import { constructAdditionalNotificationCoop } from '../../libs/utils/helpers';
import { Logger } from '../../libs/utils/logger';
import { HarvestRealizationCreateOdooQueue } from '../queues/harvest-realization-create-odoo.queue';
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

  @Inject(HarvestRealizationDAO)
  private harvestRealizationDAO: HarvestRealizationDAO;

  @Inject(SlackDAO)
  private slackDAO!: SlackDAO;

  @Inject(HarvestRealizationCreateOdooQueue)
  private harvestRealizationCreateOdooQueue: HarvestRealizationCreateOdooQueue;

  @Inject(Logger)
  private logger: Logger;

  protected workerName = QUEUE_HARVEST_REALIZATION_SUBMITTED;

  protected async handle(
    data: HarvestRealization,
    attemptsMade: number,
    opts: JobsOptions,
    jobId?: string,
  ): Promise<void> {
    try {
      const harvestRealization = await this.harvestRealizationDAO.getOneStrict({
        where: {
          id: data.id,
        },
        relations: {
          harvestDeal: {
            harvestRequest: {
              approver: true,
              creator: true,
            },
          },
        },
      });

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
        `Rentang BW ${harvestRealization.harvestDeal.minWeight} - ${harvestRealization.harvestDeal.maxWeight} kg ` +
        `, jumlah ${harvestRealization.harvestDeal.quantity} ekor, total tonase ${harvestRealization.tonnage} kg`;

      await this.pushNotificationQueue.sendNotificationToApp('ppl', {
        appTarget: 'ppl',
        userReceivers: Object.keys(notificationReceiverMap),
        content: {
          id: harvestRealization.id,
          headline,
          body,
          subHeadline: body,
          type: 'harvest-realization',
          target: targetPage.android.ppl.harvestActivityPage,
          additionalParameters: {
            farmingCycleId: farmingCycle.id,
            coopId: farmingCycle.coopId,
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
          target: targetPage.android.ppl.harvestActivityPage,
          additionalParameters: {
            farmingCycleId: farmingCycle.id,
            coopId: farmingCycle.coopId,
            coop: constructAdditionalNotificationCoop(farmingCycle),
          },
        },
      });

      if (data.status === RealizationStatusEnum.FINAL) {
        await this.harvestRealizationCreateOdooQueue.addJob({
          ...data,
          farmingCycleCode: farmingCycle.farmingCycleCode,
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
