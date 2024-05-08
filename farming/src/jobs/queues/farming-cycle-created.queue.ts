import { Service } from 'fastify-decorators';
import { ChickInRequest } from '../../datasources/entity/pgsql/ChickInRequest.entity';
import { QUEUE_FARMING_CYCLE_CREATED } from '../../libs/constants/queue';
import { BaseQueue } from './base.queue';

@Service()
export class FarmingCycleCreatedQueue extends BaseQueue<ChickInRequest> {
  protected queueName = QUEUE_FARMING_CYCLE_CREATED;
}
