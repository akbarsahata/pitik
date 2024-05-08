import { Service } from 'fastify-decorators';
import { QUEUE_HARVEST_REQUEST_APPROVED } from '../../libs/constants/queue';
import { HarvestRequest } from '../../datasources/entity/pgsql/HarvestRequest.entity';
import { BaseQueue } from './base.queue';

@Service()
export class HarvestRequestApprovedQueue extends BaseQueue<HarvestRequest> {
  protected queueName = QUEUE_HARVEST_REQUEST_APPROVED;
}
