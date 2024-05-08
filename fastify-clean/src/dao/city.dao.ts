import { Initializer, Inject, Service } from 'fastify-decorators';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { City } from '../datasources/entity/pgsql/City.entity';
import { BaseSQLDAO } from './base.dao';

@Service()
export class CityDAO extends BaseSQLDAO<City> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(City);
  }
}
