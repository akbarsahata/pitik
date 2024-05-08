/* eslint-disable class-methods-use-this */
import { Initializer, Inject, Service } from 'fastify-decorators';
import { PostgreSQLConnection } from '../../datasources/connection/postgresql.connection';
import { SalesOrderIssueCategory } from '../../datasources/entity/pgsql/sales/OrderIssueCategory.entity';
import { BaseSQLDAO } from '../base.dao';

@Service()
export class OrderIssueCategoryDAO extends BaseSQLDAO<SalesOrderIssueCategory> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(SalesOrderIssueCategory);
  }
}
