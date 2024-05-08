import { JobsOptions } from 'bullmq';
import { Inject, Service } from 'fastify-decorators';
import { ErpDAO } from '../../dao/erp.dao';
import { ProductESDAO } from '../../dao/es/product.es.dao';
import { SlackDAO } from '../../dao/external/slack.dao';
import { mapProductPayload } from '../../dto/product.dto';
import { QUEUE_REINDEX_ERP_PRODUCTS } from '../../libs/constants/queue';
import { Logger } from '../../libs/utils/logger';
import { BaseWorker } from './base.worker';

@Service()
export class ReindexErpProductsWorker extends BaseWorker {
  @Inject(ProductESDAO)
  productESDAO: ProductESDAO;

  @Inject(ErpDAO)
  erpDAO: ErpDAO;

  @Inject(SlackDAO)
  slackDAO!: SlackDAO;

  @Inject(Logger)
  logger: Logger;

  protected workerName = QUEUE_REINDEX_ERP_PRODUCTS;

  protected async handle(_: any, attemptsMade: number, opts: JobsOptions, jobId?: string) {
    try {
      const erpProducts = await this.erpDAO.getAllActiveProducts();

      await this.productESDAO.reindex(erpProducts.map((ep) => mapProductPayload(ep)));
    } catch (error) {
      this.logger.error(error);

      if (attemptsMade === opts.attempts) {
        await this.slackDAO.alertFailedJobs(this.workerName, error, {}, jobId);
      }

      throw error;
    }
  }
}
