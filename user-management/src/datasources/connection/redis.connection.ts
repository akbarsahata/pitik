/* eslint-disable no-console */
import { Destructor, Initializer, Service } from 'fastify-decorators';
import IORedis, { Redis } from 'ioredis';
import { sleep } from '../../libs/utils/helpers';
import { redisEnv } from '../../config/datasource';

@Service()
export class RedisConnection {
  public connection!: Redis;

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
        lazyConnect: false,
        connectTimeout: redisEnv.REDIS_CONNECTION_TIMEOUT,
      });

      this.connection.setMaxListeners(9999);

      console.log('[CONNECTION] Connected to Redis');
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Destructor()
  async destroy() {
    /**
     * give delay before close redis connection
     * to prevent error in repeatable queue & worker destructor
     */
    await sleep(5000);

    await this.connection.quit();
  }
}
