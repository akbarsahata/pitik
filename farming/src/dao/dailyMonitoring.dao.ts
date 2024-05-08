/* eslint-disable class-methods-use-this */
import { randomUUID } from 'crypto';
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
  QueryRunner,
  Repository,
} from 'typeorm';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { DailyMonitoring } from '../datasources/entity/pgsql/DailyMonitoring.entity';
import { FarmingCycle } from '../datasources/entity/pgsql/FarmingCycle.entity';
import { HarvestRealization } from '../datasources/entity/pgsql/HarvestRealization.entity';
import { DATE_SQL_FORMAT, DEFAULT_TIME_ZONE } from '../libs/constants';
import { ERR_DAILY_MONITORING_NOT_FOUND } from '../libs/constants/errors';
import { RequestUser } from '../libs/types/index.d';
import { BaseSQLDAO } from './base.dao';

@Service()
export class DailyMonitoringDAO extends BaseSQLDAO<DailyMonitoring> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  protected harvestRealizationRepo: Repository<HarvestRealization>;

  protected farmingCycleRepo: Repository<FarmingCycle>;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(DailyMonitoring);
    this.harvestRealizationRepo = this.pSql.connection.getRepository(HarvestRealization);
    this.farmingCycleRepo = this.pSql.connection.getRepository(FarmingCycle);
  }

  async createOne(
    data: DeepPartial<DailyMonitoring>,
    user?: RequestUser,
  ): Promise<DailyMonitoring> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const toBeEntity = {
      ...data,
      id: data.id || randomUUID(),
      createdBy: user?.id || null,
      createdDate: data.createdDate || now,
      modifiedBy: user?.id || null,
      modifiedDate: now,
    };

    const entity = this.repository.create(toBeEntity);

    const createdEntity = await this.repository.save(entity);

    return createdEntity;
  }

  async createOneWithTx(
    data: DeepPartial<DailyMonitoring>,
    user: RequestUser,
    queryRunner: QueryRunner,
  ): Promise<DailyMonitoring> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const entity = queryRunner.manager.create(DailyMonitoring, {
      ...data,
      id: data.id || randomUUID(),
      createdBy: user.id,
      createdDate: data.createdDate || now,
      modifiedBy: user.id,
      modifiedDate: now,
    });

    const createdEntity = await queryRunner.manager.save(DailyMonitoring, entity);

    return createdEntity;
  }

  async updateOneWithTx(
    params: FindOptionsWhere<DailyMonitoring>,
    data: Partial<DailyMonitoring>,
    user: Partial<RequestUser>,
    queryRunner: QueryRunner,
  ): Promise<DailyMonitoring> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    await queryRunner.manager.update(DailyMonitoring, params, {
      ...data,
      modifiedBy: user.id,
      modifiedDate: now,
    });

    const updatedEntity = await queryRunner.manager.findOneOrFail(DailyMonitoring, {
      where: {
        ...((params.id && {
          id: params.id,
        }) ||
          params),
      },
    });

    return updatedEntity;
  }

  async updateOne(
    params: FindOptionsWhere<DailyMonitoring>,
    data: DeepPartial<DailyMonitoring>,
  ): Promise<DailyMonitoring> {
    await this.repository.update(params, {
      ...data,
    });

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

  async upsertPlaceholders(data: DeepPartial<DailyMonitoring>[]): Promise<DailyMonitoring[]> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const upsertItems = data.map((item) => ({
      farmingCycleId: item.farmingCycleId,
      taskTicketId: item.taskTicketId,
      date: item.date,
      day: item.day,
      reportStatus: item.reportStatus,
      createdDate: now,
      modifiedDate: now,
    }));

    await this.repository.save(upsertItems);

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
    const [latestDailyMonitoring, farmingCycle] = await Promise.all([
      this.getOne({
        where: {
          farmingCycleId,
          populationTotal: Not(IsNull()),
        },
        order: {
          day: 'DESC',
        },
      }),
      this.farmingCycleRepo.findOne({
        where: {
          id: farmingCycleId,
        },
      }),
    ]);

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
      (farmingCycle?.initialPopulation || 0) -
      (latestDailyMonitoring?.populationMortaled || 0) -
      (latestDailyMonitoring?.populationHarvested || 0) -
      countAdditionalHarvest
    );
  }

  async upsertOne(
    user: RequestUser,
    item: DeepPartial<DailyMonitoring>,
    opts?: {
      qr?: QueryRunner;
    },
  ): Promise<DailyMonitoring> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);
    const upsertItem: DeepPartial<DailyMonitoring> = {
      ...item,
      id: item.id || randomUUID(),
      createdBy: user.id,
      createdDate: now,
      modifiedBy: user.id,
      modifiedDate: now,
    };

    const result = await this.repository
      .createQueryBuilder(undefined, opts && opts.qr)
      .insert()
      .into(DailyMonitoring)
      .values(upsertItem)
      .orUpdate(
        [
          'erp_code',
          'day',
          'date',
          'report_status',
          'executed_by',
          'reviewed_by',
          'bw',
          'adg',
          'ip',
          'fcr',
          'feed_intake',
          'cull',
          'mortality',
          'feed_remaining',
          'feed_stockout_date',
          'population_total',
          'population_harvested',
          'population_mortaled',
          'average_chicken_age',
          'remarks',
          'recording_image',
          'mortality_image',
          'hdp',
          'modified_by',
          'modified_date',
        ],
        ['id'],
      )
      .returning(['id'])
      .execute();

    return this.repository
      .createQueryBuilder(undefined, opts && opts.qr)
      .where('id = :id', { id: result.identifiers[0].id })
      .getOneOrFail();
  }
}
