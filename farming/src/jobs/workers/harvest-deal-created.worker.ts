import { JobsOptions } from 'bullmq';
import { Inject, Service } from 'fastify-decorators';
import { In } from 'typeorm';
import { CoopMemberDDAO } from '../../dao/coopMemberD.dao';
import { SlackDAO } from '../../dao/external/slack.dao';
import { FarmingCycleDAO } from '../../dao/farmingCycle.dao';
import { HarvestDealDAO } from '../../dao/harvestDeal.dao';
import { HarvestDeal } from '../../datasources/entity/pgsql/HarvestDeal.entity';
import {
  USER_TYPE,
  USER_TYPE_APPROVER_GROUP,
  USER_TYPE_REQUESTER_GROUP,
} from '../../libs/constants';
import { QUEUE_HARVEST_DEAL_CREATED } from '../../libs/constants/queue';
import { targetPage } from '../../libs/constants/targetPage';
import { constructAdditionalNotificationCoop } from '../../libs/utils/helpers';
import { Logger } from '../../libs/utils/logger';
import { UserService as UserCoreService } from '../../services/usermanagement/userCore.service';
import { PushNotificationQueue } from '../queues/push-notification.queue';
import { BaseWorker } from './base.worker';

@Service()
export class HarvestDealCreatedWorker extends BaseWorker<HarvestDeal> {
  @Inject(FarmingCycleDAO)
  private farmingCycleDAO: FarmingCycleDAO;

  @Inject(HarvestDealDAO)
  private harvestDealDAO: HarvestDealDAO;

  @Inject(PushNotificationQueue)
  private pushNotificationQueue: PushNotificationQueue;

  @Inject(CoopMemberDDAO)
  private coopMemberDDAO: CoopMemberDDAO;

  @Inject(UserCoreService)
  private userCoreService: UserCoreService;

  @Inject(SlackDAO)
  private slackDAO!: SlackDAO;

  @Inject(Logger)
  private logger: Logger;

  protected workerName = QUEUE_HARVEST_DEAL_CREATED;

  protected async handle(
    data: HarvestDeal,
    attemptsMade: number,
    opts: JobsOptions,
    jobId?: string,
  ): Promise<void> {
    try {
      const [harvestDeal, farmingCycle] = await Promise.all([
        this.harvestDealDAO.getOneStrict({
          where: {
            id: data.id,
          },
        }),
        this.farmingCycleDAO.getOneStrict({
          where: {
            id: data.farmingCycleId,
          },
          relations: {
            coop: true,
            farm: {
              city: true,
              district: true,
            },
          },
        }),
      ]);

      const userTypes = [...USER_TYPE_APPROVER_GROUP, ...USER_TYPE_REQUESTER_GROUP];

      const [coopMembers] = await this.coopMemberDDAO.getMany({
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

      const internalUserIds = coopMembers.filter((cm) => cm.isInternal).map((u) => u.userId);
      const [internalUsers] = await this.userCoreService.search({ cmsIds: internalUserIds });
      const userReceivers = internalUsers.reduce((prev, user) => {
        if (
          user.cmsId &&
          user.roles?.find((role) => role.name === USER_TYPE.PPL || role.name === USER_TYPE.SLSADM)
        ) {
          prev.push(user.cmsId);
        }

        return prev;
      }, [] as string[]);

      await this.pushNotificationQueue.sendNotificationToApp('ppl', {
        appTarget: 'ppl',
        userReceivers,
        content: {
          id: `harvest-deal-created-${harvestDeal.id}`,
          headline: `Deal Panen ${harvestDeal.erpCode} terbentuk`,
          subHeadline: `Deal Panen ${harvestDeal.erpCode} terbentuk`,
          body: `Deal Panen dengan Nomor DO ${harvestDeal.erpCode} terbentuk, Mohon lakukan Realisasi sesuai dengan Panen yang dilakukan`,
          type: 'purchase-request-created',
          target: targetPage.android.ppl.notificationPage,
          additionalParameters: {
            coopId: farmingCycle.coopId,
            farmingCycleId: harvestDeal.farmingCycleId,
            coop: constructAdditionalNotificationCoop(farmingCycle),
          },
        },
        notification: {
          subjectId: 'System',
          notificationType: 'harvest-deal-created',
          headline: `Deal Panen ${harvestDeal.erpCode} terbentuk`,
          subHeadline: `Deal Panen dengan Nomor DO ${harvestDeal.erpCode} terbentuk, Mohon lakukan Realisasi sesuai dengan Panen yang dilakukan`,
          referenceId: `harvest-deal-id: ${harvestDeal.id}`,
          icon: '',
          iconPath: '',
          target: targetPage.android.ppl.notificationPage,
          additionalParameters: {
            coopId: farmingCycle.coopId,
            farmingCycleId: harvestDeal.farmingCycleId,
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
