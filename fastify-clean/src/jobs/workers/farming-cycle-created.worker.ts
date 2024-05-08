import { captureException } from '@sentry/node';
import { Inject, Service } from 'fastify-decorators';
import { DeepPartial } from 'typeorm';
import { CoopMemberDDAO } from '../../dao/coopMemberD.dao';
import { ErpDAO } from '../../dao/erp.dao';
import { FarmingCycleDAO } from '../../dao/farmingCycle.dao';
import { FarmingCycleChickStockDDAO } from '../../dao/farmingCycleChickStockD.dao';
import { FarmingCycleMemberDDAO } from '../../dao/farmingCycleMemberD.dao';
import { ChickInRequest } from '../../datasources/entity/pgsql/ChickInRequest.entity';
import { FarmingCycleChickStockD } from '../../datasources/entity/pgsql/FarmingCycleChickStockD.entity';
import { FarmingCycleMemberD } from '../../datasources/entity/pgsql/FarmingCycleMemberD.entity';
import { USER_TYPE, USER_TYPE_INTERNAL_GROUP } from '../../libs/constants';
import { QUEUE_FARMING_CYCLE_CREATED } from '../../libs/constants/queue';
import { BaseWorker } from './base.worker';

// FIXME: please remove import env once flow with ODOO is ready
import env from '../../config/env';
import { Logger } from '../../libs/utils/logger';

@Service()
export class FarmingCycleCreatedWorker extends BaseWorker<ChickInRequest> {
  @Inject(FarmingCycleDAO)
  fcDAO: FarmingCycleDAO;

  @Inject(CoopMemberDDAO)
  coopMemberDDAO: CoopMemberDDAO;

  @Inject(FarmingCycleMemberDDAO)
  fcMemberDDAO: FarmingCycleMemberDDAO;

  @Inject(ErpDAO)
  erpDAO: ErpDAO;

  @Inject(FarmingCycleChickStockDDAO)
  private farmingCycleChickStockDDAO!: FarmingCycleChickStockDDAO;

  @Inject(Logger)
  private logger: Logger;

  protected workerName = QUEUE_FARMING_CYCLE_CREATED;

  protected async handle(data: ChickInRequest) {
    try {
      const fc = await this.fcDAO.getOneStrict({
        where: {
          id: data.farmingCycleId,
        },
        relations: {
          farm: {
            owner: true,
            branch: true,
          },
          coop: {
            coopType: true,
            chickType: true,
            contract: {
              contractType: true,
            },
          },
          chickType: true,
        },
      });

      const [coopMembers] = await this.coopMemberDDAO.getMany({
        where: {
          coopId: fc.coopId,
        },
        relations: {
          user: true,
        },
      });

      await this.fcMemberDDAO.createMany(
        coopMembers.map<DeepPartial<FarmingCycleMemberD>>((cm) => ({
          farmingCycleId: fc.id,
          userId: cm.user.id,
          isLeader: cm.user.userType === USER_TYPE.KK,
          isInternal: USER_TYPE_INTERNAL_GROUP.includes(cm.user.userType),
        })),
        {
          id: fc.createdBy,
          role: '',
        },
      );

      const farmingCycleStockPayload: Partial<FarmingCycleChickStockD> = {
        farmingCycleId: fc.id,
        userId: fc.farm.userOwnerId,
        transactionDate: fc.farmingCycleStartDate,
        operator: '+',
        qty: fc.initialPopulation,
        notes: 'Initial Population',
      };

      await this.farmingCycleChickStockDDAO.createOne(farmingCycleStockPayload, {
        id: fc.createdBy,
        role: '',
      });

      // FIXME:  please remove conditional USE_ERP feature flag once flow with ODOO is ready
      if (env.USE_ERP || env.USE_ERP_CONTRACT) {
        await this.erpDAO.createFarmingCycle(fc, data);
      }
    } catch (error) {
      this.logger.error(error);

      captureException(error);

      throw error;
    }
  }
}
