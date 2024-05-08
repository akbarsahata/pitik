/* eslint-disable class-methods-use-this */
import { randomUUID } from 'crypto';
import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import { DeepPartial, FindOptionsWhere, QueryRunner } from 'typeorm';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { DailyMonitoringMortality } from '../datasources/entity/pgsql/DailyMonitoringMortality.entity';
import { DEFAULT_TIME_ZONE } from '../libs/constants';
import { ERR_DAILY_MONITORING_MORTALITY_UPSERT_FAILED } from '../libs/constants/errors';
import { RequestUser } from '../libs/types/index.d';
import { BaseSQLDAO } from './base.dao';

@Service()
export class DailyMonitoringMortalityDAO extends BaseSQLDAO<DailyMonitoringMortality> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(DailyMonitoringMortality);
  }

  async upsertMany(
    user: RequestUser,
    items: DeepPartial<DailyMonitoringMortality>[],
    opts?: {
      qr?: QueryRunner;
    },
  ): Promise<DailyMonitoringMortality[]> {
    if (items.length === 0) return [];

    const { dailyMonitoringId } = items[0];
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);
    const upsertItems = items.map<DeepPartial<DailyMonitoringMortality>>((item) => ({
      ...item,
      id: item.id || randomUUID(),
      createdBy: user.id,
      createdDate: now,
      modifiedBy: user.id,
      modifiedDate: now,
      deletedDate: null,
    }));

    await this.repository
      .createQueryBuilder(undefined, opts && opts.qr)
      .insert()
      .into(DailyMonitoringMortality)
      .values(upsertItems)
      .orUpdate(['quantity', 'cause', 'modified_by', 'modified_date', 'deleted_date'], ['id'])
      .execute();

    const [results, count] = await this.repository
      .createQueryBuilder(undefined, opts && opts.qr)
      .where('dailymonitoring_id = :dailyMonitoringId', { dailyMonitoringId })
      .getManyAndCount();

    if (count !== upsertItems.length) {
      throw ERR_DAILY_MONITORING_MORTALITY_UPSERT_FAILED('result count not match');
    }

    return results;
  }

  async softDeleteManyWithTx(
    where: FindOptionsWhere<DailyMonitoringMortality>,
    queryRunner: QueryRunner,
  ): Promise<DailyMonitoringMortality[]> {
    const toBeDeleted = await queryRunner.manager.find(DailyMonitoringMortality, { where });

    await queryRunner.manager.softDelete(DailyMonitoringMortality, where);

    return toBeDeleted;
  }
}
