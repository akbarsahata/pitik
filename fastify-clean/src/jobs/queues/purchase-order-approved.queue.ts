import { Service } from 'fastify-decorators';
import { PurchaseOrder } from '../../datasources/entity/pgsql/PurchaseOrder.entity';
import { QUEUE_PURCHASE_ORDER_APPROVED } from '../../libs/constants/queue';
import { BaseQueue } from './base.queue';

@Service()
export class PurchaseOrderApprovedQueue extends BaseQueue<PurchaseOrder> {
  protected queueName = QUEUE_PURCHASE_ORDER_APPROVED;
}
