import { Initializer, Inject, Service } from 'fastify-decorators';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { BaseSQLDAO } from './base.dao';
import { Alert } from '../datasources/entity/pgsql/Alert.entity';

@Service()
export class AlertDAO extends BaseSQLDAO<Alert> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(Alert);
  }
}
