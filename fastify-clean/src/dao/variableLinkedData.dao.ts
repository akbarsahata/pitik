import { Initializer, Inject, Service } from 'fastify-decorators';
import { EntityNotFoundError, FindOneOptions } from 'typeorm';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { VariableLinkedData } from '../datasources/entity/pgsql/VariableLinkedData.entity';
import { ERR_VAR_LINKED_DATA_NOT_FOUND } from '../libs/constants/errors';
import { BaseSQLDAO } from './base.dao';

@Service()
export class VariableLinkedDataDAO extends BaseSQLDAO<VariableLinkedData> {
  @Inject(PostgreSQLConnection)
  protected pSql!: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  async init() {
    this.repository = this.pSql.connection.getRepository(VariableLinkedData);
  }

  async getOneById(id: number): Promise<VariableLinkedData> {
    try {
      const varLinked = await this.repository.findOneOrFail({
        where: {
          id,
        },
      });

      return varLinked;
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw ERR_VAR_LINKED_DATA_NOT_FOUND(error.message);
      }

      throw error;
    }
  }

  async getOneStrict(params: FindOneOptions<VariableLinkedData>): Promise<VariableLinkedData> {
    try {
      const varLinked = await this.repository.findOneOrFail(params);

      return varLinked;
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw ERR_VAR_LINKED_DATA_NOT_FOUND(error.message);
      }

      throw error;
    }
  }
}
