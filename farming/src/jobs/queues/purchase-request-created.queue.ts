import { Service } from 'fastify-decorators';
import { QUEUE_PURCHASE_REQUEST_CREATED } from '../../libs/constants/queue';
import { PurchaseRequestCreatedJobData } from '../../libs/interfaces/job-data';
import { BaseQueue } from './base.queue';

@Service()
export class PurchaseRequestCreatedQueue extends BaseQueue<PurchaseRequestCreatedJobData> {
  protected queueName = QUEUE_PURCHASE_REQUEST_CREATED;
}
