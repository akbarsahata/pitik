/* eslint-disable class-methods-use-this */
import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import { DeepPartial, FindOneOptions, FindOptionsWhere, QueryRunner } from 'typeorm';
import { PostgreSQLConnection } from '../../datasources/connection/postgresql.connection';
import { Manufacture } from '../../datasources/entity/pgsql/sales/Manufacture.entity';
import { DEFAULT_TIME_ZONE } from '../../libs/constants';
import { ERR_SALES_MANUFACTURE_NOT_FOUND } from '../../libs/constants/errors';
import { RequestUser } from '../../libs/types/index.d';
import { BaseSQLDAO } from '../base.dao';

@Service()
export class ManufactureDAO extends BaseSQLDAO<Manufacture> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(Manufacture);
  }

  async getOneStrict(params: FindOneOptions<Manufacture>): Promise<Manufacture> {
    try {
      const manufacture = await this.repository.findOneOrFail(params);

      return manufacture;
    } catch (error) {
      throw ERR_SALES_MANUFACTURE_NOT_FOUND();
    }
  }

  async updateOneWithTx(
    params: FindOptionsWhere<Manufacture>,
    data: Partial<Manufacture>,
    user: Partial<RequestUser>,
    queryRunner: QueryRunner,
  ) {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    await queryRunner.manager.update(Manufacture, params, {
      ...data,
      modifiedBy: user.id,
      modifiedDate: now,
    });

    const manufacture = await queryRunner.manager.findOneOrFail(Manufacture, {
      where: {
        ...((params.id && {
          id: params.id,
        }) ||
          params),
      },
    });

    return manufacture;
  }

  // eslint-disable-next-line class-methods-use-this
  async upsertOne(
    user: RequestUser,
    item: DeepPartial<Manufacture>,
    opts?: {
      qr?: QueryRunner;
    },
  ): Promise<Manufacture> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);
    const upsertItem: DeepPartial<Manufacture> = {
      ...item,
      createdBy: user.id,
      createdDate: now,
      modifiedBy: user.id,
      modifiedDate: now,
    };

    const result = await this.repository
      .createQueryBuilder(undefined, opts && opts.qr)
      .insert()
      .into(Manufacture)
      .values(upsertItem)
      .orUpdate(['status', 'modified_by', 'modified_date'], ['id'])
      .returning(['id'])
      .execute();

    return this.repository
      .createQueryBuilder(undefined, opts && opts.qr)
      .where('id = :id', { id: result.identifiers[0].id })
      .getOneOrFail();
  }
}
