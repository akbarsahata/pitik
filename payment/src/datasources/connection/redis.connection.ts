import { Destructor, Initializer, Inject, Service } from 'fastify-decorators';
import IORedis, { Redis } from 'ioredis';
import { env } from '../../config/env';
import { Logger } from '../../libs/utils/logger';

@Service()
export class RedisConnection {
  public connection!: Redis;

  @Inject(Logger)
  private logger!: Logger;

  @Initializer()
  async init() {
    try {
      this.connection = new IORedis({
        host: env.REDIS_HOST,
        port: env.REDIS_PORT,
        username: env.REDIS_USERNAME,
        password: env.REDIS_PASSWORD,
        db: env.REDIS_DB,
        enableReadyCheck: false,
        maxRetriesPerRequest: null,
      });

      this.connection.setMaxListeners(9999);

      this.logger.info({ message: '[CONNECTION] Connected to Redis' });
    } catch (error) {
      this.logger.error({ message: '[CONNECTION] Error connecting to Redis' });
      this.logger.error(error);
      throw error;
    }
  }

  @Destructor()
  async destroy() {
    await this.connection.quit();
  }
}
