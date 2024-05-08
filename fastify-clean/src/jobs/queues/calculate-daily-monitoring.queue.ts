import { Service } from 'fastify-decorators';
import { RequestUser } from '../../libs/types/index.d';
import { QUEUE_CALCULATE_DAILY_MONITORING } from '../../libs/constants/queue';
import { BaseQueue } from './base.queue';

export interface CalculateDailyMonitoringInterface {
  user?: RequestUser;
  taskTicketId?: string;
  farmingCycleId: string;
  updateStatusStrategy?: 'single' | 'multiple';
  date?: string;
}

@Service()
export class CalculateDailyMonitoringQueue extends BaseQueue<CalculateDailyMonitoringInterface> {
  protected queueName = QUEUE_CALCULATE_DAILY_MONITORING;
}
