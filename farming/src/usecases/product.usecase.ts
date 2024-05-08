import { Inject, Service } from 'fastify-decorators';
import {
  InternalUpsertProductBody,
  InternalUpsertProductItem,
  SearchProductQuery,
} from '../dto/product.dto';
import { ProductService } from '../services/farming/product.service';

@Service()
export class ProductUseCase {
  @Inject(ProductService)
  private productService: ProductService;

  async internalUpsert(input: InternalUpsertProductBody) {
    return this.productService.internalUpsert(input);
  }

  async searchProducts(filter: SearchProductQuery): Promise<[InternalUpsertProductItem[], number]> {
    return this.productService.search(filter);
  }

  async reindexProducts() {
    await this.productService.reindex();
  }
}
