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
import { InternalTransfer } from '../../datasources/entity/pgsql/sales/InternalTransfer.entity';
import { DEFAULT_TIME_ZONE } from '../../libs/constants';
import { ERR_SALES_INTERNAL_TRANSFER_NOT_FOUND } from '../../libs/constants/errors';
import { RequestUser } from '../../libs/types/index.d';
import { BaseSQLDAO } from '../base.dao';

@Service()
export class InternalTransferDAO extends BaseSQLDAO<InternalTransfer> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(InternalTransfer);
  }

  async getOneStrict(params: FindOneOptions<InternalTransfer>): Promise<InternalTransfer> {
    try {
      const po = await this.repository.findOneOrFail(params);

      return po;
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw ERR_SALES_INTERNAL_TRANSFER_NOT_FOUND(error.message);
      }

      throw error;
    }
  }

  async upsertOne(
    user: RequestUser,
    item: DeepPartial<InternalTransfer>,
    opts?: {
      qr?: QueryRunner;
    },
  ): Promise<InternalTransfer> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);
    const upsertItem: DeepPartial<InternalTransfer> = {
      ...item,
      createdBy: user.id,
      createdDate: now,
      modifiedBy: user.id,
      modifiedDate: now,
    };

    const result = await this.repository
      .createQueryBuilder(undefined, opts && opts.qr)
      .insert()
      .into(InternalTransfer)
      .values(upsertItem)
      .orUpdate(
        [
          'ref_target_operation_unit_id',
          'ref_source_operation_unit_id',
          'status',
          'check_in_latitude',
          'check_in_longitude',
          'ref_driver_id',
          'modified_by',
          'modified_date',
          'check_in_distance',
          'remarks',
          'driver_remarks',
        ],
        ['id'],
      )
      .returning(['id'])
      .execute();

    return this.repository
      .createQueryBuilder(undefined, opts && opts.qr)
      .where('id = :id', { id: result.identifiers[0].id })
      .getOneOrFail();
  }

  // eslint-disable-next-line class-methods-use-this
  async updateOneWithTx(
    params: FindOptionsWhere<InternalTransfer>,
    data: Partial<InternalTransfer>,
    user: Partial<RequestUser>,
    queryRunner: QueryRunner,
  ) {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    await queryRunner.manager.update(InternalTransfer, params, {
      ...data,
      modifiedBy: user.id,
      modifiedDate: now,
    });

    const po = await queryRunner.manager.findOneOrFail(InternalTransfer, {
      where: {
        ...((params.id && {
          id: params.id,
        }) ||
          params),
      },
    });

    return po;
  }
}
