import { Client } from '@elastic/elasticsearch';
import { Destructor, Initializer, Inject, Service } from 'fastify-decorators';
import { esEnv } from '../../config/datasource';
import { Logger } from '../../libs/utils/logger';

@Service()
export class ElasticSearchConnection {
  public client!: Client;

  @Inject(Logger)
  private logger!: Logger;

  @Initializer()
  async init() {
    try {
      this.client = new Client({
        node: esEnv.ES_NODE,
        auth: {
          username: esEnv.ES_USERNAME,
          password: esEnv.ES_PASSWORD,
        },
        agent: {
          maxSockets: 10,
          keepAlive: true,
        },
      });

      this.logger.info({ message: '[CONNECTION] Connected to ElasticSearch' });
    } catch (error) {
      this.logger.info({ message: '[CONNECTION] Error connecting to ElasticSearch' });
      this.logger.error(error);
      throw error;
    }
  }

  @Destructor()
  async destroy() {
    await this.client.close();
  }
}
