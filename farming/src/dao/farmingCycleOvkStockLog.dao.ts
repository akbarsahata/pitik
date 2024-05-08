import { randomUUID } from 'crypto';
import { format, utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import {
  DeepPartial,
  EntityNotFoundError,
  FindOneOptions,
  FindOptionsWhere,
  QueryRunner,
  Repository,
} from 'typeorm';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { FarmingCycleOvkStockLog } from '../datasources/entity/pgsql/FarmingCycleOvkStockLog.entity';
import { GoodsReceipt } from '../datasources/entity/pgsql/GoodsReceipt.entity';
import { GoodsReceiptProduct } from '../datasources/entity/pgsql/GoodsReceiptProduct.entity';
import { PurchaseOrder } from '../datasources/entity/pgsql/PurchaseOrder.entity';
import { TaskTicket } from '../datasources/entity/pgsql/TaskTicket.entity';
import { TransferRequest } from '../datasources/entity/pgsql/TransferRequest.entity';
import { DATETIME_59_SQL_FORMAT, DATE_SQL_FORMAT, DEFAULT_TIME_ZONE } from '../libs/constants';
import { ERR_OVK_STOCK_ADJUSTMENT_NOT_FOUND } from '../libs/constants/errors';
import { RequestUser } from '../libs/types/index.d';
import { BaseSQLDAO } from './base.dao';

@Service()
// eslint-disable-next-line max-len
export class FarmingCycleOvkStockLogDAO extends BaseSQLDAO<FarmingCycleOvkStockLog> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  protected grpRepository: Repository<GoodsReceiptProduct>;

  @Initializer([PostgreSQLConnection])
  async init() {
    this.repository = this.pSql.connection.getRepository(FarmingCycleOvkStockLog);
    this.grpRepository = this.pSql.connection.getRepository(GoodsReceiptProduct);
  }

  async getOneStrict(
    params: FindOneOptions<FarmingCycleOvkStockLog>,
  ): Promise<FarmingCycleOvkStockLog> {
    try {
      const data = await this.repository.findOneOrFail(params);

      return data;
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw ERR_OVK_STOCK_ADJUSTMENT_NOT_FOUND(error.message);
      }

      throw error;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async getOneWithTx(
    params: FindOneOptions<FarmingCycleOvkStockLog>,
    queryRunner: QueryRunner,
  ): Promise<FarmingCycleOvkStockLog | null> {
    const data = await queryRunner.manager.findOne(FarmingCycleOvkStockLog, params);

    return data;
  }

  // eslint-disable-next-line class-methods-use-this
  async createOneWithTx(
    data: DeepPartial<FarmingCycleOvkStockLog>,
    user: RequestUser,
    queryRunner: QueryRunner,
    transactionHooks?: Function[] | undefined,
  ): Promise<FarmingCycleOvkStockLog> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const newData = queryRunner.manager.create(FarmingCycleOvkStockLog, {
      ...data,
      id: data.id || randomUUID(),
      createdBy: user.id,
      createdDate: now,
      modifiedBy: user.id,
      modifiedDate: now,
    });

    const result = await queryRunner.manager.save(FarmingCycleOvkStockLog, newData);

    const promises = transactionHooks?.map((trxHook) => trxHook(newData, queryRunner));

    await Promise.all(promises || []);

    return result;
  }

  // eslint-disable-next-line class-methods-use-this
  async upsertStockWithTx(
    data: DeepPartial<FarmingCycleOvkStockLog>,
    user: RequestUser,
    queryRunner: QueryRunner,
  ): Promise<FarmingCycleOvkStockLog> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const stock = await queryRunner.manager.findOne(FarmingCycleOvkStockLog, {
      where: {
        ...(data.subcategoryCode && {
          subcategoryCode: data.subcategoryCode,
        }),
        ...(data.productCode && {
          productCode: data.productCode,
        }),
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

    if (!stock) {
      const newStock = queryRunner.manager.create(FarmingCycleOvkStockLog, {
        id: randomUUID(),
        subcategoryCode: data.subcategoryCode,
        subcategoryName: data.subcategoryName,
        productCode: data.productCode,
        productName: data.productName,
        farmingCycleId: data.farmingCycleId,
        taskTicketId: data.taskTicketId,
        taskTicketDId: data.taskTicketDId,
        operator: data.operator,
        quantity: data.quantity,
        uom: data.uom,
        notes: data.notes,
        createdBy: user.id,
        createdDate: now,
        modifiedBy: user.id,
        modifiedDate: now,
      });

      await queryRunner.manager.save(FarmingCycleOvkStockLog, newStock);

      return newStock;
    }

    await queryRunner.manager.update(FarmingCycleOvkStockLog, stock.id, {
      subcategoryCode: data.subcategoryCode,
      subcategoryName: data.subcategoryName,
      productCode: data.productCode,
      productName: data.productName,
      farmingCycleId: data.farmingCycleId,
      taskTicketId: data.taskTicketId,
      taskTicketDId: data.taskTicketDId,
      operator: data.operator,
      quantity: data.quantity,
      uom: data.uom,
      notes: data.notes,
      createdBy: user.id,
      createdDate: now,
      modifiedBy: user.id,
      modifiedDate: now,
    });

    const updatedStock = await queryRunner.manager.findOneOrFail(FarmingCycleOvkStockLog, {
      where: {
        id: stock.id,
      },
    });

    return updatedStock;
  }

  // eslint-disable-next-line consistent-return
  async upsertOneWithTx(
    params: FindOptionsWhere<FarmingCycleOvkStockLog>,
    data: DeepPartial<FarmingCycleOvkStockLog>,
    user: RequestUser,
    queryRunner: QueryRunner,
  ) {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const ovkStock = await this.repository.findOne({
      where: {
        ...params,
      },
    });

    if (!ovkStock) {
      const newOvkStock = queryRunner.manager.create(FarmingCycleOvkStockLog, {
        ...data,
        id: randomUUID(),
        createdBy: user.id,
        createdDate: now,
        modifiedBy: user.id,
        modifiedDate: now,
      });

      const result = await queryRunner.manager.save(FarmingCycleOvkStockLog, newOvkStock);

      return result;
    }

    await queryRunner.manager.update(FarmingCycleOvkStockLog, params, {
      ...data,
      modifiedBy: user.id,
      modifiedDate: now,
    });

    const updatedOvkStock = await queryRunner.manager.findOneOrFail(FarmingCycleOvkStockLog, {
      where: {
        ...((params.id && {
          id: params.id,
        }) ||
          params),
      },
    });

    return updatedOvkStock;
  }

  /**
   * @param farmingCycleId farming cycle id
   * @param untilDate latest consumption date
   * @returns total ovk consumed
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
  ): Promise<number> {
    const sql = this.repository
      .createQueryBuilder('fol')
      .select('SUM(fol.quantity::float)', 'total')
      .innerJoin(TaskTicket, 'tt', 'tt.id = fol.taskticket_id')
      .where('fol.farmingcycle_id = :farmingCycleId', {
        farmingCycleId,
      })
      .andWhere('tt.reported_date <= :untilDate', {
        untilDate: opts?.untilDate || format(new Date(), DATETIME_59_SQL_FORMAT),
      })
      .andWhere('fol."operator" = :operator ', {
        operator: '-',
      });

    if (opts?.notes) {
      const op = typeof opts.notes === 'string' ? '=' : opts.notes.operator || '=';
      sql.andWhere('fol.notes $op :value'.replace('$op', op), {
        value: typeof opts.notes === 'string' ? opts.notes : opts.notes.value,
      });
    }

    const result = await sql.getRawOne();
    return result.total;
  }

  /**
   * @param farmingCycleId farming cycle id
   * @param untilDate latest addition/restock date
   * @returns total ovk added
   */
  async totalAddition(
    farmingCycleId: string,
    untilDate: string = format(new Date(), DATE_SQL_FORMAT),
    opts?: {
      fromDate?: string;
    },
  ): Promise<number> {
    const sql = await this.grpRepository
      .createQueryBuilder('grp')
      .select(['SUM(grp.quantity) as total'])
      .innerJoin(GoodsReceipt, 'gr', 'gr.id = grp.goodsreceipt_id')
      .leftJoin(PurchaseOrder, 'po', 'po.id = gr.purchaseorder_id')
      .leftJoin(TransferRequest, 'tr', 'tr.id = gr.transferrequest_id')
      .where('grp.category_name = :categoryName', {
        categoryName: 'OVK',
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

    const result = await sql.getRawOne();

    return result.total;
  }

  // eslint-disable-next-line class-methods-use-this
  async deleteManyWithTx(
    where: FindOptionsWhere<FarmingCycleOvkStockLog>,
    queryRunner: QueryRunner,
  ): Promise<FarmingCycleOvkStockLog[]> {
    const toBeDeleted = await queryRunner.manager.find(FarmingCycleOvkStockLog, { where });

    await queryRunner.manager.delete(FarmingCycleOvkStockLog, where);

    return toBeDeleted;
  }
}
