import { Service } from 'fastify-decorators';
import { QUEUE_HARVEST_REALIZATION_SUBMITTED } from '../../libs/constants/queue';
import { HarvestRealization } from '../../datasources/entity/pgsql/HarvestRealization.entity';
import { BaseQueue } from './base.queue';

@Service()
export class HarvestRealizationSubmittedQueue extends BaseQueue<HarvestRealization> {
  protected queueName = QUEUE_HARVEST_REALIZATION_SUBMITTED;
}
