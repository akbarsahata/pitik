import { Initializer, Inject, Service } from 'fastify-decorators';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { Province } from '../datasources/entity/pgsql/Province.entity';
import { BaseSQLDAO } from './base.dao';

@Service()
export class ProvinceDAO extends BaseSQLDAO<Province> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(Province);
  }
}
