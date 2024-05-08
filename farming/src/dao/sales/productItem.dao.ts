import { Initializer, Inject, Service } from 'fastify-decorators';
import { In } from 'typeorm';
import { PostgreSQLConnection } from '../../datasources/connection/postgresql.connection';
import { ProductItem } from '../../datasources/entity/pgsql/sales/ProductItem.entity';
import { BaseSQLDAO } from '../base.dao';

type ValidateQuantityAndWeightInputItem = {
  productItemId: string;
  quantity?: number;
  weight?: number;
};

@Service()
export class ProductItemDAO extends BaseSQLDAO<ProductItem> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(ProductItem);
  }

  async validateQuantityAndWeight(items: ValidateQuantityAndWeightInputItem[]): Promise<void> {
    const mapItems = items.reduce((prev, item) => {
      prev.set(item.productItemId, item);
      return prev;
    }, new Map<string, ValidateQuantityAndWeightInputItem>());

    const [products] = await this.getMany({
      where: {
        id: In(Array.from(mapItems.keys())),
      },
      relations: {
        category: true,
      },
    });

    products.forEach((product) => {
      if (
        product.category.quantityUOM !== null &&
        typeof mapItems.get(product.id)!.quantity !== 'number'
      ) {
        throw new Error(`${product.category.name} quantity is required!`);
      } else if (
        product.category.weightUOM !== null &&
        typeof mapItems.get(product.id)!.weight !== 'number'
      ) {
        throw new Error(`${product.category.name} weight is required!`);
      }
    });
  }
}
