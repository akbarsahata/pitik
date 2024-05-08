import { Initializer, Inject, Service } from 'fastify-decorators';
import { QueryRunner } from 'typeorm';
import { PurchaseOrderProduct } from '../datasources/entity/pgsql/PurchaseOrderProduct.entity';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { BaseSQLDAO } from './base.dao';
import { RequestUser } from '../libs/types/index.d';
import { randomHexString } from '../libs/utils/helpers';

@Service()
export class PurchaseOrderProductDAO extends BaseSQLDAO<PurchaseOrderProduct> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(PurchaseOrderProduct);
  }

  // eslint-disable-next-line class-methods-use-this
  async createManyWithTx(
    inputs: Partial<PurchaseOrderProduct>[],
    _: RequestUser,
    queryRunner: QueryRunner,
  ): Promise<PurchaseOrderProduct[]> {
    const items = queryRunner.manager.create(
      PurchaseOrderProduct,
      inputs.map<Partial<PurchaseOrderProduct>>((input) => ({
        ...input,
        id: randomHexString(),
      })),
    );

    const results = await queryRunner.manager.save(PurchaseOrderProduct, items);

    return results;
  }
}
