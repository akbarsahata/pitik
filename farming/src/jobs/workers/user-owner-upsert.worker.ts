import { JobsOptions } from 'bullmq';
import { Inject, Service } from 'fastify-decorators';
import { ErpDAO } from '../../dao/erp.dao';
import { SlackDAO } from '../../dao/external/slack.dao';
import { User } from '../../datasources/entity/pgsql/User.entity';
import { QUEUE_USER_OWNER_UPSERT } from '../../libs/constants/queue';
import { Logger } from '../../libs/utils/logger';
import { BaseWorker } from './base.worker';

@Service()
export class UserOwnerUpsertWorker extends BaseWorker<User> {
  @Inject(ErpDAO)
  private erpDAO: ErpDAO;

  @Inject(SlackDAO)
  private slackDAO!: SlackDAO;

  @Inject(Logger)
  private logger: Logger;

  protected workerName = QUEUE_USER_OWNER_UPSERT;

  protected async handle(data: User, attemptsMade: number, opts: JobsOptions, jobId?: string) {
    try {
      const result = await this.erpDAO.updateUser(data);

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
