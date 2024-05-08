import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import { DeepPartial, FindOptionsWhere, QueryRunner, Repository } from 'typeorm';
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
} from '../libs/constants';
import { RequestUser } from '../libs/types/index.d';
import { randomHexString } from '../libs/utils/helpers';
import { BaseSQLDAO } from './base.dao';

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

  async upsert(
    data: DeepPartial<FarmingCycleFeedStockD>,
    user: RequestUser,
  ): Promise<FarmingCycleFeedStockD> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    let stock: FarmingCycleFeedStockD | null = null;
    if (data.taskTicketId && data.taskTicketDId) {
      stock = await this.repository.findOne({
        where: {
          taskTicketId: data.taskTicketId,
          taskTicketDId: data.taskTicketDId,
        },
      });
    }

    if (!stock) {
      stock = this.repository.create({
        id: randomHexString(),
        createdBy: user.id,
        createdDate: now,
        farmingCycleId: data.farmingCycleId,
        taskTicketId: data.taskTicketId,
        taskTicketDId: data.taskTicketDId,
        operator: data.operator,
        qty: data.qty,
        notes: data.notes,
        userId: user.id,
      });

      const newStock = await this.repository.save(stock);

      return newStock;
    }

    await this.repository.update(stock.id, {
      farmingCycleId: data.farmingCycleId,
      taskTicketId: data.taskTicketId,
      taskTicketDId: data.taskTicketDId,
      operator: data.operator,
      qty: data.qty,
      notes: data.notes,
      modifiedBy: user.id,
      modifiedDate: now,
      userId: user.id,
    });

    const updatedStock = await this.repository.findOneOrFail({
      where: {
        id: stock.id,
      },
    });

    return updatedStock;
  }

  /**
   * @param farmingCycleId farming cycle id
   * @param untilDate latest consumption date
   * @returns total feed consumed (50kg/sack)
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
      .createQueryBuilder('tfd')
      .select('SUM(tfd.qty::float)', 'total')
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

    const result = await sql.getRawOne();
    return result.total;
  }

  /**
   * @param farmingCycleId farming cycle id
   * @param untilDate latest addition/restock date
   * @returns total feed added
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
      });

    if (opts?.fromDate) {
      sql.andWhere('gr.received_date::date >= :fromDate', {
        fromDate: opts.fromDate,
      });
    }

    const result = await sql.getRawOne();

    return result.total;
  }

  async getRemainingFeed(
    farmingCycleId: string,
    untilDate: string = format(new Date(), DATETIME_17_SQL_FORMAT),
  ): Promise<number> {
    const [consumed, stock] = await Promise.all([
      this.totalConsumption(farmingCycleId, {
        untilDate,
      }),
      this.totalAddition(farmingCycleId, format(new Date(untilDate), DATE_SQL_FORMAT)),
    ]);

    return (stock || 0) - (consumed || 0);
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
}
