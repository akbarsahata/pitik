import { Service } from 'fastify-decorators';
import { QUEUE_PURCHASE_REQUEST_APPROVED } from '../../libs/constants/queue';
import { PurchaseRequestApprovedJobData } from '../../libs/interfaces/job-data';
import { BaseQueue } from './base.queue';

@Service()
export class PurchaseRequestApprovedQueue extends BaseQueue<PurchaseRequestApprovedJobData> {
  protected queueName = QUEUE_PURCHASE_REQUEST_APPROVED;
}
