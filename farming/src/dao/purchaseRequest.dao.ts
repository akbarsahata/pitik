import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import {
  DeepPartial,
  EntityNotFoundError,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  QueryRunner,
} from 'typeorm';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { PurchaseRequest } from '../datasources/entity/pgsql/PurchaseRequest.entity';
import { DEFAULT_TIME_ZONE } from '../libs/constants';
import { ERR_PURCHASE_REQUEST_NOT_FOUND } from '../libs/constants/errors';
import { RequestUser } from '../libs/types/index.d';
import { randomHexString } from '../libs/utils/helpers';
import { BaseSQLDAO } from './base.dao';

@Service()
export class PurchaseRequestDAO extends BaseSQLDAO<PurchaseRequest> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(PurchaseRequest);
  }

  async getOneStrict(params: FindOneOptions<PurchaseRequest>): Promise<PurchaseRequest> {
    try {
      const purchaseReq = await this.repository.findOneOrFail(params);

      return purchaseReq;
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw ERR_PURCHASE_REQUEST_NOT_FOUND(error.message);
      }

      throw error;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async createOneWithTx(
    data: DeepPartial<PurchaseRequest>,
    user: RequestUser,
    queryRunner: QueryRunner,
    transactionHooks?: Function[],
  ): Promise<PurchaseRequest> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const purchaseReq = queryRunner.manager.create(PurchaseRequest, {
      ...data,
      id: randomHexString(),
      createdBy: user.id,
      createdDate: now,
      modifiedBy: user.id,
      modifiedDate: now,
    });

    await transactionHooks?.reduce(async (prev, trxHook) => {
      await prev;

      return trxHook(purchaseReq, queryRunner);
    }, Promise.resolve());

    const newPurchaseReq = await queryRunner.manager.save(PurchaseRequest, purchaseReq);

    return newPurchaseReq;
  }

  async updateOne(
    params: FindOptionsWhere<PurchaseRequest>,
    data: DeepPartial<PurchaseRequest>,
    user: RequestUser,
  ): Promise<PurchaseRequest> {
    await this.repository.update(params, {
      ...data,
      modifiedBy: user.id,
      modifiedDate: utcToZonedTime(new Date(), DEFAULT_TIME_ZONE),
    });

    const updatedPR = await this.repository.findOneOrFail({
      where: {
        ...((params.id && {
          id: params.id,
        }) ||
          params),
      },
    });

    return updatedPR;
  }

  // eslint-disable-next-line class-methods-use-this
  async updateOneWithTx(
    params: FindOptionsWhere<PurchaseRequest>,
    data: DeepPartial<PurchaseRequest>,
    user: RequestUser,
    queryRunner: QueryRunner,
    transactionHooks?: Function[],
  ): Promise<PurchaseRequest> {
    await queryRunner.manager.update(PurchaseRequest, params, {
      ...data,
      modifiedBy: user.id,
      modifiedDate: utcToZonedTime(new Date(), DEFAULT_TIME_ZONE),
    });

    const updatedPR = await queryRunner.manager.findOneOrFail(PurchaseRequest, {
      where: {
        ...((params.id && {
          id: params.id,
        }) ||
          params),
      },
      order: {
        createdDate: 'DESC',
      },
    });

    await transactionHooks?.reduce(async (prev, trxHook) => {
      await prev;

      return trxHook(updatedPR, queryRunner);
    }, Promise.resolve());

    return updatedPR;
  }

  // eslint-disable-next-line class-methods-use-this
  async updateManyWithTx(
    params: FindOptionsWhere<PurchaseRequest>,
    data: DeepPartial<PurchaseRequest>,
    user: RequestUser,
    queryRunner: QueryRunner,
    transactionHooks?: Function[] | undefined,
  ): Promise<PurchaseRequest[]> {
    await queryRunner.manager.update(PurchaseRequest, params, {
      ...data,
      modifiedBy: user.id,
      modifiedDate: utcToZonedTime(new Date(), DEFAULT_TIME_ZONE),
    });

    const updatedPRs = await queryRunner.manager.find(PurchaseRequest, {
      where: {
        ...((params.id && {
          id: params.id,
        }) ||
          params),
      },
    });

    await transactionHooks?.reduce(async (prev, trxHook) => {
      await prev;

      return trxHook(updatedPRs, queryRunner);
    }, Promise.resolve());

    return updatedPRs;
  }

  async getMany(params: FindManyOptions<PurchaseRequest>): Promise<[PurchaseRequest[], number]> {
    const [purchaseReqs, count] = await this.repository.findAndCount(params);

    return [purchaseReqs, count];
  }

  async deleteOne(params: FindOptionsWhere<PurchaseRequest>): Promise<PurchaseRequest> {
    const toBeDeleted = await this.repository.findOneOrFail({ where: params });

    await this.repository.delete({
      id: toBeDeleted.id,
    });

    return toBeDeleted;
  }

  // eslint-disable-next-line class-methods-use-this
  async getOneWithTx(
    params: FindOneOptions<PurchaseRequest>,
    queryRunner: QueryRunner,
  ): Promise<PurchaseRequest | null> {
    const data = await queryRunner.manager.findOne(PurchaseRequest, params);

    return data;
  }

  // eslint-disable-next-line class-methods-use-this
  async deleteOneWithTx(
    params: FindOptionsWhere<PurchaseRequest>,
    queryRunner: QueryRunner,
  ): Promise<PurchaseRequest> {
    const toBeDeleted = await queryRunner.manager.findOneOrFail(PurchaseRequest, { where: params });

    await queryRunner.manager.delete(PurchaseRequest, {
      id: toBeDeleted.id,
    });

    return toBeDeleted;
  }

  // eslint-disable-next-line class-methods-use-this
  async deleteManyWithTx(
    where: FindOptionsWhere<PurchaseRequest>,
    queryRunner: QueryRunner,
  ): Promise<PurchaseRequest[]> {
    const toBeDeleted = await queryRunner.manager.find(PurchaseRequest, { where });

    await queryRunner.manager.delete(PurchaseRequest, where);

    return toBeDeleted;
  }
}
