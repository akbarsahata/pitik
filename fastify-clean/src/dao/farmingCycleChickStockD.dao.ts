import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import { DeepPartial, FindOptionsWhere, QueryRunner, Repository } from 'typeorm';

import { format } from 'date-fns';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { FarmingCycleChickStockD } from '../datasources/entity/pgsql/FarmingCycleChickStockD.entity';
import { TaskTicket } from '../datasources/entity/pgsql/TaskTicket.entity';
import { DEFAULT_TIME_ZONE } from '../libs/constants';
import { RequestUser } from '../libs/types/index.d';
import { randomHexString } from '../libs/utils/helpers';
import { BaseSQLDAO } from './base.dao';

@Service()
export class FarmingCycleChickStockDDAO extends BaseSQLDAO<FarmingCycleChickStockD> {
  @Inject(PostgreSQLConnection)
  protected pSql!: PostgreSQLConnection;

  protected repository!: Repository<FarmingCycleChickStockD>;

  private taskTicketRepository!: Repository<TaskTicket>;

  @Initializer([PostgreSQLConnection])
  async init() {
    this.repository = this.pSql.connection.getRepository(FarmingCycleChickStockD);
    this.taskTicketRepository = this.pSql.connection.getRepository(TaskTicket);
  }

  /**
   * total mortalitas by farming cycle id
   * @param farmingCycleId farming cycle id
   * @param reportedUntil exclusive date
   * @returns total mortalitas
   */
  async getTotalMortalityByFarmingCycleId(
    farmingCycleId: string,
    reportedUntil?: Date,
  ): Promise<number> {
    let query = this.repository
      .createQueryBuilder('fccsd')
      .select('SUM(fccsd.qty)', 'mortalityTotal')
      .where('fccsd.ref_farmingcycle_id = :id', { id: farmingCycleId })
      .andWhere('fccsd.operator = :operator', { operator: '-' });

    if (reportedUntil) {
      query = query.andWhere('fccsd.transaction_date < :date', {
        date: format(reportedUntil, 'y-M-d'),
      });
    }

    const { mortalityTotal } = await query.getRawOne();

    return Number(mortalityTotal);
  }

  async getLastMortalityByFarmingCycleId(
    farmingCycleId: string,
    limit?: number,
  ): Promise<FarmingCycleChickStockD[]> {
    let query = this.repository
      .createQueryBuilder('fccsd')
      .where('fccsd.ref_farmingcycle_id = :id', { id: farmingCycleId })
      .andWhere('fccsd.operator = :operator', { operator: '-' });

    if (limit) {
      query = query.limit(limit);
    } else {
      query = query.limit(1);
    }

    const results = await query.orderBy('fccsd.created_date', 'DESC').getMany();

    return results;
  }

  async getTotalMortalityToday(id: string, dateStr?: string): Promise<number> {
    let query = this.repository
      .createQueryBuilder('fccsd')
      .select('SUM(fccsd.qty)', 'total')
      .where('fccsd.ref_farmingcycle_id = :id', { id })
      .andWhere('fccsd.operator = :operator', { operator: '-' })
      .andWhere('fccsd.notes = :notes', { notes: 'mortality' });

    if (dateStr) {
      query = query.andWhere('fccsd.transaction_date = :dateStr', { dateStr });
    } else {
      query = query.andWhere('fccsd.transaction_date = NOW()::date');
    }

    const { total } = await query.getRawOne();

    return Number(total);
  }

  async getTotalMortalityToDate(farmingCycleId: string, dateStr?: string): Promise<number> {
    let query = this.repository
      .createQueryBuilder('fccsd')
      .select('SUM(fccsd.qty)', 'total')
      .where('fccsd.ref_farmingcycle_id = :id', { id: farmingCycleId })
      .andWhere('fccsd.operator = :operator', { operator: '-' })
      .andWhere('fccsd.notes = :notes', { notes: 'mortality' });

    if (dateStr) {
      query = query.andWhere('fccsd.transaction_date <= :dateStr', { dateStr });
    } else {
      query = query.andWhere('fccsd.transaction_date <= NOW()::date');
    }

    const { total } = await query.getRawOne();

    return Number(total);
  }

  async getTotalReductionToDate(farmingCycleId: string, dateStr?: string): Promise<number> {
    let query = this.repository
      .createQueryBuilder('fccsd')
      .select('SUM(fccsd.qty)', 'total')
      .where('fccsd.ref_farmingcycle_id = :id', { id: farmingCycleId })
      .andWhere('fccsd.operator = :operator', { operator: '-' });

    if (dateStr) {
      query = query.andWhere('fccsd.transaction_date <= :dateStr', { dateStr });
    } else {
      query = query.andWhere('fccsd.transaction_date <= NOW()::date');
    }

    const { total } = await query.getRawOne();

    return Number(total);
  }

  async getTotalAdditionToDate(farmingCycleId: string, dateStr?: string): Promise<number> {
    let query = await this.repository
      .createQueryBuilder('fccsd')
      .select('SUM(fccsd.qty)', 'total')
      .where('fccsd.ref_farmingcycle_id = :id', { id: farmingCycleId })
      .andWhere('fccsd.operator = :operator', { operator: '+' });

    if (dateStr) {
      query = query.andWhere('fccsd.transaction_date <= :dateStr', { dateStr });
    } else {
      query = query.andWhere('fccsd.transaction_date <= NOW()::date');
    }

    const { total } = await query.getRawOne();

    return Number(total);
  }

  async upsert(
    data: DeepPartial<FarmingCycleChickStockD>,
    user: RequestUser,
  ): Promise<FarmingCycleChickStockD> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    let stock = await this.repository.findOne({
      where: {
        taskTicketId: data.taskTicketId,
        taskTicketDId: data.taskTicketDId,
      },
    });

    const taskTicket = await this.taskTicketRepository.findOne({
      where: {
        id: data.taskTicketId,
      },
    });

    if (!stock) {
      stock = this.repository.create({
        id: randomHexString(),
        createdBy: user.id,
        createdDate: now,
        farmingCycleId: data.farmingCycleId,
        taskTicketId: data.taskTicketId,
        taskTicketDId: data.taskTicketDId,
        transactionDate: taskTicket?.reportedDate,
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
      transactionDate: taskTicket?.reportedDate,
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

  // eslint-disable-next-line class-methods-use-this
  async createOneWithTx(
    data: DeepPartial<FarmingCycleChickStockD>,
    userRequest: Partial<RequestUser>,
    queryRunner: QueryRunner,
  ): Promise<FarmingCycleChickStockD> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const farmingCycleChickStock = queryRunner.manager.create(FarmingCycleChickStockD, {
      ...data,
      id: randomHexString(),
      createdBy: userRequest.id,
      createdDate: now,
      modifiedBy: userRequest.id,
      modifiedDate: now,
    });

    const result = await queryRunner.manager.save(FarmingCycleChickStockD, farmingCycleChickStock);

    return result;
  }

  // eslint-disable-next-line class-methods-use-this
  async updateOneWithTx(
    params: FindOptionsWhere<FarmingCycleChickStockD>,
    data: Partial<FarmingCycleChickStockD>,
    user: Partial<RequestUser>,
    queryRunner: QueryRunner,
  ) {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    await queryRunner.manager.update(FarmingCycleChickStockD, params, {
      ...data,
      modifiedBy: user.id,
      modifiedDate: now,
    });

    const updatedFarmingCycle = await queryRunner.manager.findOneOrFail(FarmingCycleChickStockD, {
      where: {
        ...((params.id && {
          id: params.id,
        }) ||
          params),
      },
    });

    return updatedFarmingCycle;
  }

  // eslint-disable-next-line consistent-return
  async upsertOneWithTx(
    params: FindOptionsWhere<FarmingCycleChickStockD>,
    data: DeepPartial<FarmingCycleChickStockD>,
    user: RequestUser,
    queryRunner: QueryRunner,
  ) {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const chickStock = await this.repository.findOne({
      where: {
        ...params,
      },
    });

    if (!chickStock) {
      const newChickStock = queryRunner.manager.create(FarmingCycleChickStockD, {
        ...data,
        id: randomHexString(),
        createdBy: user.id,
        createdDate: now,
      });

      const result = await queryRunner.manager.save(FarmingCycleChickStockD, newChickStock);

      return result;
    }

    await queryRunner.manager.update(FarmingCycleChickStockD, params, {
      ...data,
      modifiedBy: user.id,
      modifiedDate: now,
    });

    const updatedChickStock = await queryRunner.manager.findOneOrFail(FarmingCycleChickStockD, {
      where: {
        ...((params.id && {
          id: params.id,
        }) ||
          params),
      },
    });

    return updatedChickStock;
  }
}
