import { JobsOptions } from 'bullmq';
import { format } from 'date-fns';
import { Inject, Service } from 'fastify-decorators';
import { CoopMemberDDAO } from '../../dao/coopMemberD.dao';
import { DailyMonitoringRevisionDAO } from '../../dao/dailyMonitoringRevision.dao';
import { SlackDAO } from '../../dao/external/slack.dao';
import { ERR_FARM_CYCLE_NOT_FOUND } from '../../libs/constants/errors';
import { QUEUE_DAILY_REPORT_REVISION_REQUESTED } from '../../libs/constants/queue';
import { targetPage } from '../../libs/constants/targetPage';
import { DailyReportRevisionRequestedQueueJobData } from '../../libs/interfaces/job-data';
import { Logger } from '../../libs/utils/logger';
import { PushNotificationQueue } from '../queues/push-notification.queue';
import { BaseWorker } from './base.worker';

@Service()
export class DailyReportRevisionRequestedWorker extends BaseWorker<DailyReportRevisionRequestedQueueJobData> {
  @Inject(DailyMonitoringRevisionDAO)
  private dailyMonitoringRevisionDAO!: DailyMonitoringRevisionDAO;

  @Inject(SlackDAO)
  private slackDAO!: SlackDAO;

  @Inject(Logger)
  private logger: Logger;

  @Inject(PushNotificationQueue)
  private pushNotificationQueue: PushNotificationQueue;

  @Inject(CoopMemberDDAO)
  private coopMemberDDAO: CoopMemberDDAO;

  protected workerName = QUEUE_DAILY_REPORT_REVISION_REQUESTED;

  protected async handle(
    data: DailyReportRevisionRequestedQueueJobData,
    attemptsMade: number,
    opts: JobsOptions,
    jobId?: string,
  ) {
    try {
      const { dailyMonitoringRevisionId } = data;
      const { dailyMonitoring, userRequestor } = await this.dailyMonitoringRevisionDAO.getOneStrict(
        {
          where: {
            id: dailyMonitoringRevisionId,
          },
          relations: {
            dailyMonitoring: {
              farmingCycle: {
                coop: true,
              },
            },
            userRequestor: true,
          },
          select: {
            dailyMonitoring: {
              date: true,
              day: true,
              farmingCycle: {
                id: true,
                coop: {
                  id: true,
                  coopName: true,
                },
              },
            },
            userRequestor: {
              fullName: true,
            },
          },
        },
      );
      if (userRequestor === null) {
        this.logger.warn(
          `User requestor is null for dailyMonitoringRevisionId: ${dailyMonitoringRevisionId}`,
        );
        return;
      }

      const { farmingCycle } = dailyMonitoring;
      if (farmingCycle === null) {
        throw ERR_FARM_CYCLE_NOT_FOUND();
      }

      const [coopMembers] = await this.coopMemberDDAO.getMany({
        where: {
          coopId: farmingCycle.coopId,
          isInternal: true,
        },
      });
      const userReceivers = [...new Set(coopMembers.map((coopMember) => coopMember.userId))];

      const formattedDate = format(new Date(dailyMonitoring.date), 'd MMM yyyy');

      const content = {
        headline: `Permintaan Revisi Laporan Harian`,
        subHeadline: `Permintaan revisi laporan harian tanggal ${formattedDate}`,
        body: `${userRequestor?.fullName} melakukan Revisi pada Kandang ${farmingCycle.coop.coopName} pada Hari ke ${dailyMonitoring.day} tanggal ${formattedDate}. Mohon dibantu pastikan bahwa data sudah benar dan lengkap.`,
        type: 'daily-monitoring-revision',
        target: targetPage.android.ppl.notificationPage,
        additionalParameters: {
          farmingCycleId: farmingCycle.id,
          dailyMonitoringDate: dailyMonitoring.date,
          coopId: farmingCycle.coop.id,
        },
      };
      const notification = {
        subjectId: 'DailyMonitoringRevision',
        notificationType: 'daily-monitoring-revision',
        headline: `Permintaan Revisi Laporan Harian`,
        subHeadline: `Permintaan revisi laporan harian tanggal ${formattedDate}`,
        referenceId: `daily-monitoring-revision-id: ${dailyMonitoringRevisionId}`,
        icon: '',
        iconPath: '',
        target: targetPage.android.ppl.notificationPage,
        additionalParameters: {
          farmingCycleId: farmingCycle.id,
          dailyMonitoringDate: dailyMonitoring.date,
          coopId: farmingCycle.coop.id,
        },
      };

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
