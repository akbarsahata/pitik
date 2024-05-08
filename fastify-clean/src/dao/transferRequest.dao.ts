import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import {
  DeepPartial,
  EntityNotFoundError,
  FindOneOptions,
  FindOptionsWhere,
  QueryRunner,
} from 'typeorm';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { GoodsReceipt } from '../datasources/entity/pgsql/GoodsReceipt.entity';
import { GoodsReceiptProduct } from '../datasources/entity/pgsql/GoodsReceiptProduct.entity';
import { TransferRequest } from '../datasources/entity/pgsql/TransferRequest.entity';
import { DEFAULT_TIME_ZONE } from '../libs/constants';
import { ERR_TRANSFER_REQUEST_NOT_FOUND } from '../libs/constants/errors';
import { RequestUser } from '../libs/types/index.d';
import { randomHexString } from '../libs/utils/helpers';
import { BaseSQLDAO } from './base.dao';

@Service()
export class TransferRequestDAO extends BaseSQLDAO<TransferRequest> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(TransferRequest);
  }

  // eslint-disable-next-line class-methods-use-this
  async createOneWithTx(
    data: DeepPartial<TransferRequest>,
    user: RequestUser,
    queryRunner: QueryRunner,
    transactionHooks?: Function[],
  ): Promise<TransferRequest> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const item = queryRunner.manager.create(TransferRequest, {
      ...data,
      id: randomHexString(),
      createdBy: user.id,
      createdDate: now,
      modifiedBy: user.id,
      modifiedDate: now,
    });

    const result = await queryRunner.manager.save(TransferRequest, item);

    transactionHooks?.reduce(async (prev, trxHook) => {
      await prev;

      return trxHook(item, queryRunner);
    }, Promise.resolve());

    return result;
  }

  // eslint-disable-next-line class-methods-use-this
  async updateOneWithTx(
    params: FindOptionsWhere<TransferRequest>,
    data: DeepPartial<TransferRequest>,
    user: RequestUser,
    queryRunner: QueryRunner,
    transactionHooks?: Function[],
  ): Promise<TransferRequest> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    await queryRunner.manager.update(TransferRequest, params, {
      ...data,
      modifiedBy: user.id,
      modifiedDate: now,
    });

    const result = await queryRunner.manager.findOneOrFail(TransferRequest, {
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

  async getOneStrict(params: FindOneOptions<TransferRequest>): Promise<TransferRequest> {
    try {
      const transferReq = await this.repository.findOneOrFail(params);

      return transferReq;
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw ERR_TRANSFER_REQUEST_NOT_FOUND(error.message);
      }

      throw error;
    }
  }

  async updateOne(
    params: FindOptionsWhere<TransferRequest>,
    data: DeepPartial<TransferRequest>,
    user: RequestUser,
  ): Promise<TransferRequest> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const result = await this.repository.update(params, {
      ...data,
      modifiedBy: user.id,
      modifiedDate: now,
    });

    if (!result.affected) {
      throw ERR_TRANSFER_REQUEST_NOT_FOUND();
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

  async totalQuantity(
    farmingCycleId: string,
    opts?: {
      isApproved?: boolean;
      isDelivered?: boolean;
      isCancelled?: boolean;
      plannedUntil?: string;
      deliveredUntil?: string;
      deliveredFrom?: string;
      deliveredAt?: string;
      source?: 'tr' | 'gr';
    },
  ): Promise<number> {
    const sql = this.repository
      .createQueryBuilder('tr')
      .select(['SUM(tr.quantity) as total'])
      .where('tr.farmingcycle_id = :farmingCycleId', {
        farmingCycleId,
      });

    if (opts?.isApproved !== undefined) {
      sql.andWhere('tr.is_approved = :isApproved', {
        isApproved: opts.isApproved,
      });
    }

    // override source of sum
    if (opts?.source === 'gr') {
      sql.select(['SUM(grp.quantity) as total']);
    }

    if (opts?.isDelivered === true) {
      sql.innerJoin(GoodsReceipt, 'gr', 'gr.transferrequest_id = tr.id');
      sql.innerJoin(GoodsReceiptProduct, 'grp', 'grp.goodsreceipt_id = gr.id');
      if (opts?.deliveredUntil) {
        sql.andWhere('gr.received_date::date <= :deliveredUntil', {
          deliveredUntil: opts.deliveredUntil,
        });
      }
      if (opts?.deliveredFrom) {
        sql.andWhere('gr.received_date::date >= :deliveredFrom', {
          deliveredFrom: opts.deliveredFrom,
        });
      }
      if (opts?.deliveredAt) {
        sql.andWhere('gr.received_date::date = :deliveredAt', {
          deliveredAt: opts.deliveredAt,
        });
      }
    } else if (opts?.isDelivered === false) {
      sql.leftJoin(GoodsReceipt, 'gr', 'gr.transferrequest_id = tr.id');
      sql.andWhere('gr.id is NULL');
    }

    if (opts?.isCancelled === true) {
      sql.andWhere('tr.cancellation_request_by IS NOT NULL');
    } else if (opts?.isCancelled === false) {
      sql.andWhere('tr.cancellation_request_by IS NULL');
    }

    if (opts?.plannedUntil) {
      sql.andWhere('tr.date_planned::date <= :plannedUntil', {
        plannedUntil: opts.plannedUntil,
      });
    }

    const result = await sql.getRawOne();
    return result.total;
  }

  async rejectCancellationRequest(id: string, remarks: string) {
    await this.repository
      .createQueryBuilder()
      .where('id = :id', {
        id,
      })
      .update({
        cancellationRequestBy: null,
        remarks,
      })
      .execute();
  }
}
