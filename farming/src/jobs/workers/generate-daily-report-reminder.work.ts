import { JobsOptions } from 'bullmq';
import { Inject, Service } from 'fastify-decorators';
import { SlackDAO } from '../../dao/external/slack.dao';
import { TaskTicketDAO } from '../../dao/taskTicket.dao';
import { USER_TYPE } from '../../libs/constants';
import { QUEUE_GENERATE_DAILY_REPORT_REMINDER } from '../../libs/constants/queue';
import { targetPage } from '../../libs/constants/targetPage';
import { constructAdditionalNotificationCoop } from '../../libs/utils/helpers';
import { Logger } from '../../libs/utils/logger';
import { UserService as UserCoreService } from '../../services/usermanagement/userCore.service';
import { GenerateDailyReportReminderJob } from '../queues/generate-daily-report-reminder.queue';
import { PushNotificationQueue } from '../queues/push-notification.queue';
import { BaseWorker } from './base.worker';

@Service()
export class GenerateDailyReportReminderWorker extends BaseWorker<GenerateDailyReportReminderJob> {
  @Inject(Logger)
  private logger: Logger;

  @Inject(TaskTicketDAO)
  private taskTicketDAO: TaskTicketDAO;

  @Inject(SlackDAO)
  private slackDAO!: SlackDAO;

  @Inject(PushNotificationQueue)
  private pushNotificationQueue: PushNotificationQueue;

  @Inject(UserCoreService)
  private userCoreService: UserCoreService;

  protected workerName = QUEUE_GENERATE_DAILY_REPORT_REMINDER;

  protected async handle(
    data: GenerateDailyReportReminderJob,
    attemptsMade: number,
    opts: JobsOptions,
    jobId?: string,
  ) {
    try {
      const taskTicket = await this.taskTicketDAO.getOneStrict({
        where: {
          id: data.taskTicketId,
        },
        relations: {
          farmingCycle: {
            coop: {
              coopMembers: true,
            },
            farm: true,
          },
        },
      });

      const formattedDate = new Date(taskTicket.reportedDate).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
      });

      const targetUserIds =
        taskTicket.farmingCycle.coop.coopMembers
          ?.filter((cm) => !cm.isInternal)
          .map((u) => u.userId) || [];

      // get role of internal user
      const internalUserIds =
        taskTicket.farmingCycle.coop.coopMembers
          ?.filter((cm) => cm.isInternal)
          .map((u) => u.userId) || [];

      const [internalUsers] = await this.userCoreService.search({ cmsIds: internalUserIds });

      internalUsers.forEach((user) => {
        if (user.roles?.find((role) => role.name === USER_TYPE.PPL) && user.cmsId) {
          targetUserIds.push(user.cmsId);
        }
      });

      await this.pushNotificationQueue.sendNotificationToApp('ppl', {
        appTarget: 'ppl',
        userReceivers: [taskTicket.farmingCycle.farm.userOwnerId, ...targetUserIds],
        content: {
          id: `daily-report-reminder-${taskTicket.id}`,
          headline: `Pengingat laporan harian ${taskTicket.farmingCycle.coop.coopName}`,
          subHeadline: `Pengingat laporan harian ${taskTicket.farmingCycle.coop.coopName}`,
          body: `Besok Laporan Harian tanggal ${formattedDate} akan ditutup, Jangan lupa diisi ya!`,
          type: 'late-task-ticket',
          target: targetPage.android.ppl.notificationPage,
          additionalParameters: {
            coopId: taskTicket.farmingCycle.coopId,
            farmingCycleId: taskTicket.farmingCycleId,
            coop: constructAdditionalNotificationCoop(taskTicket.farmingCycle),
          },
        },
        notification: {
          subjectId: 'System',
          notificationType: 'daily-report-reminder',
          headline: `Pengingat laporan harian ${taskTicket.farmingCycle.coop.coopName}`,
          subHeadline: `Besok Laporan Harian tanggal ${formattedDate} akan ditutup, Jangan lupa diisi ya!`,
          referenceId: `coop-id: ${taskTicket.farmingCycle.coopId}`,
          icon: '',
          iconPath: '',
          target: targetPage.android.ppl.notificationPage,
          additionalParameters: {
            coopId: taskTicket.farmingCycle.coopId,
            farmingCycleId: taskTicket.farmingCycleId,
            coop: constructAdditionalNotificationCoop(taskTicket.farmingCycle),
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
