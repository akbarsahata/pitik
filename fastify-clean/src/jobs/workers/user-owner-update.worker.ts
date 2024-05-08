import { captureException } from '@sentry/node';
import { Inject, Service } from 'fastify-decorators';
import { ErpDAO } from '../../dao/erp.dao';
import { User } from '../../datasources/entity/pgsql/User.entity';
import { QUEUE_USER_OWNER_UPDATED } from '../../libs/constants/queue';
import { BaseWorker } from './base.worker';

// FIXME: please remove import env once flow with ODOO is ready
import env from '../../config/env';
import { Logger } from '../../libs/utils/logger';

@Service()
export class UserOwnerUpdatedWorker extends BaseWorker<User> {
  @Inject(ErpDAO)
  private erpDAO: ErpDAO;

  @Inject(Logger)
  private logger: Logger;

  protected workerName = QUEUE_USER_OWNER_UPDATED;

  protected async handle(data: User) {
    // FIXME:  please remove conditional USE_ERP feature flag once flow with ODOO is ready
    if (!env.USE_ERP) return false;

    try {
      const result = await this.erpDAO.updateUser(data);

      return result;
    } catch (error) {
      this.logger.error(error);

      captureException(error);

      throw error;
    }
  }
}
