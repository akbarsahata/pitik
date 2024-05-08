import { Service } from 'fastify-decorators';
import { QUEUE_PURCHASE_ORDER_APPROVED } from '../../libs/constants/queue';
import { PurchaseOrderApprovedJobData } from '../../libs/interfaces/job-data';
import { BaseQueue } from './base.queue';

@Service()
export class PurchaseOrderApprovedQueue extends BaseQueue<PurchaseOrderApprovedJobData> {
  protected queueName = QUEUE_PURCHASE_ORDER_APPROVED;
}
