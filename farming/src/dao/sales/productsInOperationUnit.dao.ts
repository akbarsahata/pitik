/* eslint-disable class-methods-use-this */
import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import { DeepPartial, FindOptionsWhere, QueryRunner } from 'typeorm';
import { PostgreSQLConnection } from '../../datasources/connection/postgresql.connection';
import { ProductsInOperationUnit } from '../../datasources/entity/pgsql/sales/ProductsInOperationUnit.entity';
import { DEFAULT_TIME_ZONE } from '../../libs/constants';
import { ERR_PRODUCTS_IN_VENDOR_INSERT_FAILED } from '../../libs/constants/errors';
import { RequestUser } from '../../libs/types/index.d';
import { BaseSQLDAO } from '../base.dao';

@Service()
export class ProductsInOperationUnitDAO extends BaseSQLDAO<ProductsInOperationUnit> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(ProductsInOperationUnit);
  }

  async createManyWithTx(
    data: DeepPartial<ProductsInOperationUnit>[],
    _user: Partial<RequestUser>,
    queryRunner: QueryRunner,
  ): Promise<ProductsInOperationUnit[]> {
    const items = queryRunner.manager.create(
      ProductsInOperationUnit,
      data.map<DeepPartial<ProductsInOperationUnit>>((input) => ({
        ...input,
      })),
    );

    const result = await queryRunner.manager.save(ProductsInOperationUnit, items);

    return result;
  }

  async softDeleteManyWithTx(
    where: FindOptionsWhere<ProductsInOperationUnit>,
    queryRunner: QueryRunner,
  ): Promise<ProductsInOperationUnit[]> {
    const toBeDeleted = await queryRunner.manager.find(ProductsInOperationUnit, { where });

    await queryRunner.manager.softDelete(ProductsInOperationUnit, where);

    return toBeDeleted;
  }

  async upsertMany(
    user: RequestUser,
    items: DeepPartial<ProductsInOperationUnit>[],
    opts?: {
      qr?: QueryRunner;
    },
  ): Promise<ProductsInOperationUnit[]> {
    if (items.length === 0) return [];

    const operationUnitId = items[0].salesOperationUnitId;
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);
    const upsertItems = items.map<DeepPartial<ProductsInOperationUnit>>((item) => ({
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
      .into(ProductsInOperationUnit)
      .values(upsertItems)
      .orUpdate(
        ['modified_by', 'modified_date', 'deleted_date'],
        ['ref_sales_operation_unit_id', 'ref_sales_product_category_id'],
      )
      .execute();

    const [results, count] = await this.repository
      .createQueryBuilder(undefined, opts && opts.qr)
      .where('ref_sales_operation_unit_id = :operationUnitId', { operationUnitId })
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
