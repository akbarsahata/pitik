import { Service } from 'fastify-decorators';
import { QUEUE_REPOPULATION_CREATED } from '../../libs/constants/queue';
import { RepopulationCreatedJobData } from '../../libs/interfaces/job-data';
import { BaseQueue } from './base.queue';

@Service()
export class RepopulationCreatedQueue extends BaseQueue<RepopulationCreatedJobData> {
  protected queueName = QUEUE_REPOPULATION_CREATED;
}
