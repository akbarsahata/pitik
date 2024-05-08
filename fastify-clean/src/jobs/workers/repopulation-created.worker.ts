import { captureException } from '@sentry/node';
import { Inject, Service } from 'fastify-decorators';
import { ErpDAO } from '../../dao/erp.dao';
import { FarmingCycleDAO } from '../../dao/farmingCycle.dao';
import { RepopulationDAO } from '../../dao/repopulation.dao';
import { Repopulation } from '../../datasources/entity/pgsql/Repopulation.entity';
import { QUEUE_REPOPULATION_CREATED } from '../../libs/constants/queue';
import { BaseWorker } from './base.worker';

// FIXME: please remove import env once flow with ODOO is ready
import env from '../../config/env';
import { Logger } from '../../libs/utils/logger';

@Service()
export class RepopulationCreatedWorker extends BaseWorker<Repopulation> {
  @Inject(RepopulationDAO)
  private dao: RepopulationDAO;

  @Inject(FarmingCycleDAO)
  private farmingCycleDAO: FarmingCycleDAO;

  @Inject(ErpDAO)
  private erpDAO: ErpDAO;

  @Inject(Logger)
  private logger: Logger;

  protected workerName = QUEUE_REPOPULATION_CREATED;

  protected async handle(data: Repopulation): Promise<void> {
    try {
      await this.dao.getOneStrict({
        where: {
          farmingCycleId: data.farmingCycleId,
        },
      });

      const farmingCycle = await this.farmingCycleDAO.getOneStrict({
        where: {
          id: data.farmingCycleId,
        },
      });

      // FIXME: please remove import env once flow with ODOO is ready
      if (env.USE_ERP) {
        this.erpDAO.createRepopulation(farmingCycle.farmingCycleCode, data);
      }
    } catch (error) {
      this.logger.error(error);

      captureException(error);

      throw error;
    }
  }
}
