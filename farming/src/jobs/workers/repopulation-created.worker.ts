import { JobsOptions } from 'bullmq';
import { Inject, Service } from 'fastify-decorators';
import { ErpDAO } from '../../dao/erp.dao';
import { SlackDAO } from '../../dao/external/slack.dao';
import { FarmingCycleDAO } from '../../dao/farmingCycle.dao';
import { RepopulationDAO } from '../../dao/repopulation.dao';
import { QUEUE_REPOPULATION_CREATED } from '../../libs/constants/queue';
import { RepopulationCreatedJobData } from '../../libs/interfaces/job-data';
import { Logger } from '../../libs/utils/logger';
import { BaseWorker } from './base.worker';

@Service()
export class RepopulationCreatedWorker extends BaseWorker<RepopulationCreatedJobData> {
  @Inject(RepopulationDAO)
  private dao: RepopulationDAO;

  @Inject(FarmingCycleDAO)
  private farmingCycleDAO: FarmingCycleDAO;

  @Inject(ErpDAO)
  private erpDAO: ErpDAO;

  @Inject(SlackDAO)
  private slackDAO!: SlackDAO;

  @Inject(Logger)
  private logger: Logger;

  protected workerName = QUEUE_REPOPULATION_CREATED;

  protected async handle(
    data: RepopulationCreatedJobData,
    attemptsMade: number,
    opts: JobsOptions,
    jobId?: string,
  ): Promise<void> {
    try {
      const [repopulation, farmingCycle] = await Promise.all([
        this.dao.getOneStrict({
          where: {
            farmingCycleId: data.farmingCycleId,
          },
        }),
        this.farmingCycleDAO.getOneStrict({
          where: {
            id: data.farmingCycleId,
          },
        }),
      ]);

      await this.erpDAO.createRepopulation(farmingCycle.farmingCycleCode, repopulation);
    } catch (error) {
      this.logger.error(error);

      if (attemptsMade === opts.attempts) {
        await this.slackDAO.alertFailedJobs(this.workerName, error, data, jobId);
      }

      throw error;
    }
  }
}
