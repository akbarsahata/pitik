import { randomUUID } from 'crypto';
import { Initializer, Inject, Service } from 'fastify-decorators';
import {
  DeepPartial,
  EntityNotFoundError,
  FindOneOptions,
  FindOptionsWhere,
  QueryRunner,
} from 'typeorm';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { TransferRequestProduct } from '../datasources/entity/pgsql/TransferRequestProduct.entity';
import { ERR_TRANSFER_REQUEST_PHOTO_NOT_FOUND } from '../libs/constants/errors';
import { RequestUser } from '../libs/types/index.d';
import { BaseSQLDAO } from './base.dao';

@Service()
export class TransferRequestProductDAO extends BaseSQLDAO<TransferRequestProduct> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(TransferRequestProduct);
  }

  // eslint-disable-next-line class-methods-use-this
  async createManyWithTx(
    data: DeepPartial<TransferRequestProduct>[],
    _user: RequestUser,
    queryRunner: QueryRunner,
  ): Promise<TransferRequestProduct[]> {
    const items = data.map((d) =>
      queryRunner.manager.create(TransferRequestProduct, {
        ...d,
        id: randomUUID(),
      }),
    );

    const result = await queryRunner.manager.save(TransferRequestProduct, items);

    return result;
  }

  // eslint-disable-next-line class-methods-use-this
  async updateOneWithTx(
    params: FindOptionsWhere<TransferRequestProduct>,
    data: DeepPartial<TransferRequestProduct>,
    _user: RequestUser,
    queryRunner: QueryRunner,
    transactionHooks?: Function[],
  ): Promise<TransferRequestProduct> {
    await queryRunner.manager.update(TransferRequestProduct, params, {
      ...data,
    });

    const result = await queryRunner.manager.findOneOrFail(TransferRequestProduct, {
      where: {
        ...((params.id && {
          id: params.id,
        }) ||
          params),
      },
    });

    await transactionHooks?.reduce(async (prev, trxHook) => {
      await prev;

      return trxHook(result, queryRunner);
    }, Promise.resolve());

    return result;
  }

  async getOneStrict(
    params: FindOneOptions<TransferRequestProduct>,
  ): Promise<TransferRequestProduct> {
    try {
      const transferReq = await this.repository.findOneOrFail(params);

      return transferReq;
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw ERR_TRANSFER_REQUEST_PHOTO_NOT_FOUND(error.message);
      }

      throw error;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async upsertManyWithTx(
    params: FindOptionsWhere<TransferRequestProduct>,
    data: DeepPartial<TransferRequestProduct>[],
    _user: RequestUser,
    queryRunner: QueryRunner,
  ): Promise<TransferRequestProduct[]> {
    await Promise.all(
      data.map((d) => {
        if (d.id || d.id === '') {
          return queryRunner.manager.update(TransferRequestProduct, d.id, d);
        }

        const item = queryRunner.manager.create(TransferRequestProduct, {
          ...d,
          id: randomUUID(),
        });

        return queryRunner.manager.save(TransferRequestProduct, item);
      }),
    );

    const result = await queryRunner.manager.find(TransferRequestProduct, {
      where: {
        transferRequestId: params.transferRequestId,
      },
    });

    return result;
  }

  // eslint-disable-next-line class-methods-use-this
  async deleteManyWithTx(
    where: FindOptionsWhere<TransferRequestProduct>,
    queryRunner: QueryRunner,
  ): Promise<TransferRequestProduct[]> {
    const toBeDeleted = await queryRunner.manager.find(TransferRequestProduct, { where });

    await queryRunner.manager.delete(TransferRequestProduct, where);

    return toBeDeleted;
  }

  // eslint-disable-next-line class-methods-use-this
  async updateManyWithTx(
    params: FindOptionsWhere<TransferRequestProduct>,
    data: DeepPartial<TransferRequestProduct>,
    _: RequestUser,
    queryRunner: QueryRunner,
    transactionHooks?: Function[] | undefined,
  ): Promise<TransferRequestProduct[]> {
    await queryRunner.manager.update(TransferRequestProduct, params, {
      ...data,
    });

    const updatedPRs = await queryRunner.manager.find(TransferRequestProduct, {
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
}
