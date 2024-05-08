import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import {
  DeepPartial,
  EntityNotFoundError,
  FindOneOptions,
  FindOptionsWhere,
  QueryRunner,
} from 'typeorm';
import { PostgreSQLConnection } from '../../datasources/connection/postgresql.connection';
import { PurchaseOrder } from '../../datasources/entity/pgsql/sales/PurchaseOrder.entity';
import { DEFAULT_TIME_ZONE } from '../../libs/constants';
import { ERR_SALES_PURCHASE_ORDER_NOT_FOUND } from '../../libs/constants/errors';
import { RequestUser } from '../../libs/types/index.d';
import { BaseSQLDAO } from '../base.dao';

@Service()
export class PurchaseOrderDAO extends BaseSQLDAO<PurchaseOrder> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(PurchaseOrder);
  }

  async getOneStrict(params: FindOneOptions<PurchaseOrder>): Promise<PurchaseOrder> {
    try {
      const po = await this.repository.findOneOrFail(params);

      return po;
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw ERR_SALES_PURCHASE_ORDER_NOT_FOUND(error.message);
      }

      throw error;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async updateOneWithTx(
    params: FindOptionsWhere<PurchaseOrder>,
    data: Partial<PurchaseOrder>,
    user: Partial<RequestUser>,
    queryRunner: QueryRunner,
  ) {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    await queryRunner.manager.update(PurchaseOrder, params, {
      ...data,
      salesVendorId: data.salesVendorId,
      salesOperationUnitId: data.salesOperationUnitId,
      modifiedBy: user.id,
      modifiedDate: now,
    });

    const po = await queryRunner.manager.findOneOrFail(PurchaseOrder, {
      where: {
        ...((params.id && {
          id: params.id,
        }) ||
          params),
      },
    });

    return po;
  }

  // eslint-disable-next-line class-methods-use-this
  async upsertOne(
    user: RequestUser,
    item: DeepPartial<PurchaseOrder>,
    opts?: {
      qr?: QueryRunner;
    },
  ): Promise<PurchaseOrder> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);
    const upsertItem: DeepPartial<PurchaseOrder> = {
      ...item,
      createdBy: user.id,
      createdDate: now,
      modifiedBy: user.id,
      modifiedDate: now,
    };

    const result = await this.repository
      .createQueryBuilder(undefined, opts && opts.qr)
      .insert()
      .into(PurchaseOrder)
      .values(upsertItem)
      .orUpdate(['status', 'modified_by', 'modified_date', 'remarks', 'total_weight'], ['id'])
      .returning(['id'])
      .execute();

    return this.repository
      .createQueryBuilder(undefined, opts && opts.qr)
      .where('id = :id', { id: result.identifiers[0].id })
      .getOneOrFail();
  }

  async updateOne(
    params: FindOptionsWhere<PurchaseOrder>,
    data: Partial<PurchaseOrder>,
    user: RequestUser,
  ): Promise<PurchaseOrder> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const result = await this.repository.update(params, {
      ...data,
      modifiedBy: user.id,
      modifiedDate: now,
    });

    if (!result.affected) {
      throw ERR_SALES_PURCHASE_ORDER_NOT_FOUND();
    }

    const updated = await this.repository.findOneOrFail({
      where: params,
    });

    return updated;
  }
}
