/* eslint-disable class-methods-use-this */
import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import { DeepPartial, FindOptionsWhere, QueryRunner } from 'typeorm';
import { PostgreSQLConnection } from '../../datasources/connection/postgresql.connection';
import { ProductNotesInSalesOrder } from '../../datasources/entity/pgsql/sales/ProductNotesInSalesOrder.entity';
import { DEFAULT_TIME_ZONE } from '../../libs/constants';
import { ERR_SALES_PRODUCTS_IN_SALES_ORDER_UPSERT_FAILED } from '../../libs/constants/errors';
import { RequestUser } from '../../libs/types/index.d';
import { BaseSQLDAO } from '../base.dao';

@Service()
export class ProductNotesInSalesOrderDAO extends BaseSQLDAO<ProductNotesInSalesOrder> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(ProductNotesInSalesOrder);
  }

  async upsertMany(
    items: DeepPartial<ProductNotesInSalesOrder>[],
    user: RequestUser,
    queryRunner?: QueryRunner,
  ): Promise<ProductNotesInSalesOrder[]> {
    if (items.length === 0) return [];

    const orderId = items[0].salesOrderId;
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);
    const upsertItems = items.map<DeepPartial<ProductNotesInSalesOrder>>((item) => ({
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
      .into(ProductNotesInSalesOrder)
      .values(upsertItems)
      .orUpdate(
        [
          'quantity',
          'weight',
          'number_of_cuts',
          'modified_by',
          'modified_date',
          'deleted_date',
          'ref_product_category_id',
          'ref_sales_order_id',
          'cut_type',
        ],
        ['id'],
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

  async softDeleteManyWithTx(
    where: FindOptionsWhere<ProductNotesInSalesOrder>,
    queryRunner: QueryRunner,
  ): Promise<ProductNotesInSalesOrder[]> {
    const toBeDeleted = await queryRunner.manager.find(ProductNotesInSalesOrder, { where });

    await queryRunner.manager.softDelete(ProductNotesInSalesOrder, where);

    return toBeDeleted;
  }
}
