import { Service } from 'fastify-decorators';
import { QUEUE_CALCULATE_DAILY_MONITORING } from '../../libs/constants/queue';
import { CalculateDailyMonitoringJobData } from '../../libs/interfaces/job-data';
import { BaseQueue } from './base.queue';

@Service()
export class CalculateDailyMonitoringQueue extends BaseQueue<CalculateDailyMonitoringJobData> {
  protected queueName = QUEUE_CALCULATE_DAILY_MONITORING;
}
