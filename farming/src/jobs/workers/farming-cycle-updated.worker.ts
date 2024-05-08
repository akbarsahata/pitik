import { JobsOptions } from 'bullmq';
import { Inject, Service } from 'fastify-decorators';
import { ChickInRequestDAO } from '../../dao/chickInRequest.dao';
import { ErpDAO } from '../../dao/erp.dao';
import { SlackDAO } from '../../dao/external/slack.dao';
import { FarmingCycleDAO } from '../../dao/farmingCycle.dao';
import { FarmingCycle } from '../../datasources/entity/pgsql/FarmingCycle.entity';
import { QUEUE_FARMING_CYCLE_UPDATED } from '../../libs/constants/queue';
import { Logger } from '../../libs/utils/logger';
import { BaseWorker } from './base.worker';

@Service()
export class FarmingCycleUpdatedWorker extends BaseWorker<FarmingCycle> {
  @Inject(FarmingCycleDAO)
  private farmingCycleDAO!: FarmingCycleDAO;

  @Inject(ChickInRequestDAO)
  private chickInRequestDAO!: ChickInRequestDAO;

  @Inject(ErpDAO)
  private erpDAO!: ErpDAO;

  @Inject(SlackDAO)
  private slackDAO!: SlackDAO;

  @Inject(Logger)
  private logger!: Logger;

  protected workerName = QUEUE_FARMING_CYCLE_UPDATED;

  protected async handle(
    data: FarmingCycle,
    attemptsMade: number,
    opts: JobsOptions,
    jobId?: string,
  ) {
    try {
      const farmingCycle = await this.farmingCycleDAO.getOneStrict({
        where: {
          id: data.id,
        },
        relations: {
          contract: {
            contractType: true,
          },
          coop: {
            chickType: true,
            contract: {
              contractType: true,
            },
            coopType: true,
          },
          farm: {
            owner: true,
            branch: true,
          },
        },
      });

      const chickInRequest = await this.chickInRequestDAO.getOne({
        where: {
          farmingCycleId: data.id,
        },
      });

      if (!chickInRequest) return;

      await this.erpDAO.createFarmingCycle(farmingCycle, chickInRequest);
    } catch (error) {
      this.logger.error(error);

      if (attemptsMade === opts.attempts) {
        await this.slackDAO.alertFailedJobs(this.workerName, error, data, jobId);
      }

      throw error;
    }
  }
}
