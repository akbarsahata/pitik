import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import { EntityNotFoundError, FindOneOptions, FindOptionsWhere, QueryRunner } from 'typeorm';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { AlertPreset } from '../datasources/entity/pgsql/AlertPreset.entity';
import { User } from '../datasources/entity/pgsql/User.entity';
import { DEFAULT_TIME_ZONE } from '../libs/constants';
import { ERR_ALERT_PRESET_NOT_FOUND } from '../libs/constants/errors';
import { RequestUser } from '../libs/types/index.d';
import { randomHexString } from '../libs/utils/helpers';
import { BaseSQLDAO } from './base.dao';

@Service()
export class AlertPresetDAO extends BaseSQLDAO<AlertPreset> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(AlertPreset);
  }

  async getOneStrict(params: FindOneOptions<AlertPreset>): Promise<AlertPreset> {
    try {
      const alertPreset = await this.repository.findOneOrFail(params);

      return alertPreset;
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw ERR_ALERT_PRESET_NOT_FOUND(error.message);
      }

      throw error;
    }
  }

  async getOneById(id: string): Promise<AlertPreset> {
    try {
      return this.repository.findOneOrFail({
        where: {
          id,
        },
        select: {
          coopType: {
            id: true,
            coopTypeCode: true,
            coopTypeName: true,
          },
        },
        relations: {
          coopType: true,
        },
      });
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw ERR_ALERT_PRESET_NOT_FOUND(error.message);
      }

      throw error;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async createOneWithTx(
    data: Partial<AlertPreset>,
    userRequest: Partial<User>,
    queryRunner: QueryRunner,
    transactionHooks?: Function[],
  ): Promise<AlertPreset> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const alertPreset = queryRunner.manager.create(AlertPreset, {
      ...data,
      id: randomHexString(),
      createdBy: userRequest.id,
      createdDate: now,
      modifiedBy: userRequest.id,
      modifiedDate: now,
    });

    const result = await queryRunner.manager.save(AlertPreset, alertPreset);

    const promises = transactionHooks?.map((trxHook) => trxHook(alertPreset, queryRunner));
    await Promise.all(promises || []);

    return result;
  }

  // eslint-disable-next-line class-methods-use-this
  async updateOneWithTx(
    params: FindOptionsWhere<AlertPreset>,
    data: Partial<AlertPreset>,
    user: RequestUser,
    queryRunner: QueryRunner,
    transactionHooks?: Function[],
  ): Promise<AlertPreset> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    await queryRunner.manager.update(AlertPreset, params, {
      ...data,
      modifiedBy: user.id,
      modifiedDate: now,
    });

    const updatedCoop = await queryRunner.manager.findOneOrFail(AlertPreset, {
      where: {
        ...((params.id && {
          id: params.id,
        }) ||
          params),
      },
    });

    const promises = transactionHooks?.map((trxHook) => trxHook(updatedCoop, queryRunner));
    await Promise.all(promises || []);

    return updatedCoop;
  }
}
