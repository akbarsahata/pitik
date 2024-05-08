import { Initializer, Inject, Service } from 'fastify-decorators';
import { QueryRunner } from 'typeorm';
import { ulid } from 'ulid';
import { PostgreSQLConnection } from '../../datasources/connection/postgresql.connection';
import { XenditLog } from '../../datasources/entity/postgresql/xenditLog';
import { BaseSQLDAO } from './base.dao';

@Service()
export class XenditLogDAO extends BaseSQLDAO<XenditLog> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init(): void {
    this.repository = this.pSql.connection.getRepository(XenditLog);
  }

  async createOne(data: Partial<XenditLog>, queryRunner?: QueryRunner): Promise<XenditLog> {
    const insertItem: Partial<XenditLog> = {
      ...data,
      id: data.id || ulid(),
    };

    await this.repository
      .createQueryBuilder(undefined, queryRunner)
      .insert()
      .into(XenditLog)
      .values(insertItem)
      .execute();

    return this.repository
      .createQueryBuilder(undefined, queryRunner)
      .where('id = :id', { id: insertItem.id })
      .getOneOrFail();
  }
}
