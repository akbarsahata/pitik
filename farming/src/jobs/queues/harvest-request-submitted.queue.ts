import { Service } from 'fastify-decorators';
import { QUEUE_HARVEST_REQUEST_SUBMITTED } from '../../libs/constants/queue';
import { HarvestRequest } from '../../datasources/entity/pgsql/HarvestRequest.entity';
import { BaseQueue } from './base.queue';

@Service()
export class HarvestRequestSubmittedQueue extends BaseQueue<HarvestRequest> {
  protected queueName = QUEUE_HARVEST_REQUEST_SUBMITTED;
}
