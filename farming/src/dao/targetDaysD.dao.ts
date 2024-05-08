import { hoursToMilliseconds } from 'date-fns';
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
import { Target } from '../datasources/entity/pgsql/Target.entity';
import { TargetDaysD } from '../datasources/entity/pgsql/TargetDaysD.entity';
import { DEFAULT_TIME_ZONE } from '../libs/constants';
import { ERR_TARGET_DAYS_NOT_FOUND } from '../libs/constants/errors';
import { RequestUser } from '../libs/types/index.d';
import { randomHexString } from '../libs/utils/helpers';

@Service()
export class TargetDaysDDAO {
  @Inject(PostgreSQLConnection)
  private pSql!: PostgreSQLConnection;

  private repository!: Repository<TargetDaysD>;

  @Initializer([PostgreSQLConnection])
  async init() {
    this.repository = this.pSql.connection.getRepository(TargetDaysD);
  }

  async getOneById(id: string): Promise<TargetDaysD> {
    try {
      const targetDaysD = await this.repository.findOneOrFail({
        where: {
          id,
        },
      });

      return targetDaysD;
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw ERR_TARGET_DAYS_NOT_FOUND(error.message);
      }

      throw error;
    }
  }

  async getOne(params: FindOneOptions<TargetDaysD>): Promise<TargetDaysD | null> {
    return this.repository.findOne(params);
  }

  async getOneStrict(params: FindOneOptions<TargetDaysD>): Promise<TargetDaysD> {
    try {
      const targetDaysD = await this.repository.findOneOrFail(params);

      return targetDaysD;
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw ERR_TARGET_DAYS_NOT_FOUND(error.message);
      }

      throw error;
    }
  }

  async getMany(params: FindManyOptions<TargetDaysD>): Promise<TargetDaysD[]> {
    return this.repository.find(params);
  }

  // eslint-disable-next-line class-methods-use-this
  async upsertOneWithTx(
    data: Partial<TargetDaysD>,
    userId: string,
    queryRunner: QueryRunner,
  ): Promise<Partial<TargetDaysD>> {
    const existing = await queryRunner.manager.findOne(TargetDaysD, {
      where: {
        id: data.id,
        targetId: data.targetId,
      },
    });

    try {
      if (data.id && existing) {
        await queryRunner.manager.update(
          TargetDaysD,
          {
            id: existing.id,
          },
          {
            day: data.day,
            minValue: data.minValue,
            maxValue: data.maxValue,
          },
        );

        return existing;
      }

      const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

      const coopImage = queryRunner.manager.create(TargetDaysD, {
        ...data,
        id: randomHexString(),
        createdBy: userId,
        createdDate: now,
        modifiedBy: userId,
        modifiedDate: now,
      });

      await queryRunner.manager.save(coopImage);

      return coopImage;
    } catch (error) {
      throw new Error(error);
    }
  }

  wrapUpsertHook(day: number, userId: string, minValue?: number, maxValue?: number): Function {
    return (target: Target, queryRunner: QueryRunner) =>
      this.upsertOneWithTx(
        {
          day,
          minValue,
          maxValue,
          targetId: target.id,
        },
        userId,
        queryRunner,
      );
  }

  // eslint-disable-next-line class-methods-use-this
  async createManyWithTx(
    data: DeepPartial<TargetDaysD>[],
    user: RequestUser,
    queryRunner: QueryRunner,
    transactionHooks?: Function[],
  ): Promise<TargetDaysD[]> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const items = queryRunner.manager.create(
      TargetDaysD,
      data.map<DeepPartial<TargetDaysD>>((input) => ({
        ...input,
        id: input.id || randomHexString(),
        createdBy: user.id,
        createdDate: now,
        modifiedBy: user.id,
        modifiedDate: now,
      })),
    );

    const result = await queryRunner.manager.save(TargetDaysD, items);

    await transactionHooks?.reduce(async (prev, trxHook) => {
      await prev;

      return trxHook(items, queryRunner);
    }, Promise.resolve());

    return result;
  }

  // eslint-disable-next-line class-methods-use-this
  async deleteWithTx(params: FindOptionsWhere<TargetDaysD>, queryRunner: QueryRunner) {
    const results = await queryRunner.manager.delete(TargetDaysD, params);
    return results;
  }

  async getMappedByVariableAndDay(
    params: FindOptionsWhere<TargetDaysD> | FindOptionsWhere<TargetDaysD>[],
  ): Promise<Map<string, TargetDaysD>> {
    const results = await this.repository.find({
      where: params,
      relations: {
        target: true,
      },
      cache: hoursToMilliseconds(3),
    });
    return results.reduce((prev, targetDays) => {
      prev.set(`${targetDays.target.variableId}-${targetDays.day}`, targetDays);
      return prev;
    }, new Map<string, TargetDaysD>());
  }

  async getMappedByKey(
    params: FindOptionsWhere<TargetDaysD>[],
    keyFunction: Function,
  ): Promise<Map<string, TargetDaysD>> {
    let results: TargetDaysD[] = [];

    if (params.length > 0) {
      results = await this.repository.find({
        where: params,
        relations: {
          target: true,
        },
        cache: hoursToMilliseconds(3),
      });
    }

    return results.reduce((prev, targetDays) => {
      prev.set(keyFunction(targetDays), targetDays);
      return prev;
    }, new Map<string, TargetDaysD>());
  }
}
