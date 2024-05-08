import { Initializer, Inject, Service } from 'fastify-decorators';
import { FindOneOptions, In } from 'typeorm';
import { PostgreSQLConnection } from '../../datasources/connection/postgresql.connection';
import {
  ProductCategory,
  ProductCategoryCodeEnum,
} from '../../datasources/entity/pgsql/sales/ProductCategory.entity';
import { BaseSQLDAO } from '../base.dao';

type ValidateQuantityAndWeightInputItem = {
  productItemId: string;
  quantity?: number;
  weight?: number;
};

@Service()
export class ProductCategoryDAO extends BaseSQLDAO<ProductCategory> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(ProductCategory);
  }

  async validateQuantityAndWeight(items: ValidateQuantityAndWeightInputItem[]): Promise<void> {
    const mapItems = items.reduce((prev, item) => {
      prev.set(item.productItemId, item);
      return prev;
    }, new Map<string, ValidateQuantityAndWeightInputItem>());

    const [productCategories] = await this.getMany({
      where: {
        id: In(Array.from(mapItems.keys())),
      },
    });

    productCategories.forEach((productCategory) => {
      if (productCategory.weightUOM !== null && !mapItems.get(productCategory.id)!.weight) {
        throw new Error(`${productCategory.name} weight is required!`);
      }

      if (
        productCategory.code === ProductCategoryCodeEnum.LIVE_BIRD ||
        productCategory.code === ProductCategoryCodeEnum.AYAM_UTUH ||
        productCategory.code === ProductCategoryCodeEnum.BRANKAS
      ) {
        if (productCategory.quantityUOM !== null && !mapItems.get(productCategory.id)!.quantity) {
          throw new Error(`${productCategory.name} quantity is required!`);
        }
      }
    });
  }

  async getOneStrict(params: FindOneOptions<ProductCategory>): Promise<ProductCategory> {
    try {
      const operation = await this.repository.findOneOrFail(params);

      return operation;
    } catch (error) {
      throw NaN;
    }
  }
}
