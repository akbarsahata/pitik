import { Service } from 'fastify-decorators';
import { Farm } from '../../datasources/entity/pgsql/Farm.entity';
import { QUEUE_FARM_UPDATED } from '../../libs/constants/queue';
import { BaseQueue } from './base.queue';

@Service()
export class FarmUpdatedQueue extends BaseQueue<Farm> {
  protected queueName = QUEUE_FARM_UPDATED;
}
