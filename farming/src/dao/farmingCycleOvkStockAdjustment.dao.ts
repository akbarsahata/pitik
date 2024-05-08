import { randomUUID } from 'crypto';
import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import { DeepPartial, EntityNotFoundError, FindOneOptions, QueryRunner } from 'typeorm';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import {
  FarmingCycleOvkStockAdjustment,
  OvkStockAdjustmentTypeEnum,
} from '../datasources/entity/pgsql/FarmingCycleOvkStockAdjustment.entity';
import { DEFAULT_TIME_ZONE } from '../libs/constants';
import { ERR_FEED_STOCK_ADJUSTMENT_NOT_FOUND } from '../libs/constants/errors';
import { RequestUser } from '../libs/types/index.d';
import { BaseSQLDAO } from './base.dao';

@Service()
// eslint-disable-next-line max-len
export class FarmingCycleOvkStockAdjustmentDAO extends BaseSQLDAO<FarmingCycleOvkStockAdjustment> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  async init() {
    this.repository = this.pSql.connection.getRepository(FarmingCycleOvkStockAdjustment);
  }

  async getOneStrict(
    params: FindOneOptions<FarmingCycleOvkStockAdjustment>,
  ): Promise<FarmingCycleOvkStockAdjustment> {
    try {
      const data = await this.repository.findOneOrFail(params);

      return data;
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw ERR_FEED_STOCK_ADJUSTMENT_NOT_FOUND(error.message);
      }

      throw error;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async createOneWithTx(
    data: DeepPartial<FarmingCycleOvkStockAdjustment>,
    user: RequestUser,
    queryRunner: QueryRunner,
    transactionHooks?: Function[] | undefined,
  ): Promise<FarmingCycleOvkStockAdjustment> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const newData = queryRunner.manager.create(FarmingCycleOvkStockAdjustment, {
      ...data,
      id: data.id || randomUUID(),
      createdBy: user.id,
      createdDate: now,
      modifiedBy: user.id,
      modifiedDate: now,
    });

    const result = await queryRunner.manager.save(FarmingCycleOvkStockAdjustment, newData);

    const promises = transactionHooks?.map((trxHook) => trxHook(newData, queryRunner));

    await Promise.all(promises || []);

    return result;
  }

  /**
   * @param farmingCycleId farming cycle id
   * @returns total ovk adjusted
   */
  async totalMinusAdjustment(farmingCycleId: string): Promise<number> {
    const sql = this.repository
      .createQueryBuilder('foa')
      .select('SUM(foa.adjustment_quantity::float)', 'total')
      .where('foa.farmingcycle_id = :farmingCycleId', {
        farmingCycleId,
      })
      .andWhere('foa."type" = :type ', {
        type: OvkStockAdjustmentTypeEnum.Pengurangan,
      });

    const result = await sql.getRawOne();
    return result.total;
  }

  /**
   * @param farmingCycleId farming cycle id
   * @returns total ovk adjusted
   */
  async totalPlusAdjustment(farmingCycleId: string): Promise<number> {
    const sql = this.repository
      .createQueryBuilder('foa')
      .select('SUM(foa.adjustment_quantity::float)', 'total')
      .where('foa.farmingcycle_id = :farmingCycleId', {
        farmingCycleId,
      })
      .andWhere('foa."type" = :type ', {
        type: OvkStockAdjustmentTypeEnum.Penambahan,
      });

    const result = await sql.getRawOne();
    return result.total;
  }
}
