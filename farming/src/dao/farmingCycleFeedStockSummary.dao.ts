import { randomUUID } from 'crypto';
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
import { FarmingCycleFeedStockSummary } from '../datasources/entity/pgsql/FarmingCycleFeedStockSummary.entity';
import { DEFAULT_TIME_ZONE } from '../libs/constants';
import { ERR_FEED_STOCK_SUMMARY_NOT_FOUND } from '../libs/constants/errors';
import { RequestUser } from '../libs/types/index.d';
import { BaseSQLDAO } from './base.dao';

@Service()
export class FarmingCycleFeedStockSummaryDAO extends BaseSQLDAO<FarmingCycleFeedStockSummary> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  async init() {
    this.repository = this.pSql.connection.getRepository(FarmingCycleFeedStockSummary);
  }

  // eslint-disable-next-line class-methods-use-this
  async getOneWithTx(
    params: FindOneOptions<FarmingCycleFeedStockSummary>,
    queryRunner: QueryRunner,
  ): Promise<FarmingCycleFeedStockSummary | null> {
    const data = await queryRunner.manager.findOne(FarmingCycleFeedStockSummary, params);

    return data;
  }

  async getOneStrict(
    params: FindOneOptions<FarmingCycleFeedStockSummary>,
  ): Promise<FarmingCycleFeedStockSummary> {
    try {
      const data = await this.repository.findOneOrFail(params);

      return data;
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw ERR_FEED_STOCK_SUMMARY_NOT_FOUND(error.message);
      }

      throw error;
    }
  }

  async getManyGroupBySubcategory(farmingCycleId: string): Promise<FarmingCycleFeedStockSummary[]> {
    const query = this.repository
      .createQueryBuilder('fcfss')
      .select('farmingcycle_id', 'farmingCycleId')
      .addSelect('subcategory_code', 'subcategoryCode')
      .addSelect('SUM(remaining_quantity)', 'remainingQuantity')
      .addSelect('SUM(booked_quantity)', 'bookedQuantity')
      .groupBy('fcfss.farmingcycle_id')
      .addGroupBy('fcfss.subcategory_code')
      .where('farmingcycle_id = :farmingCycleId', { farmingCycleId })
      .orderBy("fcfss.subcategory_code != 'PRESTARTER'")
      .addOrderBy("fcfss.subcategory_code != 'STARTER'")
      .addOrderBy("fcfss.subcategory_code != 'FINISHER'")
      .getRawMany();

    const result = await query;

    return result;
  }

  async getTotalSummary(
    farmingCycleId: string,
  ): Promise<{ farmingCycleId: string; remainingQuantity: number; bookedQuantity: number }> {
    const query = this.repository
      .createQueryBuilder('fcfss')
      .select('farmingcycle_id', 'farmingCycleId')
      .addSelect('SUM(remaining_quantity)', 'remainingQuantity')
      .addSelect('SUM(booked_quantity)', 'bookedQuantity')
      .groupBy('fcfss.farmingcycle_id')
      .where('farmingcycle_id = :farmingCycleId', { farmingCycleId })
      .getRawOne();

    const result = await query;

    return result;
  }

  // eslint-disable-next-line class-methods-use-this
  async updateOneWithTx(
    params: FindOptionsWhere<FarmingCycleFeedStockSummary>,
    data: DeepPartial<FarmingCycleFeedStockSummary>,
    user: RequestUser,
    queryRunner: QueryRunner,
    transactionHooks?: Function[] | undefined,
  ): Promise<FarmingCycleFeedStockSummary> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    await queryRunner.manager.update(FarmingCycleFeedStockSummary, params, {
      ...data,
      modifiedBy: user.id,
      modifiedDate: now,
    });

    const updatedData = await queryRunner.manager.findOneOrFail(FarmingCycleFeedStockSummary, {
      where: {
        ...((params.id && {
          id: params.id,
        }) ||
          params),
      },
    });

    const promises = transactionHooks?.map((trxHook) => trxHook(updatedData, queryRunner));

    await Promise.all(promises || []);

    return updatedData;
  }

  // eslint-disable-next-line class-methods-use-this
  async incrementRemainingQuantityWithTx(
    params: FindOptionsWhere<FarmingCycleFeedStockSummary>,
    adjustmentQuantity: number,
    user: RequestUser,
    queryRunner: QueryRunner,
  ): Promise<void> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const adjustment = Number(adjustmentQuantity) || 0;

    const remainingQuantity = () =>
      `remaining_quantity ${adjustment < 0 ? '-' : '+'} ${Math.abs(adjustment)}`;

    await queryRunner.manager.update(FarmingCycleFeedStockSummary, params, {
      remainingQuantity,
      modifiedBy: user.id,
      modifiedDate: now,
    });
  }

  // eslint-disable-next-line class-methods-use-this
  async incrementBookedQuantityWithTx(
    params: FindOptionsWhere<FarmingCycleFeedStockSummary>,
    booked: number,
    user: RequestUser,
    queryRunner: QueryRunner,
  ): Promise<void> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const num = Number(booked) || 0;

    const bookedQuantity = () => `booked_quantity ${num < 0 ? '-' : '+'} ${Math.abs(num)}`;

    await queryRunner.manager.update(FarmingCycleFeedStockSummary, params, {
      bookedQuantity,
      modifiedBy: user.id,
      modifiedDate: now,
    });
  }

  // eslint-disable-next-line class-methods-use-this
  async createOneWithTx(
    data: DeepPartial<FarmingCycleFeedStockSummary>,
    user: RequestUser,
    queryRunner: QueryRunner,
  ): Promise<FarmingCycleFeedStockSummary> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const item = queryRunner.manager.create(FarmingCycleFeedStockSummary, {
      ...data,
      id: data.id ? data.id : randomUUID(),
      createdBy: user.id,
      createdDate: now,
      modifiedBy: user.id,
      modifiedDate: now,
    });

    const newItem = await queryRunner.manager.save(FarmingCycleFeedStockSummary, item);

    return newItem;
  }

  // eslint-disable-next-line class-methods-use-this
  async deleteOneWithTx(
    params: FindOptionsWhere<FarmingCycleFeedStockSummary>,
    queryRunner: QueryRunner,
  ): Promise<FarmingCycleFeedStockSummary> {
    const toBeDeleted = await queryRunner.manager.findOneOrFail(FarmingCycleFeedStockSummary, {
      where: params,
    });

    await queryRunner.manager.delete(FarmingCycleFeedStockSummary, {
      id: toBeDeleted.id,
    });

    return toBeDeleted;
  }
}
