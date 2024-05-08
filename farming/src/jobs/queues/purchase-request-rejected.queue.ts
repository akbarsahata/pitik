import { Service } from 'fastify-decorators';
import { QUEUE_PURCHASE_REQUEST_REJECTED } from '../../libs/constants/queue';
import { PurchaseRequestRejectedJobData } from '../../libs/interfaces/job-data';
import { BaseQueue } from './base.queue';

@Service()
export class PurchaseRequestRejectedQueue extends BaseQueue<PurchaseRequestRejectedJobData> {
  protected queueName = QUEUE_PURCHASE_REQUEST_REJECTED;
}
