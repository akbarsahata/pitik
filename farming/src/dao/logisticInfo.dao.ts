import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import {
  DeepPartial,
  EntityNotFoundError,
  FindOneOptions,
  FindOptionsWhere,
  QueryRunner,
} from 'typeorm';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { LogisticInfo } from '../datasources/entity/pgsql/LogisticInfo.entity';
import { DEFAULT_TIME_ZONE } from '../libs/constants';
import { ERR_LOGISTIC_INFO_NOT_FOUND } from '../libs/constants/errors';
import { RequestUser } from '../libs/types/index.d';
import { randomHexString } from '../libs/utils/helpers';
import { BaseSQLDAO } from './base.dao';

@Service()
export class LogisticInfoDAO extends BaseSQLDAO<LogisticInfo> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(LogisticInfo);
  }

  async getOneStrict(params: FindOneOptions<LogisticInfo>): Promise<LogisticInfo> {
    try {
      const purchaseReq = await this.repository.findOneOrFail(params);

      return purchaseReq;
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw ERR_LOGISTIC_INFO_NOT_FOUND(error.message);
      }

      throw error;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async createOneWithTx(
    data: DeepPartial<LogisticInfo>,
    user: RequestUser,
    queryRunner: QueryRunner,
  ): Promise<LogisticInfo> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const purchaseReq = queryRunner.manager.create(LogisticInfo, {
      ...data,
      id: randomHexString(),
      createdBy: user.id,
      createdDate: now,
      modifiedBy: user.id,
      modifiedDate: now,
    });

    const newLogisticInfo = await queryRunner.manager.save(LogisticInfo, purchaseReq);

    return newLogisticInfo;
  }

  // eslint-disable-next-line class-methods-use-this
  async updateOneWithTx(
    params: FindOptionsWhere<LogisticInfo>,
    data: DeepPartial<LogisticInfo>,
    user: RequestUser,
    queryRunner: QueryRunner,
  ): Promise<LogisticInfo> {
    await queryRunner.manager.update(LogisticInfo, params, {
      ...data,
      modifiedBy: user.id,
      modifiedDate: utcToZonedTime(new Date(), DEFAULT_TIME_ZONE),
    });

    const updatedLogisticInfo = await queryRunner.manager.findOneOrFail(LogisticInfo, {
      where: {
        ...((params.id && {
          id: params.id,
        }) ||
          params),
      },
    });

    return updatedLogisticInfo;
  }

  // eslint-disable-next-line class-methods-use-this
  async deleteOneWithTx(
    params: FindOptionsWhere<LogisticInfo>,
    queryRunner: QueryRunner,
  ): Promise<LogisticInfo> {
    const toBeDeleted = await queryRunner.manager.findOneOrFail(LogisticInfo, { where: params });

    await queryRunner.manager.delete(LogisticInfo, {
      id: toBeDeleted.id,
    });

    return toBeDeleted;
  }
}
