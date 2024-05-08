/* eslint-disable class-methods-use-this */
import { Initializer, Inject, Service } from 'fastify-decorators';
import { DeepPartial, FindOptionsWhere, QueryRunner } from 'typeorm';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { BranchCity } from '../datasources/entity/pgsql/BranchCity.entity';
import { ERR_BRANCH_CITY_UPSERT_FAILED } from '../libs/constants/errors';
import { BaseSQLDAO } from './base.dao';

@Service()
export class BranchCityDAO extends BaseSQLDAO<BranchCity> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(BranchCity);
  }

  async upsertMany(
    items: DeepPartial<BranchCity>[],
    opts?: {
      qr?: QueryRunner;
    },
  ): Promise<BranchCity[]> {
    if (items.length === 0) return [];

    const upsertItems = items.map<DeepPartial<BranchCity>>((item) => ({
      ...item,
      deletedDate: null,
    }));

    await this.repository
      .createQueryBuilder(undefined, opts && opts.qr)
      .insert()
      .into(BranchCity)
      .values(upsertItems)
      .orUpdate(['deleted_date'], ['id'])
      .execute();

    const [results, count] = await this.repository
      .createQueryBuilder(undefined, opts && opts.qr)
      .where('city_id IN (:...ids)', { ids: upsertItems.map((item) => item.cityId) })
      .getManyAndCount();

    if (count !== upsertItems.length) {
      throw ERR_BRANCH_CITY_UPSERT_FAILED('result count not match');
    }

    return results;
  }

  async softDeleteManyWithTx(
    where: FindOptionsWhere<BranchCity>,
    queryRunner: QueryRunner,
  ): Promise<BranchCity[]> {
    const toBeDeleted = await queryRunner.manager.find(BranchCity, { where });

    await queryRunner.manager.softDelete(BranchCity, where);

    return toBeDeleted;
  }
}
