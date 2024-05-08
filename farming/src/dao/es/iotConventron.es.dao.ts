import { SearchHit, SearchResponse } from '@elastic/elasticsearch/api/types.d';
import { Inject, Service } from 'fastify-decorators';
import { esEnv } from '../../config/datasource';
import { ElasticSearchConnection } from '../../datasources/connection/elasticsearch.connection';
import { IOTConventronData } from '../../datasources/entity/elasticsearch/IOTSensorData.entity';
import { PayloadConventronJob } from '../../dto/smartConventron.dto';
import { IotSmartConventronCreatedQueue } from '../../jobs/queues/iot-smart-conventron-created.queue';
import { Logger } from '../../libs/utils/logger';
import { ESTimeRange } from '../iotSensor.dao';

@Service()
export class IotConventronESDAO {
  @Inject(ElasticSearchConnection)
  private es!: ElasticSearchConnection;

  @Inject(IotSmartConventronCreatedQueue)
  private iotSmartConventronCreatedQueue: IotSmartConventronCreatedQueue;

  @Inject(Logger)
  private logger: Logger;

  async getManyByCoopCode(
    coopCode: string,
    range?: ESTimeRange,
    order?: 'asc' | 'desc',
    deviceId: string | null = null,
  ): Promise<SearchHit<IOTConventronData>[]> {
    const query: any = {
      bool: {
        must: [
          {
            match: {
              paths: coopCode,
            },
          },
        ],
        filter: [
          {
            match_phrase: {
              _index: esEnv.ES_IDX_IOT_CONVENTRON,
            },
          },
        ],
      },
    };

    if (range) {
      query.bool.filter.unshift({
        range: {
          created: {
            format: 'strict_date_optional_time',
            gte: range.from,
            lte: range.to,
          },
        },
      });
    }

    if (deviceId) {
      query.bool.must.push({
        match: {
          paths: deviceId,
        },
      });
    }

    const sort = [{ created: { order: order || 'desc', format: 'strict_date_optional_time' } }];

    const result = await this.es.client.search<SearchResponse<IOTConventronData>>({
      index: esEnv.ES_IDX_IOT_CONVENTRON,
      body: {
        sort,
        query,
      },
      size: 1e4,
    });

    return result.body.hits.hits;
  }

  async saveToElastic(topic: string, data: Partial<PayloadConventronJob>) {
    const paths = topic.toString().split('/');

    try {
      await this.iotSmartConventronCreatedQueue.addJob({
        ...data,
        paths,
        coopId: paths[paths.length - 3],
        deviceId: paths[paths.length - 2],
      });
    } catch (error) {
      this.logger.error(error);
    }
  }
}
