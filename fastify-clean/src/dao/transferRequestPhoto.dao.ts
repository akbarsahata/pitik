import { Initializer, Inject, Service } from 'fastify-decorators';
import {
  DeepPartial,
  EntityNotFoundError,
  FindOneOptions,
  FindOptionsWhere,
  QueryRunner,
} from 'typeorm';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { TransferRequestPhoto } from '../datasources/entity/pgsql/TransferRequestPhoto.entity';
import { ERR_TRANSFER_REQUEST_PHOTO_NOT_FOUND } from '../libs/constants/errors';
import { RequestUser } from '../libs/types/index.d';
import { randomHexString } from '../libs/utils/helpers';
import { BaseSQLDAO } from './base.dao';

@Service()
export class TransferRequestPhotoDAO extends BaseSQLDAO<TransferRequestPhoto> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(TransferRequestPhoto);
  }

  // eslint-disable-next-line class-methods-use-this
  async createManyWithTx(
    data: DeepPartial<TransferRequestPhoto>[],
    _user: RequestUser,
    queryRunner: QueryRunner,
  ): Promise<TransferRequestPhoto[]> {
    const items = data.map((d) =>
      queryRunner.manager.create(TransferRequestPhoto, {
        ...d,
        id: randomHexString(),
      }),
    );

    const result = await queryRunner.manager.save(TransferRequestPhoto, items);

    return result;
  }

  // eslint-disable-next-line class-methods-use-this
  async updateOneWithTx(
    params: FindOptionsWhere<TransferRequestPhoto>,
    data: DeepPartial<TransferRequestPhoto>,
    _user: RequestUser,
    queryRunner: QueryRunner,
    transactionHooks?: Function[],
  ): Promise<TransferRequestPhoto> {
    await queryRunner.manager.update(TransferRequestPhoto, params, {
      ...data,
    });

    const result = await queryRunner.manager.findOneOrFail(TransferRequestPhoto, {
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

  async getOneStrict(params: FindOneOptions<TransferRequestPhoto>): Promise<TransferRequestPhoto> {
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
    params: FindOptionsWhere<TransferRequestPhoto>,
    data: DeepPartial<TransferRequestPhoto>[],
    _user: RequestUser,
    queryRunner: QueryRunner,
  ): Promise<TransferRequestPhoto[]> {
    data.map((d) => {
      if (d.id || d.id === '') {
        return queryRunner.manager.update(TransferRequestPhoto, d.id, d);
      }

      const item = queryRunner.manager.create(TransferRequestPhoto, {
        ...d,
        id: randomHexString(),
      });

      return queryRunner.manager.save(TransferRequestPhoto, item);
    });

    const result = await queryRunner.manager.find(TransferRequestPhoto, {
      where: {
        transferRequestId: params.transferRequestId,
      },
    });

    return result;
  }
}
