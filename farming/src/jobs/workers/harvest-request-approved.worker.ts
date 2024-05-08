import { JobsOptions } from 'bullmq';
import { format } from 'date-fns';
import { Inject, Service } from 'fastify-decorators';
import { In } from 'typeorm';
import { CoopMemberDDAO } from '../../dao/coopMemberD.dao';
import { ErpDAO } from '../../dao/erp.dao';
import { SlackDAO } from '../../dao/external/slack.dao';
import { FarmingCycleDAO } from '../../dao/farmingCycle.dao';
import { HarvestRequestDAO } from '../../dao/harvestRequest.dao';
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
import { HarvestRequestApprovedJobData } from '../../libs/interfaces/job-data';
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
export class HarvestRequestApprovedWorker extends BaseWorker<HarvestRequestApprovedJobData> {
  @Inject(FarmingCycleDAO)
  private farmingCycleDAO: FarmingCycleDAO;

  @Inject(HarvestRequestDAO)
  private harvestRequestDAO: HarvestRequestDAO;

  @Inject(CoopMemberDDAO)
  private coopMemberDDAO: CoopMemberDDAO;

  @Inject(ErpDAO)
  private erpDAO: ErpDAO;

  @Inject(SlackDAO)
  private slackDAO!: SlackDAO;

  @Inject(PushNotificationQueue)
  private pushNotificationQueue: PushNotificationQueue;

  @Inject(Logger)
  private logger: Logger;

  protected workerName = QUEUE_HARVEST_REQUEST_APPROVED;

  protected async handle(
    data: HarvestRequestApprovedJobData,
    attemptsMade: number,
    opts: JobsOptions,
    jobId?: string,
  ): Promise<void> {
    try {
      const harvestRequest = await this.harvestRequestDAO.getOneStrict({
        where: {
          id: data.id,
        },
        relations: {
          approver: true,
          creator: true,
        },
      });

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

      await this.createHarvestRequestToOdoo({ ...harvestRequest, farmingCycle });
    } catch (error) {
      this.logger.error(error);

      if (attemptsMade === opts.attempts) {
        await this.slackDAO.alertFailedJobs(this.workerName, error, data, jobId);
      }

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
        target: targetPage.android.ppl.harvestActivityPage,
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
        target: targetPage.android.ppl.harvestActivityPage,
        additionalParameters: {
          coop: constructAdditionalNotificationCoop(farmingCycle),
        },
      },
    };

    if (userReceiverGroup === USER_TYPE_GROUP.ENDUSER) {
      Object.assign(notifyPayload.content, {
        ...notifyPayload.content,
        target: targetPage.android.ppl.smartScaleHarvestMainPage,
        additionalParameters: {},
      });

      Object.assign(notifyPayload.notification, {
        ...notifyPayload.notification,
        target: targetPage.android.ppl.smartScaleHarvestMainPage,
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
        target: targetPage.android.ppl.harvestActivityPage,
        additionalParameters,
      });

      Object.assign(notifyPayload.notification, {
        ...notifyPayload.notification,
        target: targetPage.android.ppl.harvestActivityPage,
        additionalParameters,
      });
    }

    await this.pushNotificationQueue.sendNotificationToApp('ppl', {
      ...notifyPayload,
      appTarget: 'ppl',
    });
  }

  private async createHarvestRequestToOdoo(harvestDetail: HarvestRequest): Promise<void> {
    const erpCode = await this.erpDAO.createHarvestRequest({
      farmingCycleCode: harvestDetail.farmingCycle.farmingCycleCode,
      coopCode: harvestDetail.farmingCycle.coop.coopCode,
      requester: `${harvestDetail.creator.fullName} - ${harvestDetail.creator.phoneNumber}`,
      approver: `${harvestDetail.approver.fullName} - ${harvestDetail.approver.phoneNumber}`,
      datePlanned: harvestDetail.datePlanned,
      rangeMin: harvestDetail.minWeight,
      rangeMax: harvestDetail.maxWeight,
      quantity: harvestDetail.quantity,
      reason: harvestDetail.reason,
    });

    await this.harvestRequestDAO.updateOne(
      {
        id: harvestDetail.id,
      },
      {
        erpCode,
      },
      {
        id: harvestDetail.approver.id,
        role: harvestDetail.approver.userType,
      },
    );
  }
}
