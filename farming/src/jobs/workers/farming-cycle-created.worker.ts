import { JobsOptions } from 'bullmq';
import { Inject, Service } from 'fastify-decorators';
import { DeepPartial } from 'typeorm';
import { CoopMemberDDAO } from '../../dao/coopMemberD.dao';
import { ErpDAO } from '../../dao/erp.dao';
import { SlackDAO } from '../../dao/external/slack.dao';
import { FarmingCycleDAO } from '../../dao/farmingCycle.dao';
import { FarmingCycleChickStockDDAO } from '../../dao/farmingCycleChickStockD.dao';
import { FarmingCycleMemberDDAO } from '../../dao/farmingCycleMemberD.dao';
import { ChickInRequest } from '../../datasources/entity/pgsql/ChickInRequest.entity';
import { FarmingCycleChickStockD } from '../../datasources/entity/pgsql/FarmingCycleChickStockD.entity';
import { FarmingCycleMemberD } from '../../datasources/entity/pgsql/FarmingCycleMemberD.entity';
import { USER_TYPE, USER_TYPE_INTERNAL_GROUP } from '../../libs/constants';
import { QUEUE_FARMING_CYCLE_CREATED } from '../../libs/constants/queue';
import { Logger } from '../../libs/utils/logger';
import { BaseWorker } from './base.worker';

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

  @Inject(SlackDAO)
  private slackDAO!: SlackDAO;

  @Inject(Logger)
  private logger: Logger;

  protected workerName = QUEUE_FARMING_CYCLE_CREATED;

  protected async handle(
    data: ChickInRequest,
    attemptsMade: number,
    opts: JobsOptions,
    jobId?: string,
  ) {
    const queryRunner = await this.fcDAO.startTransaction();

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
          contract: {
            contractType: true,
          },
          chickType: true,
        },
      });

      const [[coopMembers], [farmingCycleMembers]] = await Promise.all([
        this.coopMemberDDAO.getMany({
          where: {
            coopId: fc.coopId,
          },
          relations: {
            user: true,
          },
        }),
        this.fcMemberDDAO.getMany({
          where: {
            farmingCycleId: data.farmingCycleId,
          },
        }),
      ]);

      const fcMemberIds: string[] = farmingCycleMembers.map((member) => member.userId);

      const fcMembers: DeepPartial<FarmingCycleMemberD>[] = coopMembers
        .filter((member) => !fcMemberIds.includes(member.user.id))
        .map<DeepPartial<FarmingCycleMemberD>>((cm) => ({
          farmingCycleId: fc.id,
          userId: cm.user.id,
          isLeader: cm.user.userType === USER_TYPE.KK,
          isInternal: USER_TYPE_INTERNAL_GROUP.includes(cm.user.userType),
        }));

      await this.fcMemberDDAO.createManyWithTx(
        fcMembers,
        { id: fc.createdBy, role: '' },
        queryRunner,
      );

      const farmingCycleStockPayload: Partial<FarmingCycleChickStockD> = {
        farmingCycleId: fc.id,
        userId: fc.farm.userOwnerId,
        transactionDate: fc.farmingCycleStartDate,
        operator: '+',
        qty: fc.initialPopulation,
        notes: 'Initial Population',
      };

      await this.farmingCycleChickStockDDAO.upsertOneWithTx(
        { farmingCycleId: fc.id, notes: 'Initial Population' },
        farmingCycleStockPayload,
        { id: fc.createdBy, role: '' },
        queryRunner,
      );

      // commiting without releasing transaction
      await this.fcDAO.commitTransaction(queryRunner, false);

      await this.erpDAO.createFarmingCycle(fc, data);

      await this.fcDAO.commitTransaction(queryRunner);
    } catch (error) {
      await this.fcDAO.rollbackTransaction(queryRunner);

      this.logger.error(error);

      if (attemptsMade === opts.attempts) {
        await this.slackDAO.alertFailedJobs(this.workerName, error, data, jobId);
      }

      throw error;
    }
  }
}
