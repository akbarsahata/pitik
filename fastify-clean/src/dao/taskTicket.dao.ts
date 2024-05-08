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
  MoreThan,
  QueryRunner,
  Repository,
} from 'typeorm';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { AutoNumbering } from '../datasources/entity/pgsql/AutoNumbering.entity';
import { DailyMonitoring } from '../datasources/entity/pgsql/DailyMonitoring.entity';
import { DataVerificationGamification } from '../datasources/entity/pgsql/DataVerificationGamification.entity';
import { FarmingCycleTaskD } from '../datasources/entity/pgsql/FarmingCycleTaskD.entity';
import { FarmingCycleTaskGamificationPoint } from '../datasources/entity/pgsql/FarmingCycleTaskGamificationPoint.entity';
import { GamificationPointHistory } from '../datasources/entity/pgsql/GamificationPointHistory.entity';
import { TaskTicket } from '../datasources/entity/pgsql/TaskTicket.entity';
import { TaskTicketD } from '../datasources/entity/pgsql/TaskTicketD.entity';
import { User } from '../datasources/entity/pgsql/User.entity';
import { TaskTicketJob } from '../dto/farmingCycle.dto';
import {
  TaskDetail,
  TaskFormItem,
  TaskMedia,
  TaskSourceEnum,
  TaskSummaryItem,
} from '../dto/task.dto';
import {
  AUTO_NUMBERING_TRX_TYPE,
  DATETIME_17_SQL_FORMAT,
  DEFAULT_TIME_ZONE,
} from '../libs/constants';
import { ERR_TASK_TICKET_NOT_FOUND } from '../libs/constants/errors';
import { TASK_LAPORAN_AKHIR_HARI } from '../libs/constants/taskCodes';
import { RequestUser } from '../libs/types/index.d';
import { generateIssueNumber, randomHexString } from '../libs/utils/helpers';
import { ThresholdGenerator } from '../libs/utils/threshold';
import { BaseSQLDAO } from './base.dao';

@Service()
export class TaskTicketDAO extends BaseSQLDAO<TaskTicket> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Inject(ThresholdGenerator)
  private thresholdGenerator!: ThresholdGenerator;

  private taskTicketDRepository!: Repository<TaskTicketD>;

  @Initializer([PostgreSQLConnection])
  async init() {
    this.repository = this.pSql.connection.getRepository(TaskTicket);
    this.taskTicketDRepository = this.pSql.connection.getRepository(TaskTicketD);
  }

  async getOneById(id: string): Promise<TaskTicket> {
    try {
      const taskTicket = await this.repository.findOneOrFail({
        where: {
          id,
        },
      });

      return taskTicket;
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw ERR_TASK_TICKET_NOT_FOUND(error.message);
      }

      throw error;
    }
  }

  async getMapped(
    params: FindManyOptions<TaskTicket>,
    keyFunction: Function,
  ): Promise<Map<string, TaskTicket>> {
    const [results] = await this.getMany(params);

    return results.reduce((prev, item) => {
      prev.set(keyFunction(item), item);
      return prev;
    }, new Map<string, TaskTicket>());
  }

  async getOneStrict(params: FindOneOptions<TaskTicket>): Promise<TaskTicket> {
    try {
      const taskTicket = await this.repository.findOneOrFail(params);

      return taskTicket;
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw ERR_TASK_TICKET_NOT_FOUND(error.message);
      }

      throw error;
    }
  }

  async getOne(params: FindOneOptions<TaskTicket>): Promise<TaskTicket | null> {
    const taskTicket = await this.repository.findOne(params);

    return taskTicket;
  }

  async findNextTicket(farmingCycleTaskId: string, reportedDate: Date): Promise<TaskTicket | null> {
    return this.repository.findOne({
      where: {
        farmingCycleTaskId,
        reportedDate: MoreThan(reportedDate),
      },
      order: {
        reportedDate: 'ASC',
      },
    });
  }

  async getSummaryCurrent(
    farmingCycleId: string,
    skip = 0,
    limit = 5,
  ): Promise<[TaskSummaryItem[], number]> {
    const [result, count] = await Promise.all([
      this.repository
        .createQueryBuilder('tt')
        .select([
          'tt.id as id',
          'tt.task_name as title',
          'tt.instruction as instruction',
          'tt.ticketSource as source',
          'tt.reported_date as date',
          'fctgp.potential_points as "potentialPoints"',
        ])
        .leftJoin(
          FarmingCycleTaskGamificationPoint,
          'fctgp',
          'tt.ref_farmingcycletask_id = fctgp.ref_farmingcycletask_id',
        )
        .where("tt.reported_date + interval '1 hours' * tt.deadline >= NOW()")
        .andWhere('tt.ticket_status = 2')
        .andWhere('tt.ref_farmingcycle_id = :farmingCycleId', { farmingCycleId })
        .orderBy("tt.reported_date + interval '1 hours' * tt.deadline", 'ASC')
        .offset(skip)
        .limit(limit)
        .getRawMany(),
      this.repository
        .createQueryBuilder('tt')
        .where("tt.reported_date + interval '1 hours' * tt.deadline >= NOW()")
        .andWhere('tt.ticket_status = 2')
        .andWhere('tt.ref_farmingcycle_id = :farmingCycleId', { farmingCycleId })
        .getCount(),
    ]);

    return [result, count];
  }

  async getSummaryLate(
    farmingCycleId: string,
    skip = 0,
    limit = 5,
  ): Promise<[TaskSummaryItem[], number]> {
    const [result, count] = await Promise.all([
      this.repository
        .createQueryBuilder('tt')
        .select([
          'tt.id as id',
          'tt.task_name as title',
          'tt.instruction as instruction',
          'tt.ticketSource as source',
          'tt.reported_date as date',
          'fctgp.potential_points as "potentialPoints"',
        ])
        .leftJoin(
          FarmingCycleTaskGamificationPoint,
          'fctgp',
          'tt.ref_farmingcycletask_id = fctgp.ref_farmingcycletask_id',
        )
        .where(
          "tt.reported_date + interval '1 hours' * tt.deadline < NOW()",
          // interval '1 day' * a.number_of_days from a;
        )
        .andWhere('tt.ticket_status = 2')
        .andWhere('tt.ref_farmingcycle_id = :farmingCycleId', { farmingCycleId })
        .orderBy("tt.reported_date + interval '1 hours' * tt.deadline", 'DESC')
        .offset(skip)
        .limit(limit)
        .getRawMany(),
      this.countSummaryLate(farmingCycleId),
    ]);

    return [result, count];
  }

  async countSummaryLate(farmingCycleId: string): Promise<number> {
    return this.repository
      .createQueryBuilder('tt')
      .where("tt.reported_date + interval '1 hours' * tt.deadline < NOW()")
      .andWhere('tt.ticket_status = 2')
      .andWhere('tt.ref_farmingcycle_id = :farmingCycleId', { farmingCycleId })
      .getCount();
  }

  async getSummaryDone(
    farmingCycleId: string,
    skip = 0,
    limit = 5,
  ): Promise<[TaskSummaryItem[], number]> {
    const [result, count] = await Promise.all([
      this.repository
        .createQueryBuilder('tt')
        .select([
          'tt.id as id',
          'tt.task_name as title',
          'tt.instruction as instruction',
          'tt.ticketSource as source',
          'tt.reported_date as date',
          'fctgp.potential_points as "potentialPoints"',
          'gph.earned_points as "earnedPoints"',
          "CASE WHEN dvg.id IS NULL THEN '' WHEN dvg.ref_user_verifier_id IS NULL THEN 'verifying' ELSE 'verified' END as \"verificationStatus\"",
        ])
        .leftJoin(
          FarmingCycleTaskGamificationPoint,
          'fctgp',
          'tt.ref_farmingcycletask_id = fctgp.ref_farmingcycletask_id',
        )
        .leftJoin(GamificationPointHistory, 'gph', 'tt.id = gph.ref_taskticket_id')
        .leftJoin(DataVerificationGamification, 'dvg', 'tt.id = dvg.ref_taskticket_id')
        .where('tt.ticket_status = 3')
        .andWhere('tt.ref_farmingcycle_id = :farmingCycleId', { farmingCycleId })
        .orderBy('tt.modified_date', 'DESC')
        .offset(skip)
        .limit(limit)
        .getRawMany(),
      this.countSummaryDone(farmingCycleId),
    ]);

    return [result, count];
  }

  async countSummaryDone(farmingCycleId: string): Promise<number> {
    return this.repository
      .createQueryBuilder('tt')
      .where('tt.ticket_status = 3')
      .andWhere('tt.ref_farmingcycle_id = :farmingCycleId', { farmingCycleId })
      .getCount();
  }

  async getOneDetailById(id: string): Promise<TaskDetail> {
    const [taskTicket, taskTicketDetails] = await Promise.all([
      this.repository
        .createQueryBuilder('tt')
        .select([
          'tt.id as id',
          'tt.task_name as "taskName"',
          'tt.ticket_code as "ticketCode"',
          'tt.already_execute as "alreadyExecute"',
          'tt.instruction as instruction',
          'fctgp.potential_points as "potentialPoints"',
          'gph.earned_points as "earnedPoints"',
          'SUM(ttd.check_data_correctness::int) as "needVerification"',
        ])
        .leftJoin(
          FarmingCycleTaskGamificationPoint,
          'fctgp',
          'tt.ref_farmingcycletask_id = fctgp.ref_farmingcycletask_id',
        )
        .leftJoin(GamificationPointHistory, 'gph', 'tt.id = gph.ref_taskticket_id')
        .leftJoin(TaskTicketD, 'ttd', 'tt.id = ttd.ref_taskticket_id')
        .where('tt.id = :id')
        .groupBy('tt.id')
        .addGroupBy('fctgp.potential_points')
        .addGroupBy('gph.earned_points')
        .setParameter('id', id)
        .getRawOne(),
      this.taskTicketDRepository
        .createQueryBuilder('ttd')
        .leftJoinAndSelect('ttd.variable', 'variable', 'ttd.ref_variable_id = variable.id')
        .leftJoinAndSelect('ttd.photos', 'photos', 'ttd.id = photos.ref_taskticketdetail_id')
        .leftJoinAndSelect('ttd.videos', 'videos', 'ttd.id = videos.ref_taskticketdetail_id')
        .where('ttd.ref_taskticket_id = :taskTicketId', { taskTicketId: id })
        .orderBy('ttd.seq_no', 'ASC')
        .getMany(),
    ]);

    if (!taskTicket) {
      throw ERR_TASK_TICKET_NOT_FOUND();
    }

    return {
      id: taskTicket.id,
      name: taskTicket.taskName,
      ticketCode: taskTicket.ticketCode,
      isExecuted: !!taskTicket.alreadyExecute,
      instruction: taskTicket.instruction,
      needVerification: taskTicket.needVerification > 0,
      potentialPoints: taskTicket.potentialPoints,
      earnedPoints: taskTicket.earnedPoints,
      detail: (await Promise.all<any>(
        taskTicketDetails.map<Promise<TaskFormItem>>(async (ttd) => ({
          id: ttd.id,
          title: ttd.instructionTitle,
          dataOption: TaskTicketDAO.parseDataOption(ttd.dataOption),
          dataRequired: ttd.dataRequired,
          dataValue: ttd.dataValue || '',
          dataType: ttd.dataType || '',
          dataInstruction: ttd.dataInstruction || '',
          dataUOM: ttd.variable?.variableUOM || '',
          additionalDetail: ttd.additionalDetail || '',
          photoRequired: ttd.photoRequired,
          photoInstruction: ttd.photoInstruction || '',
          photoValue: ttd.photos.map<TaskMedia>((p) => ({
            id: p.id,
            url: p.imageUrl,
          })),
          videoRequired: ttd.videoRequired,
          videoInstruction: ttd.videoInstruction || '',
          videoValue: ttd.videos.map<TaskMedia>((v) => ({
            id: v.id,
            url: v.videoUrl,
          })),
          threshold: await this.thresholdGenerator.generate(ttd.variable?.variableCode || ''),
        })),
      )) as TaskFormItem[],
    };
  }

  async updateOne(
    params: FindOptionsWhere<TaskTicket>,
    data: Partial<TaskTicket>,
    user: RequestUser,
  ) {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const result = await this.repository.update(params, {
      ...data,
      modifiedBy: user.id,
      modifiedDate: now,
    });

    if (!result.affected) {
      throw ERR_TASK_TICKET_NOT_FOUND();
    }

    const updated = await this.repository.findOneOrFail({
      where: {
        ...((params.id && {
          id: params.id,
        }) ||
          params),
      },
    });

    return updated;
  }

  async createTaskTicket(
    data: DeepPartial<TaskTicket>,
    user: RequestUser,
    farmOwner: User,
  ): Promise<TaskTicket> {
    const queryRunner = this.pSql.connection.createQueryRunner();

    await queryRunner.connect();

    await queryRunner.startTransaction();

    try {
      const taskTicketNumbering = await queryRunner.manager.findOneOrFail(AutoNumbering, {
        where: {
          transactionType: AUTO_NUMBERING_TRX_TYPE.TASK_TICKET,
        },
      });

      const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

      const taskTicket = queryRunner.manager.create(TaskTicket, {
        id: randomHexString(),
        farmingCycleId: data.farmingCycleId,
        farmingCycleAlertInstructionId: data.farmingCycleAlertInstructionId,
        alertTriggeredId: data.alertTriggeredId,
        taskName: data.taskName,
        instruction: data.instruction,
        ticketSource: data.ticketSource,
        deadline: data.deadline,
        ticketCode: generateIssueNumber(
          taskTicketNumbering.lastNumber,
          taskTicketNumbering.digitCount,
          taskTicketNumbering.prefix,
          farmOwner.userCode,
        ),
        reportedDate: now,
        alreadyExecute: false,
        ticketStatus: 2,
        createdBy: user.id,
        createdDate: now,
        modifiedBy: user.id,
        modifiedDate: now,
      });

      const createdTaskTicket = await queryRunner.manager.save(taskTicket);

      await queryRunner.manager.update(AutoNumbering, taskTicketNumbering.id, {
        lastNumber: () => 'last_number + 1',
      });

      await queryRunner.commitTransaction();

      return createdTaskTicket;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async createFromJobWithTx(
    data: TaskTicketJob,
    user: RequestUser,
    queryRunner: QueryRunner,
  ): Promise<TaskTicket> {
    const taskTicketNumbering = await queryRunner.manager.findOneOrFail(AutoNumbering, {
      where: {
        transactionType: 'TaskTicket',
      },
    });

    const taskTicket = queryRunner.manager.create(TaskTicket, {
      id: randomHexString(),
      ticketCode: generateIssueNumber(
        taskTicketNumbering.lastNumber,
        taskTicketNumbering.digitCount,
        taskTicketNumbering.prefix,
        data.farmOwnerCode,
      ),
      reportedDate: new Date(data.reportedDate),
      farmingCycleId: data.farmingCycleId,
      farmingCycleTaskId: data.farmingCycleTaskId,
      taskName: data.taskName,
      instruction: data.instruction,
      ticketSource: TaskSourceEnum.TASK,
      deadline: data.triggerDeadline,
      alreadyExecute: false,
      ticketStatus: 2,
      createdBy: user.id,
      createdDate: utcToZonedTime(new Date(), DEFAULT_TIME_ZONE),
    });

    await queryRunner.manager.save(taskTicket);

    await queryRunner.manager.update(AutoNumbering, taskTicketNumbering.id, {
      lastNumber: () => 'last_number + 1',
    });

    return taskTicket;
  }

  private static parseDataOption(option: string): string[] {
    try {
      let optionJson = JSON.parse(option);

      if (typeof optionJson === 'string') {
        optionJson = JSON.parse(optionJson);
      }

      return optionJson.map((oj: { name: string }) => oj.name);
    } catch (error) {
      return [];
    }
  }

  async getTaskWithoutDailyMonitoring(
    limit: number,
    opts?: {
      farmingCycleId?: string;
    },
  ): Promise<[TaskTicket[], number]> {
    const sql = this.repository
      .createQueryBuilder('tt')
      .leftJoin(DailyMonitoring, 'd', 'd.ref_taskticket_id = tt.id')
      .innerJoin(FarmingCycleTaskD, 'tfd', 'tt.ref_farmingcycletask_id = tfd.id')
      .innerJoinAndSelect('tt.farmingCycle', 'fc')
      .where('tfd.task_code = :taskCode', { taskCode: TASK_LAPORAN_AKHIR_HARI })
      .andWhere('d.ref_taskticket_id is null')
      .limit(limit);

    if (opts?.farmingCycleId) {
      sql.andWhere('tt.ref_farmingcycle_id = :farmingCycleId', {
        farmingCycleId: opts.farmingCycleId,
      });
    }

    const results = await sql.getManyAndCount();

    return results;
  }

  async upsertMany(user: RequestUser, items: DeepPartial<TaskTicket>[]): Promise<TaskTicket[]> {
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
      .createQueryBuilder()
      .insert()
      .into(TaskTicket)
      .values(upserItems)
      .orUpdate(
        [
          'modified_by',
          'modified_date',
          'executed_by',
          'executed_date',
          'already_execute',
          'ticket_status',
        ],
        ['id'],
      )
      .execute();

    const [results] = await this.getMany({
      where: {
        id: In(upserItems.map((item) => item.id)),
      },
    });

    return results;
  }

  async getDailyReportTask(opts: {
    farmingCycleId: string;
    reportedDate?: string;
  }): Promise<TaskTicket | null> {
    const sql = await this.repository
      .createQueryBuilder('tt')
      .innerJoin(FarmingCycleTaskD, 'fctd', 'fctd.id = tt.ref_farmingcycletask_id')
      .where('tt.ref_farmingcycle_id = :farmingCycleId', { farmingCycleId: opts.farmingCycleId })
      .andWhere('fctd.task_code = :taskCode', { taskCode: TASK_LAPORAN_AKHIR_HARI });

    if (opts.reportedDate) {
      sql.andWhere('tt.reported_date = :reportedDate', {
        reportedDate: format(new Date(opts.reportedDate), DATETIME_17_SQL_FORMAT),
      });
    }

    return sql.getOne();
  }
}
