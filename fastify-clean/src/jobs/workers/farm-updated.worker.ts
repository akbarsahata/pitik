import { captureException } from '@sentry/node';
import { Inject, Service } from 'fastify-decorators';
import { ErpDAO } from '../../dao/erp.dao';
import { FarmDAO } from '../../dao/farm.dao';
import { Farm } from '../../datasources/entity/pgsql/Farm.entity';
import { QUEUE_FARM_UPDATED } from '../../libs/constants/queue';
import { BaseWorker } from './base.worker';

// FIXME: please remove import env once flow with ODOO is ready
import env from '../../config/env';
import { Logger } from '../../libs/utils/logger';

@Service()
export class FarmUpdatedWorker extends BaseWorker<Farm> {
  @Inject(ErpDAO)
  private erpDAO!: ErpDAO;

  @Inject(FarmDAO)
  private farmDAO: FarmDAO;

  @Inject(Logger)
  private logger: Logger;

  protected workerName = QUEUE_FARM_UPDATED;

  protected async handle(data: Farm) {
    // FIXME:  please remove conditional USE_ERP feature flag once flow with ODOO is ready
    if (!env.USE_ERP) return false;

    try {
      const farm = await this.farmDAO.getOne({
        where: {
          id: data.id,
        },
        relations: {
          branch: true,
          owner: true,
        },
      });

      if (!farm) {
        throw new Error(`NOT FOUND FARM: ${data.id}`);
      }

      const result = await this.erpDAO.updateFarm(farm);

      return result;
    } catch (error) {
      this.logger.error(error);

      captureException(error);

      throw error;
    }
  }
}
