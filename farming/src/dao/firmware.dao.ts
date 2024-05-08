import { randomUUID } from 'crypto';
import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import { DeepPartial, EntityNotFoundError, FindOneOptions, FindOptionsWhere } from 'typeorm';
import { FirmwareBody } from '../dto/firmware.dto';
import { DEFAULT_TIME_ZONE } from '../libs/constants';
// import { RequestUser } from '../libs/types/index.d';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { IotFirmware } from '../datasources/entity/pgsql/IotFirmware.entity';
import { User } from '../datasources/entity/pgsql/User.entity';
import { ERR_FIRMWARE_NOT_FOUND } from '../libs/constants/errors';
import { BaseSQLDAO } from './base.dao';

@Service()
export class FirmwareDAO extends BaseSQLDAO<IotFirmware> {
  @Inject(PostgreSQLConnection)
  protected pSql!: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(IotFirmware);
  }

  async createFirmware(data: DeepPartial<FirmwareBody>, user: Partial<User>): Promise<IotFirmware> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const toBeEntity = {
      ...data,
      id: randomUUID(),
      createdBy: user.id,
      createdDate: now,
      modifiedBy: user.id,
      modifiedDate: now,
    };
    const entity = this.repository.create(toBeEntity);

    const createdEntity = await this.repository.save(entity);

    return createdEntity;
  }

  async deleteFirmware(
    params: FindOptionsWhere<IotFirmware>,
    user: Partial<User>,
  ): Promise<IotFirmware> {
    const result = await this.repository.update(params, {
      modifiedBy: user.id,
      deletedDate: new Date(),
    });

    if (!result.affected) {
      throw ERR_FIRMWARE_NOT_FOUND();
    }

    return this.repository.findOneOrFail({
      where: {
        ...((params.id && {
          id: params.id,
        }) ||
          params),
      },
    });
  }

  async getOneStrict(params: FindOneOptions<IotFirmware>): Promise<IotFirmware> {
    try {
      const device = await this.repository.findOneOrFail(params);

      return device;
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw ERR_FIRMWARE_NOT_FOUND(error.message);
      }

      throw error;
    }
  }
}
