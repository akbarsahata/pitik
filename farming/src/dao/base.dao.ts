/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
import { utcToZonedTime } from 'date-fns-tz';
import { Service } from 'fastify-decorators';
import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  ObjectLiteral,
  QueryRunner,
  Repository,
} from 'typeorm';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { CMSBase } from '../datasources/entity/pgsql/Base.entity';
import { DEFAULT_TIME_ZONE } from '../libs/constants';
import { ERR_METHOD_NOT_IMPLEMENTED } from '../libs/constants/errors';
import { RequestUser } from '../libs/types/index.d';
import { randomHexString } from '../libs/utils/helpers';

@Service()
export abstract class BaseDAO<T extends ObjectLiteral = CMSBase> {
  protected pSql!: PostgreSQLConnection;

  protected repository: Repository<T>;

  abstract init(): void;
}

@Service()
export abstract class BaseSQLDAO<T extends ObjectLiteral = CMSBase> extends BaseDAO<T> {
  async getOne(params: FindOneOptions<T>): Promise<T | null> {
    const entity = await this.repository.findOne(params);

    return entity;
  }

  /**
   * very simple getOne implementation but using query runner
   * override this method if you need order, join, or even select
   *
   * @param   {FindOneOptions<T>}       params       find parameters
   * @param   {QueryRunner<T>}          queryRunner  query runner
   *
   * @return  {Promise<T>}                           found entity
   */
  async getOneWithTx(params: FindOneOptions<T>, queryRunner: QueryRunner): Promise<T | null> {
    let query = this.repository.createQueryBuilder('e', queryRunner).select('*');

    if (params.where) {
      query = query.where(params.where);
    }

    const entity = await query.getOne();

    return entity;
  }

  async getOneStrict(params: FindOneOptions<T>): Promise<T> {
    if (this && params) {
      throw ERR_METHOD_NOT_IMPLEMENTED(this.constructor.name);
    }

    throw ERR_METHOD_NOT_IMPLEMENTED(this.constructor.name);
  }

  async getMany(params: FindManyOptions<T>): Promise<[T[], number]> {
    const [entities, count] = await this.repository.findAndCount(params);

    return [entities, count];
  }

  /**
   * very simple getMany implementation but using query runner
   * override this method if you need order, join, or even select
   *
   * @param   {FindOneOptions<T>}       params       find parameters
   * @param   {QueryRunner<T>}          queryRunner  query runner
   *
   * @return  {Promise<T>}                           found entity
   */
  async getManyWithTx(params: FindOneOptions<T>, queryRunner: QueryRunner): Promise<T[]> {
    let query = this.repository.createQueryBuilder('e', queryRunner).select('*');

    if (params.where) {
      query = query.where(params.where);
    }

    const entity = await query.getMany();

    return entity;
  }

  async createOne(data: DeepPartial<T>, user: RequestUser): Promise<T> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);
    const toBeEntity = {
      ...data,
      id: data.id ? data.id : randomHexString(),
      createdBy: user.id,
      createdDate: now,
      modifiedBy: user.id,
      modifiedDate: now,
    };

    const entity = this.repository.create(toBeEntity);

    const createdEntity = await this.repository.save(entity);

    return createdEntity;
  }

  async createMany(data: DeepPartial<T>[], user: RequestUser): Promise<T[]> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);
    const entities = this.repository.create(
      data.map<DeepPartial<T>>((d) => ({
        ...d,
        id: randomHexString(),
        createdBy: user.id,
        createdDate: now,
        modifiedBy: user.id,
        modifiedDate: now,
      })),
    );

    const createdEntities = await this.repository.save(entities);

    return createdEntities;
  }

  async createOneWithTx(
    data: DeepPartial<T>,
    user: RequestUser,
    queryRunner: QueryRunner,
    transactionHooks?: Function[],
  ): Promise<T> {
    if (this && data && user && queryRunner && transactionHooks) {
      throw ERR_METHOD_NOT_IMPLEMENTED();
    }

    throw ERR_METHOD_NOT_IMPLEMENTED();
  }

  async createManyWithTx(
    data: DeepPartial<T>[],
    user: RequestUser,
    queryRunner: QueryRunner,
    transactionHooks?: Function[],
  ): Promise<T[]> {
    if (this && data && user && queryRunner && transactionHooks) {
      throw ERR_METHOD_NOT_IMPLEMENTED();
    }

    throw ERR_METHOD_NOT_IMPLEMENTED();
  }

  async updateOne(
    params: FindOptionsWhere<T>,
    data: DeepPartial<T>,
    user: RequestUser,
  ): Promise<T> {
    if (this && params && data && user) {
      throw ERR_METHOD_NOT_IMPLEMENTED(this.constructor.name);
    }

    throw ERR_METHOD_NOT_IMPLEMENTED(this.constructor.name);
  }

  async updateMany(
    params: FindOptionsWhere<T>,
    data: DeepPartial<T>,
    user: RequestUser,
  ): Promise<T[]> {
    if (this && params && data && user) {
      throw ERR_METHOD_NOT_IMPLEMENTED(this.constructor.name);
    }

    throw ERR_METHOD_NOT_IMPLEMENTED(this.constructor.name);
  }

  async updateOneWithTx(
    params: FindOptionsWhere<T>,
    data: DeepPartial<T>,
    user: RequestUser,
    queryRunner: QueryRunner,
    transactionHooks?: Function[],
  ): Promise<T> {
    if (this && params && data && user && queryRunner && transactionHooks) {
      throw ERR_METHOD_NOT_IMPLEMENTED();
    }

    throw ERR_METHOD_NOT_IMPLEMENTED();
  }

  async updateManyWithTx(
    params: FindOptionsWhere<T>,
    data: DeepPartial<T>,
    user: RequestUser,
    queryRunner: QueryRunner,
    transactionHooks?: Function[],
  ): Promise<T[]> {
    if (this && params && data && user && queryRunner && transactionHooks) {
      throw ERR_METHOD_NOT_IMPLEMENTED();
    }

    throw ERR_METHOD_NOT_IMPLEMENTED();
  }

  async deleteOne(params: FindOptionsWhere<T>): Promise<T> {
    if (this && params) {
      throw ERR_METHOD_NOT_IMPLEMENTED(this.constructor.name);
    }

    throw ERR_METHOD_NOT_IMPLEMENTED(this.constructor.name);
  }

  async deleteOneWithTx(params: FindOptionsWhere<T>, queryRunner: QueryRunner): Promise<T> {
    if (this && params && queryRunner) {
      throw ERR_METHOD_NOT_IMPLEMENTED(this.constructor.name);
    }

    throw ERR_METHOD_NOT_IMPLEMENTED(this.constructor.name);
  }

  async deleteMany(params: FindOptionsWhere<T>): Promise<T[]> {
    if (this && params) {
      throw ERR_METHOD_NOT_IMPLEMENTED(this.constructor.name);
    }

    throw ERR_METHOD_NOT_IMPLEMENTED(this.constructor.name);
  }

  async deleteManyWithTx(params: FindOptionsWhere<T>, queryRunner: QueryRunner): Promise<T[]> {
    if (this && params && queryRunner) {
      throw ERR_METHOD_NOT_IMPLEMENTED(this.constructor.name);
    }

    throw ERR_METHOD_NOT_IMPLEMENTED(this.constructor.name);
  }

  async startTransaction(): Promise<QueryRunner> {
    const queryRunner = this.pSql.connection.createQueryRunner();

    await queryRunner.connect();

    await queryRunner.startTransaction();

    return queryRunner;
  }

  async commitTransaction(queryRunner: QueryRunner, release = true): Promise<void> {
    if (queryRunner.isTransactionActive) {
      await queryRunner.commitTransaction();
    }

    if (release) {
      await queryRunner.release();
    }
  }

  async rollbackTransaction(queryRunner: QueryRunner): Promise<void> {
    if (queryRunner.isTransactionActive) {
      await queryRunner.rollbackTransaction();
    }

    await queryRunner.release();
  }

  async removeCache(cacheId: string): Promise<void> {
    await this.repository.manager.connection.queryResultCache?.remove([cacheId]);
  }
}
