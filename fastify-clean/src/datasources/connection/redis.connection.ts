import { Destructor, Initializer, Inject, Service } from 'fastify-decorators';
import IORedis, { Redis } from 'ioredis';
import { redisEnv } from '../../config/datasource';
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
        host: redisEnv.REDIS_HOST,
        port: redisEnv.REDIS_PORT,
        username: redisEnv.REDIS_USERNAME,
        password: redisEnv.REDIS_PASSWORD,
        db: redisEnv.REDIS_DB,
        enableReadyCheck: false,
        maxRetriesPerRequest: null,
      });

      this.connection.setMaxListeners(9999);

      this.logger.info({ message: '[CONNECTION] Connected to Redis' });
    } catch (error) {
      this.logger.info({ message: '[CONNECTION] Error connecting to Redis' });
      this.logger.error(error);
      throw error;
    }
  }

  @Destructor()
  async destroy() {
    await this.connection.quit();
  }
}
