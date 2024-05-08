/* eslint-disable class-methods-use-this */
import { randomUUID } from 'crypto';
import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import { DeepPartial, EntityNotFoundError, FindOneOptions, QueryRunner } from 'typeorm';
import { PostgreSQLConnection } from '../../datasources/connection/postgresql.connection';
import { SalesCustomerVisit } from '../../datasources/entity/pgsql/sales/CustomerVisit.entity';
import { DEFAULT_TIME_ZONE } from '../../libs/constants';
import { ERR_SALES_VISIT_NOT_FOUND } from '../../libs/constants/errors';
import { RequestUser } from '../../libs/types/index.d';
import { BaseSQLDAO } from '../base.dao';

@Service()
export class CustomerVisitDAO extends BaseSQLDAO<SalesCustomerVisit> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(SalesCustomerVisit);
  }

  async createOneWithTx(
    data: DeepPartial<SalesCustomerVisit>,
    user: Partial<RequestUser>,
    queryRunner: QueryRunner,
  ): Promise<SalesCustomerVisit> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const items = queryRunner.manager.create(SalesCustomerVisit, {
      ...data,
      id: randomUUID(),
      createdBy: user.id,
      createdDate: now,
      modifiedBy: user.id,
      modifiedDate: now,
    });

    const result = await queryRunner.manager.save(SalesCustomerVisit, items);

    return result;
  }

  async getLatestVisit(customerId: string): Promise<SalesCustomerVisit | null> {
    return this.repository.findOne({
      where: {
        salesCustomerId: customerId,
      },
      relations: {
        salesProductsInVisit: {
          salesProductItem: {
            category: true,
          },
        },
      },
      order: {
        createdDate: 'DESC',
      },
    });
  }

  async getOneStrict(params: FindOneOptions<SalesCustomerVisit>): Promise<SalesCustomerVisit> {
    try {
      const coop = await this.repository.findOneOrFail(params);

      return coop;
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw ERR_SALES_VISIT_NOT_FOUND(error.message);
      }

      throw error;
    }
  }
}
