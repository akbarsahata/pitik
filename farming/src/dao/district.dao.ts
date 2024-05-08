import { Initializer, Inject, Service } from 'fastify-decorators';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { District } from '../datasources/entity/pgsql/District.entity';
import { BaseSQLDAO } from './base.dao';

@Service()
export class DistrictDAO extends BaseSQLDAO<District> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(District);
  }
}
