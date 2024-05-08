import { Initializer, Inject, Service } from 'fastify-decorators';
import { DeepPartial, QueryRunner } from 'typeorm';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { BaseSQLDAO } from './base.dao';
import { GoodsReceiptProduct } from '../datasources/entity/pgsql/GoodsReceiptProduct.entity';
import { RequestUser } from '../libs/types/index.d';
import { randomHexString } from '../libs/utils/helpers';

@Service()
export class GoodsReceiptProductDAO extends BaseSQLDAO<GoodsReceiptProduct> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(GoodsReceiptProduct);
  }

  // eslint-disable-next-line class-methods-use-this
  async createManyWithTx(
    data: DeepPartial<GoodsReceiptProduct>[],
    _user: RequestUser,
    queryRunner: QueryRunner,
  ): Promise<GoodsReceiptProduct[]> {
    const grs = data.map((d) =>
      queryRunner.manager.create(GoodsReceiptProduct, {
        ...d,
        id: randomHexString(),
      }),
    );

    const newGRs = await queryRunner.manager.save(GoodsReceiptProduct, grs);

    return newGRs;
  }
}
