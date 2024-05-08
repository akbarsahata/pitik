import { Inject, Service } from 'fastify-decorators';
import { esEnv } from '../../config/datasource';
import { ElasticSearchConnection } from '../../datasources/connection/elasticsearch.connection';
import { ConventronCreatedJob } from '../../dto/smartConventron.dto';
import { QUEUE_IOT_SMART_CONVENTRON_CREATED } from '../../libs/constants/queue';
import { Logger } from '../../libs/utils/logger';
import { BaseWorker } from './base.worker';

@Service()
export class IotSmartConventronCreatedWorker extends BaseWorker<ConventronCreatedJob> {
  protected workerName = QUEUE_IOT_SMART_CONVENTRON_CREATED;

  @Inject(Logger)
  private logger: Logger;

  @Inject(ElasticSearchConnection)
  private es: ElasticSearchConnection;

  protected async handle(data: ConventronCreatedJob): Promise<void> {
    try {
      await this.es.client.index({
        index: esEnv.ES_IDX_IOT_CONVENTRON,
        body: data,
      });
    } catch (error) {
      this.logger.error(error);

      throw error;
    }
  }
}
