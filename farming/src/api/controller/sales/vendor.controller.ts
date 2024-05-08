import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, GET, Inject, POST, PUT } from 'fastify-decorators';
import {
  CreateSalesVendorBody,
  createSalesVendorBodyDTO,
  CreateSalesVendorResponse,
  createSalesVendorResponseDTO,
  GetSalesVendorByIdParams,
  getSalesVendorByIdParamsDTO,
  GetSalesVendorByIdResponse,
  getSalesVendorByIdResponseDTO,
  GetSalesVendorsQuery,
  getSalesVendorsQueryDTO,
  GetSalesVendorsResponse,
  getSalesVendorsResponseDTO,
  UpdateSalesVendorBody,
  updateSalesVendorBodyDTO,
  UpdateSalesVendorParams,
  updateSalesVendorParamsDTO,
  UpdateSalesVendorResponse,
  updateSalesVendorResponseDTO,
} from '../../../dto/sales/vendor.dto';
import { SalesVendorsService } from '../../../services/sales/vendor.service';
import { verifyAccess } from '../../hooks/onRequest/verifyAccess';

@Controller({
  route: '/sales/vendors',
  type: 0,
  tags: [{ name: 'sales-vendors' }],
})
export class VendorsController {
  @Inject(SalesVendorsService)
  private service: SalesVendorsService;

  @GET({
    url: '/',
    options: {
      schema: {
        querystring: getSalesVendorsQueryDTO,
        response: {
          200: getSalesVendorsResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async getMany(
    req: FastifyRequest<{
      Querystring: GetSalesVendorsQuery;
    }>,
  ): Promise<GetSalesVendorsResponse> {
    const [vendors, count] = await this.service.get(req.user, req.query, req.appId);

    return {
      code: 200,
      count,
      data: vendors.map((vendor) => ({
        ...vendor,
        province: {
          ...vendor.province,
          name: vendor.province.provinceName,
        },
        city: {
          ...vendor.city,
          name: vendor.city.cityName,
        },
        district: {
          ...vendor.district,
          name: vendor.district.districtName,
        },
        purchasableProducts: vendor.salesProductsInVendor.map((productCategory) => ({
          ...productCategory,
          id: productCategory.salesProductCategory.id,
          name: productCategory.salesProductCategory.name,
        })),
      })),
    };
  }

  @GET({
    url: '/:vendorId',
    options: {
      schema: {
        params: getSalesVendorByIdParamsDTO,
        response: {
          200: getSalesVendorByIdResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async getById(
    req: FastifyRequest<{
      Params: GetSalesVendorByIdParams;
    }>,
  ): Promise<GetSalesVendorByIdResponse> {
    const vendor = await this.service.getById(req.params.vendorId);

    return {
      code: 200,
      data: {
        ...vendor,
        province: {
          ...vendor.province,
          name: vendor.province.provinceName,
        },
        city: {
          ...vendor.city,
          name: vendor.city.cityName,
        },
        district: {
          ...vendor.district,
          name: vendor.district.districtName,
        },
        purchasableProducts: vendor.salesProductsInVendor.map((productCategory) => ({
          ...productCategory,
          id: productCategory.salesProductCategory.id,
          name: productCategory.salesProductCategory.name,
        })),
      },
    };
  }

  @POST({
    url: '/',
    options: {
      schema: {
        body: createSalesVendorBodyDTO,
        response: {
          201: createSalesVendorResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async create(
    req: FastifyRequest<{
      Body: CreateSalesVendorBody;
    }>,
    rep: FastifyReply,
  ): Promise<CreateSalesVendorResponse> {
    const vendor = await this.service.create(req.body, req.user);

    rep.code(201);

    return {
      code: 201,
      data: {
        ...vendor,
        province: {
          ...vendor.province,
          name: vendor.province.provinceName,
        },
        city: {
          ...vendor.city,
          name: vendor.city.cityName,
        },
        district: {
          ...vendor.district,
          name: vendor.district.districtName,
        },
        purchasableProducts: vendor.salesProductsInVendor.map((productCategory) => ({
          ...productCategory,
          id: productCategory.salesProductCategory.id,
          name: productCategory.salesProductCategory.name,
        })),
      },
    };
  }

  @PUT({
    url: '/:vendorId',
    options: {
      schema: {
        params: updateSalesVendorParamsDTO,
        body: updateSalesVendorBodyDTO,
        response: {
          200: updateSalesVendorResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async update(
    req: FastifyRequest<{
      Body: UpdateSalesVendorBody;
      Params: UpdateSalesVendorParams;
    }>,
  ): Promise<UpdateSalesVendorResponse> {
    const vendor = await this.service.update(req.user, req.body, req.params.vendorId);

    return {
      code: 200,
      data: {
        ...vendor,
        province: {
          ...vendor.province,
          name: vendor.province.provinceName,
        },
        city: {
          ...vendor.city,
          name: vendor.city.cityName,
        },
        district: {
          ...vendor.district,
          name: vendor.district.districtName,
        },
        purchasableProducts: vendor.salesProductsInVendor.map((productCategory) => ({
          ...productCategory,
          id: productCategory.salesProductCategory.id,
          name: productCategory.salesProductCategory.name,
        })),
      },
    };
  }
}
