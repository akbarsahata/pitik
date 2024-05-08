/* eslint-disable no-console */
import { Client } from '@elastic/elasticsearch';
import { Initializer, Service } from 'fastify-decorators';
import { env } from '../../config/env';

@Service()
export class ElasticSearchConnection {
  public client!: Client;

  @Initializer()
  async init() {
    try {
      this.client = new Client({
        node: env.ES_NODE,
        auth: {
          username: env.ES_USERNAME,
          password: env.ES_PASSWORD,
        },
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
