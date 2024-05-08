import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import { EntityNotFoundError, FindOneOptions, FindOptionsWhere, QueryRunner } from 'typeorm';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { TaskPreset } from '../datasources/entity/pgsql/TaskPreset.entity';
import { User } from '../datasources/entity/pgsql/User.entity';
import { DEFAULT_TIME_ZONE } from '../libs/constants';
import { ERR_TASK_PRESET_NOT_FOUND } from '../libs/constants/errors';
import { RequestUser } from '../libs/types/index.d';
import { randomHexString } from '../libs/utils/helpers';
import { BaseSQLDAO } from './base.dao';

@Service()
export class TaskPresetDAO extends BaseSQLDAO<TaskPreset> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(TaskPreset);
  }

  async getOneStrict(params: FindOneOptions<TaskPreset>): Promise<TaskPreset> {
    try {
      const taskPreset = await this.repository.findOneOrFail(params);

      return taskPreset;
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw ERR_TASK_PRESET_NOT_FOUND(error.message);
      }

      throw error;
    }
  }

  async getOneById(id: string): Promise<TaskPreset> {
    try {
      return this.repository.findOneOrFail({
        where: {
          id,
        },
        select: {
          coopType: {
            id: true,
            coopTypeCode: true,
            coopTypeName: true,
          },
        },
        relations: {
          coopType: true,
        },
      });
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw ERR_TASK_PRESET_NOT_FOUND(error.message);
      }

      throw error;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async createOneWithTx(
    data: Partial<TaskPreset>,
    userRequest: Partial<User>,
    queryRunner: QueryRunner,
    transactionHooks?: Function[],
  ): Promise<TaskPreset> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const taskPreset = queryRunner.manager.create(TaskPreset, {
      ...data,
      id: randomHexString(),
      createdBy: userRequest.id,
      createdDate: now,
      modifiedBy: userRequest.id,
      modifiedDate: now,
    });

    const result = await queryRunner.manager.save(TaskPreset, taskPreset);

    const promises = transactionHooks?.map((trxHook) => trxHook(taskPreset, queryRunner));
    await Promise.all(promises || []);

    return result;
  }

  // eslint-disable-next-line class-methods-use-this
  async updateOneWithTx(
    params: FindOptionsWhere<TaskPreset>,
    data: Partial<TaskPreset>,
    user: RequestUser,
    queryRunner: QueryRunner,
    transactionHooks?: Function[],
  ): Promise<TaskPreset> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    await queryRunner.manager.update(TaskPreset, params, {
      ...data,
      modifiedBy: user.id,
      modifiedDate: now,
    });

    const updatedCoop = await queryRunner.manager.findOneOrFail(TaskPreset, {
      where: {
        ...((params.id && {
          id: params.id,
        }) ||
          params),
      },
    });

    const promises = transactionHooks?.map((trxHook) => trxHook(updatedCoop, queryRunner));
    await Promise.all(promises || []);

    return updatedCoop;
  }
}
