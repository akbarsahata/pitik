import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, GET, Inject, POST } from 'fastify-decorators';
import {
  InternalUpsertProductBody,
  internalUpsertProductBodyDTO,
  InternalUpsertProductResponse,
  internalUpsertProductResponseDTO,
  SearchProductQuery,
  searchProductQueryDTO,
  SearchProductResponse,
  searchProductResponseDTO,
} from '../../dto/product.dto';
import { ProductUseCase } from '../../usecases/product.usecase';
import { verifyAccess } from '../hooks/onRequest/verifyAccess';

@Controller({
  route: '/',
  type: 0,
  tags: [{ name: 'products' }],
})
export class ProductController {
  @Inject(ProductUseCase)
  private usecase!: ProductUseCase;

  @POST({
    url: '/internal/products',
    options: {
      schema: {
        tags: ['internal'],
        body: internalUpsertProductBodyDTO,
        response: {
          200: internalUpsertProductResponseDTO,
        },
      },
    },
  })
  async internalUpsertProduct(
    req: FastifyRequest<{
      Body: InternalUpsertProductBody;
    }>,
  ): Promise<InternalUpsertProductResponse> {
    await this.usecase.internalUpsert(req.body);

    return {
      code: 200,
    };
  }

  @GET({
    url: '/products/search',
    options: {
      schema: {
        querystring: searchProductQueryDTO,
        response: {
          200: searchProductResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async searchProducts(
    req: FastifyRequest<{
      Querystring: SearchProductQuery;
    }>,
  ): Promise<SearchProductResponse> {
    const [products, count] = await this.usecase.searchProducts(req.query);

    return {
      code: 200,
      count,
      data: products,
    };
  }

  @POST({
    url: '/products/reindex',
    options: {
      onRequest: verifyAccess,
    },
  })
  async reindexProducts(_: FastifyRequest, res: FastifyReply) {
    await this.usecase.reindexProducts();

    res.code(204).send();
  }
}
