import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import { DeepPartial, FindOneOptions, FindOptionsWhere, In, QueryRunner } from 'typeorm';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { FarmingCycleTaskD } from '../datasources/entity/pgsql/FarmingCycleTaskD.entity';
import { TaskTicket } from '../datasources/entity/pgsql/TaskTicket.entity';
import { TaskTicketD } from '../datasources/entity/pgsql/TaskTicketD.entity';
import { DATETIME_SQL_FORMAT, DEFAULT_TIME_ZONE } from '../libs/constants';
import { ERR_TASK_TICKET_DETAIL_NOT_FOUND } from '../libs/constants/errors';
import { RequestUser } from '../libs/types/index.d';
import { randomHexString } from '../libs/utils/helpers';
import { BaseSQLDAO } from './base.dao';

@Service()
export class TaskTicketDDAO extends BaseSQLDAO<TaskTicketD> {
  @Inject(PostgreSQLConnection)
  protected pSql!: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  async init() {
    this.repository = this.pSql.connection.getRepository(TaskTicketD);
  }

  /**
   * get latest of data value
   * @param variableId variable id
   * @param farmingCycleId farming cycle id
   * @param skip skip n last
   * @param reportedUntil exclusive date
   * @returns latest data value
   */
  async getLatestValue(
    variableId: string,
    farmingCycleId: string,
    skip?: number,
    reportedUntil?: Date,
    reportedFrom?: Date,
  ): Promise<TaskTicketD | null> {
    let query = this.repository
      .createQueryBuilder('ttd')
      .leftJoin(TaskTicket, 'tt', 'ttd.ref_taskticket_id = tt.id')
      .where('ttd.ref_variable_id = :variableId', { variableId })
      .andWhere('tt.ref_farmingcycle_id = :farmingCycleId', { farmingCycleId })
      .andWhere('tt.already_execute = 1')
      .orderBy('tt.reported_date', 'DESC');

    if (skip) {
      query = query.offset(skip).limit(1);
    }

    if (reportedUntil && !reportedFrom) {
      query = query.andWhere('tt.reported_date < :date', { date: format(reportedUntil, 'y-M-d') });
    }

    if (reportedUntil && reportedFrom) {
      query = query.andWhere('tt.reported_date BETWEEN :dateFrom AND :dateTo', {
        dateFrom: format(reportedFrom, 'y-M-d H:m:s'),
        dateTo: format(reportedUntil, 'y-M-d H:m:s'),
      });
    }

    const latest = await query.getOne();

    return latest;
  }

  async getTodayLatestValue(
    variableId: string,
    farmingCycleId: string,
    dateTimeStr?: string,
  ): Promise<TaskTicketD | null> {
    let query = this.repository
      .createQueryBuilder('ttd')
      .leftJoin(TaskTicket, 'tt', 'ttd.ref_taskticket_id = tt.id')
      .where('ttd.ref_variable_id = :variableId', { variableId })
      .andWhere('tt.ref_farmingcycle_id = :farmingCycleId', { farmingCycleId })
      .andWhere('tt.already_execute = 1')
      .orderBy('tt.reported_date', 'DESC')
      .limit(1);

    if (dateTimeStr) {
      query = query.andWhere('tt.reported_date = :dateTimeStr', { dateTimeStr });
    } else {
      query = query.andWhere("tt.reported_date::date = (NOW() + interval '7 hour')::date");
    }

    const latest = await query.getOne();

    return latest;
  }

  /**
   * get latest sum of data_value
   * @param variableId variable id
   * @param farmingCycleId farming cycle id
   * @param reportedUntil exclusive date
   * @returns sum of data value
   */
  async getLatestSum(
    variableId: string,
    farmingCycleId: string,
    option?: {
      reportedUntil?: Date;
      reportedUntilFormat?: string;
      taskCode?: string;
    },
  ): Promise<number> {
    let query = this.repository
      .createQueryBuilder('ttd')
      .select('SUM(data_value::float)', 'totalSum')
      .leftJoin(TaskTicket, 'tt', 'ttd.ref_taskticket_id = tt.id')
      .where('ttd.ref_variable_id = :variableId', { variableId })
      .andWhere('tt.ref_farmingcycle_id = :farmingCycleId', { farmingCycleId })
      .andWhere('tt.already_execute = 1');

    if (option?.taskCode) {
      query = query
        .innerJoin(FarmingCycleTaskD, 'fctd', 'fctd.id = tt.ref_farmingcycletask_id')
        .andWhere('fctd.task_code = :taskCode', { taskCode: option.taskCode });
    }

    if (option?.reportedUntil) {
      query = query.andWhere('tt.reported_date < :date', {
        date: format(option.reportedUntil, option.reportedUntilFormat || DATETIME_SQL_FORMAT),
      });
    }

    const { totalSum } = await query.getRawOne();

    return totalSum;
  }

  async getTodaySum(variableId: string, farmingCycleId: string): Promise<number> {
    const { totalSum } = await this.repository
      .createQueryBuilder('ttd')
      .select('SUM(data_value::float)', 'totalSum')
      .leftJoin(TaskTicket, 'tt', 'ttd.ref_taskticket_id = tt.id')
      .where('ttd.ref_variable_id = :variableId', { variableId })
      .andWhere('tt.ref_farmingcycle_id = :farmingCycleId', { farmingCycleId })
      .andWhere("tt.reported_date::date = (NOW() + interval '7 hour')::date")
      .andWhere('tt.already_execute = 1')
      .getRawOne();

    return totalSum;
  }

  async getLatestAverage(variableId: string, farmingCycleId: string): Promise<number> {
    const { average } = await this.repository
      .createQueryBuilder('ttd')
      .select('AVG(ttd.data_value::float)', 'average')
      .leftJoin(TaskTicket, 'tt', 'ttd.ref_taskticket_id = tt.id')
      .where('ttd.ref_variable_id = :id', { id: variableId })
      .andWhere('tt.ref_farmingcycle_id = :farmingCycleId', { farmingCycleId })
      .andWhere("tt.reported_date::date <= (NOW() + interval '7 hour')::date")
      .andWhere('tt.already_execute = 1')
      .getRawOne();

    return average;
  }

  async getTodayLatestAverage(
    variableId: string,
    farmingCycleId: string,
    dateTimeStr?: string,
  ): Promise<number> {
    let query = this.repository
      .createQueryBuilder('ttd')
      .select('AVG(ttd.data_value::float)', 'average')
      .leftJoin(TaskTicket, 'tt', 'ttd.ref_taskticket_id = tt.id')
      .where('ttd.ref_variable_id = :id', { id: variableId })
      .andWhere('tt.ref_farmingcycle_id = :farmingCycleId', { farmingCycleId })
      .andWhere('tt.already_execute = 1');

    if (dateTimeStr) {
      query = query.andWhere('tt.reported_date = :dateTimeStr', { dateTimeStr });
    } else {
      query = query.andWhere("tt.reported_date::date = (NOW() + interval '7 hour')::date");
    }

    const { average } = await query.getRawOne();

    return average;
  }

  async updateOne(
    params: FindOptionsWhere<TaskTicketD>,
    data: Partial<TaskTicketD>,
    user: RequestUser,
  ): Promise<TaskTicketD> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const result = await this.repository.update(params, {
      ...data,
      executedDate: now,
      modifiedBy: user.id,
      modifiedDate: now,
    });

    if (!result.affected) {
      throw ERR_TASK_TICKET_DETAIL_NOT_FOUND();
    }

    const updated = await this.repository.findOneOrFail({
      where: params,
      relations: {
        photos: true,
        videos: true,
      },
    });

    return updated;
  }

  async createOne(data: Partial<TaskTicketD>, user: RequestUser): Promise<TaskTicketD> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const newTaskTicketD = this.repository.create({
      ...data,
      id: randomHexString(),
      createdBy: user.id,
      createdDate: now,
      modifiedBy: user.id,
      modifiedDate: now,
    });

    return this.repository.save(newTaskTicketD);
  }

  async createMany(data: Partial<TaskTicketD>[], user: RequestUser): Promise<TaskTicketD[]> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const taskTicketDs = this.repository.create(
      data.map((d) => ({
        ...d,
        id: randomHexString(),
        createdBy: user.id,
        createdDate: now,
        modifiedBy: user.id,
        modifiedDate: now,
      })),
    );

    await this.repository.save(taskTicketDs);

    return taskTicketDs;
  }

  async createManyWithTx(
    data: DeepPartial<TaskTicketD>[],
    user: RequestUser,
    queryRunner: QueryRunner,
  ): Promise<TaskTicketD[]> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const taskTicketDs = queryRunner.manager.create(
      TaskTicketD,
      data.map((d) => ({
        ...d,
        id: randomHexString(),
        createdBy: user.id,
        createdDate: now,
        modifiedBy: user.id,
        modifiedDate: now,
      })),
    );

    const createdTaskTicketDs = await this.repository.save(taskTicketDs);

    return createdTaskTicketDs;
  }

  async getByTaskTicket(
    id: string,
    params?: FindOneOptions<TaskTicketD>,
  ): Promise<[TaskTicketD[], number]> {
    const results = await this.repository.findAndCount({
      where: {
        ...(params && (params.where as object)),
        taskTicketId: id,
      },
    });

    return results;
  }

  async getCheckCorrectnessOnly(taskTicketId: string): Promise<[TaskTicketD[], number]> {
    const [results, count] = await this.repository.findAndCount({
      where: {
        taskTicketId,
        checkDataCorrectness: true,
      },
    });

    return [results, count];
  }

  // eslint-disable-next-line class-methods-use-this
  async updateOneWithTx(
    params: FindOptionsWhere<TaskTicketD>,
    data: DeepPartial<TaskTicketD>,
    user: RequestUser,
    queryRunner: QueryRunner,
  ): Promise<TaskTicketD> {
    await queryRunner.manager.update(TaskTicketD, params, {
      ...data,
      modifiedBy: user.id,
      modifiedDate: utcToZonedTime(new Date(), DEFAULT_TIME_ZONE),
    });

    const updated = await queryRunner.manager.findOneOrFail(TaskTicketD, {
      where: {
        ...((params.id && {
          id: params.id,
        }) ||
          params),
      },
    });

    return updated;
  }

  async upsertMany(
    user: RequestUser,
    items: DeepPartial<TaskTicketD>[],
    queryRunner?: QueryRunner,
  ): Promise<TaskTicketD[]> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const upserItems = items.map((item) => ({
      ...item,
      id: item.id || randomHexString(),
      createdBy: user.id,
      createdDate: now,
      modifiedBy: user.id,
      modifiedDate: now,
    }));

    await this.repository
      .createQueryBuilder(undefined, queryRunner)
      .insert()
      .into(TaskTicketD)
      .values(upserItems)
      .orUpdate(
        ['data_value', 'modified_by', 'modified_date', 'executed_date', 'ref_feedbrand_id'],
        ['id'],
      )
      .execute();

    const [data] = await this.getMany({
      where: {
        id: In(upserItems.map((item) => item.id)),
      },
      relations: {
        taskTicket: true,
      },
    });

    return data;
  }

  // eslint-disable-next-line class-methods-use-this
  async getManyWithTx(
    params: FindOneOptions<TaskTicketD>,
    queryRunner: QueryRunner,
  ): Promise<TaskTicketD[]> {
    const data = await queryRunner.manager.find(TaskTicketD, params);

    return data;
  }
}
