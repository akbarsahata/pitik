/* eslint-disable class-methods-use-this */
import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import { DeepPartial, QueryRunner } from 'typeorm';
import { PostgreSQLConnection } from '../../datasources/connection/postgresql.connection';
import { SalesOrderIssueCategoryInVisit } from '../../datasources/entity/pgsql/sales/OrderIssueCategoryInVisit.entity';
import { DEFAULT_TIME_ZONE } from '../../libs/constants';
import { ERR_ORDER_ISSUE_CATEGORY_IN_VISIT_INSERT_FAILED } from '../../libs/constants/errors';
import { RequestUser } from '../../libs/types/index.d';
import { BaseSQLDAO } from '../base.dao';

@Service()
export class OrderIssueCategoryInVisitDAO extends BaseSQLDAO<SalesOrderIssueCategoryInVisit> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(SalesOrderIssueCategoryInVisit);
  }

  async upsertMany(
    user: RequestUser,
    items: DeepPartial<SalesOrderIssueCategoryInVisit>[],
    opts?: {
      qr?: QueryRunner;
    },
  ): Promise<SalesOrderIssueCategoryInVisit[]> {
    if (items.length === 0) return [];

    const visitId = items[0].salesCustomerVisitId;
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);
    const upsertItems = items.map<DeepPartial<SalesOrderIssueCategoryInVisit>>((item) => ({
      ...item,
      createdBy: user.id,
      createdDate: now,
      modifiedBy: user.id,
      modifiedDate: now,
    }));

    await this.repository
      .createQueryBuilder(undefined, opts && opts.qr)
      .insert()
      .into(SalesOrderIssueCategoryInVisit)
      .values(upsertItems)
      .orUpdate(
        ['modified_by', 'modified_date'],
        ['ref_sales_customer_visit_id', 'ref_order_issue_category_id'],
      )
      .execute();

    const [results, count] = await this.repository
      .createQueryBuilder(undefined, opts && opts.qr)
      .where('ref_sales_customer_visit_id = :visitId', { visitId })
      .andWhere('ref_order_issue_category_id IN (:...categoryIds)', {
        categoryIds: upsertItems.map((p) => p.salesOrderIssueCategoryId),
      })
      .getManyAndCount();

    if (count !== upsertItems.length) {
      throw ERR_ORDER_ISSUE_CATEGORY_IN_VISIT_INSERT_FAILED('result count not match');
    }

    return results;
  }
}
