import { randomUUID } from 'crypto';
import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import { DeepPartial, EntityNotFoundError, FindOneOptions, QueryRunner } from 'typeorm';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { FarmingCycleFeedStockAdjustment } from '../datasources/entity/pgsql/FarmingCycleFeedStockAdjustment.entity';
import { DATETIME_SQL_FORMAT, DEFAULT_TIME_ZONE } from '../libs/constants';
import { ERR_FEED_STOCK_ADJUSTMENT_NOT_FOUND } from '../libs/constants/errors';
import { RequestUser } from '../libs/types/index.d';
import { BaseSQLDAO } from './base.dao';

@Service()
// eslint-disable-next-line max-len
export class FarmingCycleFeedStockAdjustmentDAO extends BaseSQLDAO<FarmingCycleFeedStockAdjustment> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  async init() {
    this.repository = this.pSql.connection.getRepository(FarmingCycleFeedStockAdjustment);
  }

  async getOneStrict(
    params: FindOneOptions<FarmingCycleFeedStockAdjustment>,
  ): Promise<FarmingCycleFeedStockAdjustment> {
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

  async getTotalAdjustmentQuantityByFarmingCycle(
    farmingCycleId: string,
    reportedUntil?: Date,
    reportedUntilFormat?: string,
  ): Promise<{ totalQty: number; uom: string }> {
    let query = this.repository
      .createQueryBuilder('adjustment')
      .select([
        'SUM(CASE WHEN adjustment.type = :addType THEN adjustment.adjustment_quantity ELSE -adjustment.adjustment_quantity END) as total_adjustment_quantity',
        'adjustment.uom',
      ])
      .where('adjustment.farmingcycle_id = :farmingCycleId', { farmingCycleId });

    if (reportedUntil) {
      query = query.andWhere('adjustment.created_date < :reportedUntil', {
        reportedUntil: format(reportedUntil, reportedUntilFormat || DATETIME_SQL_FORMAT),
      });
    }

    const result = await query
      .groupBy('adjustment.farmingcycle_id')
      .groupBy('adjustment.uom') // assume there's only 1 uom per farming cycle
      .setParameters({ addType: 'Penambahan' })
      .getRawOne();

    if (result) return { totalQty: result.total_adjustment_quantity, uom: result.uom };
    return { totalQty: 0, uom: 'karung' };
  }

  // eslint-disable-next-line class-methods-use-this
  async createOneWithTx(
    data: DeepPartial<FarmingCycleFeedStockAdjustment>,
    user: RequestUser,
    queryRunner: QueryRunner,
    transactionHooks?: Function[] | undefined,
  ): Promise<FarmingCycleFeedStockAdjustment> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const newData = queryRunner.manager.create(FarmingCycleFeedStockAdjustment, {
      ...data,
      id: data.id || randomUUID(),
      createdBy: user.id,
      createdDate: now,
      modifiedBy: user.id,
      modifiedDate: now,
    });

    const result = await queryRunner.manager.save(FarmingCycleFeedStockAdjustment, newData);

    const promises = transactionHooks?.map((trxHook) => trxHook(newData, queryRunner));

    await Promise.all(promises || []);

    return result;
  }
}
