import { format } from 'date-fns';
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
  Not,
  Repository,
} from 'typeorm';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { DailyMonitoring } from '../datasources/entity/pgsql/DailyMonitoring.entity';
import { HarvestRealization } from '../datasources/entity/pgsql/HarvestRealization.entity';
import { DATE_SQL_FORMAT, DEFAULT_TIME_ZONE } from '../libs/constants';
import { ERR_DAILY_MONITORING_NOT_FOUND } from '../libs/constants/errors';
import { RequestUser } from '../libs/types/index.d';
import { randomHexString } from '../libs/utils/helpers';
import { BaseSQLDAO } from './base.dao';

@Service()
export class DailyMonitoringDAO extends BaseSQLDAO<DailyMonitoring> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  protected harvestRealizationRepo: Repository<HarvestRealization>;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(DailyMonitoring);
    this.harvestRealizationRepo = this.pSql.connection.getRepository(HarvestRealization);
  }

  async createOne(
    data: DeepPartial<DailyMonitoring>,
    user?: RequestUser,
  ): Promise<DailyMonitoring> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const toBeEntity = {
      ...data,
      id: randomHexString(),
      createdBy: user?.id || null,
      createdDate: data.createdDate || now,
      modifiedBy: user?.id || null,
      modifiedDate: now,
    };

    const entity = this.repository.create(toBeEntity);

    const createdEntity = await this.repository.save(entity);

    return createdEntity;
  }

  async updateOne(
    params: FindOptionsWhere<DailyMonitoring>,
    data: DeepPartial<DailyMonitoring>,
  ): Promise<DailyMonitoring> {
    await this.repository.update(params, {
      ...data,
    });

    // prettier-ignore
    const updated = await this.repository.findOneOrFail({
      where: {
        ...((params.farmingCycleId &&
          params.taskTicketId && {
          farmingCycleId: params.farmingCycleId,
          taskTicketId: params.taskTicketId,
        }) ||
          params),
      },
    });

    return updated;
  }

  async getOneStrict(params: FindOneOptions<DailyMonitoring>): Promise<DailyMonitoring> {
    try {
      const item = await this.repository.findOneOrFail(params);

      return item;
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw ERR_DAILY_MONITORING_NOT_FOUND(error.message);
      }

      throw error;
    }
  }

  async upsertMany(data: DeepPartial<DailyMonitoring>[]): Promise<DailyMonitoring[]> {
    await this.repository.save(data);

    const results = await this.repository.find({
      where: {
        taskTicketId: In(data.map((val) => val.taskTicketId)),
      },
    });

    return results;
  }

  /**
   * getLatestMappedByFarmingCycleId return latest daily monitoring data of farming cycle id
   * @param fcIds array of farming cycle ids
   */
  async getLatestMappedByFarmingCycleId(fcIds: string[]): Promise<Map<string, DailyMonitoring>> {
    const dailyMonitoringMap = new Map<string, DailyMonitoring>();

    if (fcIds.length === 0) {
      return dailyMonitoringMap;
    }

    const sql = this.repository
      .createQueryBuilder('dm')
      .innerJoin(
        (qb) =>
          qb
            .from(DailyMonitoring, 'dm2')
            .select(['dm2.ref_farmingcycle_id as "ref_farmingcycle_id"', 'max(dm2.day) as "day"'])
            .where('dm2.ref_farmingcycle_id IN (:...fcIds)', { fcIds })
            .distinct(true)
            .distinctOn(['dm2.ref_farmingcycle_id'])
            .groupBy('dm2.ref_farmingcycle_id'),
        'dm2',
        '"dm2"."ref_farmingcycle_id" = dm.ref_farmingcycle_id AND "dm2"."day" = dm.day',
      );

    const dailyMonitorings = await sql.getMany();

    const result = dailyMonitorings.reduce((prep, item) => {
      prep.set(item.farmingCycleId, item);
      return prep;
    }, new Map<string, DailyMonitoring>());

    return result;
  }

  async getMappedByKey(
    filter: FindManyOptions<DailyMonitoring>,
    keyFormat: Function,
  ): Promise<Map<string, DailyMonitoring>> {
    const items = await this.repository.find(filter);

    return items.reduce((prev, item) => {
      prev.set(keyFormat(item), item);
      return prev;
    }, new Map<string, DailyMonitoring>());
  }

  async getRemainingPopulation(farmingCycleId: string): Promise<number> {
    const latestDailyMonitoring = await this.getOne({
      where: {
        farmingCycleId,
        populationTotal: Not(IsNull()),
      },
      order: {
        day: 'DESC',
      },
    });

    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const additionalHarvests =
      (now.getHours() < 17 &&
        (await this.harvestRealizationRepo.find({
          where: {
            farmingCycleId,
            harvestDate: format(now, DATE_SQL_FORMAT),
          },
        }))) ||
      [];

    const countAdditionalHarvest = additionalHarvests.reduce(
      (prev, item) => prev + item.quantity,
      0,
    );

    return (
      (latestDailyMonitoring?.populationTotal || 0) -
      (latestDailyMonitoring?.populationMortaled || 0) -
      (latestDailyMonitoring?.populationHarvested || 0) -
      countAdditionalHarvest
    );
  }
}
