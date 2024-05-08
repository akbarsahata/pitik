/* eslint-disable class-methods-use-this */
import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import { DeepPartial, FindOptionsWhere, QueryRunner } from 'typeorm';
import { PostgreSQLConnection } from '../../datasources/connection/postgresql.connection';
import { ProductsInPurchaseOrderInvoice } from '../../datasources/entity/pgsql/sales/ProductsInPurchaseOrderInvoice.entity';
import { DEFAULT_TIME_ZONE } from '../../libs/constants';
import { ERR_SALES_PRODUCTS_IN_PURCHASE_ORDER_INVOICE_INSERT_FAILED } from '../../libs/constants/errors';
import { RequestUser } from '../../libs/types/index.d';
import { BaseSQLDAO } from '../base.dao';

@Service()
/* eslint-disable max-len */
export class ProductsInPurchaseOrderInvoiceDAO extends BaseSQLDAO<ProductsInPurchaseOrderInvoice> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(ProductsInPurchaseOrderInvoice);
  }

  async createManyWithTx(
    data: DeepPartial<ProductsInPurchaseOrderInvoice>[],
    _user: Partial<RequestUser>,
    queryRunner: QueryRunner,
  ): Promise<ProductsInPurchaseOrderInvoice[]> {
    const items = queryRunner.manager.create(
      ProductsInPurchaseOrderInvoice,
      data.map<DeepPartial<ProductsInPurchaseOrderInvoice>>((input) => ({
        ...input,
      })),
    );

    const result = await queryRunner.manager.save(ProductsInPurchaseOrderInvoice, items);

    return result;
  }

  async softDeleteManyWithTx(
    where: FindOptionsWhere<ProductsInPurchaseOrderInvoice>,
    queryRunner: QueryRunner,
  ): Promise<ProductsInPurchaseOrderInvoice[]> {
    const toBeDeleted = await queryRunner.manager.find(ProductsInPurchaseOrderInvoice, {
      where,
    });

    await queryRunner.manager.softDelete(ProductsInPurchaseOrderInvoice, where);

    return toBeDeleted;
  }

  async upsertMany(
    user: RequestUser,
    items: DeepPartial<ProductsInPurchaseOrderInvoice>[],
    opts?: {
      qr?: QueryRunner;
    },
  ): Promise<ProductsInPurchaseOrderInvoice[]> {
    if (items.length === 0) return [];

    const poiId = items[0].salesPurchaseOrderInvoiceId;
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);
    const upsertItems = items.map<DeepPartial<ProductsInPurchaseOrderInvoice>>((item) => ({
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
      .into(ProductsInPurchaseOrderInvoice)
      .values(upsertItems)
      .orUpdate(
        ['modified_by', 'modified_date', 'deleted_date', 'price', 'quantity'],
        ['ref_sales_product_item_id', 'ref_sales_purchase_order_invoice_id'],
      )
      .execute();

    const [results, count] = await this.repository
      .createQueryBuilder(undefined, opts && opts.qr)
      .where('ref_sales_purchase_order_invoice_id = :poiId', { poiId })
      .andWhere('ref_sales_product_item_id IN (:...productIds)', {
        productIds: upsertItems.map((p) => p.salesProductItemId),
      })
      .getManyAndCount();

    if (count !== upsertItems.length) {
      throw ERR_SALES_PRODUCTS_IN_PURCHASE_ORDER_INVOICE_INSERT_FAILED('result count not match');
    }

    return results;
  }
}
