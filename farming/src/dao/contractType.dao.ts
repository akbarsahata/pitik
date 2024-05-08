import { Initializer, Inject, Service } from 'fastify-decorators';
import { EntityNotFoundError, FindOneOptions } from 'typeorm';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { ContractType } from '../datasources/entity/pgsql/ContractType.entity';
import { ERR_CONTRACT_TYPE_NOT_FOUND } from '../libs/constants/errors';
import { BaseSQLDAO } from './base.dao';

@Service()
export class ContractTypeDAO extends BaseSQLDAO<ContractType> {
  @Inject(PostgreSQLConnection)
  protected pSql!: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(ContractType);
  }

  async getOneStrict(params: FindOneOptions<ContractType>): Promise<ContractType> {
    try {
      const contractType = await this.repository.findOneOrFail(params);

      return contractType;
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw ERR_CONTRACT_TYPE_NOT_FOUND(error.message);
      }

      throw error;
    }
  }
}
