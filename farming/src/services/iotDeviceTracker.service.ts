import { SearchResponse } from '@elastic/elasticsearch/api/types.d';
import { differenceInMinutes, subDays, subHours, subMinutes } from 'date-fns';
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';
import { Inject, Service } from 'fastify-decorators';
import { Between, In, IsNull, Not } from 'typeorm';
import { esEnv } from '../config/datasource';
import env from '../config/env';
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
import { IotTicketingStageUpsertQueue } from '../jobs/queues/iot-ticketing-stage-upsert.queue';
import { DEFAULT_TIME_ZONE, DEVICE_TYPE } from '../libs/constants';
import { IotTicketingStageDeviceJobData } from '../libs/interfaces/job-data';
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

  @Inject(IotTicketingStageUpsertQueue)
  private iotTicketingStageQueue!: IotTicketingStageUpsertQueue;

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

    const offlineDevices: Partial<IotTicketingStageDeviceJobData>[] = [];
    const onlineDevices: Partial<IotTicketingStageDeviceJobData>[] = [];

    const [iotDevices] = await this.iotDeviceDAO.getMany({
      where: {
        deletedDate: IsNull(),
        coopId: Not(IsNull()),
      },
      relations: {
        coop: true,
      },
    });

    const uniqueIotDevices = Array.from(
      new Map(iotDevices.map((iotDevice) => [iotDevice.mac, iotDevice])).values(),
    );

    const offlineTrackers: Partial<IotDeviceTracker>[] = [];

    const upsertTracker = async (iotDevice: IotDevice) => {
      const queryParams = {
        bool: {
          must: [
            {
              match: {
                paths: iotDevice.mac,
              },
            },
          ],
        },
      };

      if (iotDevice.coop.coopCode) {
        const coopCode = `f${iotDevice.coop.coopCode.substring(
          iotDevice.coop.coopCode.length - 4,
          iotDevice.coop.coopCode.length,
        )}`;

        queryParams.bool.must.push({
          match: {
            paths: coopCode,
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
            gte: zonedTimeToUtc(startDate, DEFAULT_TIME_ZONE),
            lte: zonedTimeToUtc(endDate, DEFAULT_TIME_ZONE),
          },
        },
      });

      const latestTracker = await this.iotDeviceTrackerDAO.getOne({
        where: {
          iotDeviceId: iotDevice.id,
          backOnlineTime: IsNull(),
        },
      });

      let lastOnlineTime = startDate;

      if (latestTracker) {
        lastOnlineTime = latestTracker.lastOnlineTime;
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
            const onlineTime = utcToZonedTime(new Date(report._source.created), DEFAULT_TIME_ZONE);

            if (Math.abs(differenceInMinutes(lastOnlineTime, onlineTime)) > 30) {
              const currentTracker = {
                iotDeviceId: iotDevice.id,
                isOnline: true,
                lastOnlineTime,
                backOnlineTime: onlineTime,
              };

              if (latestTracker && !latestTracker.backOnlineTime) {
                offlineTrackers.push({
                  ...currentTracker,
                  id: latestTracker.id,
                });
              } else {
                offlineTrackers.push(currentTracker);
              }
            }

            lastOnlineTime = onlineTime;
          }
        });
      } else {
        offlineTrackers.push({
          id: latestTracker?.id,
          iotDeviceId: iotDevice.id,
          isOnline: false,
          lastOnlineTime,
        });
      }

      if (subMinutes(new Date(), 30) > lastOnlineTime) {
        offlineDevices.push({ ...iotDevice, lastOnlineTime });
      } else {
        onlineDevices.push({ ...iotDevice, lastOnlineTime });
      }

      return offlineTrackers;
    };

    await Promise.all(uniqueIotDevices.map(async (i) => upsertTracker(i)));

    if (offlineDevices.length > 0) {
      const offlineIds = offlineDevices.map((offDevice) => offDevice.id);

      await this.iotDeviceDAO.updateDevicesSensors({ id: In(offlineIds) }, { isOnline: false });

      // Add condition to filter which devices are need iotTicket creation
      const offDeviceNeedIotTickets: Partial<IotTicketingStageDeviceJobData>[] = [];
      offlineDevices.forEach((offDevice) => {
        if (
          offDevice.id &&
          offDevice.coop?.activeFarmingCycleId !== null &&
          offDevice.status &&
          offDevice.deviceType === DEVICE_TYPE.SMART_MONITORING.value
        ) {
          offDeviceNeedIotTickets.push(offDevice);
        }
      });

      // TODO: (iot-ticketing): remove feature flags once the feature is stable
      if (offDeviceNeedIotTickets.length > 0 && env.FEATURE_FLAG_IOT_TICKETING_STAGE) {
        await this.iotTicketingStageQueue.addJob({
          devices: offDeviceNeedIotTickets,
          type: 'offline',
        });
      }
    }

    if (onlineDevices.length > 0) {
      const onlineIds = onlineDevices.map((onDevice) => onDevice.id);

      await this.iotDeviceDAO.updateDevicesSensors(
        { id: In(onlineIds) },
        { isOnline: true, status: true },
      );

      // Add condition to filter which devices are need to update existing iotTicket status
      const onDeviceNeedIotTickets: Partial<IotTicketingStageDeviceJobData>[] = [];
      onlineDevices.forEach((onDevice) => {
        if (
          onDevice.id &&
          onDevice.coop?.activeFarmingCycleId !== null &&
          onDevice.status &&
          onDevice.deviceType === DEVICE_TYPE.SMART_MONITORING.value
        ) {
          onDeviceNeedIotTickets.push(onDevice);
        }
      });

      // TODO: (iot-ticketing): remove feature flags once the feature is stable
      if (onDeviceNeedIotTickets.length > 0 && env.FEATURE_FLAG_IOT_TICKETING_STAGE) {
        await this.iotTicketingStageQueue.addJob({
          devices: onDeviceNeedIotTickets,
          type: 'online',
        });
      }
    }

    return this.iotDeviceTrackerDAO.upsertMany(offlineTrackers);
  }
}
