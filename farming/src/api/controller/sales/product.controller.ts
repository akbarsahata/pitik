import { FastifyRequest } from 'fastify';
import { Controller, GET, Inject } from 'fastify-decorators';
import {
  GetProductsQuery,
  getProductsQueryDTO,
  GetProductsResponse,
  getProductsResponseDTO,
} from '../../../dto/sales/product.dto';
import { ProductService } from '../../../services/sales/product.sales.service';
import { verifyAccess } from '../../hooks/onRequest/verifyAccess';

@Controller({
  route: '/sales/products',
  type: 0,
  tags: [{ name: 'sales-products' }],
})
export class ProductController {
  @Inject(ProductService)
  private service: ProductService;

  @GET({
    url: '/',
    options: {
      schema: {
        querystring: getProductsQueryDTO,
        response: {
          200: getProductsResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async products(
    req: FastifyRequest<{
      Querystring: GetProductsQuery;
    }>,
  ): Promise<GetProductsResponse> {
    const [products, count] = await this.service.products(req);

    return {
      code: 200,
      count,
      data: products,
    };
  }
}
