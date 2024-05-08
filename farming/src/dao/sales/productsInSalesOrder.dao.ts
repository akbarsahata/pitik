/* eslint-disable class-methods-use-this */
import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import { DeepPartial, FindOptionsWhere, QueryRunner } from 'typeorm';
import { PostgreSQLConnection } from '../../datasources/connection/postgresql.connection';
import { ProductsInSalesOrder } from '../../datasources/entity/pgsql/sales/ProductsInSalesOrder.entity';
import { DEFAULT_TIME_ZONE } from '../../libs/constants';
import { ERR_SALES_PRODUCTS_IN_SALES_ORDER_UPSERT_FAILED } from '../../libs/constants/errors';
import { RequestUser } from '../../libs/types/index.d';
import { BaseSQLDAO } from '../base.dao';

@Service()
export class ProductsInSalesOrderDAO extends BaseSQLDAO<ProductsInSalesOrder> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(ProductsInSalesOrder);
  }

  async upsertMany(
    items: DeepPartial<ProductsInSalesOrder>[],
    user: RequestUser,
    queryRunner?: QueryRunner,
  ): Promise<ProductsInSalesOrder[]> {
    if (items.length === 0) return [];

    const orderId = items[0].salesOrderId;
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);
    const upsertItems = items.map<DeepPartial<ProductsInSalesOrder>>((item) => ({
      ...item,
      createdBy: user.id,
      createdDate: now,
      modifiedBy: user.id,
      modifiedDate: now,
      deletedDate: null,
    }));

    await this.repository
      .createQueryBuilder(undefined, queryRunner)
      .insert()
      .into(ProductsInSalesOrder)
      .values(upsertItems)
      .orUpdate(
        [
          'quantity',
          'price',
          'weight',
          'return_quantity',
          'return_weight',
          'booked_weight',
          'number_of_cuts',
          'modified_by',
          'modified_date',
          'deleted_date',
          'cut_type',
        ],
        ['ref_product_item_id', 'ref_sales_order_id', 'number_of_cuts'],
      )
      .execute();

    const [results, count] = await this.repository
      .createQueryBuilder(undefined, queryRunner)
      .where('ref_sales_order_id = :orderId', { orderId })
      .getManyAndCount();

    if (count !== upsertItems.length) {
      throw ERR_SALES_PRODUCTS_IN_SALES_ORDER_UPSERT_FAILED('result count not match');
    }

    return results;
  }

  async upsertManyWithoutCount(
    user: RequestUser,
    items: DeepPartial<ProductsInSalesOrder>[],
    opts?: {
      qr?: QueryRunner;
    },
  ): Promise<ProductsInSalesOrder[]> {
    if (items.length === 0) return [];

    const orderId = items[0].salesOrderId;
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);
    const upsertItems = items.map<DeepPartial<ProductsInSalesOrder>>((item) => ({
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
      .into(ProductsInSalesOrder)
      .values(upsertItems)
      .orUpdate(
        [
          'quantity',
          'price',
          'weight',
          'return_quantity',
          'return_weight',
          'number_of_cuts',
          'modified_by',
          'modified_date',
          'deleted_date',
        ],
        ['ref_product_item_id', 'ref_sales_order_id', 'number_of_cuts'],
      )
      .execute();

    const [results] = await this.repository
      .createQueryBuilder(undefined, opts && opts.qr)
      .where('ref_sales_order_id = :orderId', { orderId })
      .getManyAndCount();

    return results;
  }

  async softDeleteManyWithTx(
    where: FindOptionsWhere<ProductsInSalesOrder>,
    queryRunner: QueryRunner,
  ): Promise<ProductsInSalesOrder[]> {
    const toBeDeleted = await queryRunner.manager.find(ProductsInSalesOrder, { where });

    await queryRunner.manager.softDelete(ProductsInSalesOrder, where);

    return toBeDeleted;
  }
}
