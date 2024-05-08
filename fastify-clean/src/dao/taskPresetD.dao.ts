/* eslint-disable class-methods-use-this */
import { utcToZonedTime } from 'date-fns-tz';
import { DeepPartial, FindOptionsWhere, QueryRunner } from 'typeorm';
import { Initializer, Inject, Service } from 'fastify-decorators';
import { TaskPreset } from '../datasources/entity/pgsql/TaskPreset.entity';
import { TaskPresetD } from '../datasources/entity/pgsql/TaskPresetD.entity';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { DEFAULT_TIME_ZONE } from '../libs/constants';
import { randomHexString } from '../libs/utils/helpers';
import { BaseSQLDAO } from './base.dao';
import { RequestUser } from '../libs/types/index.d';

@Service()
export class TaskPresetDDAO extends BaseSQLDAO<TaskPresetD> {
  @Inject(PostgreSQLConnection)
  protected pSql!: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(TaskPresetD);
  }

  async createManyWithTx(
    data: DeepPartial<TaskPresetD>[],
    user: RequestUser,
    queryRunner: QueryRunner,
    transactionHooks?: Function[],
  ): Promise<TaskPresetD[]> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const items = queryRunner.manager.create(
      TaskPresetD,
      data.map<DeepPartial<TaskPresetD>>((input) => ({
        ...input,
        id: randomHexString(),
        createdBy: user.id,
        createdDate: now,
        modifiedBy: user.id,
        modifiedDate: now,
      })),
    );

    const result = await queryRunner.manager.save(TaskPresetD, items);

    transactionHooks?.reduce(async (prev, trxHook) => {
      await prev;

      return trxHook(items, queryRunner);
    }, Promise.resolve());

    return result;
  }

  async upsertOneWithTx(
    data: Partial<TaskPresetD>,
    userId: string,
    queryRunner: QueryRunner,
  ): Promise<Partial<TaskPresetD>> {
    const existing = await queryRunner.manager.findOne(TaskPresetD, {
      where: {
        taskPresetId: data.taskPresetId,
        taskId: data.taskId,
      },
    });

    if (existing) {
      return existing;
    }

    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const coopMember = queryRunner.manager.create(TaskPresetD, {
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

  wrapUpsertHook(taskId: string, userId: string): Function {
    return async (taskPreset: TaskPreset, queryRunner: QueryRunner) =>
      this.upsertOneWithTx(
        {
          taskPresetId: taskPreset.id,
          taskId,
        },
        userId,
        queryRunner,
      );
  }

  async deleteWithTx(params: FindOptionsWhere<TaskPresetD>, queryRunner: QueryRunner) {
    const results = await queryRunner.manager.delete(TaskPresetD, params);
    return results;
  }

  wrapDeleteHook() {
    return (taskPreset: TaskPreset, queryRunner: QueryRunner) =>
      this.deleteWithTx(taskPreset, queryRunner);
  }
}
