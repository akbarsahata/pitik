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
import { SalesOrder } from '../../datasources/entity/pgsql/sales/SalesOrder.entity';
import { DEFAULT_TIME_ZONE } from '../../libs/constants';
import { ERR_SALES_ORDER_NOT_FOUND } from '../../libs/constants/errors';
import { RequestUser } from '../../libs/types/index.d';
import { BaseSQLDAO } from '../base.dao';

@Service()
export class SalesOrderDAO extends BaseSQLDAO<SalesOrder> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(SalesOrder);
  }

  async getOneStrict(params: FindOneOptions<SalesOrder>): Promise<SalesOrder> {
    try {
      const po = await this.repository.findOneOrFail(params);

      return po;
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw ERR_SALES_ORDER_NOT_FOUND(error.message);
      }

      throw error;
    }
  }

  async upsertOne(
    item: DeepPartial<SalesOrder>,
    user: RequestUser,
    queryRunner?: QueryRunner,
  ): Promise<SalesOrder> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);
    const upsertItem: DeepPartial<SalesOrder> = {
      ...item,
      createdBy: user.id,
      createdDate: now,
      modifiedBy: user.id,
      modifiedDate: now,
    };

    const result = await this.repository
      .createQueryBuilder(undefined, queryRunner)
      .insert()
      .into(SalesOrder)
      .values(upsertItem)
      .orUpdate(
        [
          'ref_customer_id',
          'ref_driver_id',
          'ref_operation_unit_id',
          'status',
          'gr_status',
          'return_status',
          'total_weight',
          'total_quantity',
          'total_price',
          'payment_method',
          'payment_amount',
          'return_reason',
          'modified_date',
          'modified_by',
          'latitude',
          'longitude',
          'check_in_distance',
          'remarks',
          'driver_remarks',
          'delivery_time',
          'delivery_fee',
        ],
        ['id'],
      )
      .returning(['id'])
      .execute();

    const salesOrder = await this.repository
      .createQueryBuilder(undefined, queryRunner)
      .where('id = :id', { id: result.identifiers[0].id })
      .getOneOrFail();

    return salesOrder;
  }

  // eslint-disable-next-line class-methods-use-this
  async updateOneWithTx(
    params: FindOptionsWhere<SalesOrder>,
    data: Partial<SalesOrder>,
    user: Partial<RequestUser>,
    queryRunner: QueryRunner,
  ) {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    await queryRunner.manager.update(SalesOrder, params, {
      ...data,
      modifiedBy: user.id,
      modifiedDate: now,
    });

    const po = await queryRunner.manager.findOneOrFail(SalesOrder, {
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
