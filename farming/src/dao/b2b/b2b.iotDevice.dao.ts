import { randomUUID } from 'crypto';
import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import { EntityNotFoundError, FindOneOptions, FindOptionsWhere, QueryRunner } from 'typeorm';
import { PostgreSQLConnection } from '../../datasources/connection/postgresql.connection';
import { B2BIotDevice } from '../../datasources/entity/pgsql/b2b/B2BIotDevice.entity';
import { DEFAULT_TIME_ZONE } from '../../libs/constants';
import { ERR_IOT_DEVICE_NOT_FOUND } from '../../libs/constants/errors';
import { RequestUser } from '../../libs/types/index.d';
import { BaseSQLDAO } from '../base.dao';

@Service()
export class B2BIotDeviceDAO extends BaseSQLDAO<B2BIotDevice> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(B2BIotDevice);
  }

  async getOneStrict(params: FindOneOptions<B2BIotDevice>): Promise<B2BIotDevice> {
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

  // eslint-disable-next-line class-methods-use-this
  async createOneWithTx(
    data: Partial<B2BIotDevice>,
    user: RequestUser,
    queryRunner: QueryRunner,
  ): Promise<B2BIotDevice> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const item = queryRunner.manager.create(B2BIotDevice, {
      ...data,
      id: randomUUID(),
      createdBy: user.id,
      createdDate: now,
      modifiedBy: user.id,
      modifiedDate: now,
    });

    const newBuilding = await queryRunner.manager.save(B2BIotDevice, item);

    return newBuilding;
  }

  // eslint-disable-next-line class-methods-use-this
  async updateOneWithTx(
    params: FindOptionsWhere<B2BIotDevice>,
    data: Partial<B2BIotDevice>,
    user: Partial<RequestUser>,
    queryRunner: QueryRunner,
  ) {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    await queryRunner.manager.update(B2BIotDevice, params, {
      ...data,
      modifiedBy: user.id,
      modifiedDate: now,
    });

    const updated = await queryRunner.manager.findOneOrFail(B2BIotDevice, {
      where: {
        ...((params.id && {
          id: params.id,
        }) ||
          params),
      },
    });

    return updated;
  }

  // eslint-disable-next-line class-methods-use-this
  async deleteOneWithTx(
    params: FindOptionsWhere<B2BIotDevice>,
    queryRunner: QueryRunner,
  ): Promise<B2BIotDevice> {
    const toBeDeleted = await queryRunner.manager.findOneOrFail(B2BIotDevice, { where: params });

    await queryRunner.manager.delete(B2BIotDevice, {
      id: toBeDeleted.id,
    });

    return toBeDeleted;
  }
}
