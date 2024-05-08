import { JobsOptions } from 'bullmq';
import { Inject, Service } from 'fastify-decorators';
import { SlackDAO } from '../../dao/external/slack.dao';
import { QUEUE_FINALIZE_DAILY_MONITORING } from '../../libs/constants/queue';
import { Logger } from '../../libs/utils/logger';
import { DailyMonitoringService } from '../../services/dailyMonitoring.service';
import { FinalizeDailyMonitoringType } from '../queues/finalize-daily-monitoring.queue';
import { BaseWorker } from './base.worker';

@Service()
export class FinalizeDailyMonitoringWorker extends BaseWorker<FinalizeDailyMonitoringType> {
  @Inject(DailyMonitoringService)
  private dailyMonitoringService: DailyMonitoringService;

  @Inject(SlackDAO)
  private slackDAO!: SlackDAO;

  @Inject(Logger)
  private logger: Logger;

  protected workerName = QUEUE_FINALIZE_DAILY_MONITORING;

  protected async handle(
    data: FinalizeDailyMonitoringType,
    attemptsMade: number,
    opts: JobsOptions,
    jobId?: string,
  ) {
    try {
      await this.dailyMonitoringService.finalizeDailyMonitoringStatus(
        data.farmingCycleId,
        data.date,
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
