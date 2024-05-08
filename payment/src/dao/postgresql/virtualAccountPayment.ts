import { Initializer, Inject, Service } from 'fastify-decorators';
import {
  DeepPartial,
  EntityNotFoundError,
  FindOneOptions,
  FindOptionsWhere,
  QueryRunner,
} from 'typeorm';
import { PostgreSQLConnection } from '../../datasources/connection/postgresql.connection';
import { VirtualAccountPayment } from '../../datasources/entity/postgresql/virtualAccountPayment.entity';
import { BaseSQLDAO } from './base.dao';
import { ERR_VIRTUAL_ACCOUNT_PAYMENT_NOT_FOUND } from '../../libs/constants/errors';
import { Logger } from '../../libs/utils/logger';

@Service()
export class VirtualAccountPaymentDAO extends BaseSQLDAO<VirtualAccountPayment> {
  @Inject(Logger)
  protected logger: Logger;

  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init(): void {
    this.repository = this.pSql.connection.getRepository(VirtualAccountPayment);
  }

  async createOne(
    data: Partial<VirtualAccountPayment>,
    queryRunner?: QueryRunner,
  ): Promise<VirtualAccountPayment> {
    await this.repository
      .createQueryBuilder(undefined, queryRunner)
      .insert()
      .into(VirtualAccountPayment)
      .values(data)
      .execute();

    return this.repository
      .createQueryBuilder(undefined, queryRunner)
      .where('id = :id', { id: data.id })
      .getOneOrFail();
  }

  async updateOne(
    params: FindOptionsWhere<VirtualAccountPayment>,
    data: DeepPartial<VirtualAccountPayment>,
    queryRunner?: QueryRunner,
  ): Promise<VirtualAccountPayment> {
    const now = new Date();
    const updateItem: DeepPartial<VirtualAccountPayment> = {
      ...data,
      modifiedDate: now,
    };

    await this.repository
      .createQueryBuilder(undefined, queryRunner)
      .update(VirtualAccountPayment)
      .set(updateItem)
      .where(params)
      .execute();

    return this.repository.createQueryBuilder(undefined, queryRunner).where(params).getOneOrFail();
  }

  async getOneStrict(
    params: FindOneOptions<VirtualAccountPayment>,
  ): Promise<VirtualAccountPayment> {
    try {
      const va = await this.repository.findOneOrFail(params);

      return va;
    } catch (error) {
      this.logger.error(error);

      if (error instanceof EntityNotFoundError) {
        throw ERR_VIRTUAL_ACCOUNT_PAYMENT_NOT_FOUND();
      }

      throw error;
    }
  }
}
