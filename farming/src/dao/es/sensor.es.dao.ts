import { SearchHit, SearchResponse } from '@elastic/elasticsearch/api/types.d';
import { sub } from 'date-fns';
import { Inject, Service } from 'fastify-decorators';
import { esEnv } from '../../config/datasource';
import { ElasticSearchConnection } from '../../datasources/connection/elasticsearch.connection';
import {
  IOTSensorData,
  IOTSensorDataItem,
  IOTSensors,
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
    deviceIds: string[] = [],
  ): Promise<SearchHit<IOTSensorData>[]> {
    const query = {
      bool: {
        filter: [
          {
            bool: {
              should: [
                {
                  match_phrase: {
                    'paths.keyword': coopCode,
                  },
                },
                deviceIds.length && {
                  bool: {
                    should: deviceIds.map((id) => ({
                      match_phrase: {
                        paths: id,
                      },
                    })),
                    minimum_should_match: 1,
                  },
                },
              ].filter((i) => i),
              minimum_should_match: 1,
            },
          },

          range
            ? {
                range: {
                  created: {
                    format: 'strict_date_optional_time',
                    gte: range.from,
                    lte: range.to,
                  },
                },
              }
            : undefined,
        ].filter((i) => i),
      },
    };

    const result = await this.es.client.search<SearchResponse<IOTSensorData>>({
      index: esEnv.ES_IDX_IOT,
      body: {
        size: 1e4,
        sort: [{ created: { order: order || 'desc' } }],
        query,
      },
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

  async getOneCoop(index: string[], coop: string): Promise<IOTSensors | null> {
    const qy = {
      sort: {
        created: 'DESC',
      },
      query: {
        bool: {
          must: {
            match: {
              paths: coop,
            },
          },
        },
      },
    };

    const result = await this.es.client.search({
      index,
      body: qy,
      size: 1,
    });

    if (
      result &&
      result.body &&
      result.body.hits &&
      result.body.hits.hits &&
      result.body.hits.hits[0]
    ) {
      // eslint-disable-next-line no-underscore-dangle
      return result.body.hits.hits[0]._source;
    }
    return null;
  }

  async getManyByMac(
    macIds: string[],
    range?: ESTimeRange,
    order?: 'asc' | 'desc',
  ): Promise<SearchHit<IOTSensorData>[]> {
    const query: any = {
      bool: {
        should: macIds.map((matchPath) => ({
          match_phrase: {
            paths: matchPath,
          },
        })),
        minimum_should_match: 1,
        must_not: [
          {
            match: {
              paths: 'sensors',
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
}
