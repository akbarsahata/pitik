import { JobsOptions } from 'bullmq';
import { Inject, Service } from 'fastify-decorators';
import { ChickInRequestDAO } from '../../dao/chickInRequest.dao';
import { CoopMemberDDAO } from '../../dao/coopMemberD.dao';
import { SlackDAO } from '../../dao/external/slack.dao';
import { FarmingCycleDAO } from '../../dao/farmingCycle.dao';
import { ChickInRequest } from '../../datasources/entity/pgsql/ChickInRequest.entity';
import { QUEUE_CHICKIN_REQUEST_UPDATED } from '../../libs/constants/queue';
import { targetPage } from '../../libs/constants/targetPage';
import { constructAdditionalNotificationCoop } from '../../libs/utils/helpers';
import { Logger } from '../../libs/utils/logger';
import { PushNotificationQueue } from '../queues/push-notification.queue';
import { BaseWorker } from './base.worker';

@Service()
export class ChickInRequestUpdatedWorker extends BaseWorker<ChickInRequest> {
  @Inject(ChickInRequestDAO)
  private cirDAO: ChickInRequestDAO;

  @Inject(CoopMemberDDAO)
  private coopMemberDDAO: CoopMemberDDAO;

  @Inject(FarmingCycleDAO)
  private farmingCycleDAO: FarmingCycleDAO;

  @Inject(SlackDAO)
  private slackDAO!: SlackDAO;

  @Inject(PushNotificationQueue)
  private pushNotificationQueue: PushNotificationQueue;

  @Inject(Logger)
  private logger: Logger;

  protected workerName = QUEUE_CHICKIN_REQUEST_UPDATED;

  protected async handle(
    data: ChickInRequest,
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
          farmingCycleId: true,
          coop: {
            coopName: true,
          },
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

      await this.pushNotificationQueue.sendNotificationToApp('ppl', {
        appTarget: 'ppl',
        userReceivers,
        content: {
          headline: `Perubahan permintaan DOC-in di kandang ${chickInReq.coop.coopName}`,
          subHeadline: 'Terus pantau status DOC-in-nya ya',
          body: 'Ada perubahan permintaan dari rekanmu coba cek ya',
          type: 'chick-in-request',
          target: targetPage.android.ppl.notificationPage,
          additionalParameters: {
            farmingCycleId: chickInReq.farmingCycleId,
            coopId: chickInReq.coopId,
            coop: constructAdditionalNotificationCoop(farmingCycle),
          },
        },
        notification: {
          subjectId: 'DOC-in',
          notificationType: 'chick-in-request',
          headline: 'Hey ada perubahan permintaan DOC-in dari rekanmu',
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
