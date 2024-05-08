import { captureException } from '@sentry/node';
import { format } from 'date-fns';
import { Inject, Service } from 'fastify-decorators';
import { In } from 'typeorm';
import { CoopMemberDDAO } from '../../dao/coopMemberD.dao';
import { FarmingCycleDAO } from '../../dao/farmingCycle.dao';
import { CoopMemberD } from '../../datasources/entity/pgsql/CoopMemberD.entity';
import { FarmingCycle } from '../../datasources/entity/pgsql/FarmingCycle.entity';
import { HarvestDeal } from '../../datasources/entity/pgsql/HarvestDeal.entity';
import {
  USER_TYPE_APPROVER_GROUP,
  USER_TYPE_GROUP,
  USER_TYPE_REQUESTER_GROUP,
} from '../../libs/constants';
import { QUEUE_HARVEST_DEAL_CREATED } from '../../libs/constants/queue';
import { Logger } from '../../libs/utils/logger';
import { PushNotificationQueue } from '../queues/push-notification.queue';
import { BaseWorker } from './base.worker';

interface SubmittedUserReceiverGroup {
  requesterGroup: string[];
  approverGroup: string[];
}

@Service()
export class HarvestDealCreatedWorker extends BaseWorker<HarvestDeal> {
  @Inject(PushNotificationQueue)
  private pushNotificationQueue: PushNotificationQueue;

  @Inject(CoopMemberDDAO)
  private coopMemberDDAO: CoopMemberDDAO;

  @Inject(FarmingCycleDAO)
  private farmingCycleDAO: FarmingCycleDAO;

  @Inject(Logger)
  private logger: Logger;

  protected workerName = QUEUE_HARVEST_DEAL_CREATED;

  protected async handle(harvestDeal: HarvestDeal): Promise<void> {
    try {
      const farmingCycle = await this.farmingCycleDAO.getOneStrict({
        where: {
          id: harvestDeal.farmingCycleId,
        },
        relations: {
          farm: true,
          coop: true,
        },
      });

      const userTypes = [...USER_TYPE_APPROVER_GROUP, ...USER_TYPE_REQUESTER_GROUP];

      const [userReceivers] = await this.coopMemberDDAO.getMany({
        where: {
          coopId: farmingCycle.coopId,
          user: {
            userType: In(userTypes),
          },
        },
      });

      const { requesterGroup, approverGroup } = await this.groupUserBasedOnUserType(userReceivers);

      if (requesterGroup.length > 0) {
        await this.notifyUserReceivers(
          requesterGroup,
          harvestDeal,
          farmingCycle,
          USER_TYPE_GROUP.REQUESTER,
        );
      }

      if (approverGroup.length > 0) {
        await this.notifyUserReceivers(
          approverGroup,
          harvestDeal,
          farmingCycle,
          USER_TYPE_GROUP.APPROVER,
        );
      }
    } catch (error) {
      this.logger.error(error);

      captureException(error);

      throw error;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  private async groupUserBasedOnUserType(userReceivers: CoopMemberD[]) {
    const userReceiverGroup: SubmittedUserReceiverGroup = {
      requesterGroup: [],
      approverGroup: [],
    };

    userReceivers.forEach((ur) => {
      if (USER_TYPE_REQUESTER_GROUP.includes(ur.user.userType)) {
        userReceiverGroup.requesterGroup.push(ur.userId);
      }

      if (USER_TYPE_APPROVER_GROUP.includes(ur.user.userType)) {
        userReceiverGroup.approverGroup.push(ur.userId);
      }
    });

    return userReceiverGroup;
  }

  private async notifyUserReceivers(
    userReceiverIds: string[],
    harvestDeal: HarvestDeal,
    farmingCycle: FarmingCycle,
    userReceiverGroup: string,
  ) {
    let headline: string = '';

    if (userReceiverGroup === USER_TYPE_GROUP.REQUESTER) {
      headline =
        `[INFO] Panen kandang ${farmingCycle.coop.coopName} ` +
        `${format(new Date(harvestDeal.datePlanned), 'd MMM')} bisa dilakukan pelaporan realisasi`;
    }

    if (userReceiverGroup === USER_TYPE_GROUP.APPROVER) {
      headline =
        `[INFO] Laporkan realisasi panen kandang ${farmingCycle.coop.coopName} ` +
        `${format(new Date(harvestDeal.datePlanned), 'd MMM')}`;
    }

    const body =
      `Rentang BW ${harvestDeal.minWeight} - ${harvestDeal.maxWeight} kg ` +
      `dengan jumlah ${harvestDeal.quantity} ekor`;

    await this.pushNotificationQueue.addJob({
      userReceivers: userReceiverIds,
      content: {
        id: harvestDeal.id,
        headline,
        body,
        subHeadline: body,
        type: 'harvest-deal',
      },
      notification: {
        subjectId: 'System',
        notificationType: 'harvest-deal',
        headline,
        subHeadline: body,
        referenceId: `harvest - deal - id: ${harvestDeal.id} `,
        icon: '',
        iconPath: '',
      },
    });
  }
}
