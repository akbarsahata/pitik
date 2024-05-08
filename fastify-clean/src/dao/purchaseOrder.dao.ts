import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import {
  DeepPartial,
  EntityNotFoundError,
  FindOneOptions,
  FindOptionsWhere,
  QueryRunner,
} from 'typeorm';
import { DEFAULT_TIME_ZONE } from '../libs/constants';
import { RequestUser } from '../libs/types/index.d';
import { randomHexString } from '../libs/utils/helpers';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { PurchaseOrder } from '../datasources/entity/pgsql/PurchaseOrder.entity';
import { BaseSQLDAO } from './base.dao';
import { ERR_PURCHASE_ORDER_NOT_FOUND } from '../libs/constants/errors';

@Service()
export class PurchaseOrderDAO extends BaseSQLDAO<PurchaseOrder> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(PurchaseOrder);
  }

  // eslint-disable-next-line class-methods-use-this
  async createOneWithTx(
    input: Partial<PurchaseOrder>,
    userRequest: RequestUser,
    queryRunner: QueryRunner,
    transactionHooks?: Function[],
  ): Promise<PurchaseOrder> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const item = queryRunner.manager.create(PurchaseOrder, {
      ...input,
      id: randomHexString(),
      createdBy: userRequest.id,
      createdDate: now,
      modifiedBy: userRequest.id,
      modifiedDate: now,
    });

    const result = await queryRunner.manager.save(PurchaseOrder, item);

    transactionHooks?.reduce(async (prev, trxHook) => {
      await prev;

      return trxHook(item, queryRunner);
    }, Promise.resolve());

    return result;
  }

  // eslint-disable-next-line class-methods-use-this
  async updateOneWithTx(
    params: FindOptionsWhere<PurchaseOrder>,
    data: Partial<PurchaseOrder>,
    userRequest: RequestUser,
    queryRunner: QueryRunner,
    transactionHooks?: Function[],
  ): Promise<PurchaseOrder> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    await queryRunner.manager.update(PurchaseOrder, params, {
      ...data,
      modifiedBy: userRequest.id,
      modifiedDate: now,
    });

    const result = await queryRunner.manager.findOneOrFail(PurchaseOrder, {
      where: {
        ...((params.id && {
          id: params.id,
        }) ||
          params),
      },
    });

    transactionHooks?.reduce(async (prev, trxHook) => {
      await prev;

      return trxHook(result, queryRunner);
    }, Promise.resolve());

    return result;
  }

  async getOneStrict(params: FindOneOptions<PurchaseOrder>): Promise<PurchaseOrder> {
    try {
      const purchaseOrder = await this.repository.findOneOrFail(params);

      return purchaseOrder;
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw ERR_PURCHASE_ORDER_NOT_FOUND(error.message);
      }

      throw error;
    }
  }

  async getOne(params: FindOneOptions<PurchaseOrder>): Promise<PurchaseOrder | null> {
    const purchaseOrder = await this.repository.findOne(params);

    return purchaseOrder;
  }

  async updateOne(
    params: FindOptionsWhere<PurchaseOrder>,
    data: DeepPartial<PurchaseOrder>,
    user: RequestUser,
  ): Promise<PurchaseOrder> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const result = await this.repository.update(params, {
      ...data,
      modifiedBy: user.id,
      modifiedDate: now,
    });

    if (!result.affected) {
      throw ERR_PURCHASE_ORDER_NOT_FOUND();
    }

    const updated = await this.repository.findOneOrFail({
      where: {
        ...((params.id && {
          id: params.id,
        }) ||
          params),
      },
    });

    return updated;
  }
}
