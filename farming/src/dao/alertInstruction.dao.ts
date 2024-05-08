import { Initializer, Inject, Service } from 'fastify-decorators';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { BaseSQLDAO } from './base.dao';
import { AlertInstruction } from '../datasources/entity/pgsql/AlertInstruction.entity';

@Service()
export class AlertInstructionDAO extends BaseSQLDAO<AlertInstruction> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(AlertInstruction);
  }
}
