import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, GET, Inject, PATCH, POST } from 'fastify-decorators';
import {
  CreateOvkStockAdjustmentBody,
  createOvkStockAdjustmentBodyDTO,
  CreateOvkStockAdjustmentParams,
  createOvkStockAdjustmentParamsDTO,
  CreateOvkStockAdjustmentResponse,
  createOvkStockAdjustmentResponseDTO,
  CreateOvkStockClosingAdjustmentBody,
  createOvkStockClosingAdjustmentBodyDTO,
  GetOvkStockClosingAdjustmentResponse,
  getOvkStockClosingAdjustmentResponseDTO,
  GetOvkStockSummaryGroupByTypeResponse,
  getOvkStockSummaryGroupByTypeResponseDTO,
  GetOvkStockSummaryParams,
  getOvkStockSummaryParamsDTO,
  GetOvkStockSummaryQuery,
  getOvkStockSummaryQueryDTO,
  GetOvkStockSummaryResponse,
  getOvkStockSummaryResponseDTO,
} from '../../dto/ovkstock.dto';
import { OvkStockService } from '../../services/ovkstock.service';
import { verifyAccess } from '../hooks/onRequest/verifyAccess';

@Controller({
  route: '/ovkstocks',
  type: 0,
  tags: [{ name: 'ovkstocks' }],
})
export class OvkStockController {
  @Inject(OvkStockService)
  private service!: OvkStockService;

  @GET({
    url: '/:farmingCycleId/summaries',
    options: {
      schema: {
        querystring: getOvkStockSummaryQueryDTO,
        params: getOvkStockSummaryParamsDTO,
        response: {
          200: getOvkStockSummaryResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async getSummaries(
    request: FastifyRequest<{
      Querystring: GetOvkStockSummaryQuery;
      Params: GetOvkStockSummaryParams;
    }>,
  ): Promise<GetOvkStockSummaryResponse> {
    const data = await this.service.getSummaries(request.params, request.query);

    return {
      code: 200,
      data,
    };
  }

  @GET({
    url: '/:farmingCycleId/summaries-by-type',
    options: {
      schema: {
        params: getOvkStockSummaryParamsDTO,
        response: {
          200: getOvkStockSummaryGroupByTypeResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async getSummariesByType(
    request: FastifyRequest<{
      Params: GetOvkStockSummaryParams;
    }>,
  ): Promise<GetOvkStockSummaryGroupByTypeResponse> {
    const data = await this.service.getSummariesGroupBySubcategory(request.params);

    return {
      code: 200,
      data,
    };
  }

  @GET({
    url: '/:farmingCycleId/summaries-by-farming-cycle',
    options: {
      schema: {
        params: getOvkStockSummaryParamsDTO,
        response: {
          200: getOvkStockSummaryGroupByTypeResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async getSummariesByFarmingCycle(
    request: FastifyRequest<{
      Params: GetOvkStockSummaryParams;
    }>,
  ): Promise<GetOvkStockSummaryGroupByTypeResponse> {
    const data = await this.service.getSummaryByFarmingCycle(request.params);

    return {
      code: 200,
      data,
    };
  }

  @POST({
    url: '/:farmingCycleId/adjustments',
    options: {
      schema: {
        params: createOvkStockAdjustmentParamsDTO,
        body: createOvkStockAdjustmentBodyDTO,
        response: {
          '2xx': createOvkStockAdjustmentResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async createAdjustment(
    request: FastifyRequest<{
      Params: CreateOvkStockAdjustmentParams;
      Body: CreateOvkStockAdjustmentBody;
    }>,
    reply: FastifyReply,
  ): Promise<CreateOvkStockAdjustmentResponse> {
    const data = await this.service.createAdjustments(request.params, request.body, request.user);

    reply.status(201);

    return {
      code: 201,
      data,
    };
  }

  @PATCH({
    url: '/:farmingCycleId/closing-adjustment',
    options: {
      schema: {
        params: createOvkStockAdjustmentParamsDTO,
        body: createOvkStockClosingAdjustmentBodyDTO,
        response: {
          200: getOvkStockClosingAdjustmentResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async setOvkClosingAdjustment(
    req: FastifyRequest<{
      Params: CreateOvkStockAdjustmentParams;
      Body: CreateOvkStockClosingAdjustmentBody;
    }>,
  ): Promise<GetOvkStockClosingAdjustmentResponse> {
    const data = await this.service.createClosingAdjustment(req.params, req.body, req.user);

    return {
      code: 200,
      data,
    };
  }

  @GET({
    url: '/:farmingCycleId/closing-adjustment',
    options: {
      schema: {
        params: createOvkStockAdjustmentParamsDTO,
        response: {
          200: getOvkStockClosingAdjustmentResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async getOvkAdjustment(
    req: FastifyRequest<{
      Params: CreateOvkStockAdjustmentParams;
    }>,
  ): Promise<GetOvkStockClosingAdjustmentResponse> {
    const data = await this.service.getClosingAdjustment(req.params);

    return {
      code: 200,
      data,
    };
  }
}
