import { Service } from 'fastify-decorators';
import { QUEUE_FARMING_CYCLE_CLOSED } from '../../libs/constants/queue';
import { BaseQueue } from './base.queue';

@Service()
export class FarmingCycleClosedQueue extends BaseQueue<string> {
  protected queueName = QUEUE_FARMING_CYCLE_CLOSED;
}
