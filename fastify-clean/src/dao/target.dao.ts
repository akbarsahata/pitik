import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import { EntityNotFoundError, FindOneOptions, FindOptionsWhere, QueryRunner } from 'typeorm';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { Target } from '../datasources/entity/pgsql/Target.entity';
import { User } from '../datasources/entity/pgsql/User.entity';
import { DEFAULT_TIME_ZONE } from '../libs/constants';
import { ERR_TARGET_NOT_FOUND, ERR_TASK_PRESET_NOT_FOUND } from '../libs/constants/errors';
import { RequestUser } from '../libs/types/index.d';
import { randomHexString } from '../libs/utils/helpers';
import { BaseSQLDAO } from './base.dao';

@Service()
export class TargetDAO extends BaseSQLDAO<Target> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(Target);
  }

  async getOneStrict(params: FindOneOptions<Target>): Promise<Target> {
    try {
      const target = await this.repository.findOneOrFail(params);

      return target;
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw ERR_TASK_PRESET_NOT_FOUND(error.message);
      }

      throw error;
    }
  }

  async getOneById(id: string): Promise<Target> {
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
          chickType: {
            id: true,
            chickTypeCode: true,
            chickTypeName: true,
          },
          variable: {
            id: true,
            variableCode: true,
            variableName: true,
            variableUOM: true,
            variableType: true,
            variableFormula: true,
          },
        },
        relations: {
          coopType: true,
          chickType: true,
          variable: true,
        },
      });
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw ERR_TARGET_NOT_FOUND(error.message);
      }

      throw error;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async createOneWithTx(
    data: Partial<Target>,
    userRequest: Partial<User>,
    queryRunner: QueryRunner,
    transactionHooks?: Function[],
  ): Promise<Target> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const target = queryRunner.manager.create(Target, {
      ...data,
      id: randomHexString(),
      createdBy: userRequest.id,
      createdDate: now,
      modifiedBy: userRequest.id,
      modifiedDate: now,
    });

    const result = await queryRunner.manager.save(Target, target);

    const promises = transactionHooks?.map((trxHook) => trxHook(target, queryRunner));
    await Promise.all(promises || []);

    await queryRunner.commitTransaction();

    return result;
  }

  // eslint-disable-next-line class-methods-use-this
  async updateOneWithTx(
    params: FindOptionsWhere<Target>,
    data: Partial<Target>,
    user: RequestUser,
    queryRunner: QueryRunner,
    transactionHooks?: Function[],
  ): Promise<Target> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    await queryRunner.manager.update(Target, params, {
      ...data,
      modifiedBy: user.id,
      modifiedDate: now,
    });

    const updatedTarget = await queryRunner.manager.findOneOrFail(Target, {
      where: {
        ...((params.id && {
          id: params.id,
        }) ||
          params),
      },
    });

    const promises = transactionHooks?.map((trxHook) => trxHook(updatedTarget, queryRunner));
    await Promise.all(promises || []);

    return updatedTarget;
  }
}
