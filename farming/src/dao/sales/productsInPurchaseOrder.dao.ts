import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import { DeepPartial, FindOptionsWhere, QueryRunner } from 'typeorm';
import { PostgreSQLConnection } from '../../datasources/connection/postgresql.connection';
import { ProductsInPurchaseOrder } from '../../datasources/entity/pgsql/sales/ProductsInPurchaseOrder.entity';
import { DEFAULT_TIME_ZONE } from '../../libs/constants';
import { ERR_SALES_PRODUCTS_IN_PURCHASE_ORDER_INSERT_FAILED } from '../../libs/constants/errors';
import { RequestUser } from '../../libs/types/index.d';
import { BaseSQLDAO } from '../base.dao';

@Service()
export class ProductsInPurchaseOrderDAO extends BaseSQLDAO<ProductsInPurchaseOrder> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(ProductsInPurchaseOrder);
  }

  // eslint-disable-next-line class-methods-use-this
  async createManyWithTx(
    data: DeepPartial<ProductsInPurchaseOrder>[],
    _user: Partial<RequestUser>,
    queryRunner: QueryRunner,
  ): Promise<ProductsInPurchaseOrder[]> {
    const items = queryRunner.manager.create(
      ProductsInPurchaseOrder,
      data.map<DeepPartial<ProductsInPurchaseOrder>>((input) => ({
        ...input,
      })),
    );

    const result = await queryRunner.manager.save(ProductsInPurchaseOrder, items);

    return result;
  }

  // eslint-disable-next-line class-methods-use-this
  async softDeleteManyWithTx(
    where: FindOptionsWhere<ProductsInPurchaseOrder>,
    queryRunner: QueryRunner,
  ): Promise<ProductsInPurchaseOrder[]> {
    const toBeDeleted = await queryRunner.manager.find(ProductsInPurchaseOrder, {
      where,
    });

    await queryRunner.manager.softDelete(ProductsInPurchaseOrder, where);

    return toBeDeleted;
  }

  async upsertMany(
    user: RequestUser,
    items: DeepPartial<ProductsInPurchaseOrder>[],
    opts?: {
      qr?: QueryRunner;
    },
  ): Promise<ProductsInPurchaseOrder[]> {
    if (items.length === 0) return [];

    const poiId = items[0].salesPurchaseOrderId;
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);
    const upsertItems = items.map<DeepPartial<ProductsInPurchaseOrder>>((item) => ({
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
      .into(ProductsInPurchaseOrder)
      .values(upsertItems)
      .orUpdate(
        ['modified_by', 'modified_date', 'deleted_date', 'price', 'quantity', 'weight'],
        ['ref_sales_product_item_id', 'ref_sales_purchase_order_id'],
      )
      .execute();

    const [results, count] = await this.repository
      .createQueryBuilder(undefined, opts && opts.qr)
      .where('ref_sales_purchase_order_id = :poiId', { poiId })
      .andWhere('ref_sales_product_item_id IN (:...productIds)', {
        productIds: upsertItems.map((p) => p.salesProductItemId),
      })
      .getManyAndCount();

    if (count !== upsertItems.length) {
      throw ERR_SALES_PRODUCTS_IN_PURCHASE_ORDER_INSERT_FAILED('result count not match');
    }

    return results;
  }
}
