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
import { ulid } from 'ulid';
import { PostgreSQLConnection } from '../../datasources/connection/postgresql.connection';
import { DEFAULT_TIME_ZONE } from '../../libs/constants';
import { ERR_METHOD_NOT_IMPLEMENTED } from '../../libs/constants/errors';
import { RequestUser } from '../../libs/types/index.d';

@Service()
export abstract class BaseDAO<T extends ObjectLiteral> {
  protected pSql!: PostgreSQLConnection;

  protected repository: Repository<T>;

  abstract init(): void;
}

@Service()
export abstract class BaseSQLDAO<T extends ObjectLiteral> extends BaseDAO<T> {
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

  async createOne(data: DeepPartial<T>, queryRunner?: QueryRunner, user?: RequestUser): Promise<T> {
    if (this && data && queryRunner && user) {
      throw ERR_METHOD_NOT_IMPLEMENTED(this.constructor.name);
    }

    throw ERR_METHOD_NOT_IMPLEMENTED(this.constructor.name);
  }

  async createMany(data: DeepPartial<T>[], user: RequestUser): Promise<T[]> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);
    const entities = this.repository.create(
      data.map<DeepPartial<T>>((d) => ({
        ...d,
        id: ulid(),
        createdBy: user.id,
        createdDate: now,
        modifiedBy: user.id,
        modifiedDate: now,
      })),
    );

    const createdEntities = await this.repository.save(entities);

    return createdEntities;
  }

  async updateOne(
    params: FindOptionsWhere<T>,
    data: DeepPartial<T>,
    queryRunner?: QueryRunner,
    user?: RequestUser,
  ): Promise<T> {
    if (this && params && data && queryRunner && user) {
      throw ERR_METHOD_NOT_IMPLEMENTED(this.constructor.name);
    }

    throw ERR_METHOD_NOT_IMPLEMENTED(this.constructor.name);
  }

  /**
   * upsert one entity with optional query runner
   *
   * @param   { DeepPartial<T> }        item
   * @param   { QueryRunner }           queryRunner  query runner
   * @param   { RequestUser }           user
   */
  async upsertOne(item: DeepPartial<T>, queryRunner?: QueryRunner, user?: RequestUser): Promise<T> {
    if (this && user && item && queryRunner) {
      throw ERR_METHOD_NOT_IMPLEMENTED(this.constructor.name);
    }

    throw ERR_METHOD_NOT_IMPLEMENTED(this.constructor.name);
  }

  /**
   * upsert many entities with optional query runner
   *
   * @param   { DeepPartial<T>[] }      items
   * @param   { QueryRunner }           queryRunner  query runner
   * @param   { RequestUser }           user
   */
  async upsertMany(
    items: DeepPartial<T>[],
    queryRunner?: QueryRunner,
    user?: RequestUser,
  ): Promise<T[]> {
    if (this && user && items && queryRunner) {
      throw ERR_METHOD_NOT_IMPLEMENTED(this.constructor.name);
    }

    throw ERR_METHOD_NOT_IMPLEMENTED(this.constructor.name);
  }

  async deleteOne(params: FindOptionsWhere<T>, queryRunner?: QueryRunner): Promise<T> {
    if (this && params && queryRunner) {
      throw ERR_METHOD_NOT_IMPLEMENTED(this.constructor.name);
    }

    throw ERR_METHOD_NOT_IMPLEMENTED(this.constructor.name);
  }

  async deleteMany(params: FindOptionsWhere<T>, queryRunner?: QueryRunner): Promise<T[]> {
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
}
