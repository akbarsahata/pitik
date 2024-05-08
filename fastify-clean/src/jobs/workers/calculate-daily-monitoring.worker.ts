import { captureException } from '@sentry/node';
import { Inject, Service } from 'fastify-decorators';
import { QUEUE_CALCULATE_DAILY_MONITORING } from '../../libs/constants/queue';
import { BaseWorker } from './base.worker';
import { CalculateDailyMonitoringInterface } from '../queues/calculate-daily-monitoring.queue';
import { DailyMonitoringService } from '../../services/dailyMonitoring.service';
import { Logger } from '../../libs/utils/logger';
import { TaskTicketDAO } from '../../dao/taskTicket.dao';

@Service()
export class CalculateDailyMonitoringWorker extends BaseWorker<CalculateDailyMonitoringInterface> {
  @Inject(DailyMonitoringService)
  private dailyMonitoringService: DailyMonitoringService;

  @Inject(TaskTicketDAO)
  private taskTicketDAO: TaskTicketDAO;

  @Inject(Logger)
  private logger: Logger;

  protected workerName = QUEUE_CALCULATE_DAILY_MONITORING;

  protected async handle(data: CalculateDailyMonitoringInterface) {
    try {
      let { taskTicketId } = data;
      if (!taskTicketId && data.date) {
        const tt = await this.taskTicketDAO.getDailyReportTask({
          farmingCycleId: data.farmingCycleId,
          reportedDate: data.date,
        });

        taskTicketId = tt?.id;
      }

      if (!taskTicketId) return;

      await this.dailyMonitoringService.calculateDailyMonitoring(
        data.farmingCycleId,
        taskTicketId,
        data.user,
        data.updateStatusStrategy,
      );
    } catch (error) {
      this.logger.error(error);

      captureException(error);

      throw error;
    }
  }
}
