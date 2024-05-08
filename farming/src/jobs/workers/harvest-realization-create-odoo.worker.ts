import { JobsOptions } from 'bullmq';
import { Inject, Service } from 'fastify-decorators';
import { ErpDAO } from '../../dao/erp.dao';
import { SlackDAO } from '../../dao/external/slack.dao';
import { HarvestRealizationDAO } from '../../dao/harvestRealization.dao';
import { ErpHarvestRealizationCreate } from '../../datasources/entity/erp/ERPProduct';
import {
  HarvestRealization,
  RealizationStatusEnum,
} from '../../datasources/entity/pgsql/HarvestRealization.entity';
import { USER_TYPE } from '../../libs/constants';
import { QUEUE_HARVEST_REALIZATION_CREATE_ODOO } from '../../libs/constants/queue';
import { targetPage } from '../../libs/constants/targetPage';
import { HarvestRealizationCreateOdooJobData } from '../../libs/interfaces/job-data';
import { constructAdditionalNotificationCoop } from '../../libs/utils/helpers';
import { Logger } from '../../libs/utils/logger';
import { UserService as UserCoreService } from '../../services/usermanagement/userCore.service';
import { PushNotificationQueue } from '../queues/push-notification.queue';
import { BaseWorker } from './base.worker';

@Service()
// eslint-disable-next-line max-len
export class HarvestRealizationCreateOdooWorker extends BaseWorker<HarvestRealizationCreateOdooJobData> {
  @Inject(HarvestRealizationDAO)
  private harvestRealizationDAO: HarvestRealizationDAO;

  @Inject(ErpDAO)
  private erpDAO: ErpDAO;

  @Inject(PushNotificationQueue)
  private pushNotificationQueue: PushNotificationQueue;

  @Inject(UserCoreService)
  private userCoreService: UserCoreService;

  @Inject(SlackDAO)
  private slackDAO!: SlackDAO;

  @Inject(Logger)
  private logger: Logger;

  protected workerName = QUEUE_HARVEST_REALIZATION_CREATE_ODOO;

  protected async handle(
    data: HarvestRealizationCreateOdooJobData,
    attemptsMade: number,
    opts: JobsOptions,
    jobId?: string,
  ): Promise<void> {
    try {
      const harvestRealizationDetail = await this.harvestRealizationDAO.getOneStrict({
        where: {
          id: data.id,
        },
        relations: {
          farmingCycle: {
            farm: {
              city: true,
              district: true,
            },
            coop: {
              coopMembers: true,
            },
          },
          harvestDeal: {
            harvestRequest: {
              approver: true,
              creator: true,
            },
          },
        },
      });

      const erpCode = await this.createHarvestRealizationToOdoo(harvestRealizationDetail);

      await this.harvestRealizationDAO.updateOne(
        {
          id: harvestRealizationDetail.id,
        },
        {
          erpCode,
          status: RealizationStatusEnum.FINAL,
        },
        {
          id: harvestRealizationDetail.createdBy,
          role: '',
        },
      );

      const { coopMembers } = harvestRealizationDetail.farmingCycle.coop;
      const internalUserIds = coopMembers?.filter((cm) => cm.isInternal).map((u) => u.userId) || [];

      if (internalUserIds.length === 0) return;
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
          id: `harvest-realization-created-${harvestRealizationDetail.id}`,
          headline: `Realisasi ${erpCode} berhasil`,
          subHeadline: `Realisasi ${erpCode} berhasil`,
          body: `Realisasi pada Nomor DO ${erpCode} berhasil, mohon lakukan pengecekan kembali jika data sudah benar. Terima Kasih`,
          type: 'harvest-realization-created',
          target: targetPage.android.ppl.notificationPage,
          additionalParameters: {
            coopId: harvestRealizationDetail.farmingCycle.coopId,
            farmingCycleId: harvestRealizationDetail.farmingCycleId,
            coop: constructAdditionalNotificationCoop(harvestRealizationDetail.farmingCycle),
          },
        },
        notification: {
          subjectId: 'System',
          notificationType: 'harvest-realization-created',
          headline: `Realisasi ${erpCode} berhasil`,
          subHeadline: `Realisasi pada Nomor DO ${erpCode} berhasil, mohon lakukan pengecekan kembali jika data sudah benar. Terima Kasih`,
          referenceId: `harvest-realization-id: ${harvestRealizationDetail.id}`,
          icon: '',
          iconPath: '',
          target: targetPage.android.ppl.notificationPage,
          additionalParameters: {
            coopId: harvestRealizationDetail.farmingCycle.coopId,
            farmingCycleId: harvestRealizationDetail.farmingCycleId,
            coop: constructAdditionalNotificationCoop(harvestRealizationDetail.farmingCycle),
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

  private async createHarvestRealizationToOdoo(
    harvestRealization: HarvestRealization,
  ): Promise<string> {
    const payloadForOdoo: ErpHarvestRealizationCreate = {
      farmingCycleCode: harvestRealization.farmingCycle.farmingCycleCode,
      coopCode: harvestRealization.farmingCycle.coop.coopCode,
      datePlanned: harvestRealization.harvestDeal.datePlanned,
      rangeMin: harvestRealization.harvestDeal.minWeight,
      rangeMax: harvestRealization.harvestDeal.maxWeight,
      quantity: harvestRealization.quantity,
      tonnage: Number(harvestRealization.tonnage.toFixed(2)),
      deliveryOrder: harvestRealization.harvestDeal.erpCode,
      requester: `${harvestRealization.harvestDeal.harvestRequest.approver.fullName} - ${harvestRealization.harvestDeal.harvestRequest.approver.phoneNumber}`,
    };

    const erpCode = await this.erpDAO.createHarvestRealization(payloadForOdoo);

    return erpCode;
  }
}
