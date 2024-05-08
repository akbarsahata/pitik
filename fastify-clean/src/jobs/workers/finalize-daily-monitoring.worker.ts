import { captureException } from '@sentry/node';
import { Inject, Service } from 'fastify-decorators';
import { QUEUE_FINALIZE_DAILY_MONITORING } from '../../libs/constants/queue';
import { BaseWorker } from './base.worker';
import { FinalizeDailyMonitoringType } from '../queues/finalize-daily-monitoring.queue';
import { DailyMonitoringService } from '../../services/dailyMonitoring.service';
import { Logger } from '../../libs/utils/logger';

@Service()
export class FinalizeDailyMonitoringWorker extends BaseWorker<FinalizeDailyMonitoringType> {
  @Inject(DailyMonitoringService)
  private dailyMonitoringService: DailyMonitoringService;

  @Inject(Logger)
  private logger: Logger;

  protected workerName = QUEUE_FINALIZE_DAILY_MONITORING;

  protected async handle(data: FinalizeDailyMonitoringType) {
    try {
      await this.dailyMonitoringService.finalizeDailyMonitoringStatus(
        data.farmingCycleId,
        data.taskTicketId,
      );
    } catch (error) {
      this.logger.error(error);

      captureException(error);

      throw error;
    }
  }
}
