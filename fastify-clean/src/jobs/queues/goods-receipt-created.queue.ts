import { Service } from 'fastify-decorators';
import { GoodsReceipt } from '../../datasources/entity/pgsql/GoodsReceipt.entity';
import { QUEUE_GOODS_RECEIPT_CREATED } from '../../libs/constants/queue';
import { BaseQueue } from './base.queue';

@Service()
export class GoodsReceiptCreatedQueue extends BaseQueue<GoodsReceipt> {
  protected queueName = QUEUE_GOODS_RECEIPT_CREATED;
}
