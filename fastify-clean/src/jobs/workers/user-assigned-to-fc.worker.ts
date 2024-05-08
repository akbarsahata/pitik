import { captureException } from '@sentry/node';
import { Inject, Service } from 'fastify-decorators';
import { CoopMemberDDAO } from '../../dao/coopMemberD.dao';
import { FarmingCycleDAO } from '../../dao/farmingCycle.dao';
import { FarmingCycleMemberD } from '../../datasources/entity/pgsql/FarmingCycleMemberD.entity';
import { QUEUE_USER_ASSIGNED_TO_FC } from '../../libs/constants/queue';
import { Logger } from '../../libs/utils/logger';
import { BaseWorker } from './base.worker';

@Service()
export class UserAssignedToFcWorker extends BaseWorker<Partial<FarmingCycleMemberD>> {
  @Inject(FarmingCycleDAO)
  private fcDAO!: FarmingCycleDAO;

  @Inject(CoopMemberDDAO)
  private coopMemberDAO!: CoopMemberDDAO;

  @Inject(Logger)
  private logger: Logger;

  protected workerName = QUEUE_USER_ASSIGNED_TO_FC;

  protected async handle(data: Partial<FarmingCycleMemberD>): Promise<void> {
    try {
      const farmingCycle = await this.fcDAO.getOneStrict({
        where: {
          id: data.farmingCycleId,
        },
      });

      await this.coopMemberDAO.upsertOne(
        {
          coopId: farmingCycle.coopId,
          userId: data.userId,
          isLeader: data.isLeader,
        },
        data.createdBy as string,
      );
    } catch (error) {
      this.logger.error(error);

      captureException(error);

      throw error;
    }
  }
}
