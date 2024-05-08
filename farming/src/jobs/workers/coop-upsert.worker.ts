import { JobsOptions } from 'bullmq';
import { Inject, Service } from 'fastify-decorators';
import { CoopDAO } from '../../dao/coop.dao';
import { ErpDAO } from '../../dao/erp.dao';
import { SlackDAO } from '../../dao/external/slack.dao';
import { FarmingCycleDAO } from '../../dao/farmingCycle.dao';
import { Coop } from '../../datasources/entity/pgsql/Coop.entity';
import { QUEUE_COOP_UPSERT } from '../../libs/constants/queue';
import { Logger } from '../../libs/utils/logger';
import { BaseWorker } from './base.worker';

@Service()
export class CoopUpsertWorker extends BaseWorker<Coop> {
  @Inject(CoopDAO)
  private coopDAO!: CoopDAO;

  @Inject(FarmingCycleDAO)
  private farmingCycleDAO!: FarmingCycleDAO;

  @Inject(ErpDAO)
  private erpDAO!: ErpDAO;

  @Inject(SlackDAO)
  private slackDAO!: SlackDAO;

  @Inject(Logger)
  private logger: Logger;

  protected workerName = QUEUE_COOP_UPSERT;

  protected async handle(data: Coop, attemptsMade: number, opts: JobsOptions, jobId?: string) {
    try {
      let result: any;

      const coop = await this.coopDAO.getOne({
        where: {
          id: data.id,
        },
        relations: {
          contract: {
            contractType: true,
          },
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

      result = await this.erpDAO.updateCoop(coop);

      return result;
    } catch (error) {
      this.logger.error(error);

      if (attemptsMade === opts.attempts) {
        await this.slackDAO.alertFailedJobs(this.workerName, error, data, jobId);
      }

      throw error;
    }
  }
}
