import { Service } from 'fastify-decorators';
import { QUEUE_FARMING_CYCLE_CLOSED } from '../../libs/constants/queue';
import { FarmingCycleClosedJobData } from '../../libs/interfaces/job-data';
import { BaseQueue } from './base.queue';

@Service()
export class FarmingCycleClosedQueue extends BaseQueue<FarmingCycleClosedJobData> {
  protected queueName = QUEUE_FARMING_CYCLE_CLOSED;
}
