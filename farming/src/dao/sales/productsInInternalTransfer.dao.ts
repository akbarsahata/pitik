/* eslint-disable class-methods-use-this */
import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import { DeepPartial, FindOptionsWhere, QueryRunner } from 'typeorm';
import { PostgreSQLConnection } from '../../datasources/connection/postgresql.connection';
import { ProductsInInternalTransfer } from '../../datasources/entity/pgsql/sales/ProductsInInternalTransfer.entity';
import { DEFAULT_TIME_ZONE } from '../../libs/constants';
import { ERR_SALES_PRODUCTS_IN_INTERNAL_TRANSFER_UPSERT_FAILED } from '../../libs/constants/errors';
import { RequestUser } from '../../libs/types/index.d';
import { BaseSQLDAO } from '../base.dao';

@Service()
export class ProductsInInternalTransferDAO extends BaseSQLDAO<ProductsInInternalTransfer> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(ProductsInInternalTransfer);
  }

  async upsertMany(
    user: RequestUser,
    items: DeepPartial<ProductsInInternalTransfer>[],
    opts?: {
      qr?: QueryRunner;
    },
  ): Promise<ProductsInInternalTransfer[]> {
    if (items.length === 0) return [];

    const { internalTransferId } = items[0];
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);
    const upsertItems = items.map<DeepPartial<ProductsInInternalTransfer>>((item) => ({
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
      .into(ProductsInInternalTransfer)
      .values(upsertItems)
      .orUpdate(
        ['quantity', 'weight', 'modified_by', 'modified_date', 'deleted_date'],
        ['ref_internal_transfer_id', 'ref_product_item_id'],
      )
      .execute();

    const [results, count] = await this.repository
      .createQueryBuilder(undefined, opts && opts.qr)
      .where('ref_internal_transfer_id = :internalTransferId', { internalTransferId })
      .getManyAndCount();

    if (count !== upsertItems.length) {
      throw ERR_SALES_PRODUCTS_IN_INTERNAL_TRANSFER_UPSERT_FAILED('result count not match');
    }

    return results;
  }

  async softDeleteManyWithTx(
    where: FindOptionsWhere<ProductsInInternalTransfer>,
    queryRunner: QueryRunner,
  ): Promise<ProductsInInternalTransfer[]> {
    const toBeDeleted = await queryRunner.manager.find(ProductsInInternalTransfer, { where });

    await queryRunner.manager.softDelete(ProductsInInternalTransfer, where);

    return toBeDeleted;
  }
}
