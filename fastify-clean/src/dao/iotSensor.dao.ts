import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import {
  DeepPartial,
  EntityNotFoundError,
  FindOneOptions, QueryRunner,
} from 'typeorm';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { IotDevice } from '../datasources/entity/pgsql/IotDevice.entity';
import { IotSensor, IotSensorTypeEnum } from '../datasources/entity/pgsql/IotSensor.entity';
import { DEFAULT_TIME_ZONE } from '../libs/constants';
import { ERR_IOT_SENSOR_INSERT_FAILED, ERR_IOT_SENSOR_NOT_FOUND } from '../libs/constants/errors';
import { RequestUser } from '../libs/types/index.d';
import { randomHexString } from '../libs/utils/helpers';
import { BaseSQLDAO } from './base.dao';

export interface ESTimeRange {
  to: Date;
  from: Date;
}

// implement pointer elasticsearch new
export interface SearchOptions {
  rows: Number;
  pit?: Object;
  current?: any;
}

@Service()
export class IOTSensorDAO extends BaseSQLDAO<IotSensor> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(IotSensor);
  }

  // eslint-disable-next-line class-methods-use-this
  async upsertOneWithTx(
    data: Partial<IotSensor>,
    userId: string,
    queryRunner: QueryRunner,
  ): Promise<Partial<IotSensor>> {
    const existing = await queryRunner.manager.findOne(IotSensor, {
      where: {
        id: data.id,
        sensorCode: data.sensorCode,
      },
    });

    try {
      if (data.id && existing) {
        await queryRunner.manager.update(
          IotSensor,
          {
            id: existing.id,
          },
          {
            ...data,
          },
        );

        return existing;
      }

      const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

      const sensor = queryRunner.manager.create(IotSensor, {
        ...data,
        id: randomHexString(),
        createdBy: userId,
        createdDate: now,
        modifiedBy: userId,
        modifiedDate: now,
      });

      await queryRunner.manager.save(sensor);

      return sensor;
    } catch (error) {
      throw new Error(error);
    }
  }

  wrapUpsertHook(
    name: string,
    sensorType: keyof typeof IotSensorTypeEnum,
    position: string | null,
    status: number,
    roomId: string | null,
    userId: string,
    additional: Object | undefined,
  ): Function {
    return (device: IotDevice, queryRunner: QueryRunner) =>
      this.upsertOneWithTx(
        {
          sensorCode: name,
          sensorType,
          position,
          status,
          additional,
          roomId,
          iotDeviceId: device.id,
        },
        userId,
        queryRunner,
      );
  }

  async deleteByIotDeviceId(
    iotDeviceId: string,
    opts?: {
      qr?: QueryRunner;
    },
  ) {
    await this.repository
      .createQueryBuilder(undefined, opts && opts.qr)
      .where('ref_iot_device_id = :iotDeviceId', { iotDeviceId })
      .delete()
      .execute();
  }

  // eslint-disable-next-line class-methods-use-this
  async createManyWithTx(
    data: DeepPartial<IotSensor>[],
    user: RequestUser,
    queryRunner: QueryRunner,
    transactionHooks?: Function[],
  ): Promise<IotSensor[]> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const items = queryRunner.manager.create(
      IotSensor,
      data.map<DeepPartial<IotSensor>>((input) => ({
        ...input,
        id: input.id || randomHexString(),
        createdBy: user.id,
        createdDate: now,
        modifiedBy: user.id,
        modifiedDate: now,
      })),
    );

    const result = await queryRunner.manager.save(IotSensor, items);

    transactionHooks?.reduce(async (prev, trxHook) => {
      await prev;

      return trxHook(items, queryRunner);
    }, Promise.resolve());

    return result;
  }

  async upsertManySensors(
    user: RequestUser,
    items: DeepPartial<IotSensor>[],
    opts?: {
      qr?: QueryRunner;
    },
  ): Promise<IotSensor[]> {
    if (!items.length) return [];

    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const upsertItems = items.map<DeepPartial<IotSensor>>((item) => ({
      ...item,
      id: item.id || randomHexString(),
      createdBy: user.id,
      createdDate: now,
      modifiedBy: user.id,
      modifiedDate: now,
    }));

    await this.repository
      .createQueryBuilder(undefined, opts && opts.qr)
      .insert()
      .into(IotSensor)
      .values(upsertItems)
      .orUpdate(
        [
          'sensor_code',
          'sensor_type',
          'status',
          'ref_room_id',
          'position',
          'additional',
          'deleted_date',
          'modified_by',
          'modified_date',
        ],
        ['id'],
      )
      .execute();

    const [results, count] = await this.repository
      .createQueryBuilder(undefined, opts && opts.qr)
      .where('id IN (:...ids)', {
        ids: upsertItems.map((item) => item.id),
      })
      .getManyAndCount();

    if (count !== upsertItems.length) {
      throw ERR_IOT_SENSOR_INSERT_FAILED('result count not match');
    }

    return results;
  }

  async getOneStrict(params: FindOneOptions<IotSensor>): Promise<IotSensor> {
    try {
      const sensor = await this.repository.findOneOrFail(params);

      return sensor;
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw ERR_IOT_SENSOR_NOT_FOUND(error.message);
      }

      throw error;
    }
  }
}
