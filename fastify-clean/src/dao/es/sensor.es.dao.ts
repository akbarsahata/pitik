import { SearchHit, SearchResponse } from '@elastic/elasticsearch/api/types.d';
import { sub } from 'date-fns';
import { Inject, Service } from 'fastify-decorators';
import { esEnv } from '../../config/datasource';
import { ElasticSearchConnection } from '../../datasources/connection/elasticsearch.connection';
import {
  IOTSensorData,
  IOTSensorDataItem,
  SensorNames,
} from '../../datasources/entity/elasticsearch/IOTSensorData.entity';
import { sensorRegexp } from '../../libs/constants/regexp';
import { parseSkipFailed, toSensorCode } from '../../libs/utils/helpers';
import { ESTimeRange } from '../iotSensor.dao';

@Service()
export class SensorESDAO {
  @Inject(ElasticSearchConnection)
  private es!: ElasticSearchConnection;

  async getManyByCoopCode(
    coopCode: string,
    range?: ESTimeRange,
    order?: 'asc' | 'desc',
    deviceId: string | null = null,
  ): Promise<SearchHit<IOTSensorData>[]> {
    const query: any = {
      bool: {
        must: [
          {
            match: {
              paths: 'sensors',
            },
          },
          {
            match: {
              paths: coopCode,
            },
          },
        ],
        filter: [
          {
            match_phrase: {
              _index: esEnv.ES_IDX_IOT,
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

    const result = await this.es.client.search<SearchResponse<IOTSensorData>>({
      index: esEnv.ES_IDX_IOT,
      body: {
        sort,
        query,
      },
      size: 1e4,
    });

    return result.body.hits.hits;
  }

  async getRelativeTemperatureHumidityByCoopCode(opts: {
    coopCode: string | undefined;
    timestamp: Date;
  }): Promise<{
    temperature: number | null;
    humidity: number | null;
  }> {
    if (!opts.coopCode || !opts.timestamp) {
      return { temperature: null, humidity: null };
    }
    const sensorData = await this.getManyByCoopCode(toSensorCode(opts.coopCode), {
      from: sub(opts.timestamp, { minutes: 10 }),
      to: opts.timestamp,
    });

    /* eslint-disable no-underscore-dangle */
    if (!sensorData[0] || !sensorData[0]._source) {
      /* eslint-enable no-underscore-dangle */
      return { temperature: null, humidity: null };
    }

    const data = parseSkipFailed(sensorData);
    if (!data) {
      return { temperature: null, humidity: null };
    }

    const sensorNames = Object.keys(data).filter((key) => sensorRegexp.test(key)) as SensorNames[];
    const sensorCount = sensorNames.length;

    const temperature =
      sensorNames.reduce(
        (total, sensorName) => (data[sensorName] as IOTSensorDataItem).t + total,
        0,
      ) /
      (sensorCount * 10);

    const humidity =
      sensorNames.reduce(
        (total, sensorName) => (data[sensorName] as IOTSensorDataItem).h + total,
        0,
      ) / sensorCount;

    return { temperature, humidity };
  }
}
