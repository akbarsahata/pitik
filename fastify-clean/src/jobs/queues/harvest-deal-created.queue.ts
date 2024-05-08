import { Service } from 'fastify-decorators';
import { HarvestDeal } from '../../datasources/entity/pgsql/HarvestDeal.entity';
import { QUEUE_HARVEST_DEAL_CREATED } from '../../libs/constants/queue';
import { BaseQueue } from './base.queue';

@Service()
export class HarvestDealCreatedQueue extends BaseQueue<HarvestDeal> {
  protected queueName = QUEUE_HARVEST_DEAL_CREATED;
}
