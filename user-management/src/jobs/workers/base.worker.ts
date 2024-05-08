import { Worker } from 'bullmq';
import { Destructor, Initializer, Inject, Service } from 'fastify-decorators';
import { RedisConnection } from '../../datasources/connection/redis.connection';

@Service()
export class BaseWorker<T = any> {
  @Inject(RedisConnection)
  protected redis!: RedisConnection;

  protected worker!: Worker;

  protected workerName = '';

  protected concurrency = 1;

  @Initializer([RedisConnection])
  init() {
    if (!this.workerName) {
      throw new Error('EMPTY WORKER NAME');
    }

    this.worker = new Worker<T>(
      this.workerName,
      async ({ data }) => {
        await this.handle(data);
      },
      { connection: this.redis.connection, concurrency: this.concurrency },
    );

    return this.worker;
  }

  @Destructor()
  async destroy() {
    await this.worker.close();
  }

  protected async handle(data: T) {
    if (this && data) throw new Error('NOT IMPLEMENTED WORKER HANDLER');
  }
}
