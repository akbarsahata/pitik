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
  USER_TYPE_COOP_MEMBER,
  USER_TYPE_ENDUSER_GROUP,
  USER_TYPE_GROUP,
  USER_TYPE_REQUESTER_GROUP,
} from '../../libs/constants';
import { QUEUE_HARVEST_REQUEST_APPROVED } from '../../libs/constants/queue';
import { targetPage } from '../../libs/constants/targetPage';
import { constructAdditionalNotificationCoop } from '../../libs/utils/helpers';
import { Logger } from '../../libs/utils/logger';
import { PushNotificationQueue } from '../queues/push-notification.queue';
import { BaseWorker } from './base.worker';

interface ApprovedUserReceiverGroup {
  requesterGroup: string[];
  approverGroup: string[];
  endUserGroup: string[];
}

@Service()
export class HarvestRequestApprovedWorker extends BaseWorker<HarvestRequest> {
  @Inject(FarmingCycleDAO)
  private farmingCycleDAO: FarmingCycleDAO;

  @Inject(CoopMemberDDAO)
  private coopMemberDDAO: CoopMemberDDAO;

  @Inject(PushNotificationQueue)
  private pushNotificationQueue: PushNotificationQueue;

  @Inject(Logger)
  private logger: Logger;

  protected workerName = QUEUE_HARVEST_REQUEST_APPROVED;

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

      const [userReceivers] = await this.coopMemberDDAO.getMany({
        where: {
          coopId: farmingCycle.coopId,
          user: {
            userType: In(USER_TYPE_COOP_MEMBER),
          },
        },
        relations: {
          user: true,
        },
      });

      const { requesterGroup, approverGroup, endUserGroup } = await this.groupUserBasedOnUserType(
        userReceivers,
      );

      if (requesterGroup.length > 0) {
        await this.notifyUserReceivers(
          requesterGroup,
          harvestRequest,
          farmingCycle,
          USER_TYPE_GROUP.REQUESTER,
        );
      }

      if (approverGroup.length > 0) {
        await this.notifyUserReceivers(
          approverGroup,
          harvestRequest,
          farmingCycle,
          USER_TYPE_GROUP.APPROVER,
        );
      }

      endUserGroup.push(farmingCycle.farm.userOwnerId);
      if (endUserGroup.length > 0) {
        await this.notifyUserReceivers(
          endUserGroup,
          harvestRequest,
          farmingCycle,
          USER_TYPE_GROUP.ENDUSER,
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
    const userReceiverGroup: ApprovedUserReceiverGroup = {
      requesterGroup: [],
      approverGroup: [],
      endUserGroup: [],
    };

    userReceivers.forEach((ur) => {
      if (USER_TYPE_REQUESTER_GROUP.includes(ur.user.userType)) {
        userReceiverGroup.requesterGroup.push(ur.userId);
      } else if (USER_TYPE_APPROVER_GROUP.includes(ur.user.userType)) {
        userReceiverGroup.approverGroup.push(ur.userId);
      } else if (USER_TYPE_ENDUSER_GROUP.includes(ur.user.userType)) {
        userReceiverGroup.endUserGroup.push(ur.userId);
      }
    });

    return userReceiverGroup;
  }

  private async notifyUserReceivers(
    userReceiverIds: string[],
    harvestRequest: HarvestRequest,
    farmingCycle: FarmingCycle,
    userReceiverGroup: string,
  ) {
    let headline: string = '';

    if (
      userReceiverGroup === USER_TYPE_GROUP.APPROVER ||
      userReceiverGroup === USER_TYPE_GROUP.REQUESTER
    ) {
      headline =
        `[INFO] Pengajuan panen kandang ${farmingCycle.coop.coopName} ` +
        `${format(new Date(harvestRequest.datePlanned), 'd MMM')} disetujui`;
    }

    if (userReceiverGroup === USER_TYPE_GROUP.ENDUSER) {
      const headlineContentReference =
        harvestRequest.erpCode || `kandang ${farmingCycle.coop.coopName}`;
      headline = `[INFO] Deal Panen ${headlineContentReference} sudah disetujui. Lakukan Penimbangan Panen Sekarang`;
    }

    const body =
      `Rentang BW ${harvestRequest.minWeight} - ${harvestRequest.maxWeight} kg ` +
      `dengan jumlah ${harvestRequest.quantity} ekor`;

    const notifyPayload = {
      userReceivers: userReceiverIds,
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
      },
    };

    if (userReceiverGroup === USER_TYPE_GROUP.ENDUSER) {
      Object.assign(notifyPayload.content, {
        ...notifyPayload.content,
        target: targetPage.android.smartScaleWeighing,
        additionalParameters: {},
      });

      Object.assign(notifyPayload.notification, {
        ...notifyPayload.notification,
        target: targetPage.android.smartScaleWeighing,
        additionalParameters: {},
      });
    } else if (
      userReceiverGroup === USER_TYPE_GROUP.APPROVER ||
      userReceiverGroup === USER_TYPE_GROUP.REQUESTER
    ) {
      const additionalParameters = {
        coop: constructAdditionalNotificationCoop(farmingCycle),
      };

      Object.assign(notifyPayload.content, {
        ...notifyPayload.content,
        target: targetPage.android.harvestActivity,
        additionalParameters,
      });

      Object.assign(notifyPayload.notification, {
        ...notifyPayload.notification,
        target: targetPage.android.harvestActivity,
        additionalParameters,
      });
    }

    await this.pushNotificationQueue.addJob(notifyPayload);
  }
}
