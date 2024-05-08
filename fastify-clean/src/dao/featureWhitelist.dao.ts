import { Initializer, Inject, Service } from 'fastify-decorators';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { FeatureWhitelist } from '../datasources/entity/pgsql/FeatureWhitelist.entity';
import { BaseSQLDAO } from './base.dao';

@Service()
export class FeatureWhitelistDAO extends BaseSQLDAO<FeatureWhitelist> {
  @Inject(PostgreSQLConnection)
  protected pSql!: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(FeatureWhitelist);
  }
}
