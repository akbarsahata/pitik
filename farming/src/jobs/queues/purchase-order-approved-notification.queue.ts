import { Service } from 'fastify-decorators';
import { QUEUE_PURCHASE_ORDER_APPROVED_NOTIFICATION } from '../../libs/constants/queue';
import { PurchaseOrderApprovedJobData } from '../../libs/interfaces/job-data';
import { BaseQueue } from './base.queue';

@Service()
export class PurchaseOrderApprovedNotificationQueue extends BaseQueue<PurchaseOrderApprovedJobData> {
  protected queueName = QUEUE_PURCHASE_ORDER_APPROVED_NOTIFICATION;
}
