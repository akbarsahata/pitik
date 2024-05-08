import { Service } from 'fastify-decorators';
import { QUEUE_INITIALIZE_DAILY_MONITORING } from '../../libs/constants/queue';
import { BaseQueue } from './base.queue';

export interface InitDailyMonitoringInterface {
  farmingCycleId?: string;
}

@Service()
export class InitializeDailyMonitoringQueue extends BaseQueue<InitDailyMonitoringInterface> {
  protected queueName = QUEUE_INITIALIZE_DAILY_MONITORING;
}
