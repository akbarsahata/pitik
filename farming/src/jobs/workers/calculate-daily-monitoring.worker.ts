import { JobsOptions } from 'bullmq';
import { Inject, Service } from 'fastify-decorators';
import { SlackDAO } from '../../dao/external/slack.dao';
import { TaskTicketDAO } from '../../dao/taskTicket.dao';
import { QUEUE_CALCULATE_DAILY_MONITORING } from '../../libs/constants/queue';
import { CalculateDailyMonitoringJobData } from '../../libs/interfaces/job-data';
import { Logger } from '../../libs/utils/logger';
import { DailyMonitoringService } from '../../services/dailyMonitoring.service';
import { BaseWorker } from './base.worker';

@Service()
export class CalculateDailyMonitoringWorker extends BaseWorker<CalculateDailyMonitoringJobData> {
  @Inject(DailyMonitoringService)
  private dailyMonitoringService: DailyMonitoringService;

  @Inject(TaskTicketDAO)
  private taskTicketDAO: TaskTicketDAO;

  @Inject(SlackDAO)
  private slackDAO!: SlackDAO;

  @Inject(Logger)
  private logger: Logger;

  protected workerName = QUEUE_CALCULATE_DAILY_MONITORING;

  protected async handle(
    data: CalculateDailyMonitoringJobData,
    attemptsMade: number,
    opts: JobsOptions,
    jobId?: string,
  ) {
    try {
      let { taskTicketId } = data;
      if (!taskTicketId && data.date) {
        const tt = await this.taskTicketDAO.getDailyReportTask({
          farmingCycleId: data.farmingCycleId,
          reportedDate: data.date,
        });

        taskTicketId = tt?.id;
      }

      await this.dailyMonitoringService.calculateDailyMonitoring(
        data.farmingCycleId,
        data.date,
        taskTicketId || null,
        data.user,
        data.updateStatusStrategy,
      );
    } catch (error) {
      this.logger.error(error);

      if (attemptsMade === opts.attempts) {
        await this.slackDAO.alertFailedJobs(this.workerName, error, data, jobId);
      }

      throw error;
    }
  }
}
