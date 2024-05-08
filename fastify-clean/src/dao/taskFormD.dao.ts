/* eslint-disable class-methods-use-this */
import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import { DeepPartial, FindOptionsWhere, QueryRunner } from 'typeorm';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { Task } from '../datasources/entity/pgsql/Task.entity';
import { TaskFormD } from '../datasources/entity/pgsql/TaskFormD.entity';
import { TaskPreset } from '../datasources/entity/pgsql/TaskPreset.entity';
import { DEFAULT_TIME_ZONE } from '../libs/constants';
import { RequestUser } from '../libs/types/index.d';
import { randomHexString } from '../libs/utils/helpers';
import { BaseSQLDAO } from './base.dao';

@Service()
export class TaskFormDDAO extends BaseSQLDAO<TaskFormD> {
  @Inject(PostgreSQLConnection)
  protected pSql!: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(TaskFormD);
  }

  async createManyWithTx(
    data: DeepPartial<TaskFormD>[],
    user: RequestUser,
    queryRunner: QueryRunner,
    transactionHooks?: Function[],
  ): Promise<TaskFormD[]> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const items = queryRunner.manager.create(
      TaskFormD,
      data.map<DeepPartial<TaskFormD>>((input) => ({
        ...input,
        id: randomHexString(),
        createdBy: user.id,
        createdDate: now,
        modifiedBy: user.id,
        modifiedDate: now,
      })),
    );

    const result = await queryRunner.manager.save(TaskFormD, items);

    transactionHooks?.reduce(async (prev, trxHook) => {
      await prev;

      return trxHook(items, queryRunner);
    }, Promise.resolve());

    return result;
  }

  async upsertOneWithTx(
    data: Partial<TaskFormD>,
    userId: string,
    queryRunner: QueryRunner,
  ): Promise<Partial<TaskFormD>> {
    const existing = await queryRunner.manager.findOne(TaskFormD, {
      where: {
        taskId: data.taskId,
      },
    });

    if (existing) {
      return existing;
    }

    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const coopMember = queryRunner.manager.create(TaskFormD, {
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

  wrapUpsertHook(taskForm: TaskFormD, userId: string): Function {
    return async (task: Task, queryRunner: QueryRunner) =>
      this.upsertOneWithTx(
        {
          taskId: task.id,
          instructionTitle: taskForm.instructionTitle,
          dataRequired: taskForm.dataRequired,
          dataInstruction: taskForm.dataInstruction,
          dataType: taskForm.dataType,
          dataOption: taskForm.dataOption,
          variableId: taskForm.variableId,
          feedbrandId: taskForm.feedbrandId,
          harvestQty: taskForm.harvestQty,
          dataOperator: taskForm.dataOperator,
          photoRequired: taskForm.photoRequired,
          photoInstruction: taskForm.photoInstruction,
          videoRequired: taskForm.videoRequired,
          videoInstruction: taskForm.videoInstruction,
          needAdditionalDetail: taskForm.needAdditionalDetail,
          additionalDetail: taskForm.additionalDetail,
          checkDataCorrectness: taskForm.checkDataCorrectness,
        },
        userId,
        queryRunner,
      );
  }

  async deleteWithTx(params: FindOptionsWhere<TaskFormD>, queryRunner: QueryRunner) {
    const results = await queryRunner.manager.delete(TaskFormD, params);
    return results;
  }

  wrapDeleteHook() {
    return (taskPreset: TaskPreset, queryRunner: QueryRunner) =>
      this.deleteWithTx(taskPreset, queryRunner);
  }
}
