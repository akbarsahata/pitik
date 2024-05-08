import { Service } from 'fastify-decorators';
import { CreateFeedStockAdjustmentResponseList } from '../../dto/feedstock.dto';
import { QUEUE_FEED_STOCK_ADJUSTMENT_CREATED } from '../../libs/constants/queue';
import { BaseQueue } from './base.queue';

@Service()
// eslint-disable-next-line max-len
export class FeedStockAdjustmentCreatedQueue extends BaseQueue<CreateFeedStockAdjustmentResponseList> {
  protected queueName = QUEUE_FEED_STOCK_ADJUSTMENT_CREATED;
}
