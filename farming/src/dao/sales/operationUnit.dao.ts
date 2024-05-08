/* eslint-disable class-methods-use-this */
import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import { DeepPartial, FindOneOptions, FindOptionsWhere, QueryRunner } from 'typeorm';
import { PostgreSQLConnection } from '../../datasources/connection/postgresql.connection';
import { OperationUnit } from '../../datasources/entity/pgsql/sales/OperationUnit.entity';
import { DEFAULT_TIME_ZONE } from '../../libs/constants';
import { RequestUser } from '../../libs/types/index.d';
import { randomHexString } from '../../libs/utils/helpers';
import { BaseSQLDAO } from '../base.dao';

@Service()
export class SalesOperationUnitDAO extends BaseSQLDAO<OperationUnit> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(OperationUnit);
  }

  async getOneStrict(params: FindOneOptions<OperationUnit>): Promise<OperationUnit> {
    try {
      const operation = await this.repository.findOneOrFail(params);

      return operation;
    } catch (error) {
      throw NaN;
    }
  }

  async updateOneWithTx(
    params: FindOptionsWhere<OperationUnit>,
    data: Partial<OperationUnit>,
    user: Partial<RequestUser>,
    queryRunner: QueryRunner,
  ) {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    await queryRunner.manager.update(OperationUnit, params, {
      ...data,
      modifiedBy: user.id,
      modifiedDate: now,
    });

    const operation = await queryRunner.manager.findOneOrFail(OperationUnit, {
      where: {
        ...((params.id && {
          id: params.id,
        }) ||
          params),
      },
    });
    return operation;
  }

  async createOneWithTx(
    data: DeepPartial<OperationUnit>,
    user: RequestUser,
    queryRunner: QueryRunner,
  ): Promise<OperationUnit> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const item = queryRunner.manager.create(OperationUnit, {
      ...data,
      id: randomHexString(),
      createdBy: user.id,
      createdDate: now,
      modifiedBy: user.id,
      modifiedDate: now,
    });

    const operation = await queryRunner.manager.save(OperationUnit, item);

    return operation;
  }
}
