import { Initializer, Inject, Service } from 'fastify-decorators';
import { EntityNotFoundError, FindOneOptions, FindOptionsWhere, QueryRunner } from 'typeorm';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { IotDeviceSettings } from '../datasources/entity/pgsql/IotDeviceSettings.entity';
import { ERR_IOT_DEVICE_SETTINGS_NOT_FOUND } from '../libs/constants/errors';
import { BaseSQLDAO } from './base.dao';

@Service()
export class IOTDeviceSettingsDAO extends BaseSQLDAO<IotDeviceSettings> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(IotDeviceSettings);
  }

  async getOneStrict(params: FindOneOptions<IotDeviceSettings>): Promise<IotDeviceSettings> {
    try {
      const setting = await this.repository.findOneOrFail(params);

      return setting;
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw ERR_IOT_DEVICE_SETTINGS_NOT_FOUND(error.message);
      }

      throw error;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async deleteOneWithTx(
    params: FindOptionsWhere<IotDeviceSettings>,
    queryRunner: QueryRunner,
  ): Promise<IotDeviceSettings> {
    const toBeDeleted = await queryRunner.manager.findOneOrFail(IotDeviceSettings, {
      where: params,
    });

    await queryRunner.manager.delete(IotDeviceSettings, {
      id: toBeDeleted.id,
    });

    return toBeDeleted;
  }
}
