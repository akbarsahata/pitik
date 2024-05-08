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
import { BranchSapronakStock } from '../datasources/entity/pgsql/BranchSapronakStock.entity';
import { DEFAULT_TIME_ZONE } from '../libs/constants';
import { ERR_BRANCH_SAPRONAK_STOCK_NOT_FOUND } from '../libs/constants/errors';
import { RequestUser } from '../libs/types/index.d';
import { BaseSQLDAO } from './base.dao';

@Service()
export class BranchSapronakStockDAO extends BaseSQLDAO<BranchSapronakStock> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  async init() {
    this.repository = this.pSql.connection.getRepository(BranchSapronakStock);
  }

  // eslint-disable-next-line class-methods-use-this
  async getOneWithTx(
    params: FindOneOptions<BranchSapronakStock>,
    queryRunner: QueryRunner,
  ): Promise<BranchSapronakStock | null> {
    const data = await queryRunner.manager.findOne(BranchSapronakStock, params);

    return data;
  }

  async getOneStrict(params: FindOneOptions<BranchSapronakStock>): Promise<BranchSapronakStock> {
    try {
      const data = await this.repository.findOneOrFail(params);

      return data;
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw ERR_BRANCH_SAPRONAK_STOCK_NOT_FOUND(error.message);
      }

      throw error;
    }
  }

  async getManyGroupBySubcategory(
    farmingCycleId: string,
    categoryCode: 'pakan' | 'ovk',
  ): Promise<BranchSapronakStock[]> {
    let query = this.repository
      .createQueryBuilder('fcfss')
      .select('farmingcycle_id', 'farmingCycleId')
      .addSelect('subcategory_code', 'subcategoryCode')
      .addSelect('SUM(remaining_quantity)', 'remainingQuantity')
      .groupBy('fcfss.farmingcycle_id')
      .addGroupBy('fcfss.subcategory_code')
      .where('farmingcycle_id = :farmingCycleId', { farmingCycleId })
      .andWhere('category_code = :categoryCode', { categoryCode });

    if (categoryCode === 'pakan') {
      query = query
        .orderBy("fcfss.subcategory_code != 'PRESTARTER'")
        .addOrderBy("fcfss.subcategory_code != 'STARTER'")
        .addOrderBy("fcfss.subcategory_code != 'FINISHER'");
    }

    const result = await query.getRawMany();

    return result;
  }

  async getTotalSummary(
    farmingCycleId: string,
  ): Promise<{ farmingCycleId: string; remainingQuantity: number }> {
    const query = this.repository
      .createQueryBuilder('fcfss')
      .select('farmingcycle_id', 'farmingCycleId')
      .addSelect('SUM(remaining_quantity)', 'remainingQuantity')
      .groupBy('fcfss.farmingcycle_id')
      .where('farmingcycle_id = :farmingCycleId', { farmingCycleId })
      .getRawOne();

    const result = await query;

    return result;
  }

  // eslint-disable-next-line class-methods-use-this
  async updateOneWithTx(
    params: FindOptionsWhere<BranchSapronakStock>,
    data: DeepPartial<BranchSapronakStock>,
    user: RequestUser,
    queryRunner: QueryRunner,
    transactionHooks?: Function[] | undefined,
  ): Promise<BranchSapronakStock> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    await queryRunner.manager.update(BranchSapronakStock, params, {
      ...data,
      modifiedBy: user.id,
      modifiedDate: now,
    });

    const updatedData = await queryRunner.manager.findOneOrFail(BranchSapronakStock, {
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
  async incrementBookedQuantityWithTx(
    params: FindOptionsWhere<BranchSapronakStock>,
    booked: number,
    user: RequestUser,
    queryRunner: QueryRunner,
  ): Promise<void> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const num = Number(booked) || 0;

    const bookedQuantity = () => `booked_quantity ${num < 0 ? '-' : '+'} ${Math.abs(num)}`;

    await queryRunner.manager.update(BranchSapronakStock, params, {
      bookedQuantity,
      modifiedBy: user.id,
      modifiedDate: now,
    });
  }

  // eslint-disable-next-line class-methods-use-this
  async incrementQuantityWithTx(
    params: FindOptionsWhere<BranchSapronakStock>,
    quantity: number,
    user: RequestUser,
    queryRunner: QueryRunner,
  ): Promise<void> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const num = Number(quantity) || 0;

    const newQuantity = () => `quantity ${num < 0 ? '-' : '+'} ${Math.abs(num)}`;

    await queryRunner.manager.update(BranchSapronakStock, params, {
      quantity: newQuantity,
      modifiedBy: user.id,
      modifiedDate: now,
    });
  }

  // eslint-disable-next-line class-methods-use-this
  async createOneWithTx(
    data: DeepPartial<BranchSapronakStock>,
    user: RequestUser,
    queryRunner: QueryRunner,
  ): Promise<BranchSapronakStock> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const item = queryRunner.manager.create(BranchSapronakStock, {
      ...data,
      id: data.id ? data.id : randomUUID(),
      createdBy: user.id,
      createdDate: now,
      modifiedBy: user.id,
      modifiedDate: now,
    });

    const newItem = await queryRunner.manager.save(BranchSapronakStock, item);

    return newItem;
  }

  // eslint-disable-next-line class-methods-use-this
  async upsertOneWithTx(
    data: DeepPartial<BranchSapronakStock>,
    user: RequestUser,
    queryRunner: QueryRunner,
  ): Promise<BranchSapronakStock> {
    const existing = await queryRunner.manager.findOne(BranchSapronakStock, {
      where: {
        branchId: data.branchId,
        productCode: data.productCode,
      },
    });

    if (existing) {
      return existing;
    }

    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const branchSapronakStock = queryRunner.manager.create(BranchSapronakStock, {
      id: data.id ? data.id : randomUUID(),
      branchId: data.branchId,
      categoryCode: data.categoryCode,
      categoryName: data.categoryName,
      subcategoryCode: data.subcategoryCode,
      subcategoryName: data.subcategoryName,
      productCode: data.productCode,
      productName: data.productName,
      uom: data.uom,
      quantity: 0,
      bookedQuantity: 0,
      createdBy: user.id,
      createdDate: now,
      modifiedBy: user.id,
      modifiedDate: now,
    });

    await queryRunner.manager.save(branchSapronakStock);

    return branchSapronakStock;
  }
}
