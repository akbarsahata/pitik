import { Initializer, Inject, Service } from 'fastify-decorators';
import {
  DeepPartial,
  EntityNotFoundError,
  FindOneOptions,
  FindOptionsWhere,
  QueryRunner,
} from 'typeorm';
import { utcToZonedTime } from 'date-fns-tz';
import { GoodsReceipt } from '../datasources/entity/pgsql/GoodsReceipt.entity';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { BaseSQLDAO } from './base.dao';
import { ERR_GOODS_RECEIPT_NOT_FOUND } from '../libs/constants/errors';
import { RequestUser } from '../libs/types/index.d';
import { DEFAULT_TIME_ZONE } from '../libs/constants';
import { randomHexString } from '../libs/utils/helpers';

@Service()
export class GoodsReceiptDAO extends BaseSQLDAO<GoodsReceipt> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(GoodsReceipt);
  }

  async getOneStrict(params: FindOneOptions<GoodsReceipt>): Promise<GoodsReceipt> {
    try {
      const coop = await this.repository.findOneOrFail(params);

      return coop;
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw ERR_GOODS_RECEIPT_NOT_FOUND(error.message);
      }

      throw error;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async createOneWithTx(
    data: DeepPartial<GoodsReceipt>,
    user: RequestUser,
    queryRunner: QueryRunner,
  ): Promise<GoodsReceipt> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const gr = queryRunner.manager.create(GoodsReceipt, {
      ...data,
      id: randomHexString(),
      createdBy: user.id,
      createdDate: now,
      modifiedBy: user.id,
      modifiedDate: now,
    });

    const newGR = await queryRunner.manager.save(GoodsReceipt, gr);

    return newGR;
  }

  // eslint-disable-next-line class-methods-use-this
  async updateOneWithTx(
    params: FindOptionsWhere<GoodsReceipt>,
    data: Partial<GoodsReceipt>,
    userRequest: RequestUser,
    queryRunner: QueryRunner,
    transactionHooks?: Function[],
  ): Promise<GoodsReceipt> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    await queryRunner.manager.update(GoodsReceipt, params, {
      ...data,
      modifiedBy: userRequest.id,
      modifiedDate: now,
    });

    const updatedGR = await queryRunner.manager.findOneOrFail(GoodsReceipt, {
      where: {
        ...((params.id && {
          id: params.id,
        }) ||
          params),
      },
    });

    transactionHooks?.reduce(async (prev, trxHook) => {
      await prev;

      return trxHook(updatedGR, queryRunner);
    }, Promise.resolve());

    return updatedGR;
  }

  async updateOne(
    params: FindOptionsWhere<GoodsReceipt>,
    data: DeepPartial<GoodsReceipt>,
    user: RequestUser,
  ): Promise<GoodsReceipt> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const result = await this.repository.update(params, {
      ...data,
      modifiedBy: user.id,
      modifiedDate: now,
    });

    if (!result.affected) {
      throw ERR_GOODS_RECEIPT_NOT_FOUND();
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
