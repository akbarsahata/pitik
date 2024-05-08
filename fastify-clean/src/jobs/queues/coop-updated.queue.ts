import { Service } from 'fastify-decorators';
import { Coop } from '../../datasources/entity/pgsql/Coop.entity';
import { QUEUE_COOP_UPDATED } from '../../libs/constants/queue';
import { BaseQueue } from './base.queue';

@Service()
export class CoopUpdateQueue extends BaseQueue<Coop> {
  protected queueName = QUEUE_COOP_UPDATED;
}
