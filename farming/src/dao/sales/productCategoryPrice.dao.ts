/* eslint-disable class-methods-use-this */
import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import { DeepPartial, QueryRunner } from 'typeorm';
import { PostgreSQLConnection } from '../../datasources/connection/postgresql.connection';
import { ProductCategoryPrice } from '../../datasources/entity/pgsql/sales/ProductCategoryPrice.entity';
import { GetProductCategoryPricesQuery } from '../../dto/sales/productCategoryPrice.dto';
import { DEFAULT_TIME_ZONE } from '../../libs/constants';
import { RequestUser } from '../../libs/types/index.d';
import { randomHexString } from '../../libs/utils/helpers';
import { BaseSQLDAO } from '../base.dao';

@Service()
export class ProductCategoryPriceDAO extends BaseSQLDAO<ProductCategoryPrice> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(ProductCategoryPrice);
  }

  async createManyWithTx(
    data: DeepPartial<ProductCategoryPrice>[],
    user: Partial<RequestUser>,
    queryRunner: QueryRunner,
  ): Promise<ProductCategoryPrice[]> {
    if (data.length === 0) return [];

    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);
    const items = queryRunner.manager.create(
      ProductCategoryPrice,
      data.map<DeepPartial<ProductCategoryPrice>>((input) => ({
        ...input,
        id: randomHexString(),
        createdBy: user.id,
        createdDate: now,
        modifiedBy: user.id,
        modifiedDate: now,
      })),
    );

    const result = await queryRunner.manager.save(ProductCategoryPrice, items);

    return result;
  }

  async getSortedCities(filter: GetProductCategoryPricesQuery): Promise<[number[], number]> {
    const qb = await this.repository
      .createQueryBuilder('productCategoryPrice')
      .select([
        'productCategoryPrice.ref_city_id as ref_city_id',
        'max("productCategoryPrice".created_date) as createdDate',
      ]);

    if (filter.cityId) {
      qb.andWhere('productCategoryPrice.ref_city_id = :cityId', { cityId: filter.cityId });
    }

    if (filter.provinceId) {
      qb.andWhere('productCategoryPrice.ref_province_id = :provinceId', {
        provinceId: filter.provinceId,
      });
    }

    // group by
    qb.groupBy('productCategoryPrice.ref_city_id');

    // limit & page
    if (filter.$limit) {
      qb.take(filter.$limit || 10);
    }

    if (filter.$page) {
      qb.skip((filter.$page - 1) * (filter.$limit || 10));
    }

    const countSql = this.repository
      .createQueryBuilder('productCategoryPrice')
      .select('count(distinct ref_city_id)');

    const [results, countResult] = await Promise.all([qb.getRawMany(), countSql.getRawOne()]);

    return [results.map((result: any) => result.ref_city_id), parseInt(countResult.count, 10)];
  }
}
