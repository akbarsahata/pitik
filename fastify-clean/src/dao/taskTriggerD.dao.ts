/* eslint-disable class-methods-use-this */
import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import { DeepPartial, FindOptionsWhere, QueryRunner } from 'typeorm';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { Task } from '../datasources/entity/pgsql/Task.entity';
import { TaskPreset } from '../datasources/entity/pgsql/TaskPreset.entity';
import { TaskTriggerD } from '../datasources/entity/pgsql/TaskTriggerD.entity';
import { DEFAULT_TIME_ZONE } from '../libs/constants';
import { RequestUser } from '../libs/types/index.d';
import { randomHexString } from '../libs/utils/helpers';
import { BaseSQLDAO } from './base.dao';

@Service()
export class TaskTriggerDDAO extends BaseSQLDAO<TaskTriggerD> {
  @Inject(PostgreSQLConnection)
  protected pSql!: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(TaskTriggerD);
  }

  async createManyWithTx(
    data: DeepPartial<TaskTriggerD>[],
    user: RequestUser,
    queryRunner: QueryRunner,
    transactionHooks?: Function[],
  ): Promise<TaskTriggerD[]> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const items = queryRunner.manager.create(
      TaskTriggerD,
      data.map<DeepPartial<TaskTriggerD>>((input) => ({
        ...input,
        id: randomHexString(),
        createdBy: user.id,
        createdDate: now,
        modifiedBy: user.id,
        modifiedDate: now,
      })),
    );

    const result = await queryRunner.manager.save(TaskTriggerD, items);

    transactionHooks?.reduce(async (prev, trxHook) => {
      await prev;

      return trxHook(items, queryRunner);
    }, Promise.resolve());

    return result;
  }

  async upsertOneWithTx(
    data: Partial<TaskTriggerD>,
    userId: string,
    queryRunner: QueryRunner,
  ): Promise<Partial<TaskTriggerD>> {
    const existing = await queryRunner.manager.findOne(TaskTriggerD, {
      where: {
        taskId: data.taskId,
      },
    });

    if (existing) {
      return existing;
    }

    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const coopMember = queryRunner.manager.create(TaskTriggerD, {
      ...data,
      id: randomHexString(),
      createdBy: userId,
      createdDate: now,
      modifiedBy: userId,
      modifiedDate: now,
    });

    await queryRunner.manager.save(coopMember);

    return coopMember;
  }

  wrapUpsertHook(taskTrigger: TaskTriggerD, userId: string): Function {
    return async (task: Task, queryRunner: QueryRunner) =>
      this.upsertOneWithTx(
        {
          taskId: task.id,
          day: taskTrigger.day,
          triggerTime: taskTrigger.triggerTime,
          deadline: taskTrigger.deadline,
        },
        userId,
        queryRunner,
      );
  }

  async deleteWithTx(params: FindOptionsWhere<TaskTriggerD>, queryRunner: QueryRunner) {
    const results = await queryRunner.manager.delete(TaskTriggerD, params);
    return results;
  }

  wrapDeleteHook() {
    return (taskPreset: TaskPreset, queryRunner: QueryRunner) =>
      this.deleteWithTx(taskPreset, queryRunner);
  }
}
