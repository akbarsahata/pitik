import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, GET, Inject, POST, PUT } from 'fastify-decorators';
import {
  CreateSalesManufactureBody,
  createSalesManufactureBodyDTO,
  CreateSalesManufactureResponse,
  createSalesManufactureResponseDTO,
  GetSalesManufactureByIdParams,
  getSalesManufactureByIdParamsDTO,
  GetSalesManufactureByIdResponse,
  getSalesManufactureByIdResponseDTO,
  GetSalesManufacturesQuery,
  getSalesManufacturesQueryDTO,
  GetSalesManufacturesResponse,
  getSalesManufacturesResponseDTO,
  UpdateSalesManufactureBody,
  updateSalesManufactureBodyDTO,
  UpdateSalesManufactureParams,
  updateSalesManufactureParamsDTO,
  UpdateSalesManufactureResponse,
  updateSalesManufactureResponseDTO,
} from '../../../dto/sales/manufacture.dto';
import { SalesManufactureService } from '../../../services/sales/manufacture.service';
import { verifyAccess } from '../../hooks/onRequest/verifyAccess';

@Controller({
  route: '/sales/manufactures',
  type: 0,
  tags: [{ name: 'sales-manufactures' }],
})
export class ManufactureController {
  @Inject(SalesManufactureService)
  private service: SalesManufactureService;

  @GET({
    url: '/',
    options: {
      schema: {
        querystring: getSalesManufacturesQueryDTO,
        response: {
          200: getSalesManufacturesResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async getMany(
    req: FastifyRequest<{
      Querystring: GetSalesManufacturesQuery;
    }>,
  ): Promise<GetSalesManufacturesResponse> {
    const [data, count] = await this.service.get(req.query, req.user, req.appId);

    return {
      code: 200,
      count,
      data,
    };
  }

  @GET({
    url: '/:manufactureId',
    options: {
      schema: {
        params: getSalesManufactureByIdParamsDTO,
        response: {
          200: getSalesManufactureByIdResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async getById(
    req: FastifyRequest<{
      Params: GetSalesManufactureByIdParams;
    }>,
  ): Promise<GetSalesManufactureByIdResponse> {
    const manufacture = await this.service.getById(req.params.manufactureId);

    return {
      code: 200,
      data: manufacture,
    };
  }

  @POST({
    url: '/',
    options: {
      schema: {
        body: createSalesManufactureBodyDTO,
        response: {
          201: createSalesManufactureResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async create(
    req: FastifyRequest<{
      Body: CreateSalesManufactureBody;
    }>,
    rep: FastifyReply,
  ): Promise<CreateSalesManufactureResponse> {
    const manufacture = await this.service.create(req.body, req.user);

    rep.code(201);

    return {
      code: 201,
      data: manufacture,
    };
  }

  @PUT({
    url: '/:manufactureId',
    options: {
      schema: {
        params: updateSalesManufactureParamsDTO,
        body: updateSalesManufactureBodyDTO,
        response: {
          200: updateSalesManufactureResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async update(
    req: FastifyRequest<{
      Body: UpdateSalesManufactureBody;
      Params: UpdateSalesManufactureParams;
    }>,
  ): Promise<UpdateSalesManufactureResponse> {
    const manufacture = await this.service.update(req.user, req.body, req.params.manufactureId);

    return {
      code: 200,
      data: manufacture,
    };
  }
}
