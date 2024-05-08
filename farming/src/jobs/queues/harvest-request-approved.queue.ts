import { Service } from 'fastify-decorators';
import { QUEUE_HARVEST_REQUEST_APPROVED } from '../../libs/constants/queue';
import { HarvestRequestApprovedJobData } from '../../libs/interfaces/job-data';
import { BaseQueue } from './base.queue';

@Service()
export class HarvestRequestApprovedQueue extends BaseQueue<HarvestRequestApprovedJobData> {
  protected queueName = QUEUE_HARVEST_REQUEST_APPROVED;
}
