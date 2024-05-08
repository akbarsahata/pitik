/* eslint-disable guard-for-in */
import { SearchResponse } from '@elastic/elasticsearch/api/types.d';
import { addMinutes, format, subDays } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { Inject, Service } from 'fastify-decorators';
import { isIP } from 'net';
import { DeepPartial, In, IsNull, Not } from 'typeorm';
import { esEnv } from '../config/datasource';
import env from '../config/env';
import { AiNotifConfigDAO } from '../dao/aiNotifyConfig.dao';
import { ControllerTypeDAO } from '../dao/controllerType.dao';
import { FirmwareDAO } from '../dao/firmware.dao';
import { IotDeviceDAO } from '../dao/IotDevice.dao';
import { IOTSensorDAO } from '../dao/iotSensor.dao';
import { RoomDAO } from '../dao/room.dao';
import { ElasticSearchConnection } from '../datasources/connection/elasticsearch.connection';
import { MqttConnection } from '../datasources/connection/mqtt.connection';
import { RedisConnection } from '../datasources/connection/redis.connection';
import { StatsdConnection } from '../datasources/connection/statsd.connection';
import { IotDevice } from '../datasources/entity/pgsql/IotDevice.entity';
import { IotSensor } from '../datasources/entity/pgsql/IotSensor.entity';
import {
  AssignDeviceOtasBody,
  CreateDevicesSensorsBody,
  DeleteDeviceSensorsResponseItem,
  DeviceReportData,
  DeviceSensorsLocationQuery,
  DeviceSensorsLocationResponseItem,
  DevicesSensorsQuery,
  DevicesSensorsResponseItem,
  GetDeviceReportsQuery,
  HistoricalData,
  IotSensorItemBody,
  ResetIdDevicesSensorsBody,
  ResetIdDevicesSensorsResponseItem,
  SetIdDevicesSensorsBody,
  UpdateDevicesSensorsBody,
} from '../dto/devicesSensors.dto';
import { GenerateIotDeviceAlertQueue } from '../jobs/queues/generate-iot-device-alert.queue';
import {
  DATE_SQL_FORMAT,
  DEFAULT_TIME_ZONE,
  DEVICE_TYPE,
  IOT_SENSOR_INDEX,
  TIME_HH_MM,
} from '../libs/constants';
import { DEVICE_SENSOR_DELAY, DEVICE_SENSOR_ERRORS } from '../libs/constants/deviceSensor';
import {
  ERR_INVALID_IP,
  ERR_IOT_DEVICE_INCOMPLETE_INFRA,
  ERR_IOT_DEVICE_MAC_EXIST,
  ERR_IOT_SENSOR_CODE_EXIST,
  ERR_IOT_SENSOR_CODE_WRONG_FORMAT,
} from '../libs/constants/errors';
import { MAC_LENGTH } from '../libs/constants/mqttMessage';
import { ASSIGN_OTA_TOPIC, DEVICE_STATUS_TOPIC } from '../libs/constants/mqttTopic';
import { RequestUser } from '../libs/types/index.d';
import { generateOrderQuery, sleep, topicToMac } from '../libs/utils/helpers';
import { SmartCameraPublisher } from '../mqtt/publisher/smartCamera.publisher';

@Service()
export class DeviceSensorsService {
  @Inject(RedisConnection)
  redisConnection!: RedisConnection;

  @Inject(MqttConnection)
  private mqtt!: MqttConnection;

  @Inject(StatsdConnection)
  statsdConnection!: StatsdConnection;

  @Inject(IotDeviceDAO)
  iotDeviceDAO!: IotDeviceDAO;

  @Inject(IOTSensorDAO)
  iotSensorDAO!: IOTSensorDAO;

  @Inject(AiNotifConfigDAO)
  aiNotifConfigDAO!: AiNotifConfigDAO;

  @Inject(ControllerTypeDAO)
  controllerTypeDAO!: ControllerTypeDAO;

  @Inject(RoomDAO)
  roomDAO!: RoomDAO;

  @Inject(FirmwareDAO)
  firmwareDAO!: FirmwareDAO;

  @Inject(GenerateIotDeviceAlertQueue)
  generateIotDeviceAlertQueue: GenerateIotDeviceAlertQueue;

  @Inject(ElasticSearchConnection)
  private es!: ElasticSearchConnection;

  @Inject(SmartCameraPublisher)
  private smartCameraPublisher: SmartCameraPublisher;

  async getOne(id: string): Promise<DevicesSensorsResponseItem> {
    const devicesSensors = await this.iotDeviceDAO.getOneById(id);
    const [sensors] = await this.iotSensorDAO.getMany({
      where: {
        iotDeviceId: id,
        deletedDate: IsNull(),
      },
      relations: {
        room: {
          roomType: true,
          controllerType: true,
        },
      },
    });

    return {
      ...devicesSensors,
      coop: devicesSensors.coop ? devicesSensors.coop : undefined,
      room: devicesSensors.room ? devicesSensors.room : undefined,
      sensors: sensors.map((sensor) => ({
        ...sensor,
        ipCamera: sensor.additional?.ipCamera || '',
      })),
      errors:
        devicesSensors.errorCode?.map((val) => ({
          code: val,
          description: DEVICE_SENSOR_ERRORS[val as unknown as number],
        })) || [],
      createdDate: devicesSensors.createdDate.toISOString(),
      modifiedDate: devicesSensors.modifiedDate.toISOString(),
      registrationDate: devicesSensors.registrationDate.toISOString(),
    };
  }

  async getAll(filter: DevicesSensorsQuery): Promise<[DevicesSensorsResponseItem[], number]> {
    const limit: number = filter.$limit && filter.$limit > 0 ? filter.$limit : 10;
    const skip: number = !filter.$page || filter.$page < 1 ? 0 : (filter.$page - 1) * limit;
    const order = (filter.$order && generateOrderQuery(filter.$order)) || 'DESC';

    const [deviceSensors, count] = await this.iotDeviceDAO.getManyDevicesSensors({
      where: {
        deletedDate: IsNull(),
        ...(filter.status !== null && { status: filter.status }),
        ...(filter.isOnline !== null && { isOnline: filter.isOnline }),
        ...(filter.deviceType && { deviceType: filter.deviceType }),
        ...(filter.id && { id: filter.id }),
        ...(filter.phoneNumber && { phoneNumber: filter.phoneNumber }),
        ...(filter.mac && { mac: filter.mac }),
        ...(filter.firmWareVersion && { firmWareVersion: filter.firmWareVersion }),
        ...(filter.deviceId && { deviceId: filter.deviceId }),
        ...(filter.farmId && { farmId: filter.farmId }),
        ...(filter.coopId && { coopId: filter.coopId }),
        ...(filter.buildingId && { buildingId: filter.buildingId }),
        ...(filter.roomId && { roomId: filter.roomId }),
      },
      take: (filter.$limit !== 0 && limit) || undefined,
      skip,
      order: {
        createdDate: order,
      },
    });

    return [
      deviceSensors.map((device) => ({
        ...device,
        coop: device.coop ? device.coop : undefined,
        room: device.room ? device.room : undefined,
        registrationDate: device.registrationDate.toISOString(),
        createdDate: device.createdDate.toISOString(),
        modifiedDate: device.modifiedDate.toISOString(),
        sensors: device.sensors.map((sensor) => ({
          ...sensor,
          ipCamera: sensor.additional?.ipCamera || '',
        })),
        errors:
          device.errorCode?.map((val) => ({
            code: val,
            description: DEVICE_SENSOR_ERRORS[val as unknown as number],
          })) || [],
      })),
      count,
    ];
  }

  // eslint-disable-next-line class-methods-use-this
  getDeviceTypesArray(): { text: string; value: string }[] {
    const deviceTypes = Object.values<{ text: string; value: string }>(DEVICE_TYPE);

    return deviceTypes;
  }

  async getDeviceSensorLocation(
    query: DeviceSensorsLocationQuery,
  ): Promise<DeviceSensorsLocationResponseItem> {
    const device = await this.iotDeviceDAO.getOneStrict({
      where: {
        mac: query.mac,
        deletedDate: IsNull(),
      },
      relations: {
        room: true,
        coop: true,
      },
    });

    return {
      mac: device.mac,
      coopId: device.coop.id,
      roomCode: device.room.roomCode,
    };
  }

  async createDeviceSensors(
    input: CreateDevicesSensorsBody,
    user: RequestUser,
  ): Promise<DevicesSensorsResponseItem> {
    if (input.farmId) {
      if (!input.coopId || !input.buildingId || !input.roomId) {
        throw ERR_IOT_DEVICE_INCOMPLETE_INFRA();
      }
    }

    const queryRunner = await this.iotDeviceDAO.startTransaction();

    try {
      const existingDevice = await this.iotDeviceDAO.getOne({
        where: {
          mac: input.mac,
          deletedDate: IsNull(),
        },
      });
      if (existingDevice) {
        throw ERR_IOT_DEVICE_MAC_EXIST();
      }

      let transactionHooks: Function[] = [];

      if (input.sensors) {
        const sensorCodes = input.sensors.map((sensor) => sensor.sensorCode);

        const [, existingSensorsCount] = await this.iotSensorDAO.getMany({
          where: {
            sensorCode: In(sensorCodes),
            deletedDate: IsNull(),
          },
        });

        if (existingSensorsCount > 0) {
          throw ERR_IOT_SENSOR_CODE_EXIST();
        }

        for (let i = 0; i < input.sensors.length; i += 1) {
          const sensor = input.sensors[i];

          DeviceSensorsService.validateSensorCode(sensor.sensorType, sensor.sensorCode);
        }

        transactionHooks = input.sensors.map((sensor) =>
          this.iotSensorDAO.wrapUpsertHook(
            sensor.sensorCode,
            sensor.sensorType,
            sensor.position,
            sensor.status,
            sensor.roomId,
            user.id,
            sensor.ipCamera
              ? {
                  ipCamera: sensor.ipCamera,
                }
              : undefined,
          ),
        );
      }

      const device = await this.iotDeviceDAO.createOneWithTx(
        {
          phoneNumber: input.phoneNumber,
          status: input.status,
          isOnline: input.isOnline,
          mac: input.mac,
          firmWareVersion: input.firmWareVersion,
          sensors: input.sensors,
          deviceType: input.deviceType,
          deviceId: input.deviceId || input.mac.replace(/:/g, '').toLowerCase(),
          ...(input.farmId && { farmId: input.farmId }),
          ...(input.coopId && { coopId: input.coopId }),
          ...(input.buildingId && { buildingId: input.buildingId }),
          ...(input.roomId && { roomId: input.roomId }),
          ...(input.totalFan && { totalFan: input.totalFan }),
          ...(input.totalCamera && { totalCamera: input.totalCamera }),
          ...(input.heaterId && { heaterId: input.heaterId }),
          ...(input.coolingPad && { coolingPad: input.coolingPad }),
          ...(input.lamp && { lamp: input.lamp }),
        },
        user,
        queryRunner,
        transactionHooks,
      );

      if (input.controllerTypeId && input.roomId) {
        const controllerType = await this.controllerTypeDAO.getOneStrict({
          where: {
            id: input.controllerTypeId,
          },
        });

        const room = await this.roomDAO.getOneStrict({
          where: {
            id: input.roomId,
          },
        });

        await this.roomDAO.upsertOne(user, {
          ...room,
          controllerTypeId: controllerType.id,
        });
      }

      switch (device.deviceType) {
        case DEVICE_TYPE.SMART_CAMERA.value:
          this.registerSmartCamera(input);
          break;

        default:
          this.registerSmartMonitoring(device);
          break;
      }

      await this.iotSensorDAO.commitTransaction(queryRunner);

      const createdDeviceSensor = await this.getOne(device.id);

      return {
        ...createdDeviceSensor,
        sensors: createdDeviceSensor.sensors.map((sensor) => ({
          ...sensor,
          ipCamera: sensor.additional?.ipCamera || '',
        })),
        coop: createdDeviceSensor.coop ? createdDeviceSensor.coop : undefined,
        room: createdDeviceSensor.room ? createdDeviceSensor.room : undefined,
        errors: createdDeviceSensor.errors ? createdDeviceSensor.errors : [],
      };
    } catch (error) {
      await this.iotSensorDAO.rollbackTransaction(queryRunner);

      throw error;
    }
  }

  async updateDeviceSensors(
    id: string,
    input: UpdateDevicesSensorsBody,
    user: RequestUser,
  ): Promise<DevicesSensorsResponseItem> {
    if (input.farmId) {
      if (!input.coopId || !input.buildingId || !input.roomId) {
        throw ERR_IOT_DEVICE_INCOMPLETE_INFRA();
      }
    }

    const existingDevice = await this.iotDeviceDAO.getOneStrict({ where: { id } });

    if (existingDevice.mac !== input.mac) {
      const existingMac = await this.iotDeviceDAO.getOne({ where: { mac: input.mac } });

      if (existingMac) {
        throw ERR_IOT_DEVICE_MAC_EXIST(`on device id: ${existingMac.id}`);
      }
    }

    const queryRunner = await this.iotDeviceDAO.startTransaction();

    try {
      if (input.sensors) {
        const sensorCodes = input.sensors.map((sensor) => sensor.sensorCode);

        const [, existingSensorsCount] = await this.iotSensorDAO.getMany({
          where: {
            iotDeviceId: Not(id),
            sensorCode: In(sensorCodes),
            deletedDate: IsNull(),
          },
        });

        if (existingSensorsCount > 0) {
          throw ERR_IOT_SENSOR_CODE_EXIST();
        }

        for (let i = 0; i < input.sensors.length; i += 1) {
          const sensor = input.sensors[i];

          DeviceSensorsService.validateSensorCode(sensor.sensorType, sensor.sensorCode);
        }
      }

      const [existingSensors] = await this.iotSensorDAO.getMany({
        where: {
          iotDeviceId: id,
        },
      });

      const cameraSensorIds = existingSensors.reduce((prev, sensor) => {
        if (sensor.sensorType === 'CAMERA') return [...prev, sensor.id];

        return prev;
      }, [] as string[]);

      await this.aiNotifConfigDAO.deleteMany({
        sensorId: In(cameraSensorIds),
      });

      await this.iotSensorDAO.deleteByIotDeviceId(id);

      await this.iotSensorDAO.upsertManySensors(
        user,
        input.sensors.map<DeepPartial<IotSensorItemBody>>((sensor) => ({
          ...sensor,
          iotDeviceId: id,
          additional: sensor.ipCamera
            ? {
                ipCamera: sensor.ipCamera,
              }
            : {},
        })),
        {
          qr: queryRunner,
        },
      );

      await this.iotDeviceDAO.updateOneWithTx(
        { id },
        {
          phoneNumber: input.phoneNumber,
          status: input.status,
          isOnline: input.isOnline,
          mac: input.mac,
          firmWareVersion: input.firmWareVersion,
          deviceType: input.deviceType,
          deviceId: input.deviceId,
          ...(input.farmId && { farmId: input.farmId }),
          ...(input.coopId && { coopId: input.coopId }),
          ...(input.buildingId && { buildingId: input.buildingId }),
          ...(input.roomId && { roomId: input.roomId }),
          ...(input.totalFan && { totalFan: input.totalFan }),
          ...(input.totalCamera && { totalCamera: input.totalCamera }),
          ...(input.heaterId && { heaterId: input.heaterId }),
          ...(input.coolingPad !== null && { coolingPad: input.coolingPad }),
          ...(input.lamp !== null && { lamp: input.lamp }),
        },
        user,
        queryRunner,
      );

      if (input.controllerTypeId && input.roomId) {
        const controllerType = await this.controllerTypeDAO.getOneStrict({
          where: {
            id: input.controllerTypeId,
          },
        });

        const room = await this.roomDAO.getOneStrict({
          where: {
            id: input.roomId,
          },
        });

        await this.roomDAO.upsertOne(user, {
          ...room,
          controllerTypeId: controllerType.id,
        });
      }

      await this.iotDeviceDAO.commitTransaction(queryRunner);

      return this.getOne(id);
    } catch (error) {
      await this.iotDeviceDAO.rollbackTransaction(queryRunner);

      throw error;
    }
  }

  async assignDeviceOtas(
    input: AssignDeviceOtasBody,
    user: RequestUser,
  ): Promise<DevicesSensorsResponseItem[]> {
    const assignedDevicesOta = await this.iotDeviceDAO.assignDevicesOtas(input, user);

    return assignedDevicesOta.map((device) => ({
      ...device,
      coop: device.coop ? device.coop : undefined,
      room: device.room ? device.room : undefined,
      registrationDate: device.registrationDate.toISOString(),
      createdDate: device.createdDate.toISOString(),
      modifiedDate: device.modifiedDate.toISOString(),
      errors:
        device.errorCode?.map((val) => ({
          code: val,
          description: DEVICE_SENSOR_ERRORS[val as unknown as number],
        })) || [],
    }));
  }

  async deleteDeviceSensors(
    id: string,
    user: RequestUser,
  ): Promise<DeleteDeviceSensorsResponseItem> {
    const toBeDeleted = await this.iotDeviceDAO.getOneStrict({ where: { id } });

    const queryRunner = await this.iotDeviceDAO.startTransaction();

    try {
      const [existingSensors] = await this.iotSensorDAO.getMany({
        where: {
          iotDeviceId: id,
        },
      });

      const cameraSensorIds = existingSensors.reduce((prev, sensor) => {
        if (sensor.sensorType === 'CAMERA') return [...prev, sensor.id];

        return prev;
      }, [] as string[]);

      await this.aiNotifConfigDAO.deleteMany({
        sensorId: In(cameraSensorIds),
      });

      await this.iotSensorDAO.deleteByIotDeviceId(id);

      const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

      if (existingSensors.length) {
        await this.iotSensorDAO.upsertManySensors(
          user,
          existingSensors.map<DeepPartial<IotSensor>>((sensor) => ({
            ...sensor,
            iotDeviceId: id,
            deletedDate: now,
          })),
          {
            qr: queryRunner,
          },
        );
      }

      await this.iotDeviceDAO.updateOneWithTx(
        { id },
        {
          deletedDate: now,
        },
        user,
        queryRunner,
      );

      await this.iotDeviceDAO.commitTransaction(queryRunner);

      return {
        id: toBeDeleted.id,
        deletedDate: now.toISOString(),
      };
    } catch (error) {
      await this.iotDeviceDAO.rollbackTransaction(queryRunner);

      throw error;
    }
  }

  async deviceSensorsSetId(input: SetIdDevicesSensorsBody): Promise<SetIdDevicesSensorsBody> {
    return this.iotDeviceDAO.setId(input);
  }

  async deviceSensorResetId(
    input: ResetIdDevicesSensorsBody,
  ): Promise<ResetIdDevicesSensorsResponseItem> {
    return this.iotDeviceDAO.resetId(input);
  }

  async triggerDeviceSensorAlert() {
    const keys = await this.redisConnection.connection.keys('iot:em*_electricity');

    // should check if farming status is inactive, then delete the key in redis
    // but it must burden the database for checking often
    // the code that set the farming status should delete the key
    await Promise.allSettled(
      keys.map(async (redisKey) => {
        const deviceId = redisKey.split(':')[1].split('_')[0];
        const metricName = redisKey.split(':')[1];
        const macAddress = topicToMac(deviceId.substring(2, MAC_LENGTH));

        return this.generateIotDeviceAlertQueue.addJob({ macAddress, metricName, redisKey });
      }),
    );
  }

  async generateDeviceSensorAlert(data: {
    macAddress: string;
    metricName: string;
    redisKey: string;
  }) {
    // make periodic checker to redis
    // const maxTimeDiff = 15 * 60 * 1000;
    const maxTimeDiff = env.IOT_DEVICE_ALERT_TIMEOUT * 1000;

    const device = await this.iotDeviceDAO.getOne({
      where: {
        mac: data.macAddress,
        deletedDate: IsNull(),
      },
    });

    if (device && device.status) {
      const deviceTimestamp = await this.redisConnection.connection.get(data.redisKey);

      const diff = Date.now() - Number(deviceTimestamp);
      if (diff > maxTimeDiff) {
        this.statsdConnection.client.gauge(data.metricName, 1);
      }
    }
  }

  private static validateSensorCode(sensorType: string, sensorCode: string) {
    const sensorTypeCodePatternMapping = {
      XIAOMI_SENSOR: {
        pattern: 'ATC_\\w{6}',
        description: 'ATC_(6 digit angka huruf)',
      },
      CAMERA: {
        pattern: 'BRD_\\w{6}',
        description: 'BRD_(6 digit angka huruf)',
      },
    };

    if (!Reflect.has(sensorTypeCodePatternMapping, sensorType)) return;

    const validator =
      sensorTypeCodePatternMapping[sensorType as keyof typeof sensorTypeCodePatternMapping];

    const regexp = new RegExp(validator.pattern);

    if (!regexp.test(sensorCode)) {
      throw ERR_IOT_SENSOR_CODE_WRONG_FORMAT(
        sensorCode,
        `untuk type ${sensorType} gunakan`,
        validator.description,
      );
    }
  }

  async getDeviceReports(filter: GetDeviceReportsQuery): Promise<[HistoricalData[], number]> {
    const endDate = filter.endDate ? new Date(filter.endDate) : new Date();
    const startDate = filter.startDate ? new Date(filter.startDate) : subDays(new Date(), 1);

    const queryParams = {
      bool: {
        must: [
          {
            match: {
              paths: filter.deviceId,
            },
          },
        ],
      },
    };

    if (filter.coopCode) {
      queryParams.bool.must.push({
        match: {
          paths: filter.coopCode,
        },
      });
    }

    const query: any = {
      bool: {
        must: [
          {
            match: {
              paths: 'sensors',
            },
          },
          queryParams,
        ],

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
        sort: [{ created: { order: filter.$order || 'asc' } }],
        query,
      },
      size: 10000,
      rest_total_hits_as_int: true,
    });

    const historical: HistoricalData[] = [];

    let temperature: { [key: string]: number[] } = {};
    let humidity: { [key: string]: number[] } = {};
    let lamp: number[] = [];
    let ammonia: number[] = [];
    let windSpeed: number[] = [];
    let curDate = startDate;
    let nextDate = addMinutes(startDate, filter.interval);

    result.body.hits.hits.forEach((report) => {
      /* eslint-disable no-underscore-dangle */
      if (report._source) {
        const created = new Date(report._source.created);

        if (created > nextDate) {
          const avgTemperatures: { [key: string]: number } = {};
          const avgHumidities: { [key: string]: number } = {};
          const avgLamp = lamp.length
            ? {
                [`${format(curDate, DATE_SQL_FORMAT)}.${filter.deviceId}.L`]:
                  lamp.reduce((a, b) => a + b) / lamp.length,
              }
            : 0;
          const avgAmmonia = ammonia.length
            ? {
                [`${format(curDate, DATE_SQL_FORMAT)}.${filter.deviceId}.A`]:
                  ammonia.reduce((a, b) => a + b) / ammonia.length,
              }
            : 0;
          const avgwindSpeed = windSpeed.length
            ? {
                [`${format(curDate, DATE_SQL_FORMAT)}.${filter.deviceId}.W`]:
                  windSpeed.reduce((a, b) => a + b) / windSpeed.length,
              }
            : 0;

          // eslint-disable-next-line no-restricted-syntax
          for (const [key, values] of Object.entries(temperature)) {
            avgTemperatures[`${format(curDate, DATE_SQL_FORMAT)}.${key}`] =
              values.reduce((a, b) => a + b) / values.length;
          }

          // eslint-disable-next-line no-restricted-syntax
          for (const [key, values] of Object.entries(humidity)) {
            avgHumidities[`${format(curDate, DATE_SQL_FORMAT)}.${key}`] =
              values.reduce((a, b) => a + b) / values.length;
          }

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
              time: curDate.toTimeString().substring(0, 5),
              temperature: avgTemperatures,
              humidity: avgTemperatures,
              lamp: lamp.length
                ? {
                    [`${format(curDate, DATE_SQL_FORMAT)}.${filter.deviceId}.L`]:
                      lamp.reduce((a, b) => a + b) / lamp.length,
                  }
                : {},
              ammonia: ammonia.length
                ? {
                    [`${format(curDate, DATE_SQL_FORMAT)}.${filter.deviceId}.A`]:
                      ammonia.reduce((a, b) => a + b) / ammonia.length,
                  }
                : {},
              windSpeed: windSpeed.length
                ? {
                    [`${format(curDate, DATE_SQL_FORMAT)}.${filter.deviceId}.W`]:
                      windSpeed.reduce((a, b) => a + b) / windSpeed.length,
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
        // eslint-disable-next-line no-restricted-syntax
        for (const [key, value] of Object.entries(report._source.sensors)) {
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

    return [historicalData, historical.length];
  }

  async registerSmartMonitoring(data: Partial<IotDevice>) {
    const topic = DEVICE_STATUS_TOPIC + data.mac;
    /* prettier-ignore */
    const sensor = data.sensors
      ? data.sensors
        .filter((s) => s.sensorCode !== undefined)
        .map<string>((s) => s.sensorCode as string)
        .join(',')
      : '';

    this.mqtt.client.subscribe(topic, { qos: 1 }, async (error) => {
      if (!error) {
        this.mqtt.client.publish(topic, `b${sensor}`, { qos: 1, retain: false });
        await sleep(DEVICE_SENSOR_DELAY);

        if (data.coop) {
          const coopCode = `f${data.coop.coopCode.substring(
            data.coop.coopCode.length - 4,
            data.coop.coopCode.length,
          )}`;
          this.mqtt.client.publish(topic, coopCode, { qos: 1, retain: false });
          await sleep(DEVICE_SENSOR_DELAY);
        }

        if (data.deviceId) {
          this.mqtt.client.publish(topic, data.deviceId.toLowerCase(), {
            qos: 1,
            retain: false,
          });
        }
      }
    });
  }

  async registerSmartCamera(data: CreateDevicesSensorsBody) {
    data.sensors?.forEach(async (sensor) => {
      if (!sensor.ipCamera || isIP(sensor.ipCamera) === 0) {
        throw ERR_INVALID_IP;
      }

      this.smartCameraPublisher.sendRegisterCameraCommand({
        deviceId: data.deviceId || '',
        sensorCode: sensor.sensorCode,
        ipCamera: sensor.ipCamera,
      });
    });
  }

  async assignOtaSmartMonitoring(devices: IotDevice[], firmwareId: string) {
    const firmware = await this.firmwareDAO.getOneStrict({
      where: {
        id: firmwareId,
      },
    });

    devices.forEach(async (device) => {
      const topic = ASSIGN_OTA_TOPIC + device.mac.toUpperCase();
      this.mqtt.client.subscribe(topic, { qos: 1 }, (error) => {
        if (!error) {
          this.mqtt.client.publish(topic, `${firmware.version},${firmware.fileSize}`, {
            qos: 1,
            retain: false,
          });
        }
      });

      await new Promise((resolve) => {
        this.mqtt.client.on('message', (_topic, message) => {
          resolve({
            macAddress: device.mac,
            deviceId: message.toString(),
          });
        });
      });
    });
  }

  async assignOtaSmartCamera(devices: IotDevice[], firmwareId: string) {
    const firmware = await this.firmwareDAO.getOneStrict({
      where: {
        id: firmwareId,
      },
    });

    devices.forEach(async (device) => {
      const topic = ASSIGN_OTA_TOPIC + device.mac.toUpperCase();
      this.mqtt.client.subscribe(topic, { qos: 1 }, (error) => {
        if (!error) {
          this.mqtt.client.publish(topic, `${firmware.version},${firmware.fileSize}`, {
            qos: 1,
            retain: false,
          });
        }
      });

      await new Promise((resolve) => {
        this.mqtt.client.on('message', (_topic, message) => {
          resolve({
            macAddress: device.mac,
            deviceId: message.toString(),
          });
        });
      });
    });
  }
}
