/* eslint-disable no-underscore-dangle */
import { SearchResponse } from '@elastic/elasticsearch/api/types.d';
import { addMinutes, format, subDays } from 'date-fns';
import { Inject, Service } from 'fastify-decorators';
import { IsNull } from 'typeorm';
import { esEnv } from '../../config/datasource';
import { IotDeviceDAO } from '../../dao/IotDevice.dao';
import { RoomDAO } from '../../dao/room.dao';
import { ElasticSearchConnection } from '../../datasources/connection/elasticsearch.connection';
import { Room } from '../../datasources/entity/pgsql/Room.entity';
import {
  GetB2BHistoricalDataQuery,
  GetB2BHistoricalDataResponseItem,
} from '../../dto/b2b/b2b.historicalData.dto';
import { DeviceReportData } from '../../dto/devicesSensors.dto';
import { IOT_SENSOR_INDEX, TIME_HH_MM } from '../../libs/constants';

@Service()
export class B2BHistoricalDataService {
  @Inject(IotDeviceDAO)
  private iotDeviceDAO: IotDeviceDAO;

  @Inject(ElasticSearchConnection)
  private es: ElasticSearchConnection;

  @Inject(RoomDAO)
  private roomDAO: RoomDAO;

  async getB2BHistoricalData(
    filter: GetB2BHistoricalDataQuery,
  ): Promise<GetB2BHistoricalDataResponseItem | null> {
    const endDate = filter.end ? new Date(filter.end) : new Date();
    const startDate = filter.start ? new Date(filter.start) : subDays(new Date(), 1);
    const room = await this.roomDAO.getOneStrict({
      where: { id: filter.roomId },
      relations: {
        roomType: true,
      },
    });

    const [devices] = await this.iotDeviceDAO.getMany({
      where: {
        roomId: filter.roomId,
        deviceType: filter.deviceType,
        deletedDate: IsNull(),
      },
    });

    if (devices.length === 0) {
      return null;
    }

    const queryParams = {
      bool: {
        must: devices.map((item) => ({
          match: {
            paths: item.mac,
          },
        })),
      },
    };

    devices.forEach((device) => {
      if (device.coop && device.coop.coopCode) {
        queryParams.bool.must.push({
          match: {
            paths: device.coop.coopCode,
          },
        });
      }
    });

    const query: any = {
      bool: {
        must: [queryParams],

        filter: [
          {
            match_phrase: {
              _index: esEnv.ES_IDX_IOT,
            },
          },
          {
            range: {
              created: {
                format: 'strict_date_optional_time',
                gte: startDate,
                lte: endDate,
              },
            },
          },
        ],
      },
    };

    const result = await this.es.client.search<SearchResponse<DeviceReportData>>({
      index: esEnv.ES_IDX_IOT,
      body: {
        sort: [{ created: { order: 'asc' } }],
        query,
      },
      size: 10000,
      rest_total_hits_as_int: true,
    });

    const historical: Record<string, any>[] = [];

    let temperature: { [key: string]: number[] } = {};
    let humidity: { [key: string]: number[] } = {};
    let lamp: number[] = [];
    let ammonia: number[] = [];
    let windSpeed: number[] = [];
    let curDate = startDate;
    let nextDate = addMinutes(startDate, filter.interval);

    result.body.hits.hits.forEach((report) => {
      if (report._source) {
        const created = new Date(report._source.created);

        if (created > nextDate) {
          const avgTemperatures: { [key: string]: number } = {};
          const avgHumidities: { [key: string]: number } = {};
          const avgLamp = lamp.length
            ? {
                'Lux Sensor': lamp.reduce((a, b) => a + b) / lamp.length,
              }
            : 0;
          const avgAmmonia = ammonia.length
            ? {
                'Ammonia Sensor': ammonia.reduce((a, b) => a + b) / ammonia.length,
              }
            : 0;
          const avgwindSpeed = windSpeed.length
            ? {
                'Wind Sensor': windSpeed.reduce((a, b) => a + b) / windSpeed.length,
              }
            : 0;

          Object.entries(temperature).forEach(([, values], index) => {
            avgTemperatures[`Sensor ${index + 1}`] = values.reduce((a, b) => a + b) / values.length;
          });

          Object.entries(humidity).forEach(([, values], index) => {
            avgHumidities[`Sensor ${index + 1}`] = values.reduce((a, b) => a + b) / values.length;
          });

          const curHistorical = historical.find(
            (data) => data.time === format(curDate, TIME_HH_MM),
          );

          if (curHistorical) {
            curHistorical.temperature = {
              ...curHistorical.temperature,
              ...avgTemperatures,
            };
            curHistorical.humidity = {
              ...curHistorical.humidity,
              ...avgHumidities,
            };
            if (lamp.length > 0) {
              curHistorical.lamp = {
                ...curHistorical.lamp,
                ...avgLamp,
              };
            }
            if (ammonia.length > 0) {
              curHistorical.ammonia = {
                ...curHistorical.ammonia,
                ...avgAmmonia,
              };
            }
            if (windSpeed.length > 0) {
              curHistorical.windSpeed = {
                ...curHistorical.windSpeed,
                ...avgwindSpeed,
              };
            }
          } else {
            historical.push({
              time: curDate.toISOString(),
              temperature: avgTemperatures,
              humidity: avgHumidities,
              lamp: lamp.length
                ? {
                    'Lux Sensor': lamp.reduce((a, b) => a + b) / lamp.length,
                  }
                : {},
              ammonia: ammonia.length
                ? {
                    'Ammonia Sensor': ammonia.reduce((a, b) => a + b) / ammonia.length,
                  }
                : {},
              windSpeed: windSpeed.length
                ? {
                    'Wind Sensor': windSpeed.reduce((a, b) => a + b) / windSpeed.length,
                  }
                : {},
            });
          }

          temperature = {};
          humidity = {};
          lamp = [];
          ammonia = [];
          windSpeed = [];

          curDate = nextDate;
          nextDate = addMinutes(nextDate, filter.interval);
        }
        if (report && report._source && report._source.sensors) {
          Object.entries(report._source.sensors).forEach(([key, value]) => {
            if (key.startsWith(IOT_SENSOR_INDEX.CLIMATE) && typeof value === 'object') {
              const idx = `${key}.${value?.id}`;
              if (!temperature[idx]) {
                temperature[idx] = [];
              }

              if (!humidity[idx]) {
                humidity[idx] = [];
              }

              temperature[idx].push(value?.t || 0);
              humidity[idx].push(value?.h || 0);
            }
            if (key.startsWith(IOT_SENSOR_INDEX.LUX)) {
              lamp.push(Number(value));
            }
            if (key.startsWith(IOT_SENSOR_INDEX.AMMONIA)) {
              ammonia.push(Number(value));
            }
            if (key.startsWith(IOT_SENSOR_INDEX.WIND)) {
              windSpeed.push(Number(value));
            }
          });
        }
      }
    });

    const historicalData = historical.sort((n1, n2) => {
      if (n1.time > n2.time) {
        return 1;
      }

      if (n1.time < n2.time) {
        return -1;
      }

      return 0;
    });

    const mappedData = this.mapDataToDTO(historicalData, room);

    return mappedData;
  }

  // eslint-disable-next-line class-methods-use-this
  private mapDataToDTO(data: Record<string, any>[], room: Room): GetB2BHistoricalDataResponseItem {
    if (data.length === 0) {
      return {
        room,
        lamp: null,
        ammonia: null,
        humidity: null,
        windSpeed: null,
        temperature: null,
      };
    }
    // Create an object to store the transformed data
    const transformedData: Record<string, any> = {};

    // Iterate through each object in the initial array
    data.forEach((item: Record<string, any>) => {
      // Iterate through each key in the item
      Object.entries(item).forEach(([key, value]) => {
        // Skip the "time" key
        if (key === 'time') {
          return;
        }

        // Create the category key (e.g., "Sensor 1")
        const categoryKey = Object.keys(value as string)[0];

        // Initialize the category if it doesn't exist
        if (!transformedData[key]) {
          transformedData[key] = {
            categories: [],
            data: [],
          };
        }

        // Add the category to the "categories" array if it's not already there
        if (categoryKey && !transformedData[key].categories.includes(categoryKey)) {
          transformedData[key].categories.push(categoryKey);
        }

        // Add the data entry
        if (key === 'temperature') {
          transformedData[key].data.push({
            time: item.time,
            [categoryKey]: parseFloat((value[categoryKey] / 10)?.toFixed(2) || '') || null,
          });
        } else if (key === 'humidity' || key === 'lamp') {
          transformedData[key].data.push({
            time: item.time,
            [categoryKey]: Math.round(value[categoryKey]) || null,
          });
        } else {
          transformedData[key].data.push({
            time: item.time,
            [categoryKey]: parseFloat(value[categoryKey]?.toFixed(2) || '') || null,
          });
        }
      });
    });

    return {
      room,
      lamp: transformedData?.lamp || null,
      ammonia: transformedData?.ammonia || null,
      humidity: transformedData?.humidity || null,
      windSpeed: transformedData?.windSpeed || null,
      temperature: transformedData?.temperature || null,
    } as unknown as GetB2BHistoricalDataResponseItem;
  }
}
