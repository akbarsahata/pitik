import { JobsOptions } from 'bullmq';
import { Inject, Service } from 'fastify-decorators';
import { SlackDAO } from '../../dao/external/slack.dao';
import { FarmingCycleDAO } from '../../dao/farmingCycle.dao';
import { FarmingCycleMemberDDAO } from '../../dao/farmingCycleMemberD.dao';
import { TaskTicketDAO } from '../../dao/taskTicket.dao';
import { LateTaskTicketTicketJob } from '../../dto/farmingCycle.dto';
import { QUEUE_GENERATE_LATE_TASK_REMINDER } from '../../libs/constants/queue';
import { targetPage } from '../../libs/constants/targetPage';
import { constructAdditionalNotificationCoop } from '../../libs/utils/helpers';
import { Logger } from '../../libs/utils/logger';
import { PushNotificationQueue } from '../queues/push-notification.queue';
import { BaseWorker } from './base.worker';

@Service()
export class GenerateLateTaskReminderWorker extends BaseWorker<LateTaskTicketTicketJob> {
  @Inject(Logger)
  private logger: Logger;

  @Inject(TaskTicketDAO)
  private taskTicketDAO: TaskTicketDAO;

  @Inject(FarmingCycleDAO)
  private farmingCycleDAO: FarmingCycleDAO;

  @Inject(FarmingCycleMemberDDAO)
  private fcMemberDDAO: FarmingCycleMemberDDAO;

  @Inject(SlackDAO)
  private slackDAO!: SlackDAO;

  @Inject(PushNotificationQueue)
  private pushNotificationQueue: PushNotificationQueue;

  protected workerName = QUEUE_GENERATE_LATE_TASK_REMINDER;

  protected async handle(
    data: LateTaskTicketTicketJob,
    attemptsMade: number,
    opts: JobsOptions,
    jobId?: string,
  ) {
    try {
      const lateTaskCount = await this.taskTicketDAO.countSummaryLate(data.farmingCycleId);

      if (lateTaskCount < 1) return;

      const [farmingCycle, [fcWorkers]] = await Promise.all([
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
        await this.fcMemberDDAO.getMany({
          where: {
            farmingCycleId: data.farmingCycleId,
            isInternal: false,
          },
          select: {
            userId: true,
          },
        }),
      ]);

      await this.pushNotificationQueue.sendNotificationToApp('ppl', {
        appTarget: 'ppl',
        userReceivers: [data.farmOwnerId, ...fcWorkers.map((fcm) => fcm.userId)],
        content: {
          id: data.coopId,
          headline: data.coopName,
          subHeadline: data.coopName,
          body: `${lateTaskCount} tugas belum dikerjakan. Harap segera diselesaikan.`,
          type: 'late-task-ticket',
          target: targetPage.android.ppl.notificationPage,
          additionalParameters: {
            coopId: data.coopId,
            farmingCycleId: data.farmingCycleId,
            coop: constructAdditionalNotificationCoop(farmingCycle),
          },
        },
        notification: {
          subjectId: 'System',
          notificationType: 'late-task-ticket',
          headline: data.coopName,
          subHeadline: `${lateTaskCount} tugas belum dikerjakan. Harap segera diselesaikan.`,
          referenceId: `coop-id: ${data.coopId}`,
          icon: '',
          iconPath: '',
          target: targetPage.android.ppl.notificationPage,
          additionalParameters: {
            coopId: data.coopId,
            farmingCycleId: data.farmingCycleId,
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
