import { Service } from 'fastify-decorators';
import { QUEUE_GOODS_RECEIPT_CREATED } from '../../libs/constants/queue';
import { GoodsReceiptCreatedJobData } from '../../libs/interfaces/job-data';
import { BaseQueue } from './base.queue';

@Service()
export class GoodsReceiptCreatedQueue extends BaseQueue<GoodsReceiptCreatedJobData> {
  protected queueName = QUEUE_GOODS_RECEIPT_CREATED;
}
