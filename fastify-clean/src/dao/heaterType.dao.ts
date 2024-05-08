import { Initializer, Inject, Service } from 'fastify-decorators';
import { HeaterType } from '../datasources/entity/pgsql/HeaterType.entity';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { BaseSQLDAO } from './base.dao';

@Service()
export class HeaterTypeDAO extends BaseSQLDAO<HeaterType> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(HeaterType);
  }
}
