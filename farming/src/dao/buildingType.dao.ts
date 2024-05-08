import { Initializer, Inject, Service } from 'fastify-decorators';
import { FindOneOptions } from 'typeorm';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { BuildingType } from '../datasources/entity/pgsql/BuildingType.entity';
import { ERR_BUILDING_TYPE_NOT_FOUND } from '../libs/constants/errors';
import { BaseSQLDAO } from './base.dao';

@Service()
export class BuildingTypeDAO extends BaseSQLDAO<BuildingType> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(BuildingType);
  }

  async getOneStrict(params: FindOneOptions<BuildingType>): Promise<BuildingType> {
    try {
      const coopType = await this.repository.findOneOrFail(params);

      return coopType;
    } catch (error) {
      throw ERR_BUILDING_TYPE_NOT_FOUND();
    }
  }
}
