import { Queue, RepeatOptions } from 'bullmq';
import { Destructor, Initializer, Inject, Service } from 'fastify-decorators';
import { env } from '../../config/env';
import { RedisConnection } from '../../datasources/connection/redis.connection';
import { JOB_CHECK_UNDELIVERED_PAYMENT, QUEUE_REPEATABLE_JOB } from '../../libs/constants/queue';

@Service()
export class RepeatableJobQueue {
  @Inject(RedisConnection)
  private redis!: RedisConnection;

  private queue!: Queue;

  @Initializer([RedisConnection])
  async init() {
    this.queue = new Queue(QUEUE_REPEATABLE_JOB, { connection: this.redis.connection });

    /**
     * remove old jobs to prevent duplication
     * and reset repeat if triggered before schedule
     */
    await this.queue.drain(true);
    await this.queue.clean(0, 9999, 'failed');

    // add all repeatable jobs here
    this.addRepeatableJob(JOB_CHECK_UNDELIVERED_PAYMENT, {
      pattern: '0 0 * * * *', // every hour
    });

    /**
     * check whether NODE_ENV === 'development' and PAUSE_REPEATABLE_JOB === true
     * to prevent repeatable jobs to be executed on local machines accidentally
     */
    if (env.isDev && env.PAUSE_REPEATABLE_JOB) {
      await this.queue.pause();
    }
  }

  async addRepeatableJob(name: string, repeat: RepeatOptions) {
    this.queue.add(
      name,
      {},
      {
        repeat,
        jobId: name,
      },
    );
  }

  async removeRepeatableJob(name: string, repeat: RepeatOptions) {
    await this.queue.removeRepeatable(name, repeat);
  }

  async clean(duration = 60 * 60 * 1000, limit = 999999) {
    await this.queue.clean(duration, limit, 'completed');
  }

  @Destructor()
  async destroy() {
    await this.queue.close();
  }
}
