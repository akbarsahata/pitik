import { JobsOptions } from 'bullmq';
import { Inject, Service } from 'fastify-decorators';
import { ErpDAO } from '../../dao/erp.dao';
import { SlackDAO } from '../../dao/external/slack.dao';
import { FarmDAO } from '../../dao/farm.dao';
import { Farm } from '../../datasources/entity/pgsql/Farm.entity';
import { QUEUE_FARM_UPSERT } from '../../libs/constants/queue';
import { Logger } from '../../libs/utils/logger';
import { BaseWorker } from './base.worker';

@Service()
export class FarmUpsertWorker extends BaseWorker<Farm> {
  @Inject(ErpDAO)
  private erpDAO!: ErpDAO;

  @Inject(FarmDAO)
  private farmDAO: FarmDAO;

  @Inject(SlackDAO)
  private slackDAO: SlackDAO;

  @Inject(Logger)
  private logger: Logger;

  protected workerName = QUEUE_FARM_UPSERT;

  protected async handle(data: Farm, attemptsMade: number, opts: JobsOptions, jobId?: string) {
    try {
      const farm = await this.farmDAO.getOne({
        where: {
          id: data.id,
        },
        relations: {
          branch: true,
          owner: true,
        },
      });

      if (!farm) {
        throw new Error(`NOT FOUND FARM: ${data.id}`);
      }

      const result = await this.erpDAO.updateFarm(farm);

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
