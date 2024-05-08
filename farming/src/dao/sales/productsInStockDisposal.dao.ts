/* eslint-disable class-methods-use-this */
import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import { DeepPartial, FindOptionsWhere, QueryRunner } from 'typeorm';
import { PostgreSQLConnection } from '../../datasources/connection/postgresql.connection';
import { ProductsInStockDisposal } from '../../datasources/entity/pgsql/sales/ProductsInStockDisposal.entity';
import { DEFAULT_TIME_ZONE } from '../../libs/constants';
import { ERR_SALES_PRODUCTS_IN_STOCK_DISPOSAL_UPSERT_FAILED } from '../../libs/constants/errors';
import { RequestUser } from '../../libs/types/index.d';
import { BaseSQLDAO } from '../base.dao';

@Service()
export class ProductsInStockDisposalDAO extends BaseSQLDAO<ProductsInStockDisposal> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(ProductsInStockDisposal);
  }

  async createManyWithTx(
    data: DeepPartial<ProductsInStockDisposal>[],
    _user: Partial<RequestUser>,
    queryRunner: QueryRunner,
  ): Promise<ProductsInStockDisposal[]> {
    const items = queryRunner.manager.create(
      ProductsInStockDisposal,
      data.map<DeepPartial<ProductsInStockDisposal>>((input) => ({
        ...input,
      })),
    );

    const result = await queryRunner.manager.save(ProductsInStockDisposal, items);

    return result;
  }

  async softDeleteManyWithTx(
    where: FindOptionsWhere<ProductsInStockDisposal>,
    queryRunner: QueryRunner,
  ): Promise<ProductsInStockDisposal[]> {
    const toBeDeleted = await queryRunner.manager.find(ProductsInStockDisposal, { where });

    await queryRunner.manager.softDelete(ProductsInStockDisposal, where);

    return toBeDeleted;
  }

  async upsertMany(
    user: RequestUser,
    items: DeepPartial<ProductsInStockDisposal>[],
    opts?: {
      qr?: QueryRunner;
    },
  ): Promise<ProductsInStockDisposal[]> {
    if (items.length === 0) return [];

    const stockDisposalId = items[0].salesStockDisposalId;
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);
    const upsertItems = items.map<DeepPartial<ProductsInStockDisposal>>((item) => ({
      ...item,
      createdBy: user.id,
      createdDate: now,
      modifiedBy: user.id,
      modifiedDate: now,
      deletedDate: null,
    }));

    await this.repository
      .createQueryBuilder(undefined, opts && opts.qr)
      .insert()
      .into(ProductsInStockDisposal)
      .values(upsertItems)
      .orUpdate(
        ['modified_by', 'modified_date', 'deleted_date', 'quantity', 'weight'],
        ['ref_sales_stock_disposal_id', 'ref_sales_product_item_id'],
      )
      .execute();

    const [results, count] = await this.repository
      .createQueryBuilder(undefined, opts && opts.qr)
      .where('ref_sales_stock_disposal_id = :stockDisposalId', { stockDisposalId })
      .andWhere('ref_sales_product_item_id IN (:...productIds)', {
        productIds: upsertItems.map((p) => p.salesProductItemId),
      })
      .getManyAndCount();

    if (count !== upsertItems.length) {
      throw ERR_SALES_PRODUCTS_IN_STOCK_DISPOSAL_UPSERT_FAILED('result count not match');
    }

    return results;
  }
}
