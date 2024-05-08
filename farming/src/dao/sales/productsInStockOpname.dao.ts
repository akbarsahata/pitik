/* eslint-disable class-methods-use-this */
import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import { DeepPartial, FindOptionsWhere, QueryRunner } from 'typeorm';
import { PostgreSQLConnection } from '../../datasources/connection/postgresql.connection';
import { ProductsInStockOpname } from '../../datasources/entity/pgsql/sales/ProductsInStockOpname.entity';
import { DEFAULT_TIME_ZONE } from '../../libs/constants';
import { ERR_SALES_PRODUCTS_IN_STOCK_OPNAME_UPSERT_FAILED } from '../../libs/constants/errors';
import { RequestUser } from '../../libs/types/index.d';
import { BaseSQLDAO } from '../base.dao';

@Service()
export class ProductsInStockOpnameDAO extends BaseSQLDAO<ProductsInStockOpname> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(ProductsInStockOpname);
  }

  async createManyWithTx(
    data: DeepPartial<ProductsInStockOpname>[],
    _user: Partial<RequestUser>,
    queryRunner: QueryRunner,
  ): Promise<ProductsInStockOpname[]> {
    const items = queryRunner.manager.create(
      ProductsInStockOpname,
      data.map<DeepPartial<ProductsInStockOpname>>((input) => ({
        ...input,
      })),
    );

    const result = await queryRunner.manager.save(ProductsInStockOpname, items);

    return result;
  }

  async softDeleteManyWithTx(
    where: FindOptionsWhere<ProductsInStockOpname>,
    queryRunner: QueryRunner,
  ): Promise<ProductsInStockOpname[]> {
    const toBeDeleted = await queryRunner.manager.find(ProductsInStockOpname, { where });

    await queryRunner.manager.softDelete(ProductsInStockOpname, where);

    return toBeDeleted;
  }

  async upsertMany(
    user: RequestUser,
    items: DeepPartial<ProductsInStockOpname>[],
    opts?: {
      qr?: QueryRunner;
    },
  ): Promise<ProductsInStockOpname[]> {
    if (items.length === 0) return [];

    const stockOpnameId = items[0].salesStockOpnameId;
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);
    const upsertItems = items.map<DeepPartial<ProductsInStockOpname>>((item) => ({
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
      .into(ProductsInStockOpname)
      .values(upsertItems)
      .orUpdate(
        [
          'modified_by',
          'modified_date',
          'deleted_date',
          'quantity',
          'weight',
          'previous_weight',
          'previous_quantity',
        ],
        ['ref_sales_stock_opname_id', 'ref_sales_product_item_id'],
      )
      .execute();

    const [results, count] = await this.repository
      .createQueryBuilder(undefined, opts && opts.qr)
      .where('ref_sales_stock_opname_id = :stockOpnameId', { stockOpnameId })
      .andWhere('ref_sales_product_item_id IN (:...productIds)', {
        productIds: upsertItems.map((p) => p.salesProductItemId),
      })
      .getManyAndCount();

    if (count !== upsertItems.length) {
      throw ERR_SALES_PRODUCTS_IN_STOCK_OPNAME_UPSERT_FAILED('result count not match');
    }

    return results;
  }
}
