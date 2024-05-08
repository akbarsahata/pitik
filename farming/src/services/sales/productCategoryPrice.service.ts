/* eslint-disable class-methods-use-this */
import { Inject, Service } from 'fastify-decorators';
import { CityDAO } from '../../dao/city.dao';
import { ProductCategoryPriceDAO } from '../../dao/sales/productCategoryPrice.dao';
import { City } from '../../datasources/entity/pgsql/City.entity';
import {
  CreateProductCategoryPriceBody,
  GetProductCategoryPriceByIdResponseItem,
  GetProductCategoryPricesQuery,
  UpdateProductCategoryPriceBody,
} from '../../dto/sales/productCategoryPrice.dto';
import { ERR_SALES_PRICE_IN_CITY_NOT_FOUND } from '../../libs/constants/errors';
import { RequestUser } from '../../libs/types/index.d';

@Service()
export class ProductCategoryPriceService {
  @Inject(ProductCategoryPriceDAO)
  private dao: ProductCategoryPriceDAO;

  @Inject(CityDAO)
  private cityDAO: CityDAO;

  async get(
    filter: GetProductCategoryPricesQuery,
  ): Promise<[GetProductCategoryPriceByIdResponseItem[], number]> {
    const [sortedCities, count] = await this.dao.getSortedCities(filter);

    const cities = await this.cityDAO.getSalesProductCategoryPrices(sortedCities);

    return [cities.map((city) => this.mapProductCategoryPriceEntityToDTO(city)), count];
  }

  async getByCityId(cityId: number): Promise<GetProductCategoryPriceByIdResponseItem> {
    // NOTE: Reusing the function to avoid repetitiveness
    const result = await this.cityDAO.getSalesProductCategoryPrices([cityId]);
    if (!result.length) {
      throw ERR_SALES_PRICE_IN_CITY_NOT_FOUND();
    }

    return this.mapProductCategoryPriceEntityToDTO(result[0]);
  }

  async create(
    input: CreateProductCategoryPriceBody,
    user: RequestUser,
  ): Promise<GetProductCategoryPriceByIdResponseItem> {
    const qr = await this.dao.startTransaction();

    try {
      await this.dao.createManyWithTx(
        input.products.map((product) => ({
          ...product,
          provinceId: input.provinceId,
          cityId: input.cityId,
          salesProductCategoryId: product.productCategoryId,
        })),
        user,
        qr,
      );

      await this.dao.commitTransaction(qr);

      const result = await this.cityDAO.getSalesProductCategoryPrices([input.cityId]);
      return this.mapProductCategoryPriceEntityToDTO(result[0]);
    } catch (error) {
      await this.dao.rollbackTransaction(qr);
      throw error;
    }
  }

  async update(
    user: RequestUser,
    input: UpdateProductCategoryPriceBody,
    cityId: number,
  ): Promise<any> {
    const current = await this.cityDAO.getSalesProductCategoryPrices([cityId]);
    if (!current.length) {
      throw ERR_SALES_PRICE_IN_CITY_NOT_FOUND();
    }

    const qr = await this.dao.startTransaction();

    try {
      await this.dao.createManyWithTx(
        input.products.map((product) => ({
          ...product,
          provinceId: input.provinceId,
          cityId: input.cityId,
          salesProductCategoryId: product.productCategoryId,
        })),
        user,
        qr,
      );

      await this.dao.commitTransaction(qr);

      const result = await this.cityDAO.getSalesProductCategoryPrices([input.cityId]);
      return this.mapProductCategoryPriceEntityToDTO(result[0]);
    } catch (error) {
      await this.dao.rollbackTransaction(qr);
      throw error;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  private mapProductCategoryPriceEntityToDTO(data: City): GetProductCategoryPriceByIdResponseItem {
    return {
      ...data,
      province: {
        ...data.province,
        name: data.province.provinceName,
      },
      city: {
        id: data.id,
        name: data.cityName,
      },
      products: data.salesProductCategoryPrices.map((product) => ({
        id: product.salesProductCategory.id,
        name: product.salesProductCategory.name,
        price: product.price,
      })),
      createdDate: data.salesProductCategoryPrices[0].createdDate.toISOString(),
      modifiedDate: data.salesProductCategoryPrices[0].modifiedDate.toISOString(),
      createdBy: data.salesProductCategoryPrices[0].userCreator?.fullName,
      modifiedBy: data.salesProductCategoryPrices[0].userModifier?.fullName,
    };
  }
}
