import { Initializer, Inject, Service } from 'fastify-decorators';
import { FindOptionsWhere } from 'typeorm';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { AiNotifConfig } from '../datasources/entity/pgsql/AiNotifyConfig.entity';
import { BaseSQLDAO } from './base.dao';

@Service()
export class AiNotifConfigDAO extends BaseSQLDAO<AiNotifConfig> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(AiNotifConfig);
  }

  async deleteMany(params: FindOptionsWhere<AiNotifConfig>): Promise<AiNotifConfig[]> {
    const toBeDeleted = await this.repository.find({ where: params });

    await this.repository.delete(params);

    return toBeDeleted;
  }
}
