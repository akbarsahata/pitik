/* eslint-disable class-methods-use-this */
import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import { DeepPartial, FindOneOptions, FindOptionsWhere, QueryRunner } from 'typeorm';
import { PostgreSQLConnection } from '../../datasources/connection/postgresql.connection';
import { StockOpname } from '../../datasources/entity/pgsql/sales/StockOpname.entity';
import { DEFAULT_TIME_ZONE } from '../../libs/constants';
import { ERR_SALES_STOCK_OPNAME_NOT_FOUND } from '../../libs/constants/errors';
import { RequestUser } from '../../libs/types/index.d';
import { BaseSQLDAO } from '../base.dao';

@Service()
export class StockOpnameDAO extends BaseSQLDAO<StockOpname> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(StockOpname);
  }

  async getOneStrict(params: FindOneOptions<StockOpname>): Promise<StockOpname> {
    try {
      const stockOpname = await this.repository.findOneOrFail(params);

      return stockOpname;
    } catch (error) {
      throw ERR_SALES_STOCK_OPNAME_NOT_FOUND();
    }
  }

  async updateOneWithTx(
    params: FindOptionsWhere<StockOpname>,
    data: Partial<StockOpname>,
    user: Partial<RequestUser>,
    queryRunner: QueryRunner,
  ) {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    await queryRunner.manager.update(StockOpname, params, {
      ...data,
      modifiedBy: user.id,
      modifiedDate: now,
    });

    const opname = await queryRunner.manager.findOneOrFail(StockOpname, {
      where: {
        ...((params.id && {
          id: params.id,
        }) ||
          params),
      },
    });

    return opname;
  }

  async upsertOne(
    item: DeepPartial<StockOpname>,
    user: RequestUser,
    queryRunner?: QueryRunner,
  ): Promise<StockOpname> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);
    const upsertItem: DeepPartial<StockOpname> = {
      ...item,
      createdBy: user.id,
      createdDate: now,
      modifiedBy: user.id,
      modifiedDate: now,
    };

    const result = await this.repository
      .createQueryBuilder(undefined, queryRunner)
      .insert()
      .into(StockOpname)
      .values(upsertItem)
      .orUpdate(
        [
          'status',
          'confirmed_date',
          'ref_sales_operation_unit_id',
          'modified_by',
          'modified_date',
          'total_weight',
        ],
        ['id'],
      )
      .returning(['id'])
      .execute();

    const created = await this.repository
      .createQueryBuilder(undefined, queryRunner)
      .where('id = :id', { id: result.identifiers[0].id })
      .getOneOrFail();

    return created;
  }
}
