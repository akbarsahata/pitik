import { Service } from 'fastify-decorators';
import { QUEUE_REINDEX_ERP_PRODUCTS } from '../../libs/constants/queue';
import { BaseQueue } from './base.queue';

@Service()
export class ReindexErpProductsQueue extends BaseQueue {
  protected queueName = QUEUE_REINDEX_ERP_PRODUCTS;

  async addJob() {
    const jobCounts = await this.queue.getJobCounts('active', 'wait');

    if (jobCounts.wait > 0 || jobCounts.active > 0) {
      return;
    }

    this.queue.add(QUEUE_REINDEX_ERP_PRODUCTS, {});
  }
}
