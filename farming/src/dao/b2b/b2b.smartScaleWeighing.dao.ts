import { randomUUID } from 'crypto';
import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import { EntityNotFoundError, FindOneOptions, FindOptionsWhere, QueryRunner } from 'typeorm';
import { PostgreSQLConnection } from '../../datasources/connection/postgresql.connection';
import { B2BSmartScaleWeighing } from '../../datasources/entity/pgsql/b2b/B2BSmartScaleWeighings.entity';
import { User } from '../../datasources/entity/pgsql/User.entity';
import { DEFAULT_TIME_ZONE } from '../../libs/constants';
import { ERR_B2B_SMART_SCALE_WEIGHINGS_NOT_FOUND } from '../../libs/constants/errors';
import { RequestUser } from '../../libs/types/index.d';
import { Logger } from '../../libs/utils/logger';
import { BaseSQLDAO } from '../base.dao';

@Service()
export class B2BSmartScaleWeighingDAO extends BaseSQLDAO<B2BSmartScaleWeighing> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Inject(Logger)
  private logger: Logger;

  @Initializer([PostgreSQLConnection])
  async init(): Promise<void> {
    this.repository = this.pSql.connection.getRepository(B2BSmartScaleWeighing);
  }

  async getOneStrict(
    params: FindOneOptions<B2BSmartScaleWeighing>,
  ): Promise<B2BSmartScaleWeighing> {
    try {
      const b2bSmartScaleWeighing = await this.repository.findOneOrFail(params);

      return b2bSmartScaleWeighing;
    } catch (error) {
      this.logger.error(error);

      if (error instanceof EntityNotFoundError) {
        throw ERR_B2B_SMART_SCALE_WEIGHINGS_NOT_FOUND();
      }

      throw error;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async createOneWithTx(
    data: Partial<B2BSmartScaleWeighing>,
    userRequest: Partial<User>,
    queryRunner: QueryRunner,
    transactionHooks?: Function[],
  ): Promise<B2BSmartScaleWeighing> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const taskPreset = queryRunner.manager.create(B2BSmartScaleWeighing, {
      ...data,
      id: randomUUID(),
      createdBy: userRequest.id,
      createdDate: now,
      modifiedBy: userRequest.id,
      modifiedDate: now,
    });

    const result = await queryRunner.manager.save(B2BSmartScaleWeighing, taskPreset);

    const promises = transactionHooks?.map((trxHook) => trxHook(taskPreset, queryRunner));
    await Promise.all(promises || []);

    return result;
  }

  // eslint-disable-next-line class-methods-use-this
  async updateOneWithTx(
    params: FindOptionsWhere<B2BSmartScaleWeighing>,
    data: Partial<B2BSmartScaleWeighing>,
    user: RequestUser,
    queryRunner: QueryRunner,
    transactionHooks?: Function[],
  ): Promise<B2BSmartScaleWeighing> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    await queryRunner.manager.update(B2BSmartScaleWeighing, params, {
      ...data,
      modifiedBy: user.id,
      modifiedDate: now,
    });

    const updatedCoop = await queryRunner.manager.findOneOrFail(B2BSmartScaleWeighing, {
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
