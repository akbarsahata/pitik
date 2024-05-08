/* eslint-disable class-methods-use-this */
import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import { FindOneOptions, FindOptionsWhere, QueryRunner } from 'typeorm';
import { PostgreSQLConnection } from '../../datasources/connection/postgresql.connection';
import { SalesCustomer } from '../../datasources/entity/pgsql/sales/Customer.entity';
import { DEFAULT_TIME_ZONE } from '../../libs/constants';
import { ERR_SALES_CUSTOMER_NOT_FOUND } from '../../libs/constants/errors';
import { RequestUser } from '../../libs/types/index.d';
import { randomHexString } from '../../libs/utils/helpers';
import { BaseSQLDAO } from '../base.dao';

@Service()
export class CustomerDAO extends BaseSQLDAO<SalesCustomer> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(SalesCustomer);
  }

  async getOneStrict(params: FindOneOptions<SalesCustomer>): Promise<SalesCustomer> {
    try {
      const customer = await this.repository.findOneOrFail(params);

      return customer;
    } catch (error) {
      throw ERR_SALES_CUSTOMER_NOT_FOUND();
    }
  }

  async updateOne(
    params: FindOptionsWhere<SalesCustomer>,
    data: Partial<SalesCustomer>,
    user: RequestUser,
  ): Promise<SalesCustomer> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const result = await this.repository.update(params, {
      ...data,
      modifiedBy: user.id,
      modifiedDate: now,
    });

    if (!result.affected) {
      throw ERR_SALES_CUSTOMER_NOT_FOUND();
    }

    const updated = await this.repository.findOneOrFail({
      where: params,
    });

    return updated;
  }

  async createOneWithTx(
    data: Partial<SalesCustomer>,
    user: RequestUser,
    queryRunner: QueryRunner,
  ): Promise<SalesCustomer> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);
    const item = queryRunner.manager.create(SalesCustomer, {
      ...data,
      id: randomHexString(),
      createdBy: user.id,
      createdDate: now,
      modifiedBy: user.id,
      modifiedDate: now,
    });

    const newCustomer = await queryRunner.manager.save(SalesCustomer, item);

    return newCustomer;
  }

  async updateOneWithTx(
    params: FindOptionsWhere<SalesCustomer>,
    data: Partial<SalesCustomer>,
    user: Partial<RequestUser>,
    queryRunner: QueryRunner,
  ) {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    await queryRunner.manager.update(SalesCustomer, params, {
      ...data,
      modifiedBy: user.id,
      modifiedDate: now,
    });

    const updatedSalesCustomer = await queryRunner.manager.findOneOrFail(SalesCustomer, {
      where: {
        ...((params.id && {
          id: params.id,
        }) ||
          params),
      },
    });

    return updatedSalesCustomer;
  }
}
