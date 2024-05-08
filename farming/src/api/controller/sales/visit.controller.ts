import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, GET, Inject, POST } from 'fastify-decorators';
import {
  CheckInBody,
  checkInBodyDTO,
  CheckInResponse,
  checkInResponseDTO,
  CreateVisitBody,
  createVisitBodyDTO,
  CreateVisitParam,
  createVisitParamDTO,
  CreateVisitResponse,
  createVisitResponseDTO,
  GetVisitListQuery,
  getVisitListQueryDTO,
  GetVisitListResponse,
  getVisitListResponseDTO,
  GetVisitParam,
  getVisitParamDTO,
  GetVisitResponse,
  getVisitResponseDTO,
} from '../../../dto/sales/visit.dto';
import { CustomerVisitService } from '../../../services/sales/visit.sales.service';
import { verifyAccess } from '../../hooks/onRequest/verifyAccess';

@Controller({
  route: '/sales/customers',
  type: 0,
  tags: [{ name: 'sales-customers' }],
})
export class CustomerVisitController {
  @Inject(CustomerVisitService)
  service: CustomerVisitService;

  @POST({
    url: '/:customerId/visits',
    options: {
      schema: {
        body: createVisitBodyDTO,
        params: createVisitParamDTO,
        response: {
          '2xx': createVisitResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async create(
    req: FastifyRequest<{
      Body: CreateVisitBody;
      Params: CreateVisitParam;
    }>,
    rep: FastifyReply,
  ): Promise<CreateVisitResponse> {
    await this.service.create(req);

    rep.code(201);

    return {
      code: 201,
      data: {
        message: 'OK',
      },
    };
  }

  @GET({
    url: '/:customerId/visits/:visitId',
    options: {
      schema: {
        params: getVisitParamDTO,
        response: {
          200: getVisitResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async getById(
    req: FastifyRequest<{
      Params: GetVisitParam;
    }>,
  ): Promise<GetVisitResponse> {
    const visit = await this.service.getById(req.params);

    return {
      code: 200,
      data: visit,
    };
  }

  @GET({
    url: '/:customerId/visits',
    options: {
      schema: {
        params: createVisitParamDTO,
        querystring: getVisitListQueryDTO,
        response: {
          200: getVisitListResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async getVisits(
    req: FastifyRequest<{
      Params: CreateVisitParam;
      Querystring: GetVisitListQuery;
    }>,
  ): Promise<GetVisitListResponse> {
    const [visits, count] = await this.service.getVisits(req);

    return {
      code: 200,
      count,
      data: visits,
    };
  }

  @POST({
    url: '/:customerId/visits/check-in',
    options: {
      schema: {
        params: createVisitParamDTO,
        body: checkInBodyDTO,
        response: {
          200: checkInResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async checkIn(
    req: FastifyRequest<{
      Params: CreateVisitParam;
      Body: CheckInBody;
    }>,
  ): Promise<CheckInResponse> {
    const distance = await this.service.checkIn(req);

    return {
      code: 200,
      data: {
        distance,
      },
    };
  }
}
