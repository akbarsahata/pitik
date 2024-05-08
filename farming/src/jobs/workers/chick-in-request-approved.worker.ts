import { JobsOptions } from 'bullmq';
import { Inject, Service } from 'fastify-decorators';
import { ChickInRequestDAO } from '../../dao/chickInRequest.dao';
import { CoopMemberDDAO } from '../../dao/coopMemberD.dao';
import { SlackDAO } from '../../dao/external/slack.dao';
import { FarmingCycleDAO } from '../../dao/farmingCycle.dao';
import { QUEUE_CHICKIN_REQUEST_APPROVED } from '../../libs/constants/queue';
import { targetPage } from '../../libs/constants/targetPage';
import { ChickInRequestApprovedJobData } from '../../libs/interfaces/job-data';
import { constructAdditionalNotificationCoop } from '../../libs/utils/helpers';
import { Logger } from '../../libs/utils/logger';
import { PushNotificationQueue } from '../queues/push-notification.queue';
import { BaseWorker } from './base.worker';

@Service()
export class ChickInRequestApprovedWorker extends BaseWorker<ChickInRequestApprovedJobData> {
  @Inject(ChickInRequestDAO)
  private cirDAO: ChickInRequestDAO;

  @Inject(CoopMemberDDAO)
  private coopMemberDDAO: CoopMemberDDAO;

  @Inject(FarmingCycleDAO)
  private farmingCycleDAO: FarmingCycleDAO;

  @Inject(SlackDAO)
  private slackDAO!: SlackDAO;

  @Inject(Logger)
  private logger: Logger;

  @Inject(PushNotificationQueue)
  private pushNotificationQueue: PushNotificationQueue;

  protected workerName = QUEUE_CHICKIN_REQUEST_APPROVED;

  protected async handle(
    data: ChickInRequestApprovedJobData,
    attemptsMade: number,
    opts: JobsOptions,
    jobId?: string,
  ) {
    try {
      const chickInReq = await this.cirDAO.getOne({
        where: {
          id: data.id,
        },
        select: {
          id: true,
          coopId: true,
          isApproved: true,
          farmingCycleId: true,
        },
        relations: {
          coop: true,
        },
      });

      if (!chickInReq) return;

      const [farmingCycle, [coopMembers, count]] = await Promise.all([
        this.farmingCycleDAO.getOneStrict({
          where: {
            id: chickInReq.farmingCycleId,
          },
          relations: {
            coop: true,
            farm: {
              city: true,
              district: true,
            },
          },
        }),
        this.coopMemberDDAO.getMany({
          where: {
            coopId: chickInReq.coopId,
            isInternal: true,
          },
        }),
      ]);

      if (count === 0) return;

      const notificationReceiverMap: { [key: string]: boolean } = {};

      coopMembers.forEach((coopMember) => {
        notificationReceiverMap[coopMember.userId] = true;
      });

      const userReceivers = Object.keys(notificationReceiverMap);

      let content;
      let notification;

      if (chickInReq.isApproved) {
        content = {
          headline: `Permintaan DOC-in di kandang ${chickInReq.coop.coopName} telah disetujui`,
          subHeadline: 'Terus pantau status DOC-in-nya ya',
          body: 'Permintaan DOC-in dari rekanmu telah disetujui',
          type: 'chick-in-request',
          target: targetPage.android.ppl.notificationPage,
          additionalParameters: {
            farmingCycleId: chickInReq.farmingCycleId,
            coopId: chickInReq.coopId,
            coop: constructAdditionalNotificationCoop(farmingCycle),
          },
        };
        notification = {
          subjectId: 'DOC-in',
          notificationType: 'chick-in-request',
          headline: 'Permintaan DOC-in dari rekanmu telah disetujui',
          subHeadline: 'Terus pantau status DOC-in-nya ya',
          referenceId: `chick-in-request-id: ${data.id}`,
          icon: '',
          iconPath: '',
          target: targetPage.android.ppl.notificationPage,
          additionalParameters: {
            farmingCycleId: chickInReq.farmingCycleId,
            coopId: chickInReq.coopId,
            coop: constructAdditionalNotificationCoop(farmingCycle),
          },
        };
      } else {
        content = {
          headline: `Request DOC-in di kandang ${chickInReq.coop.coopName} ditolak`,
          subHeadline: 'Terus pantau status DOC-in-nya ya',
          body: 'Permintaan DOC-in dari rekanmu ditolak',
          type: 'chick-in-request',
          target: targetPage.android.ppl.notificationPage,
          additionalParameters: {
            farmingCycleId: chickInReq.farmingCycleId,
            coopId: chickInReq.coopId,
            coop: constructAdditionalNotificationCoop(farmingCycle),
          },
        };
        notification = {
          subjectId: 'DOC-in',
          notificationType: 'chick-in-request',
          headline: 'Permintaan DOC-in dari rekanmu ditolak',
          subHeadline: 'Terus pantau status DOC-in-nya ya',
          referenceId: `chick-in-request-id: ${data.id}`,
          icon: '',
          iconPath: '',
          target: targetPage.android.ppl.notificationPage,
          additionalParameters: {
            farmingCycleId: chickInReq.farmingCycleId,
            coopId: chickInReq.coopId,
            coop: constructAdditionalNotificationCoop(farmingCycle),
          },
        };
      }

      await this.pushNotificationQueue.sendNotificationToApp('ppl', {
        userReceivers,
        content,
        notification,
        appTarget: 'ppl',
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
