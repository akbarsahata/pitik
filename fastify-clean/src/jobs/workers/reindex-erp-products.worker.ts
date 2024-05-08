import { captureException } from '@sentry/node';
import { Inject, Service } from 'fastify-decorators';
import env from '../../config/env';
import { ErpDAO } from '../../dao/erp.dao';
import { ProductDAO } from '../../dao/product.dao';
import { QUEUE_REINDEX_ERP_PRODUCTS } from '../../libs/constants/queue';
import { Logger } from '../../libs/utils/logger';
import { BaseWorker } from './base.worker';

@Service()
export class ReindexErpProductsWorker extends BaseWorker {
  @Inject(ProductDAO)
  productDAO: ProductDAO;

  @Inject(ErpDAO)
  erpDAO: ErpDAO;

  @Inject(Logger)
  logger: Logger;

  protected workerName = QUEUE_REINDEX_ERP_PRODUCTS;

  protected async handle() {
    try {
      if (env.USE_ERP) {
        const activeDocs = await this.erpDAO.getAllActiveProducts();

        await this.productDAO.reindex(activeDocs);
      } else {
        const [activeDocs] = await this.productDAO.getMany({
          where: {
            isActive: true,
          },
        });

        await this.productDAO.reindexNew(activeDocs);
      }
    } catch (error) {
      this.logger.error(error);

      captureException(error);

      throw error;
    }
  }
}
