/* eslint-disable no-underscore-dangle */
import { SearchHit } from '@elastic/elasticsearch/api/types.d';
import { isAfter, sub } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { Inject, Service } from 'fastify-decorators';
import { In, IsNull } from 'typeorm';
import env from '../../config/env';
import { B2BFarmInfrastructureDAO } from '../../dao/b2b/b2b.farmInfrastructure.dao';
import { B2BIotDeviceDAO } from '../../dao/b2b/b2b.iotDevice.dao';
import { SensorESDAO } from '../../dao/es/sensor.es.dao';
import { IOTDeviceSettingsDAO } from '../../dao/iotDeviceSettings.dao';
import {
  IOTSensorData,
  IOTSensorDataItem,
  SensorNames,
} from '../../datasources/entity/elasticsearch/IOTSensorData.entity';
import { IotSensorTypeEnum } from '../../datasources/entity/pgsql/IotSensor.entity';
import {
  CreateB2BSmartMonitoringBody,
  DeleteAllB2BIotDeviceParam,
  EditB2BIotDeviceBody,
  EditB2BIotDeviceItemResponse,
  EditB2BIotDeviceParam,
  EditB2BSmartMonitoringBody,
  EditB2BSmartMonitoringItemResponse,
  EditB2BSmartMonitoringParam,
  GetB2BIotDeviceItemResponse,
  GetB2BIotDevicesQuery,
  GetB2BSmartMonitoringByCoopAndRoomId,
  GetB2BSmartMonitoringByCoopAndRoomIdResponse,
  GetB2BSmartMonitoringHistoricalItemResponse,
  GetB2BSmartMonitoringHistoricalParam,
  GetB2BSmartMonitoringHistoricalQuery,
  GetB2BSmartMonitoringItemResponse,
  GetB2BSmartMonitoringParam,
  GetSmartMonitoringLatestConditionItemResponse,
  GetSmartMonitoringLatestConditionParam,
  GetSmartMonitoringLatestConditionQuery,
  ReRegisterB2BSmartMonitoringParam,
} from '../../dto/b2b/b2b.iotDevice.dto';
import { DevicesSensorsResponseItem } from '../../dto/devicesSensors.dto';
import { SensorLatestCondition, SensorTypes } from '../../dto/sensor.dto';
import { CACHE_KEY_PREFIX, DEFAULT_TIME_ZONE, DEVICE_TYPE } from '../../libs/constants';
import { B2B_SMART_MONITORING_CONFIG_DEFAULT } from '../../libs/constants/b2bExternal';
import {
  ERR_B2B_IOT_DEVICE_ALREADY_REGISTERED,
  ERR_B2B_NOT_AN_ORGANIZATION_MEMBER,
  ERR_IOT_DEVICE_INCOMPLETE_INFRA,
  ERR_IOT_SENSOR_CODE_EXIST,
} from '../../libs/constants/errors';
import { RequestUser } from '../../libs/types/index.d';
import {
  b2bGenerateDefaultDeviceName,
  b2bValidateSensorCode,
  generateOrderQuery,
  parseSkipFailed,
} from '../../libs/utils/helpers';
import { DeviceSensorsService } from '../devicesSensors.service';
import { HistoricalList } from '../sensor.service';

@Service()
export class B2BIotDeviceService extends DeviceSensorsService {
  @Inject(B2BIotDeviceDAO)
  private b2bIotDeviceDAO!: B2BIotDeviceDAO;

  @Inject(B2BFarmInfrastructureDAO)
  private b2bFarmInfraDAO!: B2BFarmInfrastructureDAO;

  @Inject(SensorESDAO)
  private sensorESDAO!: SensorESDAO;

  @Inject(IOTDeviceSettingsDAO)
  private iotDeviceSettingsDAO!: IOTDeviceSettingsDAO;

  async getB2BIotDevices(
    filter: GetB2BIotDevicesQuery,
    user: RequestUser,
  ): Promise<[GetB2BIotDeviceItemResponse[], number]> {
    const order = (filter.$order && generateOrderQuery(filter.$order)) || 'DESC';
    const limit = filter.$limit && filter.$limit > 0 ? filter.$limit : 0;
    const skip = !filter.$page || filter.$page < 1 ? 0 : (filter.$page - 1) * limit;

    if (!user.organizationId) {
      throw ERR_B2B_NOT_AN_ORGANIZATION_MEMBER();
    }

    const [farmInfras] = await this.b2bFarmInfraDAO.getMany({
      where: {
        organizationId: user.organizationId,
        farmId: filter.farmId ? filter.farmId : undefined,
        coopId: filter.coopId ? filter.coopId : undefined,
      },
    });

    const farmInfraIds = farmInfras?.map((farmInfra) => farmInfra.id);

    const [b2bIotDevices] = await this.b2bIotDeviceDAO.getMany({
      where: {
        farmInfrastructureId: In(farmInfraIds),
      },
    });

    const iotDevicesList = b2bIotDevices?.map((b2bIotDevice) => b2bIotDevice.deviceId);

    const [iotDevices, total] = await this.iotDeviceDAO.getManyDevicesSensors({
      where: {
        id: In(iotDevicesList),
        mac: filter.mac ? filter.mac : undefined,
        deviceType: filter.deviceType ? filter.deviceType : undefined,
      },
      take: (filter.$limit !== 0 && limit) || undefined,
      skip,
      order: {
        createdDate: order,
      },
    });

    return [
      iotDevices?.map((iotDevice) => ({
        id: iotDevice.id,
        mac: iotDevice.mac,
        deviceType: iotDevice.deviceType,
        farmName: iotDevice.coop.farm.farmName,
        farmCode: iotDevice.coop.farm.farmCode,
        farmOwner: iotDevice.coop.farm.owner.fullName,
        coopName: iotDevice.coop.coopName,
        coopCode: iotDevice.coop.coopCode,
        buildingName: iotDevice.room.building?.name || '',
        roomName: iotDevice.room?.roomName,
        firmwareVersion: iotDevice.firmWareVersion || '',
        status: iotDevice.status,
        state: iotDevice.isOnline,
        totalSensor: iotDevice.sensors?.length || 0,
        sensors: iotDevice.sensors?.map((s) => ({
          sensorCode: s.sensorCode,
          position: s.position || '',
        })),
        dateRegistered: iotDevice.createdDate,
      })),
      total,
    ];
  }

  async createB2BSmartMonitoring(
    input: CreateB2BSmartMonitoringBody,
    user: RequestUser,
  ): Promise<DevicesSensorsResponseItem> {
    if (!user.organizationId) {
      throw ERR_B2B_NOT_AN_ORGANIZATION_MEMBER();
    }

    if (input.farmId) {
      if (!input.coopId || !input.buildingId || !input.roomId) {
        throw ERR_IOT_DEVICE_INCOMPLETE_INFRA();
      }
    }

    const queryRunner = await this.iotDeviceDAO.startTransaction();

    try {
      const farmInfra = await this.b2bFarmInfraDAO.getOneStrict({
        where: {
          coopId: input.coopId,
          organizationId: user.organizationId,
        },
      });

      const existingDevice = await this.iotDeviceDAO.getOne({
        where: {
          mac: input.mac.slice(-17),
          status: true,
          deletedDate: IsNull(),
        },
      });

      if (existingDevice) {
        throw ERR_B2B_IOT_DEVICE_ALREADY_REGISTERED();
      }

      let transactionHooks: Function[] = [];

      if (input.sensors) {
        const sensorCodes = input.sensors.map((sensor) => sensor.sensorCode);

        const [, existingSensorsCount] = await this.iotSensorDAO.getMany({
          where: {
            sensorCode: In(sensorCodes),
            status: 1,
            deletedDate: IsNull(),
          },
        });

        if (existingSensorsCount > 0) {
          throw ERR_IOT_SENSOR_CODE_EXIST();
        }

        for (let i = 0; i < input.sensors.length; i += 1) {
          const sensor = input.sensors[i];

          b2bValidateSensorCode(sensor.sensorType, sensor.sensorCode);
        }

        transactionHooks = input.sensors.map((sensor) =>
          this.iotSensorDAO.wrapUpsertHook(
            sensor.sensorCode,
            sensor.sensorType,
            sensor.position as string,
            1,
            input.roomId,
            user.id,
            undefined,
          ),
        );
      }

      const device = await this.iotDeviceDAO.createOneWithTx(
        {
          phoneNumber: input.phoneNumber,
          status: true,
          isOnline: true,
          mac: input.mac.slice(-17).toLowerCase(),
          firmWareVersion: input.firmWareVersion,
          sensors: input.sensors.map((sensor) => ({
            sensorCode: sensor.sensorCode,
            sensorType: sensor.sensorType,
            status: 1,
            position: sensor.position ? sensor.position : null,
            roomId: sensor.roomId || input.roomId,
            ipCamera: null,
          })),
          deviceType: input.deviceType,
          farmId: farmInfra.farmId,
          buildingId: farmInfra.buildingId,
          coopId: farmInfra.coopId,
          roomId: input.roomId,
        },
        user,
        queryRunner,
        transactionHooks,
      );

      const [, countMonitoring] = await this.b2bIotDeviceDAO.getMany({
        where: {
          farmInfrastructureId: farmInfra.id,
          iotDevice: {
            deviceType: DEVICE_TYPE.SMART_MONITORING.value as keyof typeof DEVICE_TYPE,
            deletedDate: IsNull(),
          },
        },
      });

      await this.b2bIotDeviceDAO.createOneWithTx(
        {
          b2bDeviceName: b2bGenerateDefaultDeviceName(device.deviceType, countMonitoring + 1),
          farmInfrastructureId: farmInfra.id,
          deviceId: device.id,
        },
        user,
        queryRunner,
      );

      await this.iotSensorDAO.commitTransaction(queryRunner);

      if (env.B2B_DEVICE_INTEGRATION_IS_ACTIVE) {
        await this.iotDeviceDAO.removeCache(
          `${CACHE_KEY_PREFIX.GET_ONE_IOT_DEVICE}:${input.mac.slice(-17)}`,
        );

        this.registerSmartMonitoring(device);
      }

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

  async getB2BSmartMonitoring(
    params: GetB2BSmartMonitoringParam,
    user: RequestUser,
  ): Promise<GetB2BSmartMonitoringItemResponse> {
    const farmInfra = await this.b2bFarmInfraDAO.getOne({
      where: {
        organizationId: user.organizationId,
      },
    });

    if (!farmInfra) {
      throw ERR_B2B_NOT_AN_ORGANIZATION_MEMBER();
    }

    const [b2bIotDevice, smartMonitoring] = await Promise.all([
      this.b2bIotDeviceDAO.getOneStrict({
        where: {
          deviceId: params.deviceId,
        },
      }),
      this.iotDeviceDAO.getOneStrict({
        where: {
          id: params.deviceId,
        },
        relations: {
          coop: true,
          room: true,
          sensors: true,
        },
      }),
    ]);

    return {
      deviceId: smartMonitoring.id,
      deviceName: b2bIotDevice.b2bDeviceName,
      deviceType: smartMonitoring.deviceType,
      coopId: smartMonitoring.coop.id,
      coopName: smartMonitoring.coop.coopName,
      roomId: smartMonitoring.room.id,
      roomName: smartMonitoring.room.roomName,
      mac: smartMonitoring.mac,
      status: smartMonitoring.status ? 'active' : 'inactive',
      sensors: smartMonitoring.sensors?.map((sensor) => ({
        id: sensor.id,
        sensorCode: sensor.sensorCode,
        sensorType: sensor.sensorType as IotSensorTypeEnum,
      })),
    };
  }

  async editB2BSmartMonitoring(
    param: EditB2BSmartMonitoringParam,
    input: EditB2BSmartMonitoringBody,
    user: RequestUser,
  ): Promise<EditB2BSmartMonitoringItemResponse> {
    const queryRunner = await this.iotDeviceDAO.startTransaction();

    try {
      const smartMonitoringDevice = await this.iotDeviceDAO.getOneStrict({
        where: {
          id: param.deviceId,
        },
      });

      // Validate sensors
      for (let i = 0; i < input.sensors.length; i += 1) {
        const sensor = input.sensors[i];

        b2bValidateSensorCode(sensor.sensorType, sensor.sensorCode);
      }

      await this.iotSensorDAO.deleteManyWithTx(
        {
          iotDeviceId: param.deviceId,
        },
        queryRunner,
      );

      await this.iotSensorDAO.createManyWithTx(
        input.sensors.map((sensor) => ({
          iotDeviceId: param.deviceId,
          sensorCode: sensor.sensorCode,
          sensorType: sensor.sensorType as IotSensorTypeEnum,
          status: 1,
          roomId: smartMonitoringDevice.roomId,
        })),
        user,
        queryRunner,
      );

      await this.iotDeviceDAO.updateOneWithTx(
        {
          id: param.deviceId,
        },
        {
          status: input.status === 'active',
        },
        user,
        queryRunner,
      );

      await this.iotDeviceDAO.commitTransaction(queryRunner);

      if (env.B2B_DEVICE_INTEGRATION_IS_ACTIVE) {
        this.registerSmartMonitoring(smartMonitoringDevice);
      }

      return await this.getB2BSmartMonitoring(param, user);
    } catch (error) {
      await this.iotDeviceDAO.rollbackTransaction(queryRunner);

      throw error;
    }
  }

  async renameB2BSmartMonitoring(
    param: EditB2BIotDeviceParam,
    input: EditB2BIotDeviceBody,
    user: RequestUser,
  ): Promise<EditB2BIotDeviceItemResponse> {
    const queryRunner = await this.b2bIotDeviceDAO.startTransaction();

    try {
      await this.b2bIotDeviceDAO.updateOneWithTx(
        { deviceId: param.deviceId },
        { b2bDeviceName: input.deviceName },
        user,
        queryRunner,
      );

      await this.b2bIotDeviceDAO.commitTransaction(queryRunner);

      return {
        deviceId: param.deviceId,
        ...input,
      };
    } catch (error) {
      await this.b2bIotDeviceDAO.rollbackTransaction(queryRunner);

      throw error;
    }
  }

  async reRegisterB2BSmartMonitoring(
    input: ReRegisterB2BSmartMonitoringParam,
    user: RequestUser,
  ): Promise<void> {
    const iotDevices = await this.iotDeviceDAO.getOneStrict({
      where: {
        id: input.deviceId,
      },
    });

    await this.iotDeviceDAO.updateOne(
      { id: input.deviceId },
      { status: true, isOnline: true },
      user,
    );

    await this.iotDeviceDAO.removeCache(`${CACHE_KEY_PREFIX.GET_ONE_IOT_DEVICE}:${iotDevices.mac}`);

    if (env.B2B_DEVICE_INTEGRATION_IS_ACTIVE) {
      switch (iotDevices.deviceType) {
        default:
          this.registerSmartMonitoring(iotDevices);
          break;
      }
    }
  }

  async getB2BFarmInfrastructureIotDevicesCoopRoom(
    params: GetB2BSmartMonitoringByCoopAndRoomId,
  ): Promise<GetB2BSmartMonitoringByCoopAndRoomIdResponse[]> {
    const [b2bIotDevices] = await this.b2bIotDeviceDAO.getMany({
      where: {
        iotDevice: {
          coopId: params.coopId,
          roomId: params.roomId,
        },
      },
      relations: {
        iotDevice: {
          sensors: true,
        },
      },
    });

    const smartScaleDevice = {
      mac: '',
      deviceId: '',
      deviceName: 'Smart Scale',
      deviceType: DEVICE_TYPE.SMART_SCALE.value,
      deviceSummary: {},
      sensorCount: 0,
    };

    if (!b2bIotDevices) return [smartScaleDevice];

    return [
      ...b2bIotDevices.map((device) => ({
        mac: device.iotDevice.mac,
        deviceId: device.iotDevice.id,
        deviceName: device.b2bDeviceName,
        deviceType: device.iotDevice.deviceType as string,
        deviceSummary: {},
        sensorCount: device.iotDevice.sensors?.length || 0,
      })),
      smartScaleDevice,
    ];
  }

  async getSmartMonitoringLatestCondition(
    param: GetSmartMonitoringLatestConditionParam,
    query: GetSmartMonitoringLatestConditionQuery,
    user: RequestUser,
  ): Promise<GetSmartMonitoringLatestConditionItemResponse> {
    if (!user.organizationId) {
      throw ERR_B2B_NOT_AN_ORGANIZATION_MEMBER();
    }

    const smartMonitoringDevice = await this.iotDeviceDAO.getOneStrict({
      where: {
        id: param.deviceId,
        deletedDate: IsNull(),
        sensors: {
          sensorCode: query.sensorCode ? query.sensorCode : undefined,
        },
      },
      relations: {
        coop: true,
        room: true,
        sensors: true,
      },
    });

    const now = new Date();

    const sensorData = await [1, 3, 5, 7].reduce(
      async (prevSensorData, hours): Promise<SearchHit<IOTSensorData>[]> => {
        const data = await prevSensorData;

        if (data.length > 0) {
          return data as unknown as SearchHit<IOTSensorData>[];
        }

        const resultProto = await this.sensorESDAO.getManyByMac(
          [smartMonitoringDevice.mac],
          {
            from: sub(now, { hours }),
            to: now,
          },
          'desc',
        );

        return resultProto;
      },
      Promise.resolve([] as SearchHit<IOTSensorData>[]),
    );

    if (!sensorData[0] || !sensorData[0]._source) {
      return {};
    }

    const data = parseSkipFailed(sensorData);
    if (!data) return {};

    const sensorNames = Object.keys(data).filter((key) => /^s\d{1,}/gi.test(key)) as SensorNames[];

    const sensorCount = sensorNames.length;

    // 1. Calculate Latest Reading of Temperature Sensor
    const temperature =
      sensorNames.reduce(
        (total, sensorName) => (data[sensorName] as IOTSensorDataItem).t + total,
        0,
      ) /
      (sensorCount * 10);

    // 2. Calculate Latest Reading of Humidity Sensor
    const relativeHumidity =
      sensorNames.reduce(
        (total, sensorName) => (data[sensorName] as IOTSensorDataItem).h + total,
        0,
      ) / sensorCount;

    // 3. Calculate Heat Stress Index
    const heatStressIndex = 1.8 * temperature + relativeHumidity + 32;

    // 4. Calculate Amonia
    const ammoniaStatus = 'good';
    let ammonia: number | null = null;
    if (typeof data.Modbus_sensor1?.a === 'number') {
      ammonia = data.Modbus_sensor1.a;
    } else if (data.a && data.a.ppm) {
      ammonia = data.a.ppm;
    } else if (data.a && data.a.R0) {
      const b = -0.1043;
      const m = -0.538;
      const y = data.a.Rs / data.a.R0;
      const z = (Math.log(y) - b) / m;
      const ppm = 10 ** z;

      ammonia = ppm;
    }

    const result: SensorLatestCondition = {
      temperature: {
        value: Number(temperature.toFixed(2)),
        uom: '°C',
        status: temperature > 32 ? 'bad' : 'good',
      },
      relativeHumidity: {
        value: Number(relativeHumidity.toFixed(2)),
        uom: '%',
        status: 'good',
      },
      heatStressIndex: {
        value: Number(heatStressIndex.toFixed(2)),
        uom: '',
        status:
          heatStressIndex < B2B_SMART_MONITORING_CONFIG_DEFAULT.heatStressIndex.max
            ? 'good'
            : 'bad',
      },
      wind: {
        value: Number(data?.w?.toFixed(2) ?? 0),
        uom: 'm/s',
        status: '',
      },
      ...(ammonia !== null && {
        ammonia: { value: Number(ammonia.toFixed(2)) ?? 0, uom: 'PPM', status: ammoniaStatus },
      }),
      ...(data.l && {
        lights: { value: Number(data?.l?.toFixed(2)) ?? 0, uom: 'lux', status: '' },
      }),
    };

    return result;
  }

  async getB2BSmartMonitoringHistorical(
    param: GetB2BSmartMonitoringHistoricalParam,
    query: GetB2BSmartMonitoringHistoricalQuery,
    from?: Date,
    to?: Date,
  ): Promise<GetB2BSmartMonitoringHistoricalItemResponse> {
    const { sensorType } = query;

    const smartMonitoringDevice = await this.iotDeviceDAO.getOneStrict({
      where: {
        id: param.deviceId,
        deletedDate: IsNull(),
        sensors: {
          sensorCode: query.sensorCode ? query.sensorCode : undefined,
        },
      },
      relations: {
        coop: true,
        room: true,
        sensors: true,
      },
    });

    const now = new Date();

    const last24Hour = sub(now, { hours: 24 });

    const currentTimeRange = {
      from: last24Hour,
      to: now,
    };

    if (from && to) {
      if (!isAfter(to, from)) {
        throw new Error('From can not be after To');
      }

      currentTimeRange.from = from;
      currentTimeRange.to = to;
    }

    const sensorDataCurrent = await this.sensorESDAO.getManyByMac(
      [smartMonitoringDevice.mac],
      currentTimeRange,
      'asc',
    );

    let datasetCurrent: HistoricalList = [];

    if (sensorType === 'temperature') {
      datasetCurrent = B2BIotDeviceService.mapDataset('temperature')(sensorDataCurrent);
    } else if (sensorType === 'relativeHumidity') {
      datasetCurrent = B2BIotDeviceService.mapDataset('relativeHumidity')(sensorDataCurrent);
    } else if (sensorType === 'heatStressIndex') {
      datasetCurrent = B2BIotDeviceService.mapDataset('heatStressIndex')(sensorDataCurrent);
    } else if (sensorType === 'lights') {
      datasetCurrent = B2BIotDeviceService.mapDataset('lights')(sensorDataCurrent);
    } else if (sensorType === 'wind') {
      datasetCurrent = B2BIotDeviceService.mapDataset('wind')(sensorDataCurrent);
    } else {
      datasetCurrent = B2BIotDeviceService.mapDataset('ammonia')(sensorDataCurrent);
    }

    const benchmark = await this.generateBenchmarks(datasetCurrent, sensorType);

    return {
      current: datasetCurrent.map((d) => ({
        value: d.value,
        created: utcToZonedTime(new Date(d.created), DEFAULT_TIME_ZONE).toISOString(),
      })),
      benchmark,
    };
  }

  async deleteAllB2BIotDevice(param: DeleteAllB2BIotDeviceParam): Promise<void> {
    const queryRunner = await this.b2bIotDeviceDAO.startTransaction();

    try {
      const deviceDetail = await this.b2bIotDeviceDAO.getOneStrict({
        where: {
          deviceId: param.deviceId,
        },
        relations: {
          iotDevice: true,
        },
      });

      if (deviceDetail.iotDevice?.deviceType === 'SMART_CONTROLLER') {
        await this.iotDeviceSettingsDAO.deleteOneWithTx(
          { iotDeviceId: param.deviceId },
          queryRunner,
        );
      } else if (deviceDetail.iotDevice?.deviceType === 'SMART_MONITORING') {
        await this.iotDeviceDAO.removeCache(
          `${CACHE_KEY_PREFIX.GET_ONE_IOT_DEVICE}:${deviceDetail.iotDevice.mac.toLowerCase()}`,
        );
      }

      await this.b2bIotDeviceDAO.deleteOneWithTx({ deviceId: param.deviceId }, queryRunner);

      await this.iotSensorDAO.deleteManyWithTx(
        {
          iotDeviceId: param.deviceId,
          roomId: param.roomId,
        },
        queryRunner,
      );

      await this.iotDeviceDAO.deleteOneWithTx(
        {
          id: param.deviceId,
          roomId: param.roomId,
        },
        queryRunner,
      );

      await this.b2bIotDeviceDAO.commitTransaction(queryRunner);
    } catch (error) {
      await this.b2bIotDeviceDAO.rollbackTransaction(queryRunner);

      throw error;
    }
  }

  private static mapDataset(sensorType: SensorTypes): Function {
    return function map(dataset: SearchHit<IOTSensorData>[]): HistoricalList {
      return dataset.reduce<HistoricalList>((arr, sd) => {
        try {
          if (!sd._source) {
            return arr;
          }

          const sensors = sd._source?.sensors;

          const sensorNames = Object.keys(sensors).filter((key) =>
            /^s\d{1,}/gi.test(key),
          ) as SensorNames[];
          const sensorCount = sensorNames.length;

          let computed = 0;

          if (sensorType === 'temperature') {
            computed =
              sensorNames.reduce(
                (total, sensorName) => (sensors[sensorName] as IOTSensorDataItem).t + total,
                0,
              ) /
              (sensorCount * 10);
          } else if (sensorType === 'relativeHumidity') {
            computed =
              sensorNames.reduce(
                (total, sensorName) => (sensors[sensorName] as IOTSensorDataItem).h + total,
                0,
              ) / sensorCount;
          } else if (sensorType === 'heatStressIndex') {
            const t =
              sensorNames.reduce(
                (total, sensorName) => (sensors[sensorName] as IOTSensorDataItem).t + total,
                0,
              ) /
              (sensorCount * 10);

            const rh =
              sensorNames.reduce(
                (total, sensorName) => (sensors[sensorName] as IOTSensorDataItem).h + total,
                0,
              ) / sensorCount;

            computed = 1.8 * t + rh + 32;
          } else if (sensorType === 'ammonia') {
            if (typeof sensors.Modbus_sensor1?.a === 'number') {
              computed = sensors.Modbus_sensor1.a;
            } else if (sensors.a.ppm) {
              computed = sensors.a.ppm;
            } else {
              const b = -0.1043;
              const m = -0.538;
              const y = sensors.a.Rs / sensors.a.R0;
              const z = (Math.log(y) - b) / m;
              const ppm = 10 ** z;

              computed = ppm;
            }
          } else if (sensorType === 'lights') {
            computed = Number(sensors.l);
          } else if (sensorType === 'wind') {
            computed = Number(sensors.w);
          }

          // validate temporary
          arr.push({
            value: computed,
            created: sd._source.created ? new Date(sd._source.created) : new Date(),
          });

          return [...arr];
        } catch (error) {
          return arr;
        }
      }, []);
    };
  }

  // eslint-disable-next-line class-methods-use-this
  private async generateBenchmarks(datasetCurrent: any, sensorType: string): Promise<any> {
    return datasetCurrent.map((td: any) => ({
      value: this.getDefaultBenchmark(sensorType),
      created: utcToZonedTime(new Date(td.created), DEFAULT_TIME_ZONE).toISOString(),
    }));
  }

  // eslint-disable-next-line class-methods-use-this
  private getDefaultBenchmark(sensorType: string) {
    switch (sensorType) {
      case 'ammonia':
        return B2B_SMART_MONITORING_CONFIG_DEFAULT.ammonia;
      case 'temperature':
        return B2B_SMART_MONITORING_CONFIG_DEFAULT.temperature;
      case 'relativeHumidity':
        return B2B_SMART_MONITORING_CONFIG_DEFAULT.relativeHumidity;
      case 'heatStressIndex':
        return B2B_SMART_MONITORING_CONFIG_DEFAULT.heatStressIndex;
      case 'lights':
        return B2B_SMART_MONITORING_CONFIG_DEFAULT.lights;
      case 'wind':
        return B2B_SMART_MONITORING_CONFIG_DEFAULT.wind;
      default:
        return B2B_SMART_MONITORING_CONFIG_DEFAULT.default;
    }
  }
}
