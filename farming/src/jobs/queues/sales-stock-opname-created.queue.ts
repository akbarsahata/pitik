import { Service } from 'fastify-decorators';
import { QUEUE_SALES_STOCK_OPNAME_CREATED } from '../../libs/constants/queue';
import { SalesStockOpnameCreatedJobData } from '../../libs/interfaces/job-data';
import { BaseQueue } from './base.queue';

@Service()
export class SalesStockOpnameCreatedQueue extends BaseQueue<SalesStockOpnameCreatedJobData> {
  protected queueName = QUEUE_SALES_STOCK_OPNAME_CREATED;
}
