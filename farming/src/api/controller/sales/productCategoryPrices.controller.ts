import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, GET, Inject, POST, PUT } from 'fastify-decorators';
import {
  CreateProductCategoryPriceBody,
  createProductCategoryPriceBodyDTO,
  CreateProductCategoryPriceResponse,
  createProductCategoryPriceResponseDTO,
  GetProductCategoryPriceByIdParams,
  getProductCategoryPriceByIdParamsDTO,
  GetProductCategoryPriceByIdResponse,
  getProductCategoryPriceByIdResponseDTO,
  GetProductCategoryPricesQuery,
  getProductCategoryPricesQueryDTO,
  GetProductCategoryPricesResponse,
  getProductCategoryPricesResponseDTO,
  UpdateProductCategoryPriceBody,
  updateProductCategoryPriceBodyDTO,
  UpdateProductCategoryPriceResponse,
  updateProductCategoryPriceResponseDTO,
} from '../../../dto/sales/productCategoryPrice.dto';
import { ProductCategoryPriceService } from '../../../services/sales/productCategoryPrice.service';
import { verifyAccess } from '../../hooks/onRequest/verifyAccess';

@Controller({
  route: '/sales/product-categories/prices',
  type: 0,
  tags: [{ name: 'sales-product-categories-price' }],
})
export class ProductCategoryPriceController {
  @Inject(ProductCategoryPriceService)
  private service: ProductCategoryPriceService;

  @GET({
    url: '/',
    options: {
      schema: {
        querystring: getProductCategoryPricesQueryDTO,
        response: {
          200: getProductCategoryPricesResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async getMany(
    req: FastifyRequest<{
      Querystring: GetProductCategoryPricesQuery;
    }>,
  ): Promise<GetProductCategoryPricesResponse> {
    const [data, count] = await this.service.get(req.query);

    return {
      code: 200,
      count,
      data,
    };
  }

  @GET({
    url: '/:cityId',
    options: {
      schema: {
        params: getProductCategoryPriceByIdParamsDTO,
        response: {
          200: getProductCategoryPriceByIdResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async getById(
    req: FastifyRequest<{
      Params: GetProductCategoryPriceByIdParams;
    }>,
  ): Promise<GetProductCategoryPriceByIdResponse> {
    const data = await this.service.getByCityId(req.params.cityId);

    return {
      code: 200,
      data,
    };
  }

  @POST({
    url: '/',
    options: {
      schema: {
        body: createProductCategoryPriceBodyDTO,
        response: {
          201: createProductCategoryPriceResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async create(
    req: FastifyRequest<{
      Body: CreateProductCategoryPriceBody;
    }>,
    rep: FastifyReply,
  ): Promise<CreateProductCategoryPriceResponse> {
    const data = await this.service.create(req.body, req.user);

    rep.code(201);

    return {
      code: 201,
      data,
    };
  }

  @PUT({
    url: '/:cityId',
    options: {
      schema: {
        params: getProductCategoryPriceByIdParamsDTO,
        body: updateProductCategoryPriceBodyDTO,
        response: {
          200: updateProductCategoryPriceResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async update(
    req: FastifyRequest<{
      Params: GetProductCategoryPriceByIdParams;
      Body: UpdateProductCategoryPriceBody;
    }>,
  ): Promise<UpdateProductCategoryPriceResponse> {
    const data = await this.service.update(req.user, req.body, req.params.cityId);

    return {
      code: 200,
      data,
    };
  }
}
