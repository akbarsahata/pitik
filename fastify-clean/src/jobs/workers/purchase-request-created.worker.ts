import { captureException } from '@sentry/node';
import { Inject, Service } from 'fastify-decorators';
import { IsNull } from 'typeorm';
import { PurchaseRequestDAO } from '../../dao/purchaseRequest.dao';
import { PurchaseRequest } from '../../datasources/entity/pgsql/PurchaseRequest.entity';
import { BaseWorker } from './base.worker';

// FIXME: please remove import env once flow with ODOO is ready
import { QUEUE_PURCHASE_REQUEST_CREATED } from '../../libs/constants/queue';

@Service()
export class PurchaseRequestCreatedWorker extends BaseWorker<PurchaseRequest> {
  @Inject(PurchaseRequestDAO)
  private prDAO!: PurchaseRequestDAO;

  protected workerName = QUEUE_PURCHASE_REQUEST_CREATED;

  protected async handle(data: PurchaseRequest) {
    try {
      const purchaseReq = await this.prDAO.getOne({
        where: {
          id: data.id,
          erpCode: IsNull(),
        },
        select: {
          id: true,
        },
        relations: {
          farmingCycle: true,
          products: true,
        },
      });

      if (!purchaseReq) return;
    } catch (error) {
      captureException(error);

      throw error;
    }
  }
}
