import { Initializer, Inject, Service } from 'fastify-decorators';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { BaseSQLDAO } from './base.dao';
import { RoomType } from '../datasources/entity/pgsql/RoomType.entity';

@Service()
export class RoomTypeDAO extends BaseSQLDAO<RoomType> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(RoomType);
  }
}
