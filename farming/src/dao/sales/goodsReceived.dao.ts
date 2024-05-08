import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import { DeepPartial, FindOneOptions, FindOptionsWhere, QueryRunner } from 'typeorm';
import { PostgreSQLConnection } from '../../datasources/connection/postgresql.connection';
import { GoodsReceived } from '../../datasources/entity/pgsql/sales/GoodsReceived.entity';
import { DEFAULT_TIME_ZONE } from '../../libs/constants';
import { ERR_SALES_GOODS_RECEIVED_NOT_FOUND } from '../../libs/constants/errors';
import { RequestUser } from '../../libs/types/index.d';
import { BaseSQLDAO } from '../base.dao';

@Service()
export class GoodsReceivedDAO extends BaseSQLDAO<GoodsReceived> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(GoodsReceived);
  }

  async getOneStrict(params: FindOneOptions<GoodsReceived>): Promise<GoodsReceived> {
    try {
      const vendor = await this.repository.findOneOrFail(params);

      return vendor;
    } catch (error) {
      throw ERR_SALES_GOODS_RECEIVED_NOT_FOUND();
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async updateOneWithTx(
    params: FindOptionsWhere<GoodsReceived>,
    data: Partial<GoodsReceived>,
    user: Partial<RequestUser>,
    queryRunner: QueryRunner,
  ) {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    await queryRunner.manager.update(GoodsReceived, params, {
      ...data,
      salesPurchaseOrderId: data.salesPurchaseOrderId,
      salesOrderId: data.salesOrderId,
      salesInternalTransferId: data.salesInternalTransferId,
      modifiedBy: user.id,
      modifiedDate: now,
    });

    const po = await queryRunner.manager.findOneOrFail(GoodsReceived, {
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
  async createOneWithTx(
    data: Partial<GoodsReceived>,
    user: RequestUser,
    queryRunner: QueryRunner,
  ): Promise<GoodsReceived> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);
    const item = queryRunner.manager.create(GoodsReceived, {
      ...data,
      createdBy: user.id,
      createdDate: now,
      modifiedBy: user.id,
      modifiedDate: now,
    });

    const po = await queryRunner.manager.save(GoodsReceived, item);

    return po;
  }

  async updateOne(
    params: FindOptionsWhere<GoodsReceived>,
    data: Partial<GoodsReceived>,
    user: RequestUser,
  ): Promise<GoodsReceived> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const result = await this.repository.update(params, {
      ...data,
      modifiedBy: user.id,
      modifiedDate: now,
    });

    if (!result.affected) {
      throw ERR_SALES_GOODS_RECEIVED_NOT_FOUND();
    }

    const updated = await this.repository.findOneOrFail({
      where: params,
    });

    return updated;
  }

  async upsertOne(
    user: RequestUser,
    item: DeepPartial<GoodsReceived>,
    opts?: {
      qr?: QueryRunner;
    },
  ): Promise<GoodsReceived> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);
    const upsertItem: DeepPartial<GoodsReceived> = {
      ...item,
      createdBy: user.id,
      createdDate: now,
      modifiedBy: user.id,
      modifiedDate: now,
    };

    const result = await this.repository
      .createQueryBuilder(undefined, opts && opts.qr)
      .insert()
      .into(GoodsReceived)
      .values(upsertItem)
      .orUpdate(['modified_by', 'modified_date', 'status', 'remarks'], ['id'])
      .returning(['id'])
      .execute();

    return this.repository
      .createQueryBuilder(undefined, opts && opts.qr)
      .where('id = :id', { id: result.identifiers[0].id })
      .getOneOrFail();
  }
}
