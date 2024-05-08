import { Service } from 'fastify-decorators';
import { Repopulation } from '../../datasources/entity/pgsql/Repopulation.entity';
import { QUEUE_REPOPULATION_CREATED } from '../../libs/constants/queue';
import { BaseQueue } from './base.queue';

@Service()
export class RepopulationCreatedQueue extends BaseQueue<Repopulation> {
  protected queueName = QUEUE_REPOPULATION_CREATED;
}
