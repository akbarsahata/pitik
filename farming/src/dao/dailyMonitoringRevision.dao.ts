/* eslint-disable class-methods-use-this */
import { randomUUID } from 'crypto';
import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import { DeepPartial, EntityNotFoundError, FindOneOptions, QueryRunner } from 'typeorm';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { DailyMonitoringRevision } from '../datasources/entity/pgsql/DailyMonitoringRevision.entity';
import { DEFAULT_TIME_ZONE } from '../libs/constants';
import { ERR_DAILY_REPORT_REVISION_NOT_FOUND } from '../libs/constants/errors';
import { RequestUser } from '../libs/types/index.d';
import { BaseSQLDAO } from './base.dao';

@Service()
export class DailyMonitoringRevisionDAO extends BaseSQLDAO<DailyMonitoringRevision> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  async init() {
    this.repository = this.pSql.connection.getRepository(DailyMonitoringRevision);
  }

  async createOneWithTx(
    data: DeepPartial<DailyMonitoringRevision>,
    user: RequestUser,
    queryRunner: QueryRunner,
  ): Promise<DailyMonitoringRevision> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const entity = queryRunner.manager.create(DailyMonitoringRevision, {
      ...data,
      id: data.id || randomUUID(),
      createdBy: user.id,
      createdDate: data.createdDate || now,
      modifiedBy: user.id,
      modifiedDate: now,
    });

    const createdEntity = await queryRunner.manager.save(DailyMonitoringRevision, entity);

    return createdEntity;
  }

  async getOneStrict(
    params: FindOneOptions<DailyMonitoringRevision>,
  ): Promise<DailyMonitoringRevision> {
    try {
      return this.repository.findOneOrFail(params);
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw ERR_DAILY_REPORT_REVISION_NOT_FOUND(error.message);
      }

      throw error;
    }
  }
}
