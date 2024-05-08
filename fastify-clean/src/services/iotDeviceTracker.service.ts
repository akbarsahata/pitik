import { SearchResponse } from '@elastic/elasticsearch/api/types.d';
import { differenceInMinutes, subDays, subHours, subMinutes } from 'date-fns';
import { Inject, Service } from 'fastify-decorators';
import { Between, In, IsNull, Not } from 'typeorm';
import { esEnv } from '../config/datasource';
import { IotDeviceDAO } from '../dao/IotDevice.dao';
import { IotDeviceTrackerDAO } from '../dao/iotDeviceTracker.dao';
import { ElasticSearchConnection } from '../datasources/connection/elasticsearch.connection';
import { IotDevice } from '../datasources/entity/pgsql/IotDevice.entity';
import { IotDeviceTracker } from '../datasources/entity/pgsql/IotDeviceTracker.entity';
import { DeviceReportData } from '../dto/devicesSensors.dto';
import {
  IotDeviceTrackerInput,
  OfflineTrackerParams,
  OfflineTrackerReport,
} from '../dto/iotDeviceTracker.dto';
import { RequestUser } from '../libs/types/index.d';
import { generateOrderQuery } from '../libs/utils/helpers';

@Service()
export class IotDeviceTrackerService {
  @Inject(IotDeviceTrackerDAO)
  private iotDeviceTrackerDAO!: IotDeviceTrackerDAO;

  @Inject(IotDeviceDAO)
  iotDeviceDAO!: IotDeviceDAO;

  @Inject(ElasticSearchConnection)
  private es!: ElasticSearchConnection;

  async get(filter: OfflineTrackerParams): Promise<[OfflineTrackerReport[], number]> {
    interface grouped {
      iotDeviceId: String;
      totalOfflineMinutes: number;
      totalOfflineCount: number;
      iotDevice: IotDevice;
    }

    const groupedResult: grouped[] = [];
    const endDate = filter.endDate ? new Date(filter.endDate) : new Date();
    const startDate = filter.startDate ? new Date(filter.startDate) : subDays(endDate, 1);
    const limit: number = filter.$limit && filter.$limit > 0 ? filter.$limit : 10;
    const skip: number = !filter.$page || filter.$page < 1 ? 0 : (filter.$page - 1) * limit;
    const order = (filter.$order && generateOrderQuery(filter.$order)) || 'DESC';

    const [iotDeviceTrackers] = await this.iotDeviceTrackerDAO.getMany({
      where: {
        createdDate: Between(startDate, endDate),
        iotDevice: {
          coop: {
            id: filter.coopId,
            farm: {
              id: filter.farmId,
            },
          },
        },
      },
      relations: {
        iotDevice: {
          coop: {
            farm: true,
          },
          room: {
            roomType: true,
            building: {
              buildingType: true,
            },
          },
        },
      },
      order: {
        createdDate: order,
      },
    });

    iotDeviceTrackers.forEach((iotDeviceTracker) => {
      const offlineInMinutes = differenceInMinutes(
        iotDeviceTracker.backOnlineTime || new Date(),
        iotDeviceTracker.lastOnlineTime,
      );

      const current = groupedResult.find(
        (obj) => obj.iotDeviceId === iotDeviceTracker.iotDevice.id,
      );

      if (current) {
        current.totalOfflineCount += 1;
        current.totalOfflineMinutes += offlineInMinutes;
      } else {
        groupedResult.push({
          iotDeviceId: iotDeviceTracker.iotDevice.id,
          totalOfflineCount: 1,
          totalOfflineMinutes: offlineInMinutes,
          iotDevice: iotDeviceTracker.iotDevice,
        });
      }
    });

    const count = groupedResult.length;
    const returnResponse = groupedResult
      .map((groupedItem) => {
        const minutes = groupedItem.totalOfflineMinutes % 60;
        const hours = Math.floor(groupedItem.totalOfflineMinutes / 60);

        const offlineTime = `${`${hours}`.padStart(2, '0')}:${`${minutes}`.padStart(2, '0')}`;

        return {
          id: groupedItem.iotDevice.id,
          totalOfflineCount: groupedItem.totalOfflineCount,
          totalOfflineTime: offlineTime,
          status: groupedItem.iotDevice.status,
          isOnline: groupedItem.iotDevice.isOnline,
          mac: groupedItem.iotDevice.mac,
          firmwareVersion: groupedItem.iotDevice.firmWareVersion,
          coopCode: groupedItem.iotDevice.coop.coopCode,
          deviceId: groupedItem.iotDevice.deviceId,
          coopId: groupedItem.iotDevice.coopId as string,
          roomId: groupedItem.iotDevice.roomId as string,
          farmId: groupedItem.iotDevice.coop.farmId,
          coop: {
            id: groupedItem.iotDevice.coop.id,
            coopCode: groupedItem.iotDevice.coop.coopCode,
            coopName: groupedItem.iotDevice.coop.coopName,
            farm: {
              id: groupedItem.iotDevice.coop.farm.id,
              farmCode: groupedItem.iotDevice.coop.farm.farmCode,
              farmName: groupedItem.iotDevice.coop.farm.farmName,
            },
          },
          room: {
            id: groupedItem.iotDevice.room.id,
            roomCode: groupedItem.iotDevice.room.id,
            roomType: {
              id: groupedItem.iotDevice.room.roomType.id,
              name: groupedItem.iotDevice.room.roomType.name,
            },
            building: {
              id: groupedItem.iotDevice.room.building.id,
              name: groupedItem.iotDevice.room.building.name,
              buildingType: {
                id: groupedItem.iotDevice.room.building.buildingType.id,
                name: groupedItem.iotDevice.room.building.buildingType.name,
              },
            },
          },
          createdDate: groupedItem.iotDevice.createdDate.toISOString(),
          modifiedDate: groupedItem.iotDevice.modifiedDate.toISOString(),
        };
      })
      .slice(skip, skip + limit);

    return [returnResponse, count];
  }

  async createOne(input: IotDeviceTrackerInput, user: RequestUser): Promise<IotDeviceTracker> {
    return this.iotDeviceTrackerDAO.createOne(input, user);
  }

  async checkDeviceOffline(filterStartDate?: string, filterEndDate?: string) {
    const startDate = filterStartDate ? new Date(filterStartDate) : subHours(new Date(), 1);
    const endDate = filterEndDate ? new Date(filterEndDate) : new Date();

    const offlineIds: string[] = [];
    const onlineIds: string[] = [];

    const [iotDevices] = await this.iotDeviceDAO.getMany({
      where: {
        deletedDate: IsNull(),
        coopId: Not(IsNull()),
      },
      relations: {
        coop: true,
      },
    });

    const offlineTrackers: Partial<IotDeviceTracker>[] = [];

    const upsertTracker = async (iotDevice: IotDevice) => {
      const queryParams = {
        bool: {
          must: [
            {
              match: {
                paths: iotDevice.coop.coopCode,
              },
            },
          ],
        },
      };

      if (iotDevice.deviceId) {
        queryParams.bool.must.push({
          match: {
            paths: iotDevice.deviceId,
          },
        });
      }

      const query: any = {
        bool: {
          must: [queryParams],

          filter: [
            {
              match_phrase: {
                _index: esEnv.ES_IDX_IOT,
              },
            },
          ],
        },
      };

      query.bool.filter.unshift({
        range: {
          created: {
            format: 'strict_date_optional_time',
            gte: startDate,
            lte: endDate,
          },
        },
      });

      const currentTracker = await this.iotDeviceTrackerDAO.getOne({
        where: {
          iotDeviceId: iotDevice.id,
          backOnlineTime: IsNull(),
        },
      });

      let lastOnlineTime = startDate;

      if (currentTracker) {
        lastOnlineTime = currentTracker.lastOnlineTime;
      }

      const result = await this.es.client.search<SearchResponse<DeviceReportData>>({
        index: esEnv.ES_IDX_IOT,
        body: {
          sort: [{ created: 'asc' }],
          query,
        },
        rest_total_hits_as_int: true,
      });

      if (result.body.hits.hits.length > 0) {
        result.body.hits.hits.forEach((report) => {
          /* eslint-disable no-underscore-dangle */
          if (report._source) {
            const onlineTime = new Date(report._source.created);

            if (Math.abs(differenceInMinutes(lastOnlineTime, onlineTime)) > 30) {
              offlineTrackers.push({
                id: currentTracker?.id,
                iotDeviceId: iotDevice.id,
                isOnline: false,
                lastOnlineTime,
                backOnlineTime: onlineTime,
              });
            }

            lastOnlineTime = onlineTime;
          }
        });
      } else {
        offlineTrackers.push({
          iotDeviceId: iotDevice.id,
          isOnline: false,
          lastOnlineTime,
        });
      }

      if (subMinutes(new Date(), 30) > lastOnlineTime) {
        offlineIds.push(iotDevice.id);
      } else {
        onlineIds.push(iotDevice.id);
      }

      return offlineTrackers;
    };

    await Promise.all(iotDevices.map(async (i) => upsertTracker(i)));

    if (offlineIds.length > 0) {
      await this.iotDeviceDAO.updateDevicesSensors({ id: In(offlineIds) }, { isOnline: false });
    }

    if (onlineIds.length > 0) {
      await this.iotDeviceDAO.updateDevicesSensors({ id: In(onlineIds) }, { isOnline: true });
    }

    return this.iotDeviceTrackerDAO.upsertMany(offlineTrackers);
  }
}
