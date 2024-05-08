import { Inject, Service } from 'fastify-decorators';
import { ProductItemDAO } from '../../dao/sales/productItem.dao';
import { ProductItem } from '../../datasources/entity/pgsql/sales/ProductItem.entity';
import { GetProductsQuery } from '../../dto/sales/product.dto';

@Service()
export class ProductService {
  @Inject(ProductItemDAO)
  private dao: ProductItemDAO;

  async products(opts: { query: GetProductsQuery }): Promise<[ProductItem[], number]> {
    const result = await this.dao.getMany({
      where: {
        ...opts.query,
      },
      relations: {
        category: true,
      },
      order: {
        minValue: 'ASC',
      },
    });

    return result;
  }
}
