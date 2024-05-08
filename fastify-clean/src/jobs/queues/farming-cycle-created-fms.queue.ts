import { Service } from 'fastify-decorators';
import { FarmingCycle } from '../../datasources/entity/pgsql/FarmingCycle.entity';
import { QUEUE_FARMING_CYCLE_CREATED_FMS } from '../../libs/constants/queue';
import { BaseQueue } from './base.queue';

@Service()
export class FarmingCycleCreatedFmsQueue extends BaseQueue<FarmingCycle> {
  protected queueName = QUEUE_FARMING_CYCLE_CREATED_FMS;
}
