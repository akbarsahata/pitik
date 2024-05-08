import { Service } from 'fastify-decorators';
import { PurchaseRequest } from '../../datasources/entity/pgsql/PurchaseRequest.entity';
import { QUEUE_PURCHASE_REQUEST_CREATED } from '../../libs/constants/queue';
import { BaseQueue } from './base.queue';

@Service()
export class PurchaseRequestCreatedQueue extends BaseQueue<PurchaseRequest> {
  protected queueName = QUEUE_PURCHASE_REQUEST_CREATED;
}
