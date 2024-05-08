import { format, parseISO } from 'date-fns';
import { Inject, Service } from 'fastify-decorators';
import { isIP } from 'net';
import { DeepPartial, In, IsNull, Not } from 'typeorm';
import env from '../../config/env';
import { AiNotifConfigDAO } from '../../dao/aiNotifyConfig.dao';
import { B2BFarmInfrastructureDAO } from '../../dao/b2b/b2b.farmInfrastructure.dao';
import { B2BIotDeviceDAO } from '../../dao/b2b/b2b.iotDevice.dao';
import { IotDeviceDAO } from '../../dao/IotDevice.dao';
import { RoomDAO } from '../../dao/room.dao';
import { IotDevice } from '../../datasources/entity/pgsql/IotDevice.entity';
import { IotSensorTypeEnum } from '../../datasources/entity/pgsql/IotSensor.entity';
import {
  CreateB2BSmartCameraBody,
  EditSmartCameraBody,
  GetDeviceSensorResponseItem,
  GetRecordImagesBySensorIdResponse,
  GetSmartCameraRecordsQueryDTO,
  ImageDataItem,
  RecordImagesItem,
  RenameSmartCameraBody,
  RenameSmartCameraParams,
  RenameSmartCameraResponse,
  SmartCameraRecordsItem,
} from '../../dto/b2b/b2b.smartCamera.dto';
import { IotSensorItemBody } from '../../dto/devicesSensors.dto';
import { DATETIME_ISO_FORMAT, DEVICE_TYPE } from '../../libs/constants';
import {
  ERR_B2B_NOT_AN_ORGANIZATION_MEMBER,
  ERR_INVALID_IP,
  ERR_IOT_DEVICE_MAC_EXIST,
  ERR_IOT_SENSOR_CODE_EXIST,
} from '../../libs/constants/errors';
import { RequestUser } from '../../libs/types/index.d';
import { b2bGenerateDefaultDeviceName, b2bValidateSensorCode } from '../../libs/utils/helpers';
import { SmartCameraService } from '../smartCamera.service';

@Service()
export class B2BSmartCameraService extends SmartCameraService {
  @Inject(RoomDAO)
  private roomDAO: RoomDAO;

  @Inject(IotDeviceDAO)
  private iotDeviceDAO: IotDeviceDAO;

  @Inject(B2BIotDeviceDAO)
  private b2bIotDeviceDAO: B2BIotDeviceDAO;

  @Inject(B2BFarmInfrastructureDAO)
  private b2bFarmInfraDAO: B2BFarmInfrastructureDAO;

  @Inject(AiNotifConfigDAO)
  private aiNotifConfigDAO: AiNotifConfigDAO;

  async createSmartCamera(opts: {
    body: CreateB2BSmartCameraBody;
    user: RequestUser;
  }): Promise<GetDeviceSensorResponseItem> {
    const { body, user } = opts;

    if (!user.organizationId) {
      throw ERR_B2B_NOT_AN_ORGANIZATION_MEMBER();
    }

    const room = await this.roomDAO.getOneStrict({
      where: { id: body.roomId },
    });

    const duplicate = await this.iotDeviceDAO.getOne({
      where: {
        mac: body.mac,
        status: true,
        deletedDate: IsNull(),
        roomId: room.id,
      },
    });

    if (duplicate) {
      throw ERR_IOT_DEVICE_MAC_EXIST();
    }

    const queryRunner = await this.iotDeviceDAO.startTransaction();

    try {
      const farmInfra = await this.b2bFarmInfraDAO.getOneStrict({
        where: {
          coopId: body.coopId,
          organizationId: user.organizationId,
        },
      });

      let transactionHooks: Function[] = [];

      if (body.sensors) {
        const sensorCodes = body.sensors.map((sensor) => sensor.sensorCode);

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

        for (let i = 0; i < body.sensors.length; i += 1) {
          const sensor = body.sensors[i];

          b2bValidateSensorCode(IotSensorTypeEnum.CAMERA, sensor.sensorCode);
        }

        transactionHooks = body.sensors.map((sensor) =>
          this.iotSensorDAO.wrapUpsertHook(
            sensor.sensorCode,
            IotSensorTypeEnum.CAMERA,
            'A1',
            1,
            body.roomId,
            user.id,
            undefined,
          ),
        );
      }

      const device = await this.iotDeviceDAO.createOneWithTx(
        {
          status: true,
          isOnline: true,
          mac: body.mac.slice(-17),
          sensors: body.sensors.map((sensor) => ({
            sensorCode: sensor.sensorCode,
            sensorType: IotSensorTypeEnum.CAMERA,
            status: 1,
            position: 'A1',
            roomId: body.roomId,
            ipCamera: null,
          })),
          deviceType: DEVICE_TYPE.SMART_CAMERA.value as keyof typeof DEVICE_TYPE,
          farmId: farmInfra.farmId,
          buildingId: farmInfra.buildingId,
          coopId: farmInfra.coopId,
          roomId: body.roomId,
        },
        user,
        queryRunner,
        transactionHooks,
      );

      const [, countCamera] = await this.b2bIotDeviceDAO.getMany({
        where: {
          farmInfrastructureId: farmInfra.id,
          iotDevice: {
            deviceType: DEVICE_TYPE.SMART_CAMERA.value as keyof typeof DEVICE_TYPE,
            deletedDate: IsNull(),
          },
        },
      });

      await this.b2bIotDeviceDAO.createOneWithTx(
        {
          b2bDeviceName: b2bGenerateDefaultDeviceName(device.deviceType, countCamera + 1),
          farmInfrastructureId: farmInfra.id,
          deviceId: device.id,
        },
        user,
        queryRunner,
      );

      await this.iotSensorDAO.commitTransaction(queryRunner);

      if (env.B2B_DEVICE_INTEGRATION_IS_ACTIVE) {
        this.registerSmartCamera(device);
      }

      const createdDeviceSensor = await this.iotDeviceDAO.getOneStrict({
        where: { id: device.id },
        relations: {
          coop: {
            farm: true,
          },
          room: true,
          sensors: {
            room: true,
          },
        },
      });

      return this.mapEntityToDTO(createdDeviceSensor);
    } catch (error) {
      await this.iotSensorDAO.rollbackTransaction(queryRunner);

      throw error;
    }
  }

  async getCameraRecords(opts: {
    coopId: string;
    user: RequestUser;
    query?: GetSmartCameraRecordsQueryDTO;
  }): Promise<[SmartCameraRecordsItem[], number]> {
    const coop = await this.coopDAO.getOneStrict({
      where: { id: opts.coopId },
    });

    const result = await this.smartCameraJobDAO.getSensorAndSmartCameraRecordsCount(
      coop.id,
      opts.query?.roomId,
    );

    const [sensors] = await this.iotSensorDAO.getMany({
      where: {
        id: In(result.map((s) => s.sensorId)),
        roomId: opts.query?.roomId ? opts.query.roomId : undefined,
      },
      relations: {
        room: {
          coop: {
            farm: true,
          },
          building: true,
          roomType: true,
        },
      },
    });

    return [
      sensors.map((sensor) => ({
        sensor: {
          ...sensor,
          ipCamera: null,
          position: sensor.position || 'A1',
          room: {
            ...sensor.room,
            coop: {
              id: sensor.room.coop?.farm.id || '',
              coopCode: sensor.room.coop?.coopCode || '',
              coopName: sensor.room.coop?.coopName || '',
              ...sensor.room.coop,
              farm: {
                id: sensor.room.coop?.farm.id || '',
                farmCode: sensor.room.coop?.farm.farmCode || '',
                farmName: sensor.room.coop?.farm.farmName || '',
                ...sensor.room.coop?.farm,
              },
            },
          },
        },
        recordCount: result.find((item) => item.sensorId === sensor.id)?.jobCount || 0,
      })),
      result.length,
    ];
  }

  async getB2BRecordImages(opts: {
    coopId: string;
    endDate?: string;
    limit?: number;
    page?: number;
    sensorId?: string;
    user: RequestUser;
  }): Promise<[RecordImagesItem | null, number]> {
    const coop = await this.coopDAO.getOneStrict({
      where: { id: opts.coopId },
    });

    const [sensors] = await this.iotSensorDAO.getMany({
      where: {
        id: opts.sensorId,
        deletedDate: IsNull(),
        sensorType: IotSensorTypeEnum.CAMERA,
        room: {
          coop: {
            id: opts.coopId,
          },
        },
      },
    });

    const sensorIds = sensors.map((sensor) => sensor.id);

    const dateFilter = {
      max: new Date(),
    };

    if (opts.endDate) {
      dateFilter.max = new Date(opts.endDate);
    }

    const [records, count] = await this.smartCameraJobDAO.getMany({
      where: {
        sensorId: In(sensorIds),
      },
      relations: {
        sensor: {
          room: {
            roomType: true,
            building: true,
          },
        },
        crowdResults: true,
        manualChecking: true,
      },
      take: opts.limit,
      skip: opts.limit && opts.page ? opts.limit * (opts.page - 1) : undefined,
      order: {
        createdAt: 'DESC',
      },
    });

    const result: ImageDataItem[] = [];

    await Promise.all(
      records.map(async (record) => {
        const resultData = {
          sensor: record.sensor,
          temperature: null,
          humidity: null,
          link: `${env.AI_URL}${record.bucket}/${env.SMART_CAMERA_FOLDER}/chicken-behavior/coop_${record.coopId}/room_${record.floorId}/cam_${record.sensorId}/${record.imagePath}`,
          createdAt: format(parseISO(record.createdAt.toISOString()), DATETIME_ISO_FORMAT),
        };

        const { temperature, humidity } =
          await this.sensorESDAO.getRelativeTemperatureHumidityByCoopCode({
            coopCode: coop.coopCode,
            timestamp: record.createdAt,
          });

        const { pplActualProbability } = record.manualChecking || {};
        result.push({
          ...resultData,
          temperature,
          humidity,
          jobId: record.id,
          isCrowded:
            pplActualProbability !== undefined && pplActualProbability !== null
              ? pplActualProbability === 100
              : null,
          remarks: record.manualChecking?.pplRemarks || '',
        });
      }),
    );

    return [
      {
        records: result
          .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
          .map((record, index) => ({
            ...record,
            seqNo: count - index - (opts.limit || 0) * (opts.page ? opts.page - 1 : 0),
          })),
      },
      count,
    ];
  }

  async getB2BRecordingImagesBySensorId(opts: {
    coopId: string;
    endDate?: string;
    limit?: number;
    page?: number;
    sensorId: string;
    startDate?: string;
    user: RequestUser;
  }): Promise<GetRecordImagesBySensorIdResponse> {
    const sensor = await this.iotSensorDAO.getOneStrict({
      where: {
        id: opts.sensorId,
      },
      relations: {
        room: {
          roomType: true,
          building: true,
        },
      },
    });

    const [result, count] = await this.getB2BRecordImages(opts);

    return {
      code: 200,
      count,
      data: {
        buildingName: sensor.room.building.name,
        roomTypeName: sensor.room.roomType.name,
        records: result?.records || null,
      },
    };
  }

  async renameSmartCameraDevice(
    param: RenameSmartCameraParams,
    input: RenameSmartCameraBody,
    user: RequestUser,
  ): Promise<RenameSmartCameraResponse> {
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
        code: 200,
        data: {
          deviceId: param.deviceId,
          deviceName: input.deviceName,
        },
      };
    } catch (error) {
      await this.b2bIotDeviceDAO.rollbackTransaction(queryRunner);

      throw error;
    }
  }

  async registerSmartCamera(data: IotDevice) {
    data.sensors?.forEach(async (sensor) => {
      if (!sensor.additional.ipCamera || isIP(sensor.additional.ipCamera) === 0) {
        throw ERR_INVALID_IP;
      }

      this.smartCameraPublisher.sendRegisterCameraCommand({
        deviceId: data.mac.replace(/:/g, '').toLowerCase(),
        sensorCode: sensor.sensorCode,
        ipCamera: sensor.additional.ipCamera,
      });
    });
  }

  async editSmartCameraDevice(opts: {
    deviceId: string;
    body: EditSmartCameraBody;
    user: RequestUser;
  }): Promise<GetDeviceSensorResponseItem> {
    const { body, user, deviceId } = opts;

    if (!user.organizationId) {
      throw ERR_B2B_NOT_AN_ORGANIZATION_MEMBER();
    }

    const currentDevice = await this.iotDeviceDAO.getOneStrict({
      where: { id: deviceId },
    });

    const queryRunner = await this.iotDeviceDAO.startTransaction();

    try {
      if (body.sensors) {
        const sensorCodes = body.sensors.map((sensor) => sensor.sensorCode);

        const [, existingSensorsCount] = await this.iotSensorDAO.getMany({
          where: {
            iotDeviceId: Not(deviceId),
            sensorCode: In(sensorCodes),
            status: 1,
            deletedDate: IsNull(),
          },
        });

        if (existingSensorsCount > 0) {
          throw ERR_IOT_SENSOR_CODE_EXIST();
        }

        for (let i = 0; i < body.sensors.length; i += 1) {
          const sensor = body.sensors[i];

          b2bValidateSensorCode(IotSensorTypeEnum.CAMERA, sensor.sensorCode);
        }

        const [existingSensors] = await this.iotSensorDAO.getMany({
          where: {
            iotDeviceId: deviceId,
          },
        });

        const cameraSensorIds = existingSensors.reduce((prev, sensor) => {
          if (sensor.sensorType === 'CAMERA') return [...prev, sensor.id];

          return prev;
        }, [] as string[]);

        await this.aiNotifConfigDAO.deleteMany({
          sensorId: In(cameraSensorIds),
        });

        const [currentSensors] = await this.iotSensorDAO.getMany({
          where: {
            iotDeviceId: deviceId,
            deletedDate: IsNull(),
          },
        });

        await this.iotSensorDAO.upsertManySensors(
          user,
          body.sensors.map<DeepPartial<IotSensorItemBody>>((sensor) => ({
            ...sensor,
            id: currentSensors.find((i) => i.sensorCode === sensor.sensorCode)?.id || undefined,
            status: 1,
            sensorType: IotSensorTypeEnum.CAMERA,
            position: 'A1',
            iotDeviceId: deviceId,
            roomId: currentDevice.roomId,
          })),
          {
            qr: queryRunner,
          },
        );

        await this.iotDeviceDAO.updateOneWithTx(
          { id: deviceId },
          {
            ...currentDevice,
            status: body.status === 'active',
            isOnline: currentDevice.isOnline,
            mac: currentDevice.mac,
            firmWareVersion: currentDevice.firmWareVersion,
            deviceType: currentDevice.deviceType,
          },
          user,
          queryRunner,
        );
      }
      await this.iotSensorDAO.commitTransaction(queryRunner);

      const updatedDevice = await this.iotDeviceDAO.getOneStrict({
        where: { id: deviceId },
        relations: {
          coop: {
            farm: true,
          },
          room: true,
          sensors: {
            room: true,
          },
        },
      });

      return this.mapEntityToDTO(updatedDevice);
    } catch (error) {
      await this.iotSensorDAO.rollbackTransaction(queryRunner);

      throw error;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  private mapEntityToDTO(data: IotDevice): GetDeviceSensorResponseItem {
    return {
      ...data,
      registrationDate: data.registrationDate.toISOString(),
      status: data.status ? 'active' : 'inactive',
      sensors: data.sensors.map((sensor) => ({
        ...sensor,
        ipCamera: null,
        position: sensor.position || 'A1',
      })),
      createdDate: data.createdDate.toISOString(),
      modifiedDate: data.modifiedDate.toISOString(),
    };
  }
}
