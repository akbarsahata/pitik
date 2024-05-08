/* eslint-disable no-param-reassign */
/* eslint-disable class-methods-use-this */
import { randomUUID } from 'crypto';
import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import {
  DeepPartial,
  EntityNotFoundError,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  In,
  IsNull,
  QueryRunner,
  Repository,
} from 'typeorm';
import { MqttConnection } from '../datasources/connection/mqtt.connection';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { IotDevice } from '../datasources/entity/pgsql/IotDevice.entity';
import { IotFirmware } from '../datasources/entity/pgsql/IotFirmware.entity';
import {
  AssignDeviceOtasBody,
  CreateDevicesSensorsBody,
  ResetIdDevicesSensorsBody,
  SetDeviceEnum,
  SetIdDevicesSensorsBody,
  UpdateDevicesSensorsBody,
} from '../dto/devicesSensors.dto';
import { DEFAULT_TIME_ZONE } from '../libs/constants';
import {
  ERR_IOT_DEVICE_MULTIPLE_TYPES_OR_NO_TYPE,
  ERR_IOT_DEVICE_NOT_FOUND,
  ERR_IOT_DEVICE_TYPE_NOT_MATCH,
} from '../libs/constants/errors';
import { DEVICE_STATUS_TOPIC } from '../libs/constants/mqttTopic';
import { RequestUser } from '../libs/types/index.d';
import { BaseSQLDAO } from './base.dao';

@Service()
export class IotDeviceDAO extends BaseSQLDAO<IotDevice> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Inject(MqttConnection)
  private mqtt!: MqttConnection;

  private firmwareRepository: Repository<IotFirmware>;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(IotDevice);
    this.firmwareRepository = this.pSql.connection.getRepository(IotFirmware);
  }

  async getOneStrict(params: FindOneOptions<IotDevice>): Promise<IotDevice> {
    try {
      const device = await this.repository.findOneOrFail(params);

      return device;
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw ERR_IOT_DEVICE_NOT_FOUND(error.message);
      }

      throw error;
    }
  }

  async getOneById(id: string): Promise<IotDevice> {
    try {
      const device = await this.repository.findOneOrFail({
        relations: {
          coop: {
            farm: true,
          },
          room: {
            roomType: true,
            building: {
              buildingType: true,
            },
            controllerType: true,
          },
        },
        where: {
          id,
        },
      });

      return device;
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw ERR_IOT_DEVICE_NOT_FOUND(error.message);
      }

      throw error;
    }
  }

  async getManyDevicesSensors(params: FindManyOptions<IotDevice>): Promise<[IotDevice[], number]> {
    const results = await this.repository.findAndCount({
      ...params,
      relations: {
        coop: {
          farm: true,
        },
        room: {
          roomType: true,
          building: {
            buildingType: true,
          },
          controllerType: true,
        },
        sensors: {
          room: {
            roomType: true,
          },
        },
      },
    });

    return results;
  }

  async updateDevicesSensors(
    params: FindOptionsWhere<IotDevice>,
    data: DeepPartial<UpdateDevicesSensorsBody>,
    user?: RequestUser,
  ): Promise<IotDevice> {
    if (data.roomId === '') {
      data.roomId = undefined;
    }

    const entity = await this.repository.update(params, {
      ...data,
      modifiedBy: user ? user.id : undefined,
      modifiedDate: new Date(),
    });

    if (!entity.affected) {
      throw ERR_IOT_DEVICE_NOT_FOUND();
    }

    if (data.mac) {
      const topic = DEVICE_STATUS_TOPIC + data.mac;
      /* prettier-ignore */
      const sensor = data.sensors
        ? data.sensors
          .filter((s) => s.sensorCode !== undefined)
          .map<string>((s) => s.sensorCode as string)
          .join(',')
        : '';
      this.mqtt.client.subscribe(topic, { qos: 1 }, (error) => {
        if (!error) {
          this.mqtt.client.publish(topic, `b${sensor}`, { qos: 1, retain: false });
        }
      });
    }

    return this.repository.findOneOrFail({
      relations: {
        coop: {
          farm: true,
        },
        room: {
          roomType: true,
          building: true,
          controllerType: true,
        },
      },
      where: {
        ...((params.id && {
          id: params.id,
        }) ||
          params),
      },
    });
  }

  async deleteDevicesSensors(
    params: FindOptionsWhere<IotDevice>,
    user: RequestUser,
  ): Promise<IotDevice> {
    const result = await this.repository.update(params, {
      modifiedBy: user.id,
      deletedDate: new Date(),
    });

    if (!result.affected) {
      throw ERR_IOT_DEVICE_NOT_FOUND();
    }

    const updated = await this.repository.findOneOrFail({
      relations: {
        coop: {
          farm: true,
        },
        room: {
          roomType: true,
          building: true,
          controllerType: true,
        },
      },
      where: {
        ...((params.id && {
          id: params.id,
        }) ||
          params),
      },
    });

    const topic = DEVICE_STATUS_TOPIC + updated.mac;

    this.mqtt.client.subscribe(topic, { qos: 1 }, (error) => {
      if (!error) {
        this.mqtt.client.publish(topic, 'r', { qos: 1, retain: false });
      }
    });

    return updated;
  }

  async setId(data: SetIdDevicesSensorsBody): Promise<SetIdDevicesSensorsBody> {
    let { deviceId } = data;

    if (data.type === SetDeviceEnum.SET_COOP_CODE) {
      deviceId = `f${data.deviceId.split('-')[1]}`;
    }

    const topic = DEVICE_STATUS_TOPIC + data.macAddress;
    this.mqtt.client.subscribe(topic, { qos: 1 }, (error) => {
      if (!error) {
        this.mqtt.client.publish(topic, deviceId, { qos: 1, retain: false });
      }
    });

    return new Promise((resolve) => {
      this.mqtt.client.on('message', (_topic, message) => {
        resolve({
          macAddress: data.macAddress,
          deviceId: message.toString(),
          type: data.type,
        });
      });
    });
  }

  async resetId(data: ResetIdDevicesSensorsBody): Promise<ResetIdDevicesSensorsBody> {
    const topic = DEVICE_STATUS_TOPIC + data.macAddress;
    this.mqtt.client.subscribe(topic, { qos: 1 }, (error) => {
      if (!error) {
        this.mqtt.client.publish(topic, 'r', { qos: 1, retain: false });
      }
    });

    return new Promise((resolve) => {
      this.mqtt.client.on('message', () => {
        resolve({
          macAddress: data.macAddress,
        });
      });
    });
  }

  async assignDevicesOtas(data: AssignDeviceOtasBody, user: RequestUser): Promise<IotDevice[]> {
    const firmware = await this.firmwareRepository.findOneOrFail({
      where: {
        id: data.firmwareId,
      },
    });

    const [toBeUpdatedDevices] = await this.getMany({
      where: {
        id: In(data.deviceIds),
        deletedDate: IsNull(),
      },
    });

    if (toBeUpdatedDevices.length !== data.deviceIds.length) {
      throw ERR_IOT_DEVICE_NOT_FOUND();
    }

    const deviceTypes = new Set<string>();

    toBeUpdatedDevices.forEach((device) => {
      if (device) {
        deviceTypes.add(device.deviceType);
      }
    });

    if (deviceTypes.size !== 1) {
      throw ERR_IOT_DEVICE_MULTIPLE_TYPES_OR_NO_TYPE();
    }

    if ([...deviceTypes][0] !== firmware.deviceType) {
      throw ERR_IOT_DEVICE_TYPE_NOT_MATCH();
    }

    const entity = await this.repository.update(
      {
        id: In(data.deviceIds),
      },
      {
        firmWareVersion: firmware.version,
        modifiedBy: user.id,
        modifiedDate: new Date(),
      },
    );

    if (!entity.affected) {
      throw ERR_IOT_DEVICE_NOT_FOUND();
    }

    return this.repository.find({
      relations: {
        coop: {
          farm: true,
        },
        room: {
          roomType: true,
          building: true,
          controllerType: true,
        },
      },
      where: {
        id: In(data.deviceIds),
      },
    });
  }

  // eslint-disable-next-line class-methods-use-this
  async createOneWithTx(
    data: Partial<CreateDevicesSensorsBody>,
    userRequest: RequestUser,
    queryRunner: QueryRunner,
    transactionHooks?: Function[],
  ): Promise<IotDevice> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const device = queryRunner.manager.create(IotDevice, {
      ...data,
      id: randomUUID(),
      createdBy: userRequest.id,
      createdDate: now,
      modifiedBy: userRequest.id,
      modifiedDate: now,
      registrationDate: now,
    });

    const result = await queryRunner.manager.save(IotDevice, device);

    const promises = transactionHooks?.map((trxHook) => trxHook(device, queryRunner));
    await Promise.all(promises || []);

    return result;
  }

  // eslint-disable-next-line class-methods-use-this
  async updateOneWithTx(
    params: FindOptionsWhere<IotDevice>,
    data: Partial<IotDevice>,
    user: RequestUser,
    queryRunner: QueryRunner,
    transactionHooks?: Function[],
  ): Promise<IotDevice> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    await queryRunner.manager.update(IotDevice, params, {
      ...data,
      modifiedBy: user.id,
      modifiedDate: now,
    });

    const updatedDevice = await queryRunner.manager.findOneOrFail(IotDevice, {
      where: {
        ...((params.id && {
          id: params.id,
        }) ||
          params),
      },
    });

    const promises = transactionHooks?.map((trxHook) => trxHook(updatedDevice, queryRunner));
    await Promise.all(promises || []);

    return updatedDevice;
  }
}
