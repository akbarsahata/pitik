import { Initializer, Inject, Service } from 'fastify-decorators';
import {
  DeepPartial,
  EntityNotFoundError,
  FindOneOptions,
  FindOptionsWhere,
  QueryRunner,
} from 'typeorm';
import { PostgreSQLConnection } from '../../datasources/connection/postgresql.connection';
import { VirtualAccount } from '../../datasources/entity/postgresql/virtualAccount.entity';
import { ERR_VIRTUAL_ACCOUNT_NOT_FOUND } from '../../libs/constants/errors';
import { Logger } from '../../libs/utils/logger';
import { BaseSQLDAO } from './base.dao';

@Service()
export class VirtualAccountDAO extends BaseSQLDAO<VirtualAccount> {
  @Inject(Logger)
  protected logger: Logger;

  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init(): void {
    this.repository = this.pSql.connection.getRepository(VirtualAccount);
  }

  async upsertOne(
    params: Partial<VirtualAccount>,
    queryRunner?: QueryRunner,
  ): Promise<VirtualAccount> {
    const now = new Date();
    const upsertItem: Partial<VirtualAccount> = {
      ...params,
      createdDate: now,
      modifiedDate: now,
    };

    await this.repository
      .createQueryBuilder(undefined, queryRunner)
      .insert()
      .into(VirtualAccount)
      .values(upsertItem)
      .orUpdate(
        [
          'partner_id',
          'merchant_code',
          'account_number',
          'bank_code',
          'name',
          'is_closed',
          'is_single_use',
          'expiration_date',
          'status',
          'created_date',
          'modified_date',
        ],
        ['id'],
      )
      .execute();

    return this.repository
      .createQueryBuilder(undefined, queryRunner)
      .where('id = :id', { id: upsertItem.id })
      .getOneOrFail();
  }

  async updateOne(
    params: FindOptionsWhere<VirtualAccount>,
    data: DeepPartial<VirtualAccount>,
    queryRunner?: QueryRunner | undefined,
  ): Promise<VirtualAccount> {
    const now = new Date();
    const updateItem: DeepPartial<VirtualAccount> = {
      ...data,
      modifiedDate: now,
    };

    await this.repository
      .createQueryBuilder(undefined, queryRunner)
      .update(VirtualAccount)
      .set(updateItem)
      .where(params)
      .execute();

    return this.repository.createQueryBuilder(undefined, queryRunner).where(params).getOneOrFail();
  }

  async getOneStrict(params: FindOneOptions<VirtualAccount>): Promise<VirtualAccount> {
    try {
      const va = await this.repository.findOneOrFail(params);

      return va;
    } catch (error) {
      this.logger.error(error);

      if (error instanceof EntityNotFoundError) {
        throw ERR_VIRTUAL_ACCOUNT_NOT_FOUND();
      }

      throw error;
    }
  }
}
