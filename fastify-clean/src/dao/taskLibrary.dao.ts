import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import { EntityNotFoundError, FindOneOptions, FindOptionsWhere, QueryRunner } from 'typeorm';
import { RequestUser } from '../libs/types/index.d';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { Task } from '../datasources/entity/pgsql/Task.entity';
import { User } from '../datasources/entity/pgsql/User.entity';
import { DEFAULT_TIME_ZONE } from '../libs/constants';
import { ERR_TASK_LIBRARY_NOT_FOUND } from '../libs/constants/errors';
import { randomHexString } from '../libs/utils/helpers';
import { BaseSQLDAO } from './base.dao';

@Service()
export class TaskLibraryDAO extends BaseSQLDAO<Task> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(Task);
  }

  async getOneStrict(params: FindOneOptions<Task>): Promise<Task> {
    try {
      const taskLibrary = await this.repository.findOneOrFail(params);

      return taskLibrary;
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw ERR_TASK_LIBRARY_NOT_FOUND(error.message);
      }

      throw error;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async createOneWithTx(
    data: Partial<Task>,
    userRequest: Partial<User>,
    queryRunner: QueryRunner,
    transactionHooks?: Function[],
  ): Promise<Task> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const taskLibrary = queryRunner.manager.create(Task, {
      ...data,
      id: randomHexString(),
      createdBy: userRequest.id,
      createdDate: now,
      modifiedBy: userRequest.id,
      modifiedDate: now,
    });

    const result = await queryRunner.manager.save(Task, taskLibrary);

    const promises = transactionHooks?.map((trxHook) => trxHook(taskLibrary, queryRunner));
    await Promise.all(promises || []);

    return result;
  }

  // eslint-disable-next-line class-methods-use-this
  async updateOneWithTx(
    params: FindOptionsWhere<Task>,
    data: Partial<Task>,
    user: RequestUser,
    queryRunner: QueryRunner,
    transactionHooks?: Function[],
  ): Promise<Task> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    await queryRunner.manager.update(Task, params, {
      ...data,
      modifiedBy: user.id,
      modifiedDate: now,
    });

    const updatedCoop = await queryRunner.manager.findOneOrFail(Task, {
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
