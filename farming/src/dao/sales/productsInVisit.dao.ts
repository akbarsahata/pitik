/* eslint-disable class-methods-use-this */
import { Initializer, Inject, Service } from 'fastify-decorators';
import { DeepPartial, QueryRunner } from 'typeorm';
import { PostgreSQLConnection } from '../../datasources/connection/postgresql.connection';
import { ProductsInVisit } from '../../datasources/entity/pgsql/sales/ProductsInVisit.entity';
import { RequestUser } from '../../libs/types/index.d';
import { BaseSQLDAO } from '../base.dao';

@Service()
export class ProductsInVisitDAO extends BaseSQLDAO<ProductsInVisit> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(ProductsInVisit);
  }

  async createManyWithTx(
    data: DeepPartial<ProductsInVisit>[],
    user: RequestUser,
    queryRunner: QueryRunner,
  ): Promise<ProductsInVisit[]> {
    const now = new Date();
    const items = data.map((d) =>
      queryRunner.manager.create(ProductsInVisit, {
        ...d,
        createdBy: user.id,
        modifiedBy: user.id,
        createdDate: now,
        modifiedDate: now,
      }),
    );

    const createdItems = await queryRunner.manager.save(ProductsInVisit, items);

    return createdItems;
  }
}
