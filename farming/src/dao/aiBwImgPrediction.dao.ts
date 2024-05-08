import { Initializer, Inject, Service } from 'fastify-decorators';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { AiBwImgPrediction } from '../datasources/entity/pgsql/AiBwImgPrediction.entity';
import { BaseSQLDAO } from './base.dao';

@Service()
export class AiBwImgPredictionDAO extends BaseSQLDAO<AiBwImgPrediction> {
  @Inject(PostgreSQLConnection)
  protected pSql!: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  async init(): Promise<void> {
    this.repository = this.pSql.connection.getRepository(AiBwImgPrediction);
  }
}
