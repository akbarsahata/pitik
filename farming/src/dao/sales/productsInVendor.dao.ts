/* eslint-disable class-methods-use-this */
import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import { DeepPartial, FindOptionsWhere, QueryRunner } from 'typeorm';
import { PostgreSQLConnection } from '../../datasources/connection/postgresql.connection';
import { ProductsInVendor } from '../../datasources/entity/pgsql/sales/ProductsInVendor.entity';
import { DEFAULT_TIME_ZONE } from '../../libs/constants';
import { ERR_PRODUCTS_IN_VENDOR_INSERT_FAILED } from '../../libs/constants/errors';
import { RequestUser } from '../../libs/types/index.d';
import { BaseSQLDAO } from '../base.dao';

@Service()
export class ProductsInVendorDAO extends BaseSQLDAO<ProductsInVendor> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(ProductsInVendor);
  }

  async createManyWithTx(
    data: DeepPartial<ProductsInVendor>[],
    _user: Partial<RequestUser>,
    queryRunner: QueryRunner,
  ): Promise<ProductsInVendor[]> {
    const items = queryRunner.manager.create(
      ProductsInVendor,
      data.map<DeepPartial<ProductsInVendor>>((input) => ({
        ...input,
      })),
    );

    const result = await queryRunner.manager.save(ProductsInVendor, items);

    return result;
  }

  async softDeleteManyWithTx(
    where: FindOptionsWhere<ProductsInVendor>,
    queryRunner: QueryRunner,
  ): Promise<ProductsInVendor[]> {
    const toBeDeleted = await queryRunner.manager.find(ProductsInVendor, { where });

    await queryRunner.manager.softDelete(ProductsInVendor, where);

    return toBeDeleted;
  }

  async upsertMany(
    user: RequestUser,
    items: DeepPartial<ProductsInVendor>[],
    opts?: {
      qr?: QueryRunner;
    },
  ): Promise<ProductsInVendor[]> {
    if (items.length === 0) return [];

    const vendorId = items[0].salesVendorId;
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);
    const upsertItems = items.map<DeepPartial<ProductsInVendor>>((item) => ({
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
      .into(ProductsInVendor)
      .values(upsertItems)
      .orUpdate(
        ['modified_by', 'modified_date', 'deleted_date'],
        ['ref_sales_vendor_id', 'ref_sales_product_category_id'],
      )
      .execute();

    const [results, count] = await this.repository
      .createQueryBuilder(undefined, opts && opts.qr)
      .where('ref_sales_vendor_id = :vendorId', { vendorId })
      .andWhere('ref_sales_product_category_id IN (:...productIds)', {
        productIds: upsertItems.map((p) => p.salesProductCategoryId),
      })
      .getManyAndCount();

    if (count !== upsertItems.length) {
      throw ERR_PRODUCTS_IN_VENDOR_INSERT_FAILED('result count not match');
    }

    return results;
  }
}
