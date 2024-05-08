import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, GET, Inject, POST } from 'fastify-decorators';
import {
  InternalUpsertProductBody,
  internalUpsertProductBodyDTO,
  InternalUpsertProductResponse,
  internalUpsertProductResponseDTO,
  mapProductResponse,
  SearchProductQuery,
  searchProductQueryDTO,
  SearchProductResponse,
  searchProductResponseDTO,
} from '../../dto/product.dto';
import { ProductService } from '../../services/product.service';
import { verifyAccess } from '../hooks/onRequest/verifyAccess';

@Controller({
  route: '/',
  type: 0,
  tags: [{ name: 'products' }],
})
export class ProductController {
  @Inject(ProductService)
  private service: ProductService;

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
    await this.service.internalUpsert(req.body);

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
  async search(
    req: FastifyRequest<{
      Querystring: SearchProductQuery;
    }>,
  ): Promise<SearchProductResponse> {
    const [products, count] = await this.service.search(req.query);
    return {
      code: 200,
      count,
      data: products.map((product) => mapProductResponse(product)),
    };
  }

  @POST({
    url: '/products/reindex',
    // options: {
    //   onRequest: verifyAccess,
    // },
  })
  async reindexProducts(_: FastifyRequest, res: FastifyReply) {
    await this.service.reindex();

    res.code(204).send();
  }
}
