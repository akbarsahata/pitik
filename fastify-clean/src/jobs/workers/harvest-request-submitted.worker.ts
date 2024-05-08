import { captureException } from '@sentry/node';
import { format } from 'date-fns';
import { Inject, Service } from 'fastify-decorators';
import { In } from 'typeorm';
import { CoopMemberDDAO } from '../../dao/coopMemberD.dao';
import { FarmingCycleDAO } from '../../dao/farmingCycle.dao';
import { CoopMemberD } from '../../datasources/entity/pgsql/CoopMemberD.entity';
import { FarmingCycle } from '../../datasources/entity/pgsql/FarmingCycle.entity';
import { HarvestRequest } from '../../datasources/entity/pgsql/HarvestRequest.entity';
import {
  USER_TYPE_APPROVER_GROUP,
  USER_TYPE_GROUP,
  USER_TYPE_REQUESTER_GROUP,
} from '../../libs/constants';
import { QUEUE_HARVEST_REQUEST_SUBMITTED } from '../../libs/constants/queue';
import { targetPage } from '../../libs/constants/targetPage';
import { constructAdditionalNotificationCoop } from '../../libs/utils/helpers';
import { Logger } from '../../libs/utils/logger';
import { PushNotificationQueue } from '../queues/push-notification.queue';
import { BaseWorker } from './base.worker';

interface SubmittedUserReceiverGroup {
  requesterGroup: string[];
  approverGroup: string[];
}

@Service()
export class HarvestRequestSubmittedWorker extends BaseWorker<HarvestRequest> {
  @Inject(FarmingCycleDAO)
  private farmingCycleDAO: FarmingCycleDAO;

  @Inject(CoopMemberDDAO)
  private coopMemberDDAO: CoopMemberDDAO;

  @Inject(PushNotificationQueue)
  private pushNotificationQueue: PushNotificationQueue;

  @Inject(Logger)
  private logger: Logger;

  protected workerName = QUEUE_HARVEST_REQUEST_SUBMITTED;

  protected async handle(data: HarvestRequest): Promise<void> {
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

      const userTypes = [...USER_TYPE_APPROVER_GROUP, ...USER_TYPE_REQUESTER_GROUP];

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

      const { requesterGroup, approverGroup } = await this.groupUserBasedOnUserType(userReceivers);

      if (requesterGroup.length > 0) {
        await this.notifyUserReceivers(
          requesterGroup,
          data,
          farmingCycle,
          USER_TYPE_GROUP.REQUESTER,
        );
      }

      if (approverGroup.length > 0) {
        await this.notifyUserReceivers(approverGroup, data, farmingCycle, USER_TYPE_GROUP.APPROVER);
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
    data: HarvestRequest,
    farmingCycle: FarmingCycle,
    userReceiverGroup: string,
  ) {
    let headline: string = '';

    if (userReceiverGroup === USER_TYPE_GROUP.APPROVER) {
      headline =
        `[INFO] Butuh persetujuan panen kandang ${farmingCycle.coop.coopName} ` +
        `${format(new Date(data.datePlanned), 'd MMM')}`;
    }

    if (userReceiverGroup === USER_TYPE_GROUP.REQUESTER) {
      headline =
        `[INFO] Pengajuan panen kandang ${farmingCycle.coop.coopName} ` +
        `${format(new Date(data.datePlanned), 'd MMM')}`;
    }

    const body =
      `Rentang BW ${data.minWeight} - ${data.maxWeight} kg ` +
      `dengan jumlah ${data.quantity} ekor`;

    await this.pushNotificationQueue.addJob({
      userReceivers: userReceiverIds,
      content: {
        id: data.id,
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
        referenceId: `harvest - request - id: ${data.id} `,
        icon: '',
        iconPath: '',
        target: targetPage.android.harvestActivity,
        additionalParameters: {
          coop: constructAdditionalNotificationCoop(farmingCycle),
        },
      },
    });
  }
}
