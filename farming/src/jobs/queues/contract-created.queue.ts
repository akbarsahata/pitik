import { Service } from 'fastify-decorators';
import { FarmingCycle } from '../../datasources/entity/pgsql/FarmingCycle.entity';
import { QUEUE_CONTRACT_CREATED } from '../../libs/constants/queue';
import { BaseQueue } from './base.queue';

@Service()
export class ContractCreatedQueue extends BaseQueue<FarmingCycle> {
  protected queueName = QUEUE_CONTRACT_CREATED;
}
