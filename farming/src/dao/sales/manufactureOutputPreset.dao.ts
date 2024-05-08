import { Initializer, Inject, Service } from 'fastify-decorators';
import { PostgreSQLConnection } from '../../datasources/connection/postgresql.connection';
import { ManufactureOutputPreset } from '../../datasources/entity/pgsql/sales/ManufactureOutputPreset.entity';
import { BaseSQLDAO } from '../base.dao';

@Service()
export class ManufactureOutputPresetDAO extends BaseSQLDAO<ManufactureOutputPreset> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(ManufactureOutputPreset);
  }
}
