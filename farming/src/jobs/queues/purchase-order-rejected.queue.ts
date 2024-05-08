import { Service } from 'fastify-decorators';
import { QUEUE_PURCHASE_ORDER_REJECTED } from '../../libs/constants/queue';
import { PurchaseOrderRejectedJobData } from '../../libs/interfaces/job-data';
import { BaseQueue } from './base.queue';

@Service()
export class PurchaseOrderRejectedQueue extends BaseQueue<PurchaseOrderRejectedJobData> {
  protected queueName = QUEUE_PURCHASE_ORDER_REJECTED;
}
