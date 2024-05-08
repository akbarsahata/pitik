import { JobsOptions } from 'bullmq';
import { Service } from 'fastify-decorators';
import ms from 'ms';
import { QUEUE_HARVEST_REALIZATION_CREATE_ODOO } from '../../libs/constants/queue';
import { HarvestRealizationCreateOdooJobData } from '../../libs/interfaces/job-data';
import { BaseQueue } from './base.queue';

@Service()
// eslint-disable-next-line max-len
export class HarvestRealizationCreateOdooQueue extends BaseQueue<HarvestRealizationCreateOdooJobData> {
  protected queueName = QUEUE_HARVEST_REALIZATION_CREATE_ODOO;

  /**
   * due to inability of bullmq to make sure exactly 1 concurrency
   * add job on this queue will be delayed automatically based on
   * how many active and delayed jobs
   * with expectation that jobs will be handled by 1 worker only for most of time
   *
   * @param   {HarvestRealization}  jobData  [jobData description]
   * @param   {JobsOptions<void>}   opt      [opt description]
   *
   * @return  {Promise<void>}                [return description]
   */
  async addJob(jobData: HarvestRealizationCreateOdooJobData, opt?: JobsOptions): Promise<void> {
    const [activeCount, delayedCount] = await Promise.all([
      this.queue.getActiveCount(),
      this.queue.getDelayedCount(),
    ]);

    const delay = ms('2m') * (activeCount + delayedCount);

    await this.queue.add(this.queueName, jobData, {
      ...opt,
      attempts: 3,
      delay: delay % ms('30m'), // Delay max to 30 minutes
      backoff: {
        type: 'fixed',
        delay: ms('10m'),
      },
    });
  }
}
