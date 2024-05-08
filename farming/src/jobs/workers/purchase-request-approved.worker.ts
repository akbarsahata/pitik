import { JobsOptions } from 'bullmq';
import { Inject, Service } from 'fastify-decorators';
import { IsNull } from 'typeorm';
import { CoopDAO } from '../../dao/coop.dao';
import { CoopMemberDDAO } from '../../dao/coopMemberD.dao';
import { ErpDAO } from '../../dao/erp.dao';
import { SlackDAO } from '../../dao/external/slack.dao';
import { FarmingCycleDAO } from '../../dao/farmingCycle.dao';
import { PurchaseRequestDAO } from '../../dao/purchaseRequest.dao';
import { USER_TYPE } from '../../libs/constants';
import { QUEUE_PURCHASE_REQUEST_APPROVED } from '../../libs/constants/queue';
import { targetPage } from '../../libs/constants/targetPage';
import { PurchaseRequestApprovedJobData } from '../../libs/interfaces/job-data';
import { CoopCacheUtil } from '../../libs/utils/coopCache';
import { constructAdditionalNotificationCoop } from '../../libs/utils/helpers';
import { Logger } from '../../libs/utils/logger';
import { UserService as UserCoreService } from '../../services/usermanagement/userCore.service';
import { PushNotificationQueue } from '../queues/push-notification.queue';
import { BaseWorker } from './base.worker';

@Service()
export class PurchaseRequestApprovedWorker extends BaseWorker<PurchaseRequestApprovedJobData> {
  @Inject(PurchaseRequestDAO)
  private prDAO!: PurchaseRequestDAO;

  @Inject(ErpDAO)
  private erpDAO!: ErpDAO;

  @Inject(CoopDAO)
  private coopDAO!: CoopDAO;

  @Inject(FarmingCycleDAO)
  private farmingCycleDAO: FarmingCycleDAO;

  @Inject(Logger)
  private logger: Logger;

  @Inject(CoopMemberDDAO)
  private coopMemberDDAO!: CoopMemberDDAO;

  @Inject(UserCoreService)
  private userCoreService: UserCoreService;

  @Inject(SlackDAO)
  private slackDAO!: SlackDAO;

  @Inject(PushNotificationQueue)
  private pushNotificationQueue!: PushNotificationQueue;

  @Inject(CoopCacheUtil)
  private coopCacheUtil!: CoopCacheUtil;

  protected workerName = QUEUE_PURCHASE_REQUEST_APPROVED;

  protected async handle(
    data: PurchaseRequestApprovedJobData,
    attemptsMade: number,
    opts: JobsOptions,
    jobId?: string,
  ) {
    const queryRunner = await this.prDAO.startTransaction();

    try {
      const purchaseReq = await this.prDAO.getOneWithTx(
        {
          where: {
            id: data.id,
            erpCode: IsNull(),
          },
          select: {
            id: true,
            requestSchedule: true,
            farmingCycleId: true,
            notes: true,
            farmingCycle: {
              farmingCycleCode: true,
              coopId: true,
            },
            chickInRequest: {
              approvedDate: true,
            },
            userApprover: {
              fullName: true,
              phoneNumber: true,
              userType: true,
              id: true,
            },
            userCreator: {
              fullName: true,
              phoneNumber: true,
            },
            products: true,
            modifiedBy: true,
          },
          relations: {
            farmingCycle: true,
            userApprover: true,
            userCreator: true,
            products: true,
            logisticInfo: true,
          },
        },
        queryRunner,
      );

      if (!purchaseReq || !purchaseReq?.products.length) return;

      const erpCode = await this.erpDAO.createPurchaseRequest(purchaseReq);

      await this.prDAO.updateOneWithTx(
        {
          id: purchaseReq.id,
        },
        {
          erpCode,
        },
        {
          id: purchaseReq.userApprover.id,
          role: purchaseReq.userApprover.userType,
        },
        queryRunner,
      );

      await this.prDAO.commitTransaction(queryRunner);

      // skips notification for DOC to prevent double notification
      if (purchaseReq.type === 'doc') return;

      const [[coopMembers, count], coop, farmingCycle] = await Promise.all([
        await this.coopMemberDDAO.getMany({
          where: {
            coopId: purchaseReq.farmingCycle.coopId,
            isInternal: true,
          },
        }),
        await this.coopDAO.getOneStrict({
          where: {
            id: purchaseReq.farmingCycle.coopId,
          },
        }),
        await this.farmingCycleDAO.getOneStrict({
          where: {
            id: purchaseReq.farmingCycleId,
          },
          relations: {
            farm: {
              city: true,
              district: true,
            },
            coop: true,
          },
        }),
      ]);

      await this.coopCacheUtil.invalidateCoopCache(purchaseReq.farmingCycle.coopId, 'both');

      if (count === 0) return;

      const internalUserIds = coopMembers.filter((cm) => cm.isInternal).map((u) => u.userId);

      const [internalUsers] = await this.userCoreService.search({ cmsIds: internalUserIds });

      const userReceivers = internalUsers.reduce((prev, user) => {
        if (user.cmsId && user.roles?.find((role) => role.name === USER_TYPE.PPL)) {
          prev.push(user.cmsId);
        }
        return prev;
      }, [] as string[]);

      await this.pushNotificationQueue.sendNotificationToApp('ppl', {
        appTarget: 'ppl',
        userReceivers,
        content: {
          headline: 'Pengajuan Disetujui',
          subHeadline: 'Pengajuan Disetujui',
          body: `Pengajuan ${purchaseReq.products[0]?.categoryCode || 'baru'} anda pada ${
            coop.coopName
          } telah disetujui dengan nomor ${erpCode}`,
          type: 'purchase-request',
          target: targetPage.android.ppl.notificationPage,
          additionalParameters: {
            farmingCycleId: farmingCycle.id,
            coopId: farmingCycle.coopId,
            coop: constructAdditionalNotificationCoop(farmingCycle),
          },
        },
        notification: {
          subjectId: 'purchase-request',
          notificationType: 'purchase-request',
          headline: 'Pengajuan Disetujui',
          subHeadline: `Pengajuan ${purchaseReq.products[0]?.categoryCode || 'baru'} anda pada ${
            coop.coopName
          } telah disetujui dengan nomor ${erpCode}`,
          referenceId: `purchase-request-id: ${data.id}`,
          icon: '',
          iconPath: '',
          target: targetPage.android.ppl.notificationPage,
          additionalParameters: {
            farmingCycleId: farmingCycle.id,
            coopId: farmingCycle.coopId,
            coop: constructAdditionalNotificationCoop(farmingCycle),
          },
        },
      });
    } catch (error) {
      await this.prDAO.rollbackTransaction(queryRunner);

      this.logger.error(error);

      if (attemptsMade === opts.attempts) {
        await this.slackDAO.alertFailedJobs(this.workerName, error, data, jobId);
      }

      throw error;
    }
  }
}
