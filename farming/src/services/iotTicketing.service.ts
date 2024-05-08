import { sub } from 'date-fns';
import { format as formatTZ } from 'date-fns-tz';
import { Inject, Service } from 'fastify-decorators';
import { IsNull, Not } from 'typeorm';
import { SensorESDAO } from '../dao/es/sensor.es.dao';
import { IotDeviceDAO } from '../dao/IotDevice.dao';
import { IotTicketingDAO } from '../dao/iotTicketing.dao';
import { IotTicketingHistoryDAO } from '../dao/iotTicketingHistory.dao';
import { IOTSensors } from '../datasources/entity/elasticsearch/IOTSensorData.entity';
import { IotTicketing } from '../datasources/entity/pgsql/IotTicketing.entity';
import {
  TicketingAssignBodyPayload,
  TicketingBoydPayload,
  TicketingItemsResponse,
  TicketingQuery,
  TicketingResponseDetail,
  TicketingResponseList,
  TicketingResponseSingle,
} from '../dto/iotTicketing.dto';
import { TicketingHistoryItemsDTO } from '../dto/iotTicketingHistory.dto';
import {
  DATETIME_SQL_FORMAT,
  DEFAULT_TIME_ZONE,
  DEVICE_TYPE,
  TICKETING_STATUS,
} from '../libs/constants';
import { DEVICE_SENSOR_ERRORS } from '../libs/constants/deviceSensor';
import { IOT_DEVICES } from '../libs/constants/elasticIndex';
import { ERR_ASSIGN_PIC } from '../libs/constants/errors';
import { RequestUser } from '../libs/types/index.d';
import { toSensorCode } from '../libs/utils/helpers';

@Service()
export class IotTicketingService {
  @Inject(IotTicketingDAO)
  private iotTicketingDAO!: IotTicketingDAO;

  @Inject(IotTicketingHistoryDAO)
  private iotTicketingHistoryDAO!: IotTicketingHistoryDAO;

  @Inject(SensorESDAO)
  private sensorESDAO!: SensorESDAO;

  @Inject(IotDeviceDAO)
  private iotDeviceDAO!: IotDeviceDAO;

  async getAll(filter: TicketingQuery): Promise<TicketingResponseList> {
    const [ticketing, count] = await this.iotTicketingDAO.searchTicketing(filter);

    const deviceStatus = await this.iotTicketingDAO.getCountDeviceByStatus();

    return {
      count,
      deviceStatus,
      data: ticketing.map<TicketingResponseSingle>(
        (d): TicketingResponseSingle => ({
          ...d,
          macAddress: d.iotDevice.mac,
          deviceId: d.iotDevice.deviceId,
          deviceType:
            DEVICE_TYPE[`${d.iotDevice.deviceType}`].text || DEVICE_TYPE.SMART_MONITORING.text,
          coopCode: d.iotDevice.coop.coopCode,
          farmId: d.iotDevice && d.iotDevice.coop.farm && d.iotDevice.coop.farm.id,
          farmName: d.iotDevice && d.iotDevice.coop.farm && d.iotDevice.coop.farm.farmName,
          branchId: (d.iotDevice && d.iotDevice.coop && d.iotDevice.coop.farm.branch?.id) || null,
          branchName:
            (d.iotDevice && d.iotDevice.coop && d.iotDevice.coop.farm.branch?.name) || null,
          buildingName: d.iotDevice.room?.building?.name || '',
          roomName: d.iotDevice.room.roomType?.name || '',
          incident:
            d.iotDevice.errorCode
              ?.map((e): string => (e ? DEVICE_SENSOR_ERRORS[Number(e)] : 'N/A'))
              .join(',') || null,
          pic: d.userPIC?.fullName || null,
          action: 'N/A',
          createdOn: formatTZ(new Date(d.createdOn), DATETIME_SQL_FORMAT, {
            timeZone: DEFAULT_TIME_ZONE,
          }),
          createdDate: formatTZ(new Date(d.createdDate), DATETIME_SQL_FORMAT, {
            timeZone: DEFAULT_TIME_ZONE,
          }),
          modifiedDate: formatTZ(new Date(d.modifiedDate), DATETIME_SQL_FORMAT, {
            timeZone: DEFAULT_TIME_ZONE,
          }),
          modifiedBy: d.userModifier?.fullName || d.modifiedBy,
        }),
      ),
    };
  }

  async getOne(id: string): Promise<TicketingResponseDetail> {
    const formatDate = (date: Date) =>
      formatTZ(new Date(date), DATETIME_SQL_FORMAT, {
        timeZone: DEFAULT_TIME_ZONE,
      });

    const ticket = (await this.iotTicketingDAO.getOne({
      where: {
        id,
      },
      relations: {
        iotDevice: {
          coop: {
            farm: {
              branch: true,
            },
          },
          room: {
            roomType: true,
            building: {
              buildingType: true,
            },
          },
        },
        userPIC: true,
      },
    })) as IotTicketing;

    const { iotDevice, userPIC, createdOn, createdDate, modifiedDate, ...ticketInfo } = ticket;

    const history = await this.iotTicketingHistoryDAO.getManyTicketingHistory({
      where: {
        refTicketingId: id,
      },
      relations: {
        ticketing: true,
      },
      order: {
        createdDate: 'ASC',
      },
    });

    return {
      ...ticketInfo,
      macAddress: iotDevice.mac,
      deviceId: iotDevice.deviceId,
      deviceType: DEVICE_TYPE[`${iotDevice.deviceType}`].text || DEVICE_TYPE.SMART_MONITORING.text,
      coopCode: iotDevice.coop.coopCode,
      farmName: iotDevice.coop?.farm.farmName,
      branchName: iotDevice.coop?.farm?.branch?.name || null,
      buildingName: iotDevice.room?.building?.name || '',
      roomName: iotDevice.room?.roomType?.name || '',
      incident:
        iotDevice.errorCode
          ?.map((d): string => (d == null ? 'N/A' : DEVICE_SENSOR_ERRORS[Number(d)]))
          .join(',') || null,
      pic: userPIC?.fullName || null,
      action: 'N/A',
      createdOn: formatDate(createdOn),
      createdDate: formatDate(createdDate),
      modifiedDate: formatDate(modifiedDate),
      history: history.map(
        (h): Partial<TicketingHistoryItemsDTO> => ({
          ...h,
          timeAction: formatDate(h.timeAction),
          createdDate: formatDate(h.createdDate),
          modifiedDate: formatDate(h.modifiedDate),
        }),
      ),
    };
  }

  async createOne(_: TicketingBoydPayload, user: RequestUser): Promise<string> {
    const [device] = await this.iotDeviceDAO.getMany({
      where: {
        status: true,
        coop: {
          coopCode: Not(IsNull()),
        },
      },
      relations: {
        coop: true,
      },
    });

    const getOffline = await Promise.all(
      device.map(async (s: any) => {
        const history: Partial<IOTSensors | null> = await this.sensorESDAO.getOneCoop(
          IOT_DEVICES,
          toSensorCode(s.coop.coopCode),
        );

        // eslint-disable-next-line no-param-reassign
        s.statusDevice = false;

        const now = new Date();

        const lastData = sub(now, { minutes: -60 });

        if (history && history.created) {
          // eslint-disable-next-line no-param-reassign
          s.statusDevice = new Date(history.created) >= lastData;
        }

        return {
          ...s,
          history,
        };
      }),
    );

    const getCoopOffline = getOffline
      .filter(
        (obj, index, self) =>
          index === self.findIndex((o) => o.coop.coopCode === obj.coop.coopCode),
      )
      .map((s) => ({
        // TODO: check status dlu, jika sebelumnya open bisa langsung resolved
        status: !s.statusDevice ? TICKETING_STATUS.OPEN : TICKETING_STATUS.RESOLVED,
        refDeviceId: s.id,
        refUserId: user.id,
        createdOn: new Date(),
        notes: 'N/A',
      }));

    const createdTicket = await this.iotTicketingDAO.createMany(getCoopOffline, user);

    await this.iotTicketingHistoryDAO.createMany(
      createdTicket.map((ts) => ({
        actionStatus: ts.status,
        notes: 'N/A',
        timeAction: new Date(),
        refTicketingId: ts.id,
      })),
      user,
    );

    return 'OK';
  }

  async updateOne(
    input: TicketingBoydPayload,
    params: string,
    user: RequestUser,
  ): Promise<TicketingItemsResponse> {
    const ticket = await this.iotTicketingDAO.getOneStrict({ where: { id: params } });

    const ticketing = await this.iotTicketingDAO.updateOneIotTicketing(
      input,
      ticket,
      { id: params },
      user,
    );

    await this.iotTicketingHistoryDAO.createOne(
      {
        actionStatus: input.status,
        notes: input.notes || 'N/A',
        timeAction: new Date(),
        refTicketingId: params,
      },
      user,
    );

    return {
      ...ticketing,
      pic: ticketing.refUserId,
      createdOn: formatTZ(new Date(ticketing.createdOn), DATETIME_SQL_FORMAT, {
        timeZone: DEFAULT_TIME_ZONE,
      }),
      createdDate: formatTZ(new Date(ticketing.createdDate), DATETIME_SQL_FORMAT, {
        timeZone: DEFAULT_TIME_ZONE,
      }),
      modifiedDate: formatTZ(new Date(ticketing.modifiedDate), DATETIME_SQL_FORMAT, {
        timeZone: DEFAULT_TIME_ZONE,
      }),
    };
  }

  async assignTicket(
    input: TicketingAssignBodyPayload,
    params: string,
    user: RequestUser,
  ): Promise<TicketingItemsResponse> {
    const ticketing = await this.iotTicketingDAO.assignPIC(input, { id: params }, user);
    if (ticketing.status !== TICKETING_STATUS.OPEN) {
      throw ERR_ASSIGN_PIC();
    }

    return {
      ...ticketing,
      pic: ticketing.refUserId,
      createdOn: formatTZ(new Date(ticketing.createdOn), DATETIME_SQL_FORMAT, {
        timeZone: DEFAULT_TIME_ZONE,
      }),
      createdDate: formatTZ(new Date(ticketing.createdDate), DATETIME_SQL_FORMAT, {
        timeZone: DEFAULT_TIME_ZONE,
      }),
      modifiedDate: formatTZ(new Date(ticketing.modifiedDate), DATETIME_SQL_FORMAT, {
        timeZone: DEFAULT_TIME_ZONE,
      }),
    };
  }

  async unAssignTicket(params: string, user: RequestUser): Promise<TicketingItemsResponse> {
    const ticketing = await this.iotTicketingDAO.unAssignPIC({ id: params }, user);

    return {
      ...ticketing,
      pic: ticketing.refUserId,
      createdOn: formatTZ(new Date(ticketing.createdOn), DATETIME_SQL_FORMAT, {
        timeZone: DEFAULT_TIME_ZONE,
      }),
      createdDate: formatTZ(new Date(ticketing.createdDate), DATETIME_SQL_FORMAT, {
        timeZone: DEFAULT_TIME_ZONE,
      }),
      modifiedDate: formatTZ(new Date(ticketing.modifiedDate), DATETIME_SQL_FORMAT, {
        timeZone: DEFAULT_TIME_ZONE,
      }),
    };
  }
}
