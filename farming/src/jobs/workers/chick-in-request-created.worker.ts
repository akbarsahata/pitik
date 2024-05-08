import { Inject, Service } from 'fastify-decorators';
import { ChickInRequestDAO } from '../../dao/chickInRequest.dao';
import { ChickInRequest } from '../../datasources/entity/pgsql/ChickInRequest.entity';
import { QUEUE_CHICKIN_REQUEST_CREATED } from '../../libs/constants/queue';
import { Logger } from '../../libs/utils/logger';
import { BaseWorker } from './base.worker';

@Service()
export class ChickInRequestCreatedWorker extends BaseWorker<ChickInRequest> {
  @Inject(ChickInRequestDAO)
  private cirDAO: ChickInRequestDAO;

  @Inject(Logger)
  private logger: Logger;

  protected workerName = QUEUE_CHICKIN_REQUEST_CREATED;

  protected async handle(data: ChickInRequest) {
    try {
      const chickInReq = await this.cirDAO.getOne({
        where: {
          id: data.id,
        },
        select: {
          id: true,
          coopId: true,
          coop: {
            coopName: true,
          },
        },
        relations: {
          coop: true,
        },
      });

      if (!chickInReq) return;
    } catch (error) {
      this.logger.error(error);

      throw error;
    }
  }
}
