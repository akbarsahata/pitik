import { Initializer, Inject, Service } from 'fastify-decorators';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { BaseSQLDAO } from './base.dao';
import { FloorType } from '../datasources/entity/pgsql/FloorType.entity';

@Service()
export class FloorTypeDAO extends BaseSQLDAO<FloorType> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(FloorType);
  }
}
