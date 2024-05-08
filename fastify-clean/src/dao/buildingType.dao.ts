import { Initializer, Inject, Service } from 'fastify-decorators';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { BaseSQLDAO } from './base.dao';
import { BuildingType } from '../datasources/entity/pgsql/BuildingType.entity';

@Service()
export class BuildingTypeDAO extends BaseSQLDAO<BuildingType> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(BuildingType);
  }
}
