/* eslint-disable class-methods-use-this */
import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import { DeepPartial, FindOneOptions, FindOptionsWhere, QueryRunner } from 'typeorm';
import { PostgreSQLConnection } from '../../datasources/connection/postgresql.connection';
import { StockDisposal } from '../../datasources/entity/pgsql/sales/StockDisposal.entity';
import { DEFAULT_TIME_ZONE } from '../../libs/constants';
import { ERR_SALES_STOCK_DISPOSAL_NOT_FOUND } from '../../libs/constants/errors';
import { RequestUser } from '../../libs/types/index.d';
import { randomHexString } from '../../libs/utils/helpers';
import { BaseSQLDAO } from '../base.dao';

@Service()
export class StockDisposalDAO extends BaseSQLDAO<StockDisposal> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(StockDisposal);
  }

  async getOneStrict(params: FindOneOptions<StockDisposal>): Promise<StockDisposal> {
    try {
      const stockDisposal = await this.repository.findOneOrFail(params);

      return stockDisposal;
    } catch (error) {
      throw ERR_SALES_STOCK_DISPOSAL_NOT_FOUND();
    }
  }

  async updateOneWithTx(
    params: FindOptionsWhere<StockDisposal>,
    data: Partial<StockDisposal>,
    user: Partial<RequestUser>,
    queryRunner: QueryRunner,
  ) {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    await queryRunner.manager.update(StockDisposal, params, {
      ...data,
      modifiedBy: user.id,
      modifiedDate: now,
    });

    const manufacture = await queryRunner.manager.findOneOrFail(StockDisposal, {
      where: {
        ...((params.id && {
          id: params.id,
        }) ||
          params),
      },
    });

    return manufacture;
  }

  async createOneWithTx(
    data: Partial<StockDisposal>,
    user: RequestUser,
    queryRunner: QueryRunner,
  ): Promise<StockDisposal> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);
    const item = queryRunner.manager.create(StockDisposal, {
      ...data,
      id: randomHexString(),
      createdBy: user.id,
      createdDate: now,
      modifiedBy: user.id,
      modifiedDate: now,
    });

    const manufacture = await queryRunner.manager.save(StockDisposal, item);

    return manufacture;
  }

  async upsertOne(
    user: RequestUser,
    item: DeepPartial<StockDisposal>,
    opts?: {
      qr?: QueryRunner;
    },
  ): Promise<StockDisposal> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);
    const upsertItem: DeepPartial<StockDisposal> = {
      ...item,
      createdBy: user.id,
      createdDate: now,
      modifiedBy: user.id,
      modifiedDate: now,
    };

    const result = await this.repository
      .createQueryBuilder(undefined, opts && opts.qr)
      .insert()
      .into(StockDisposal)
      .values(upsertItem)
      .orUpdate(['status', 'image_link', 'modified_by', 'modified_date'], ['id'])
      .returning(['id'])
      .execute();

    return this.repository
      .createQueryBuilder(undefined, opts && opts.qr)
      .where('id = :id', { id: result.identifiers[0].id })
      .getOneOrFail();
  }
}
