import { captureException } from '@sentry/node';
import { Inject, Service } from 'fastify-decorators';
import { CoopDAO } from '../../dao/coop.dao';
import { ErpDAO } from '../../dao/erp.dao';
import { Coop } from '../../datasources/entity/pgsql/Coop.entity';
import { QUEUE_COOP_UPDATED } from '../../libs/constants/queue';
import { BaseWorker } from './base.worker';

// FIXME: please remove import env once flow with ODOO is ready
import env from '../../config/env';
import { FarmingCycleDAO } from '../../dao/farmingCycle.dao';
import { Logger } from '../../libs/utils/logger';

@Service()
export class CoopUpdateWorker extends BaseWorker<Coop> {
  @Inject(CoopDAO)
  private coopDAO!: CoopDAO;

  @Inject(FarmingCycleDAO)
  private farmingCycleDAO!: FarmingCycleDAO;

  @Inject(ErpDAO)
  private erpDAO!: ErpDAO;

  @Inject(Logger)
  private logger: Logger;

  protected workerName = QUEUE_COOP_UPDATED;

  protected async handle(data: Coop) {
    try {
      let result: any;

      const coop = await this.coopDAO.getOne({
        where: {
          id: data.id,
        },
        relations: {
          farm: {
            owner: true,
          },
          coopType: true,
          chickType: true,
        },
      });

      if (!coop) {
        throw new Error(`NOT FOUND COOP: ${data.id}`);
      }

      if (coop.activeFarmingCycleId) {
        result = await this.farmingCycleDAO.updateOne(
          { id: coop.activeFarmingCycleId },
          { contractId: coop.contractId },
          { id: coop.modifiedBy, role: coop.userModifier?.userType as string },
        );
      }

      // FIXME:  please remove conditional USE_ERP feature flag once flow with ODOO is ready
      if (env.USE_ERP) {
        result = await this.erpDAO.updateCoop(coop);
      }

      return result;
    } catch (error) {
      this.logger.error(error);

      captureException(error);

      throw error;
    }
  }
}
