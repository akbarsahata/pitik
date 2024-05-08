import { Destructor, Initializer, Inject, Service } from 'fastify-decorators';
import { StatsD } from 'hot-shots';
import { statsdEnv } from '../../config/datasource';
import { Logger } from '../../libs/utils/logger';

@Service()
export class StatsdConnection {
  public client: StatsD;

  @Inject(Logger)
  private logger: Logger;

  @Initializer()
  async init() {
    try {
      this.client = new StatsD({ host: statsdEnv.STATSD_HOST, port: statsdEnv.STATSD_PORT });

      this.logger.info({ message: '[CONNECTION] Connected to STATSD' });
    } catch (error) {
      this.logger.info({ message: '[CONNECTION] Error connecting to STATSD' });
      this.logger.error(error);
      throw error;
    }
  }

  @Destructor()
  async destroy() {
    this.client.close();
  }
}
