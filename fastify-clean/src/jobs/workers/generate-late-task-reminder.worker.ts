import { captureException } from '@sentry/node';
import { Inject, Service } from 'fastify-decorators';
import { FarmingCycleMemberDDAO } from '../../dao/farmingCycleMemberD.dao';
import { TaskTicketDAO } from '../../dao/taskTicket.dao';
import { LateTaskTicketTicketJob } from '../../dto/farmingCycle.dto';
import { QUEUE_GENERATE_LATE_TASK_REMINDER } from '../../libs/constants/queue';
import { Logger } from '../../libs/utils/logger';
import { PushNotificationQueue } from '../queues/push-notification.queue';
import { BaseWorker } from './base.worker';

@Service()
export class GenerateLateTaskReminderWorker extends BaseWorker<LateTaskTicketTicketJob> {
  @Inject(Logger)
  private logger: Logger;

  @Inject(TaskTicketDAO)
  private taskTicketDAO: TaskTicketDAO;

  @Inject(FarmingCycleMemberDDAO)
  private fcMemberDDAO: FarmingCycleMemberDDAO;

  @Inject(PushNotificationQueue)
  private pushNotificationQueue: PushNotificationQueue;

  protected workerName = QUEUE_GENERATE_LATE_TASK_REMINDER;

  protected async handle(data: LateTaskTicketTicketJob) {
    try {
      const lateTaskCount = await this.taskTicketDAO.countSummaryLate(data.farmingCycleId);

      if (lateTaskCount < 1) return;

      const [fcWorkers] = await this.fcMemberDDAO.getMany({
        where: {
          farmingCycleId: data.farmingCycleId,
          isInternal: false,
        },
        select: {
          userId: true,
        },
      });

      this.pushNotificationQueue.addJob({
        userReceivers: [data.farmOwnerId, ...fcWorkers.map((fcm) => fcm.userId)],
        content: {
          id: data.coopId,
          headline: data.coopName,
          subHeadline: data.coopName,
          body: `${lateTaskCount} tugas belum dikerjakan. Harap segera diselesaikan.`,
          type: 'late-task-ticket',
          additionalParameters: {
            coopId: data.coopId,
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
          additionalParameters: {
            coopId: data.coopId,
          },
        },
      });
    } catch (error) {
      captureException(error);

      this.logger.error(error);

      throw error;
    }
  }
}
