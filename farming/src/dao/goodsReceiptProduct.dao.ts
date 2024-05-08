import { Initializer, Inject, Service } from 'fastify-decorators';
import { DeepPartial, FindOptionsWhere, QueryRunner } from 'typeorm';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { GoodsReceiptProduct } from '../datasources/entity/pgsql/GoodsReceiptProduct.entity';
import { RequestUser } from '../libs/types/index.d';
import { randomHexString } from '../libs/utils/helpers';
import { BaseSQLDAO } from './base.dao';

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

  async deleteOne(params: FindOptionsWhere<GoodsReceiptProduct>): Promise<GoodsReceiptProduct> {
    const toBeDeleted = await this.repository.findOneOrFail({ where: params });

    await this.repository.delete({
      id: toBeDeleted.id,
    });

    return toBeDeleted;
  }

  // eslint-disable-next-line class-methods-use-this
  async deleteOneWithTx(
    params: FindOptionsWhere<GoodsReceiptProduct>,
    queryRunner: QueryRunner,
  ): Promise<GoodsReceiptProduct> {
    const toBeDeleted = await queryRunner.manager.findOneOrFail(GoodsReceiptProduct, {
      where: params,
    });

    await queryRunner.manager.delete(GoodsReceiptProduct, {
      id: toBeDeleted.id,
    });

    return toBeDeleted;
  }

  // eslint-disable-next-line class-methods-use-this
  async deleteManyWithTx(
    where: FindOptionsWhere<GoodsReceiptProduct>,
    queryRunner: QueryRunner,
  ): Promise<GoodsReceiptProduct[]> {
    const toBeDeleted = await queryRunner.manager.find(GoodsReceiptProduct, { where });

    await queryRunner.manager.delete(GoodsReceiptProduct, where);

    return toBeDeleted;
  }
}
