import { FastifyRequest } from 'fastify';
import { Controller, GET, Inject } from 'fastify-decorators';
import {
  GetProductCategiriesResponse,
  GetProductCategoriesQuery,
  getProductCategoriesQueryDTO,
  getProductCategoriesResponseDTO,
  GetSalesManufactureOutputParams,
  getSalesManufactureOutputParamsDTO,
  GetSalesManufactureOutputResponse,
  getSalesManufactureOutputResponseDTO,
} from '../../../dto/sales/productCategory.dto';
import { ProductCategoryService } from '../../../services/sales/productCategory.sales.service';

@Controller({
  route: '/sales/product-categories',
  type: 0,
  tags: [{ name: 'sales-product-categories' }],
})
export class ProductCategoryController {
  @Inject(ProductCategoryService)
  private service: ProductCategoryService;

  @GET({
    url: '/',
    options: {
      schema: {
        querystring: getProductCategoriesQueryDTO,
        response: {
          200: getProductCategoriesResponseDTO,
        },
      },
    },
  })
  async categories(
    req: FastifyRequest<{
      Querystring: GetProductCategoriesQuery;
    }>,
  ): Promise<GetProductCategiriesResponse> {
    const [categories, count] = await this.service.categories(req);

    return {
      code: 200,
      count,
      data: categories,
    };
  }

  @GET({
    url: '/:productCategoryId/manufacture-output',
    options: {
      schema: {
        params: getSalesManufactureOutputParamsDTO,
        response: {
          200: getSalesManufactureOutputResponseDTO,
        },
      },
    },
  })
  async getManufactureOutput(
    req: FastifyRequest<{
      Params: GetSalesManufactureOutputParams;
    }>,
  ): Promise<GetSalesManufactureOutputResponse> {
    const data = await this.service.getManufactureOutput(req.params.productCategoryId);

    return {
      code: 200,
      data,
    };
  }
}
