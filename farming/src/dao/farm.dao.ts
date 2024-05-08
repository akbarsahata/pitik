import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import {
  DeepPartial,
  EntityNotFoundError,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  QueryRunner,
  Repository,
} from 'typeorm';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { Farm } from '../datasources/entity/pgsql/Farm.entity';
import { User } from '../datasources/entity/pgsql/User.entity';
import { DEFAULT_TIME_ZONE } from '../libs/constants';
import { ERR_FARM_NOT_FOUND } from '../libs/constants/errors';
import { RequestUser } from '../libs/types/index.d';
import { randomHexString } from '../libs/utils/helpers';
import { BaseSQLDAO } from './base.dao';

@Service()
export class FarmDAO extends BaseSQLDAO<Farm> {
  @Inject(PostgreSQLConnection)
  protected pSql!: PostgreSQLConnection;

  protected repository!: Repository<Farm>;

  @Initializer([PostgreSQLConnection])
  async init() {
    this.repository = this.pSql.connection.getRepository(Farm);
  }

  async getAll(params?: FindManyOptions<Farm>): Promise<[Farm[], number]> {
    return this.repository.findAndCount(params);
  }

  async getOne(params: FindOneOptions<Farm>): Promise<Farm | null> {
    return this.repository.findOne(params);
  }

  async getOneById(id: string): Promise<Farm> {
    try {
      return this.repository.findOneOrFail({
        where: {
          id,
        },
      });
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw ERR_FARM_NOT_FOUND(error.message);
      }

      throw error;
    }
  }

  async getOneStrict(params: FindOneOptions<Farm>): Promise<Farm> {
    try {
      return this.repository.findOneOrFail(params);
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw ERR_FARM_NOT_FOUND(error.message);
      }

      throw error;
    }
  }

  async createOne(
    input: Partial<Farm>,
    userRequest: Partial<User>,
    transactionHooks?: Function[],
  ): Promise<Farm> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);
    const queryRunner = this.pSql.connection.createQueryRunner();

    await queryRunner.connect();

    await queryRunner.startTransaction();

    try {
      const farm = queryRunner.manager.create(Farm, {
        ...input,
        id: randomHexString(),
        createdBy: userRequest.id,
        createdDate: now,
        modifiedBy: userRequest.id,
        modifiedDate: now,
      });

      const newFarm = await queryRunner.manager.save(Farm, farm);

      await Promise.all(transactionHooks?.map((trxHook) => trxHook(farm)) ?? []);

      await queryRunner.commitTransaction();

      return newFarm;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async updateOne(
    params: FindOptionsWhere<Farm>,
    data: Partial<Farm>,
    user: Partial<User>,
  ): Promise<Farm> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const result = await this.repository.update(params, {
      ...data,
      modifiedBy: user.id,
      modifiedDate: now,
    });

    if (!result.affected) {
      throw ERR_FARM_NOT_FOUND();
    }

    return this.repository.findOneOrFail({
      where: {
        ...((params.id && {
          id: params.id,
        }) ||
          params),
      },
    });
  }

  // eslint-disable-next-line class-methods-use-this
  async updateOneWithTx(
    params: FindOptionsWhere<Farm>,
    data: DeepPartial<Farm>,
    user: RequestUser,
    queryRunner: QueryRunner,
  ): Promise<Farm> {
    await queryRunner.manager.update(Farm, params, {
      ...data,
      modifiedBy: user.id,
      modifiedDate: utcToZonedTime(new Date(), DEFAULT_TIME_ZONE),
    });

    const updatedFarm = await queryRunner.manager.findOneOrFail(Farm, {
      where: {
        ...((params.id && {
          id: params.id,
        }) ||
          params),
      },
    });

    return updatedFarm;
  }

  // eslint-disable-next-line class-methods-use-this
  async upsertOneWithTx(
    params: FindOptionsWhere<Farm>,
    data: DeepPartial<Farm>,
    user: RequestUser,
    queryRunner: QueryRunner,
  ): Promise<Farm> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const farm = await this.repository.findOne({
      where: {
        ...params,
      },
    });

    if (!farm) {
      const newRecord = queryRunner.manager.create(Farm, {
        ...data,
        id: randomHexString(),
        createdBy: user.id,
        createdDate: now,
        modifiedBy: user.id,
        modifiedDate: now,
      });

      const newFarm = await queryRunner.manager.save(Farm, newRecord);

      return newFarm;
    }

    await queryRunner.manager.update(Farm, params, {
      ...data,
      modifiedBy: user.id,
      modifiedDate: now,
    });

    const updatedFarm = await queryRunner.manager.findOneOrFail(Farm, {
      where: {
        ...((params.id && {
          id: params.id,
        }) ||
          params),
      },
    });

    return updatedFarm;
  }
}
