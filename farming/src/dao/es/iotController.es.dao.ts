import { ApiResponse } from '@elastic/elasticsearch';
import { SearchHit, SearchResponse } from '@elastic/elasticsearch/api/types.d';
import { Inject, Service } from 'fastify-decorators';
import { esEnv } from '../../config/datasource';
import { ElasticSearchConnection } from '../../datasources/connection/elasticsearch.connection';
import { Logger } from '../../libs/utils/logger';
import { IotDeviceDAO } from '../IotDevice.dao';
import { ESTimeRange } from '../iotSensor.dao';

@Service()
export class IotControllerESDAO {
  @Inject(ElasticSearchConnection)
  private es!: ElasticSearchConnection;

  @Inject(Logger)
  private logger!: Logger;

  @Inject(IotDeviceDAO)
  private iotDeviceDAO!: IotDeviceDAO;

  async saveToElastic<T>(
    mac: string,
    data: T,
    timestamp: string | number | Date,
  ): Promise<ApiResponse<Record<string, any>, unknown>> {
    try {
      let coopCode;
      const device = await this.iotDeviceDAO.getOne({
        relations: {
          room: true,
          coop: true,
        },
        where: {
          mac: mac.toLowerCase(),
        },
      });

      if (device && device.coop && device.coop.coopCode) {
        const tempCoop = device.coop.coopCode;
        coopCode = `f${tempCoop?.substring(tempCoop.length - 4, tempCoop.length)}`;
      }

      const result = await this.es.client.index({
        index: 'iot-controller',
        body: {
          ...data,
          paths: [mac, coopCode, device?.room.roomCode],
          created: new Date(timestamp).toISOString(),
        },
      });
      return result;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async getManyByMac(
    macIds: string[],
    size?: number,
    range?: ESTimeRange,
    order?: 'asc' | 'desc',
    type?: 'sensors' | 'settings',
  ): Promise<SearchHit<any>[]> {
    const query: any = {
      bool: {
        must: macIds.map((macId) => ({
          match_phrase: {
            paths: macId,
          },
        })),
        filter: [
          {
            match_phrase: {
              _index: esEnv.ES_IDX_IOT_CONTROLLER,
            },
          },
        ],
      },
    };

    if (type && type === 'sensors') {
      query.bool.filter.push({
        bool: {
          must: [{ exists: { field: 'temp' } }, { exists: { field: 'humi' } }],
        },
      });
    }

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

    const result = await this.es.client.search<SearchResponse<any>>({
      index: esEnv.ES_IDX_IOT_CONTROLLER,
      request_cache: false,
      body: {
        sort,
        query,
      },
      size,
    });

    return result.body.hits.hits;
  }

  async getCoolerSettingsState(macId: string): Promise<boolean> {
    const query = {
      bool: {
        filter: [
          {
            bool: {
              should: [
                {
                  match_phrase: {
                    'paths.keyword': macId,
                  },
                },
              ],
              minimum_should_match: 1,
            },
          },
          {
            range: {
              created: {
                format: 'strict_date_optional_time',
                lte: 'now',
              },
            },
          },
          {
            exists: {
              field: 'cooler.states',
            },
          },
        ],
      },
    };

    const result = await this.es.client.search<SearchResponse<any>>({
      index: esEnv.ES_IDX_IOT_CONTROLLER,
      request_cache: false,
      body: {
        size: 1,
        sort: [{ created: 'desc' }],
        query,
      },
    });

    // eslint-disable-next-line no-underscore-dangle
    const raw = result.body.hits.hits[0]?._source;
    if (!raw) {
      return false;
    }

    const data = raw.cooler;
    if (!data || !data.length) {
      return false;
    }

    const state = data[data.length - 1]?.states;
    if (!state) {
      return false;
    }

    const status = state?.split('|');
    if (status && status[1] && status[1] === 'on') {
      return true;
    }

    return false;
  }

  async getHeaterSettingsState(macId: string): Promise<boolean> {
    const query = {
      bool: {
        filter: [
          {
            bool: {
              should: [
                {
                  match_phrase: {
                    'paths.keyword': macId,
                  },
                },
              ],
              minimum_should_match: 1,
            },
          },
          {
            range: {
              created: {
                format: 'strict_date_optional_time',
                lte: 'now',
              },
            },
          },
          {
            exists: {
              field: 'heater.states',
            },
          },
        ],
      },
    };

    const result = await this.es.client.search<SearchResponse<any>>({
      index: esEnv.ES_IDX_IOT_CONTROLLER,
      request_cache: false,
      body: {
        size: 1,
        sort: [{ created: 'desc' }],
        query,
      },
    });

    // eslint-disable-next-line no-underscore-dangle
    const raw = result.body.hits.hits[0]?._source;
    if (!raw) {
      return false;
    }

    const data = raw.heater;
    if (!data || !data.length) {
      return false;
    }

    const state = data[data.length - 1]?.states;
    if (!state) {
      return false;
    }

    const status = state?.split('|');
    if (status && status[1] && status[1] === 'on') {
      return true;
    }

    return false;
  }

  async getLampSettingsState(macId: string): Promise<boolean> {
    const query = {
      bool: {
        filter: [
          {
            bool: {
              should: [
                {
                  match_phrase: {
                    'paths.keyword': macId,
                  },
                },
              ],
              minimum_should_match: 1,
            },
          },
          {
            range: {
              created: {
                format: 'strict_date_optional_time',
                lte: 'now',
              },
            },
          },
          {
            exists: {
              field: 'lamp.states',
            },
          },
        ],
      },
    };

    const result = await this.es.client.search<SearchResponse<any>>({
      index: esEnv.ES_IDX_IOT_CONTROLLER,
      request_cache: false,
      body: {
        size: 1,
        sort: [{ created: 'desc' }],
        query,
      },
    });

    // eslint-disable-next-line no-underscore-dangle
    const raw = result.body.hits.hits[0]?._source;
    if (!raw) {
      return false;
    }

    const data = raw.lamp;
    if (!data || !data.length) {
      return false;
    }

    const state = data[data.length - 1]?.states;
    if (!state) {
      return false;
    }

    const status = state?.split('|');
    if (status && status[1] && status[1] === 'on') {
      return true;
    }

    return false;
  }

  async getFanSettingsState(macId: string, num: number): Promise<boolean> {
    const query = {
      bool: {
        filter: [
          {
            bool: {
              should: [
                {
                  match_phrase: {
                    'paths.keyword': macId,
                  },
                },
              ],
              minimum_should_match: 1,
            },
          },
          {
            range: {
              created: {
                format: 'strict_date_optional_time',
                lte: 'now',
              },
            },
          },
          {
            exists: {
              field: `fan.fan${num}.states`,
            },
          },
        ],
      },
    };

    const result = await this.es.client.search<SearchResponse<any>>({
      index: esEnv.ES_IDX_IOT_CONTROLLER,
      request_cache: false,
      body: {
        size: 1,
        sort: [{ created: 'desc' }],
        query,
      },
    });

    // eslint-disable-next-line no-underscore-dangle
    const raw = result.body.hits.hits[0]?._source;
    if (!raw) {
      return false;
    }

    const data = raw.fan[`fan${num}`];
    if (!data || !data.length) {
      return false;
    }

    const state = data[data.length - 1]?.states;
    if (!state) {
      return false;
    }

    const status = state?.split('|');
    if (status && status[1] && status[1] === 'on') {
      return true;
    }

    return false;
  }
}
