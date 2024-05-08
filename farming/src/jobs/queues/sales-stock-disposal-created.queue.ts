import { Service } from 'fastify-decorators';
import { QUEUE_SALES_STOCK_DISPOSAL_CREATED } from '../../libs/constants/queue';
import { SalesStockDisposalCreatedJobData } from '../../libs/interfaces/job-data';
import { BaseQueue } from './base.queue';

@Service()
export class SalesStockDisposalCreatedQueue extends BaseQueue<SalesStockDisposalCreatedJobData> {
  protected queueName = QUEUE_SALES_STOCK_DISPOSAL_CREATED;
}
