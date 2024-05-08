import { Initializer, Inject, Service } from 'fastify-decorators';
import { FindOneOptions } from 'typeorm';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { ControllerType } from '../datasources/entity/pgsql/ControllerType.entity';
import { ERR_CONTROLLER_TYPE_NOT_FOUND } from '../libs/constants/errors';
import { BaseSQLDAO } from './base.dao';

@Service()
export class ControllerTypeDAO extends BaseSQLDAO<ControllerType> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(ControllerType);
  }

  async getOneStrict(params: FindOneOptions<ControllerType>): Promise<ControllerType> {
    try {
      const chickInReq = await this.repository.findOneOrFail(params);

      return chickInReq;
    } catch (error) {
      throw ERR_CONTROLLER_TYPE_NOT_FOUND();
    }
  }
}
