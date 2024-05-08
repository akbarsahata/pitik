import { Initializer, Inject, Service } from 'fastify-decorators';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { City } from '../datasources/entity/pgsql/City.entity';
import { Province } from '../datasources/entity/pgsql/Province.entity';
import { ProductCategory } from '../datasources/entity/pgsql/sales/ProductCategory.entity';
import { ProductCategoryPrice } from '../datasources/entity/pgsql/sales/ProductCategoryPrice.entity';
import { User } from '../datasources/entity/pgsql/User.entity';
import { BaseSQLDAO } from './base.dao';

@Service()
export class CityDAO extends BaseSQLDAO<City> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(City);
  }

  async getSalesProductCategoryPrices(cityIds: number[]): Promise<City[]> {
    const sql = this.repository
      .createQueryBuilder('city')
      .select()
      .leftJoinAndMapMany(
        'city.salesProductCategoryPrices',
        ProductCategoryPrice,
        'spcp',
        'city.id = spcp.ref_city_id',
      )
      .leftJoinAndMapOne(
        'spcp.salesProductCategory',
        ProductCategory,
        'pc',
        'pc.id = spcp.ref_sales_product_category_id',
      )
      .leftJoinAndMapOne('spcp.userCreator', User, 'uc', 'uc.id = spcp.created_by')
      .leftJoinAndMapOne('spcp.userModifier', User, 'um', 'um.id = spcp.modified_by')
      .leftJoinAndMapOne('city.province', Province, 'p', 'p.id = city.ref_province_id')
      .distinctOn(['spcp.salesProductCategoryId', 'city.id'])
      .addOrderBy('spcp.salesProductCategoryId', 'DESC')
      .addOrderBy('city.id', 'DESC')
      .addOrderBy('spcp.createdDate', 'DESC')
      .where('city.id IN (:...cityIds)', { cityIds });

    const cities = await sql.getMany();

    return cities;
  }
}
