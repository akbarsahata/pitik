import { Initializer, Inject, Service } from 'fastify-decorators';
import { FindOneOptions } from 'typeorm';
import { ERR_DOCUMENT_NOT_FOUND } from '../libs/constants/errors';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { Document } from '../datasources/entity/pgsql/Document.entity';
import { BaseSQLDAO } from './base.dao';

@Service()
export class DocumentDAO extends BaseSQLDAO<Document> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(Document);
  }

  async getOneStrict(params: FindOneOptions<Document>): Promise<Document> {
    try {
      const document = await this.repository.findOneOrFail(params);

      return document;
    } catch (error) {
      throw ERR_DOCUMENT_NOT_FOUND();
    }
  }
}
