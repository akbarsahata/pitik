/* eslint-disable class-methods-use-this */
import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import { DeepPartial, FindOptionsWhere, QueryRunner } from 'typeorm';
import { PostgreSQLConnection } from '../../datasources/connection/postgresql.connection';
import { ProductsInCustomer } from '../../datasources/entity/pgsql/sales/ProductsInCustomer.entity';
import { DEFAULT_TIME_ZONE } from '../../libs/constants';
import { ERR_PRODUCTS_IN_CUSTOMER_INSERT_FAILED } from '../../libs/constants/errors';
import { RequestUser } from '../../libs/types/index.d';
import { BaseSQLDAO } from '../base.dao';

@Service()
export class ProductsInCustomerDAO extends BaseSQLDAO<ProductsInCustomer> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(ProductsInCustomer);
  }

  async createManyWithTx(
    data: DeepPartial<ProductsInCustomer>[],
    _user: Partial<RequestUser>,
    queryRunner: QueryRunner,
  ): Promise<ProductsInCustomer[]> {
    const items = queryRunner.manager.create(
      ProductsInCustomer,
      data.map<DeepPartial<ProductsInCustomer>>((input) => ({
        ...input,
      })),
    );

    const result = await queryRunner.manager.save(ProductsInCustomer, items);

    return result;
  }

  async deleteManyWithTx(
    where: FindOptionsWhere<ProductsInCustomer>,
    queryRunner: QueryRunner,
  ): Promise<ProductsInCustomer[]> {
    const toBeDeleted = await queryRunner.manager.find(ProductsInCustomer, { where });

    await queryRunner.manager.delete(ProductsInCustomer, where);

    return toBeDeleted;
  }

  async softDeleteManyWithTx(
    where: FindOptionsWhere<ProductsInCustomer>,
    queryRunner: QueryRunner,
  ): Promise<ProductsInCustomer[]> {
    const toBeDeleted = await queryRunner.manager.find(ProductsInCustomer, { where });

    await queryRunner.manager.softDelete(ProductsInCustomer, where);

    return toBeDeleted;
  }

  async upsertMany(
    user: RequestUser,
    items: DeepPartial<ProductsInCustomer>[],
    opts?: {
      qr?: QueryRunner;
    },
  ): Promise<ProductsInCustomer[]> {
    if (items.length === 0) return [];

    const customerId = items[0].salesCustomerId;
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);
    const upsertItems = items.map<DeepPartial<ProductsInCustomer>>((item) => ({
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
      .into(ProductsInCustomer)
      .values(upsertItems)
      .orUpdate(
        ['daily_quantity', 'price', 'modified_by', 'modified_date', 'deleted_date'],
        ['ref_sales_customer_id', 'ref_sales_product_item_id'],
      )
      .execute();

    const [results, count] = await this.repository
      .createQueryBuilder(undefined, opts && opts.qr)
      .where('ref_sales_customer_id = :customerId', { customerId })
      .andWhere('ref_sales_product_item_id IN (:...productIds)', {
        productIds: upsertItems.map((p) => p.salesProductItemId),
      })
      .getManyAndCount();

    if (count !== upsertItems.length) {
      throw ERR_PRODUCTS_IN_CUSTOMER_INSERT_FAILED('result count not match');
    }

    return results;
  }
}
