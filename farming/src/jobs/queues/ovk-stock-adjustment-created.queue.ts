import { Service } from 'fastify-decorators';
import { CreateOvkStockAdjustmentResponseList } from '../../dto/ovkstock.dto';
import { QUEUE_OVK_STOCK_ADJUSTMENT_CREATED } from '../../libs/constants/queue';
import { BaseQueue } from './base.queue';

@Service()
// eslint-disable-next-line max-len
export class OvkStockAdjustmentCreatedQueue extends BaseQueue<CreateOvkStockAdjustmentResponseList> {
  protected queueName = QUEUE_OVK_STOCK_ADJUSTMENT_CREATED;
}
