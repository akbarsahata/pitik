/* eslint-disable class-methods-use-this */
import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import { FindOneOptions, FindOptionsWhere, QueryRunner } from 'typeorm';
import { PostgreSQLConnection } from '../../datasources/connection/postgresql.connection';
import { Vendor } from '../../datasources/entity/pgsql/sales/Vendor.entity';
import { DEFAULT_TIME_ZONE } from '../../libs/constants';
import { ERR_SALES_VENDOR_NOT_FOUND } from '../../libs/constants/errors';
import { RequestUser } from '../../libs/types/index.d';
import { randomHexString } from '../../libs/utils/helpers';
import { BaseSQLDAO } from '../base.dao';

@Service()
export class VendorDAO extends BaseSQLDAO<Vendor> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(Vendor);
  }

  async getOneStrict(params: FindOneOptions<Vendor>): Promise<Vendor> {
    try {
      const vendor = await this.repository.findOneOrFail(params);

      return vendor;
    } catch (error) {
      throw ERR_SALES_VENDOR_NOT_FOUND();
    }
  }

  async updateOneWithTx(
    params: FindOptionsWhere<Vendor>,
    data: Partial<Vendor>,
    user: Partial<RequestUser>,
    queryRunner: QueryRunner,
  ) {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    await queryRunner.manager.update(Vendor, params, {
      ...data,
      modifiedBy: user.id,
      modifiedDate: now,
    });

    const vendor = await queryRunner.manager.findOneOrFail(Vendor, {
      where: {
        ...((params.id && {
          id: params.id,
        }) ||
          params),
      },
    });

    return vendor;
  }

  async createOneWithTx(
    data: Partial<Vendor>,
    user: RequestUser,
    queryRunner: QueryRunner,
  ): Promise<Vendor> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);
    const item = queryRunner.manager.create(Vendor, {
      ...data,
      id: randomHexString(),
      createdBy: user.id,
      createdDate: now,
      modifiedBy: user.id,
      modifiedDate: now,
    });

    const vendor = await queryRunner.manager.save(Vendor, item);

    return vendor;
  }
}
