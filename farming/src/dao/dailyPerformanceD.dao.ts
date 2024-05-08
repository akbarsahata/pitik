import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import { DeepPartial, FindManyOptions, QueryRunner } from 'typeorm';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { DailyPerformanceD } from '../datasources/entity/pgsql/DailyPerformanceD.entity';
import { DEFAULT_TIME_ZONE } from '../libs/constants';
import { RequestUser } from '../libs/types/index.d';
import { randomHexString } from '../libs/utils/helpers';
import { BaseSQLDAO } from './base.dao';

@Service()
export class DailyPerformanceDDAO extends BaseSQLDAO<DailyPerformanceD> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(DailyPerformanceD);
  }

  async getMappedByDay(
    filter: FindManyOptions<DailyPerformanceD>,
  ): Promise<Map<number, DailyPerformanceD>> {
    const [results] = await this.getMany(filter);

    return results.reduce((prev, item) => {
      prev.set(item.day, item);
      return prev;
    }, new Map<number, DailyPerformanceD>());
  }

  async upsertMany(
    user: RequestUser,
    items: DeepPartial<DailyPerformanceD>[],
    queryRunner?: QueryRunner,
  ): Promise<DailyPerformanceD[]> {
    const insertItems = items.map<DeepPartial<DailyPerformanceD>>((item) => ({
      ...item,
      id: item.id || randomHexString(),
      createdBy: user.id,
      createdDate: utcToZonedTime(new Date(), DEFAULT_TIME_ZONE),
      modifiedBy: user.id,
      modifiedDate: utcToZonedTime(new Date(), DEFAULT_TIME_ZONE),
    }));

    await this.repository
      .createQueryBuilder(undefined, queryRunner)
      .insert()
      .into(DailyPerformanceD)
      .values(insertItems)
      .orUpdate(
        [
          'daily_issue',
          'summary',
          'day',
          'created_by',
          'created_date',
          'modified_by',
          'modified_date',
          'infrastructure_issues',
          'management_issues',
          'farm_input_issues',
          'disease_issues',
          'force_majeure_issues',
          'other_issues',
          'treatment',
        ],
        ['id'],
        { skipUpdateIfNoValuesChanged: true },
      )
      .execute();

    const data = await this.repository
      .createQueryBuilder(undefined, queryRunner)
      .where('id IN (:...ids)', { ids: insertItems.map((item) => item.id) })
      .getMany();

    return data;
  }

  async getLatestDistict(farmingCycleIds: string[]): Promise<Map<string, DailyPerformanceD>> {
    const map = new Map<string, DailyPerformanceD>();

    if (farmingCycleIds.length === 0) return map;

    const dailyPerformances = await this.repository
      .createQueryBuilder()
      .distinctOn(['ref_farmingcycle_id'])
      .where('summary is not null')
      .andWhere('ref_farmingcycle_id IN (:...farmingCycleIds)', { farmingCycleIds })
      .orderBy('ref_farmingcycle_id', 'DESC')
      .addOrderBy('"day"', 'DESC')
      .getMany();

    dailyPerformances.forEach((dp) => {
      map.set(dp.farmingCycleId, dp);
    });

    return map;
  }
}
