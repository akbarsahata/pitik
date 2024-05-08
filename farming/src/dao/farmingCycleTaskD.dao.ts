import { Initializer, Inject, Service } from 'fastify-decorators';
import { utcToZonedTime } from 'date-fns-tz';
import {
  DeepPartial,
  EntityNotFoundError,
  FindManyOptions,
  FindOneOptions,
  QueryRunner,
} from 'typeorm';
import { RequestUser } from '../libs/types/index.d';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { FarmingCycleTaskD } from '../datasources/entity/pgsql/FarmingCycleTaskD.entity';
import { ERR_FARM_CYCLE_TASK_NOT_FOUND } from '../libs/constants/errors';
import { DEFAULT_TIME_ZONE } from '../libs/constants';
import { randomHexString } from '../libs/utils/helpers';
import { BaseSQLDAO } from './base.dao';

@Service()
export class FarmingCycleTaskDDAO extends BaseSQLDAO<FarmingCycleTaskD> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  async init() {
    this.repository = this.pSql.connection.getRepository(FarmingCycleTaskD);
  }

  async getOneById(id: string): Promise<FarmingCycleTaskD> {
    try {
      const fcTaskD = await this.repository.findOneOrFail({
        where: {
          id,
        },
      });

      return fcTaskD;
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw ERR_FARM_CYCLE_TASK_NOT_FOUND(error.message);
      }

      throw error;
    }
  }

  async getOne(params: FindOneOptions<FarmingCycleTaskD>): Promise<FarmingCycleTaskD> {
    try {
      const fcTask = await this.repository.findOneOrFail(params);

      return fcTask;
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw ERR_FARM_CYCLE_TASK_NOT_FOUND(error.message);
      }

      throw error;
    }
  }

  async getMany(
    params: FindManyOptions<FarmingCycleTaskD>,
  ): Promise<[FarmingCycleTaskD[], number]> {
    const [entities, count] = await this.repository.findAndCount(params);
    return [entities, count];
  }

  // eslint-disable-next-line class-methods-use-this
  async createManyWithTx(
    data: DeepPartial<FarmingCycleTaskD>[],
    user: Partial<RequestUser>,
    queryRunner: QueryRunner,
  ): Promise<FarmingCycleTaskD[]> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const items = queryRunner.manager.create(
      FarmingCycleTaskD,
      data.map<DeepPartial<FarmingCycleTaskD>>((input) => ({
        ...input,
        id: input.id ? input.id : randomHexString(),
        createdBy: user.id,
        createdDate: now,
        modifiedBy: user.id,
        modifiedDate: now,
      })),
    );

    const result = await queryRunner.manager.save(FarmingCycleTaskD, items);

    return result;
  }
}
