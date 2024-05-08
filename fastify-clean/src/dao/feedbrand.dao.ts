import { Initializer, Inject, Service } from 'fastify-decorators';
import { BaseSQLDAO } from './base.dao';

import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { FeedBrand } from '../datasources/entity/pgsql/FeedBrand.entity';

@Service()
export class FeedbrandDAO extends BaseSQLDAO<FeedBrand> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(FeedBrand);
  }
}
