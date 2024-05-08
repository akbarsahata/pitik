import { JobsOptions, Queue } from 'bullmq';
import { Destructor, Initializer, Inject, Service } from 'fastify-decorators';
import { RedisConnection } from '../../datasources/connection/redis.connection';

@Service()
export class BaseQueue<T = any> {
  @Inject(RedisConnection)
  protected redis!: RedisConnection;

  protected queue!: Queue<T>;

  protected queueName = '';

  @Initializer([RedisConnection])
  init() {
    if (!this.queueName) {
      throw new Error('EMPTY QUEUE NAME');
    }

    this.queue = new Queue(this.queueName, {
      connection: this.redis.connection,
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
      },
    });
  }

  @Destructor()
  async destroy() {
    await this.queue.close();
  }

  async addJob(jobData: T, opt: JobsOptions = {}) {
    await this.queue.add(this.queueName, jobData, opt);
  }

  async clean(duration = 60 * 60 * 1000, limit = 999999) {
    await this.queue.clean(duration, limit, 'completed');
  }
}
