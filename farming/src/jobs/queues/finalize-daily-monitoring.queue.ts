import { Service } from 'fastify-decorators';
import { QUEUE_FINALIZE_DAILY_MONITORING } from '../../libs/constants/queue';
import { BaseQueue } from './base.queue';

export type FinalizeDailyMonitoringType = {
  date: string;
  farmingCycleId: string;
};

@Service()
export class FinalizeDailyMonitoringQueue extends BaseQueue<FinalizeDailyMonitoringType> {
  protected queueName = QUEUE_FINALIZE_DAILY_MONITORING;
}
