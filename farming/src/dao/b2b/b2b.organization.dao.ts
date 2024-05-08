import { Initializer, Inject, Service } from 'fastify-decorators';
import { FindOneOptions } from 'typeorm';
import { PostgreSQLConnection } from '../../datasources/connection/postgresql.connection';
import { B2BOrganization } from '../../datasources/entity/pgsql/b2b/B2BOrganization.entity';
import { ERR_B2B_ORGANIZATION_NOT_FOUND } from '../../libs/constants/errors';
import { BaseSQLDAO } from '../base.dao';

@Service()
export class B2BOrganizationDAO extends BaseSQLDAO<B2BOrganization> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(B2BOrganization);
  }

  async getOneStrict(params: FindOneOptions<B2BOrganization>): Promise<B2BOrganization> {
    try {
      const organization = await this.repository.findOneOrFail(params);

      return organization;
    } catch (error) {
      throw ERR_B2B_ORGANIZATION_NOT_FOUND();
    }
  }
}
