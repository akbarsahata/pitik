import { randomUUID } from 'crypto';
import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import { DeepPartial, FindOptionsWhere, QueryRunner } from 'typeorm';
import { PostgreSQLConnection } from '../../datasources/connection/postgresql.connection';
import { ProductsInGoodsReceived } from '../../datasources/entity/pgsql/sales/ProductsInGoodsReceived.entity';
import { DEFAULT_TIME_ZONE } from '../../libs/constants';
import { ERR_SALES_PRODUCTS_IN_GOODS_RECEIVED_UPSERT_FAILED } from '../../libs/constants/errors';
import { RequestUser } from '../../libs/types/index.d';
import { BaseSQLDAO } from '../base.dao';

@Service()
export class ProductsInGoodsReceivedDAO extends BaseSQLDAO<ProductsInGoodsReceived> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(ProductsInGoodsReceived);
  }

  // eslint-disable-next-line class-methods-use-this
  async createManyWithTx(
    data: DeepPartial<ProductsInGoodsReceived>[],
    user: Partial<RequestUser>,
    queryRunner: QueryRunner,
  ): Promise<ProductsInGoodsReceived[]> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);
    const items = queryRunner.manager.create(
      ProductsInGoodsReceived,
      data.map<DeepPartial<ProductsInGoodsReceived>>((input) => ({
        id: randomUUID(),
        ...input,
        createdBy: user.id,
        createdDate: now,
        modifiedBy: user.id,
        modifiedDate: now,
      })),
    );

    const result = await queryRunner.manager.save(ProductsInGoodsReceived, items);

    return result;
  }

  // eslint-disable-next-line class-methods-use-this
  async softDeleteManyWithTx(
    where: FindOptionsWhere<ProductsInGoodsReceived>,
    queryRunner: QueryRunner,
  ): Promise<ProductsInGoodsReceived[]> {
    const toBeDeleted = await queryRunner.manager.find(ProductsInGoodsReceived, {
      where,
    });

    await queryRunner.manager.softDelete(ProductsInGoodsReceived, where);

    return toBeDeleted;
  }

  async upsertMany(
    user: RequestUser,
    items: DeepPartial<ProductsInGoodsReceived>[],
    opts?: {
      qr?: QueryRunner;
    },
  ): Promise<ProductsInGoodsReceived[]> {
    if (items.length === 0) return [];

    const grId = items[0].salesGoodsReceivedId;
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);
    const upsertItems = items.map<DeepPartial<ProductsInGoodsReceived>>((item) => ({
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
      .into(ProductsInGoodsReceived)
      .values(upsertItems)
      .orUpdate(
        ['modified_by', 'modified_date', 'deleted_date', 'price', 'quantity', 'weight'],
        ['id'],
      )
      .execute();

    const [results, count] = await this.repository
      .createQueryBuilder(undefined, opts && opts.qr)
      .where('ref_sales_goods_received_id = :grId', { grId })
      .andWhere('ref_sales_product_item_id IN (:...productIds)', {
        productIds: upsertItems.map((p) => p.salesProductItemId),
      })
      .getManyAndCount();

    if (count !== upsertItems.length) {
      throw ERR_SALES_PRODUCTS_IN_GOODS_RECEIVED_UPSERT_FAILED('result count not match');
    }

    return results;
  }
}
