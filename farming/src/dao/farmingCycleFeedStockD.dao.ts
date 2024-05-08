import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import { DeepPartial, FindOneOptions, FindOptionsWhere, QueryRunner, Repository } from 'typeorm';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { FarmingCycleFeedStockD } from '../datasources/entity/pgsql/FarmingCycleFeedStockD.entity';
import { GoodsReceipt } from '../datasources/entity/pgsql/GoodsReceipt.entity';
import { GoodsReceiptProduct } from '../datasources/entity/pgsql/GoodsReceiptProduct.entity';
import { PurchaseOrder } from '../datasources/entity/pgsql/PurchaseOrder.entity';
import { TaskTicket } from '../datasources/entity/pgsql/TaskTicket.entity';
import { TransferRequest } from '../datasources/entity/pgsql/TransferRequest.entity';
import {
  DATETIME_17_SQL_FORMAT,
  DATETIME_59_SQL_FORMAT,
  DATE_SQL_FORMAT,
  DEFAULT_TIME_ZONE,
  FEED_STOCK_NOTES,
} from '../libs/constants';
import { ERR_NOT_IMPLEMENTED } from '../libs/constants/errors';
import { RequestUser } from '../libs/types/index.d';
import { randomHexString } from '../libs/utils/helpers';
import { BaseSQLDAO } from './base.dao';

interface TotalQuantityAndUOM {
  totalQty: number;
  uom: string;
}

@Service()
export class FarmingCycleFeedStockDDAO extends BaseSQLDAO<FarmingCycleFeedStockD> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  protected grpRepository: Repository<GoodsReceiptProduct>;

  @Initializer([PostgreSQLConnection])
  async init() {
    this.repository = this.pSql.connection.getRepository(FarmingCycleFeedStockD);
    this.grpRepository = this.pSql.connection.getRepository(GoodsReceiptProduct);
  }

  // eslint-disable-next-line class-methods-use-this
  async getOneWithTx(
    params: FindOneOptions<FarmingCycleFeedStockD>,
    queryRunner: QueryRunner,
  ): Promise<FarmingCycleFeedStockD | null> {
    const data = await queryRunner.manager.findOne(FarmingCycleFeedStockD, params);

    return data;
  }

  // eslint-disable-next-line class-methods-use-this
  async getManyWithTx(
    params: FindOneOptions<FarmingCycleFeedStockD>,
    queryRunner: QueryRunner,
  ): Promise<FarmingCycleFeedStockD[]> {
    const data = await queryRunner.manager.find(FarmingCycleFeedStockD, params);

    return data;
  }

  // eslint-disable-next-line class-methods-use-this
  async upsertStockWithTx(
    data: DeepPartial<FarmingCycleFeedStockD>,
    user: RequestUser,
    queryRunner: QueryRunner,
  ): Promise<FarmingCycleFeedStockD> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const stock = await queryRunner.manager.findOne(FarmingCycleFeedStockD, {
      where: {
        ...(data.farmingCycleId && {
          farmingCycleId: data.farmingCycleId,
        }),
        ...(data.taskTicketId && {
          taskTicketId: data.taskTicketId,
        }),
        ...(data.taskTicketDId && {
          taskTicketDId: data.taskTicketDId,
        }),
        ...(data.operator && {
          operator: data.operator,
        }),
      },
    });

    if (!stock || stock.notes !== data.notes) {
      const newStock = queryRunner.manager.create(FarmingCycleFeedStockD, {
        id: randomHexString(),
        createdBy: user.id,
        createdDate: now,
        modifiedBy: user.id,
        modifiedDate: now,
        farmingCycleId: data.farmingCycleId,
        taskTicketId: data.taskTicketId,
        taskTicketDId: data.taskTicketDId,
        operator: data.operator,
        qty: data.qty,
        notes: data.notes,
        userId: user.id,
        productDetail: data.productDetail,
        uom: data.uom,
      });

      await queryRunner.manager.save(FarmingCycleFeedStockD, newStock);

      return newStock;
    }

    await queryRunner.manager.update(FarmingCycleFeedStockD, stock.id, {
      farmingCycleId: data.farmingCycleId,
      taskTicketId: data.taskTicketId,
      taskTicketDId: data.taskTicketDId,
      operator: data.operator,
      qty: data.qty,
      notes: data.notes,
      modifiedBy: user.id,
      modifiedDate: now,
      userId: user.id,
      productDetail: data.productDetail,
    });

    const updatedStock = await queryRunner.manager.findOneOrFail(FarmingCycleFeedStockD, {
      where: {
        id: stock.id,
      },
    });

    return updatedStock;
  }

  /**
   * @param farmingCycleId farming cycle id
   * @param untilDate latest consumption date
   * @returns total feed consumed and unit of measurement
   */
  async totalConsumption(
    farmingCycleId: string,
    opts?: {
      untilDate?: string;
      notes?:
        | string
        | {
            operator?: 'like' | '=';
            value: string;
          };
    },
  ): Promise<TotalQuantityAndUOM> {
    const sql = this.repository
      .createQueryBuilder('tfd')
      .select(['SUM(tfd.qty::float) as total', "COALESCE(tfd.uom, 'karung') as uom"])
      .innerJoin(TaskTicket, 'tt', 'tt.id = tfd.ref_taskticket_id')
      .where('tfd.ref_farmingcycle_id = :farmingCycleId', {
        farmingCycleId,
      })
      .andWhere('tt.reported_date <= :untilDate', {
        untilDate: opts?.untilDate || format(new Date(), DATETIME_59_SQL_FORMAT),
      })
      .andWhere('tfd."operator" = :operator ', {
        operator: '-',
      });

    if (opts?.notes) {
      const op = typeof opts.notes === 'string' ? '=' : opts.notes.operator || '=';
      sql.andWhere('tfd.notes $op :value'.replace('$op', op), {
        value: typeof opts.notes === 'string' ? opts.notes : opts.notes.value,
      });
    }

    const result = await sql
      .groupBy('tfd.uom') // assume there's only 1 uom per farming cycle
      .getRawOne();
    if (result) return { totalQty: result.total, uom: result.uom };
    return { totalQty: 0, uom: 'karung' };
  }

  /**
   * @param farmingCycleId farming cycle id
   * @param untilDate latest addition/restock date
   * @returns total feed added and unit of measurement
   */
  async totalAddition(
    farmingCycleId: string,
    untilDate: string = format(new Date(), DATE_SQL_FORMAT),
    opts?: {
      fromDate?: string;
    },
  ): Promise<TotalQuantityAndUOM> {
    const sql = this.grpRepository
      .createQueryBuilder('grp')
      .select(['SUM(grp.quantity) as total', "COALESCE(grp.uom, 'karung') as uom"])
      .innerJoin(GoodsReceipt, 'gr', 'gr.id = grp.goodsreceipt_id')
      .leftJoin(PurchaseOrder, 'po', 'po.id = gr.purchaseorder_id')
      .leftJoin(TransferRequest, 'tr', 'tr.id = gr.transferrequest_id')
      .where('grp.category_name = :categoryName', {
        categoryName: 'PAKAN',
      })
      .andWhere(
        '(po.id is not null and po.farmingcycle_id = :farmingCycleId or tr.id is not null and tr.farmingcycle_target_id = :farmingCycleId)',
        {
          farmingCycleId,
        },
      )
      .andWhere('gr.received_date::date <= :untilDate', {
        untilDate,
      })
      .andWhere('grp.is_returned != true');

    if (opts?.fromDate) {
      sql.andWhere('gr.received_date::date >= :fromDate', {
        fromDate: opts.fromDate,
      });
    }

    const result = await sql
      .groupBy('grp.uom') // assume there's only 1 uom per farming cycle
      .getRawOne();

    if (result) return { totalQty: result.total, uom: result.uom };
    return { totalQty: 0, uom: 'karung' };
  }

  async getRemainingFeed(
    farmingCycleId: string,
    untilDate: string = format(new Date(), DATETIME_17_SQL_FORMAT),
  ): Promise<TotalQuantityAndUOM> {
    const [consumed, stock] = await Promise.all([
      this.totalConsumption(farmingCycleId, {
        untilDate,
      }),
      this.totalAddition(farmingCycleId, format(new Date(untilDate), DATE_SQL_FORMAT)),
    ]);

    if (consumed.uom !== stock.uom) {
      throw ERR_NOT_IMPLEMENTED('Feed consumed and stock unit of measurement must be the same');
    }

    return { totalQty: stock.totalQty - consumed.totalQty, uom: stock.uom };
  }

  // eslint-disable-next-line consistent-return
  async upsertOneWithTx(
    params: FindOptionsWhere<FarmingCycleFeedStockD>,
    data: DeepPartial<FarmingCycleFeedStockD>,
    user: RequestUser,
    queryRunner: QueryRunner,
  ) {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const feedStock = await this.repository.findOne({
      where: {
        ...params,
      },
    });

    if (!feedStock) {
      const newFeedStock = queryRunner.manager.create(FarmingCycleFeedStockD, {
        ...data,
        id: randomHexString(),
        createdBy: user.id,
        createdDate: now,
        modifiedBy: user.id,
        modifiedDate: now,
      });

      const result = await queryRunner.manager.save(FarmingCycleFeedStockD, newFeedStock);

      return result;
    }

    await queryRunner.manager.update(FarmingCycleFeedStockD, params, {
      ...data,
      modifiedBy: user.id,
      modifiedDate: now,
    });

    const updatedFeedStock = await queryRunner.manager.findOneOrFail(FarmingCycleFeedStockD, {
      where: {
        ...((params.id && {
          id: params.id,
        }) ||
          params),
      },
    });

    return updatedFeedStock;
  }

  // eslint-disable-next-line class-methods-use-this
  async deleteManyWithTx(
    where: FindOptionsWhere<FarmingCycleFeedStockD>,
    queryRunner: QueryRunner,
  ): Promise<FarmingCycleFeedStockD[]> {
    const toBeDeleted = await queryRunner.manager.find(FarmingCycleFeedStockD, { where });

    await queryRunner.manager.delete(FarmingCycleFeedStockD, where);

    return toBeDeleted;
  }

  // eslint-disable-next-line class-methods-use-this
  async createOneWithTx(
    data: DeepPartial<FarmingCycleFeedStockD>,
    user: RequestUser,
    queryRunner: QueryRunner,
    transactionHooks?: Function[] | undefined,
  ): Promise<FarmingCycleFeedStockD> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const newData = queryRunner.manager.create(FarmingCycleFeedStockD, {
      ...data,
      id: data.id || randomHexString(),
      createdBy: user.id,
      createdDate: now,
      modifiedBy: user.id,
      modifiedDate: now,
    });

    const result = await queryRunner.manager.save(FarmingCycleFeedStockD, newData);

    const promises = transactionHooks?.map((trxHook) => trxHook(newData, queryRunner));

    await Promise.all(promises || []);

    return result;
  }

  /**
   * @param farmingCycleId farming cycle id
   * @param untilDate latest consumption date
   * @returns total feed adjusted and unit of measurement
   */
  async totalMinusAdjustment(
    farmingCycleId: string,
    opts?: {
      untilDate?: string;
    },
  ): Promise<TotalQuantityAndUOM> {
    const sql = this.repository
      .createQueryBuilder('tfd')
      .select(['SUM(tfd.qty::float) as total', "COALESCE(tfd.uom, 'karung') as uom"])
      .where('tfd.ref_farmingcycle_id = :farmingCycleId', {
        farmingCycleId,
      })
      .andWhere('tfd.created_date <= :untilDate', {
        untilDate: opts?.untilDate || format(new Date(), DATETIME_59_SQL_FORMAT),
      })
      .andWhere('tfd."operator" = :operator ', {
        operator: '-',
      })
      .andWhere('tfd.notes like :value', {
        value: FEED_STOCK_NOTES.ADJUSTMENT_SUMMARY,
      });

    const result = await sql
      .groupBy('tfd.uom') // assume there's only 1 uom per farming cycle
      .getRawOne();
    if (result) return { totalQty: result.total, uom: result.uom };
    return { totalQty: 0, uom: 'karung' };
  }

  /**
   * @param farmingCycleId farming cycle id
   * @param untilDate latest consumption date
   * @returns total feed adjusted and unit of measurement
   */
  async totalPlusAdjustment(
    farmingCycleId: string,
    opts?: {
      untilDate?: string;
    },
  ): Promise<TotalQuantityAndUOM> {
    const sql = this.repository
      .createQueryBuilder('tfd')
      .select(['SUM(tfd.qty::float) as total', "COALESCE(tfd.uom, 'karung') as uom"])
      .where('tfd.ref_farmingcycle_id = :farmingCycleId', {
        farmingCycleId,
      })
      .andWhere('tfd.created_date <= :untilDate', {
        untilDate: opts?.untilDate || format(new Date(), DATETIME_59_SQL_FORMAT),
      })
      .andWhere('tfd."operator" = :operator ', {
        operator: '+',
      })
      .andWhere('tfd.notes like :value', {
        value: FEED_STOCK_NOTES.ADJUSTMENT_SUMMARY,
      });

    const result = await sql
      .groupBy('tfd.uom') // assume there's only 1 uom per farming cycle
      .getRawOne();
    if (result) return { totalQty: result.total, uom: result.uom };
    return { totalQty: 0, uom: 'karung' };
  }
}
