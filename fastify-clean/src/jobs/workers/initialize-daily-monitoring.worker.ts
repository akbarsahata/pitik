import { captureException } from '@sentry/node';
import { Inject, Service } from 'fastify-decorators';
import { QUEUE_INITIALIZE_DAILY_MONITORING } from '../../libs/constants/queue';
import { Logger } from '../../libs/utils/logger';
import { DailyMonitoringService } from '../../services/dailyMonitoring.service';
import { InitDailyMonitoringInterface } from '../queues/initialize-daily-monitoring.queue';
import { BaseWorker } from './base.worker';

@Service()
export class InitializeDailyMonitoringWorker extends BaseWorker<InitDailyMonitoringInterface> {
  @Inject(DailyMonitoringService)
  private dailyMonitoringService: DailyMonitoringService;

  @Inject(Logger)
  private logger: Logger;

  protected workerName = QUEUE_INITIALIZE_DAILY_MONITORING;

  protected async handle(data: InitDailyMonitoringInterface) {
    try {
      await this.dailyMonitoringService.initializeEmptyDailyMonitoring(data);
    } catch (error) {
      this.logger.error(error);

      captureException(error);

      throw error;
    }
  }
}
