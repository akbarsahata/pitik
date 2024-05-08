import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, GET, Inject, POST, PUT } from 'fastify-decorators';
import {
  CreateSalesCustomersBody,
  createSalesCustomersBodyDTO,
  CreateSalesCustomersResponse,
  createSalesCustomersResponseDTO,
  GetProductsResponse,
  getProductsResponseDTO,
  GetSalesCustomersByIdParams,
  getSalesCustomersByIdParamsDTO,
  GetSalesCustomersByIdResponse,
  getSalesCustomersByIdResponseDTO,
  GetSalesCustomersQuery,
  getSalesCustomersQueryDTO,
  GetSalesCustomersResponse,
  getSalesCustomersResponseDTO,
  UpdateSalesCustomersBody,
  updateSalesCustomersBodyDTO,
  UpdateSalesCustomersParams,
  updateSalesCustomersParamsDTO,
  UpdateSalesCustomersResponse,
  updateSalesCustomersResponseDTO,
} from '../../../dto/sales/customer.dto';
import { CustomersService } from '../../../services/sales/customer.sales.service';
import { verifyAccess } from '../../hooks/onRequest/verifyAccess';

@Controller({
  route: '/sales/customers',
  type: 0,
  tags: [{ name: 'sales-customers' }],
})
export class CustomersController {
  @Inject(CustomersService)
  private service: CustomersService;

  @GET({
    url: '/',
    options: {
      schema: {
        querystring: getSalesCustomersQueryDTO,
        response: {
          200: getSalesCustomersResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async getMany(
    req: FastifyRequest<{
      Querystring: GetSalesCustomersQuery;
    }>,
  ): Promise<GetSalesCustomersResponse> {
    const [customers, count] = await this.service.get(req.query, req.user, req.appId);

    return {
      code: 200,
      count,
      data: customers.map((data) => ({
        ...data,
        province: {
          ...data.province,
          name: data.province.provinceName,
        },
        city: {
          ...data.city,
          name: data.city.cityName,
        },
        district: {
          ...data.district,
          name: data.district.districtName,
        },
        // TODO: Improve efficiencies
        latestVisit:
          (data.salesCustomerVisits.length && {
            ...data.salesCustomerVisits[0],
            createdDate: data.salesCustomerVisits[0].createdDate.toISOString(),
            products: data.salesCustomerVisits[0].salesProductsInVisit.map((product) => ({
              ...product,
              id: product.salesProductItem.id,
              name: product.salesProductItem.name,
              minValue: product.salesProductItem.minValue || undefined,
              maxValue: product.salesProductItem.maxValue || undefined,
              uom: product.salesProductItem.uom,
              value: product.salesProductItem.value,
              category: product.salesProductItem.category,
            })),
          }) ||
          undefined,
        products: data.salesProducts.map((p) => ({
          id: p.salesProductItemId,
          name: p.salesProductItem.name,
          minValue: p.salesProductItem.minValue || undefined,
          maxValue: p.salesProductItem.maxValue || undefined,
          price: p.price,
          dailyQuantity: p.dailyQuantity,
          uom: p.salesProductItem.uom,
          value: p.salesProductItem.value,
          category: p.salesProductItem.category,
        })),
      })),
    };
  }

  @GET({
    url: '/:customerId',
    options: {
      schema: {
        params: getSalesCustomersByIdParamsDTO,
        response: {
          200: getSalesCustomersByIdResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async getById(
    req: FastifyRequest<{
      Params: GetSalesCustomersByIdParams;
    }>,
  ): Promise<GetSalesCustomersByIdResponse> {
    const data = await this.service.getById(req.params.customerId);

    return {
      code: 200,
      data,
    };
  }

  @PUT({
    url: '/:customerId',
    options: {
      schema: {
        params: updateSalesCustomersParamsDTO,
        body: updateSalesCustomersBodyDTO,
        response: {
          200: updateSalesCustomersResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async update(
    req: FastifyRequest<{
      Params: UpdateSalesCustomersParams;
      Body: UpdateSalesCustomersBody;
    }>,
  ): Promise<UpdateSalesCustomersResponse> {
    const data = await this.service.update(req.user, req.body, req.params.customerId);

    return {
      code: 200,
      data: {
        ...data,
        branch: data.branch || null,
        products: data.salesProducts.map((p) => ({
          ...p,
          id: p.salesProductItemId,
          minValue: p.salesProductItem.minValue || undefined,
          maxValue: p.salesProductItem.maxValue || undefined,
          name: p.salesProductItem.name,
          uom: p.salesProductItem.uom,
          value: p.salesProductItem.value,
          category: p.salesProductItem.category,
        })),
      },
    };
  }

  @POST({
    url: '/',
    options: {
      schema: {
        body: createSalesCustomersBodyDTO,
        response: {
          '2xx': createSalesCustomersResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async create(
    req: FastifyRequest<{
      Body: CreateSalesCustomersBody;
    }>,
    rep: FastifyReply,
  ): Promise<CreateSalesCustomersResponse> {
    const data = await this.service.create(req.body, req.user);

    rep.code(201);

    return {
      code: 201,
      data: {
        ...data,
        branch: data.branch || null,
        products: data.salesProducts.map((p) => ({
          ...p,
          id: p.salesProductItemId,
          name: p.salesProductItem.name,
          minValue: p.salesProductItem.minValue || undefined,
          maxValue: p.salesProductItem.maxValue || undefined,
          uom: p.salesProductItem.uom,
          value: p.salesProductItem.value,
          category: p.salesProductItem.category,
        })),
      },
    };
  }

  @PUT({
    url: '/:customerId/archive',
    options: {
      schema: {
        params: updateSalesCustomersParamsDTO,
        response: {
          200: updateSalesCustomersResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async archive(
    req: FastifyRequest<{
      Params: UpdateSalesCustomersParams;
    }>,
  ): Promise<UpdateSalesCustomersResponse> {
    const data = await this.service.archive(req.user, req.params.customerId);

    return {
      code: 200,
      data,
    };
  }

  @PUT({
    url: '/:customerId/unarchive',
    options: {
      schema: {
        params: updateSalesCustomersParamsDTO,
        response: {
          200: updateSalesCustomersResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async unarchive(
    req: FastifyRequest<{
      Params: UpdateSalesCustomersParams;
    }>,
  ): Promise<UpdateSalesCustomersResponse> {
    const data = await this.service.unarchive(req.user, req.params.customerId);

    return {
      code: 200,
      data,
    };
  }

  @GET({
    url: '/:customerId/latest-products',
    options: {
      schema: {
        params: getSalesCustomersByIdParamsDTO,
        response: {
          200: getProductsResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async getLatestProducts(
    req: FastifyRequest<{
      Params: GetSalesCustomersByIdParams;
    }>,
  ): Promise<GetProductsResponse> {
    const products = await this.service.getLatestProducts(req.params.customerId);

    return {
      code: 200,
      data: products,
    };
  }
}
