import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import { DeepPartial } from 'typeorm';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { ContractHistory } from '../datasources/entity/pgsql/ContractHistory.entity';
import { DEFAULT_TIME_ZONE } from '../libs/constants';
import { RequestUser } from '../libs/types/index.d';
import { randomHexString } from '../libs/utils/helpers';
import { BaseSQLDAO } from './base.dao';

@Service()
export class ContractHistoryDAO extends BaseSQLDAO<ContractHistory> {
  @Inject(PostgreSQLConnection)
  protected pSql!: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(ContractHistory);
  }

  async createOneandReturn(
    data: DeepPartial<ContractHistory>,
    user: RequestUser,
  ): Promise<ContractHistory> {
    const toBeEntity = {
      ...data,
      id: randomHexString(),
      createdBy: user.id,
      createdDate: utcToZonedTime(new Date(), DEFAULT_TIME_ZONE),
    };

    const entity = this.repository.create(toBeEntity);

    const createdEntity = await this.repository.save(entity);

    return createdEntity;
  }
}
