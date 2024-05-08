import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, GET, Inject, POST } from 'fastify-decorators';
import {
  CreateFeedStockAdjustmentBody,
  createFeedStockAdjustmentBodyDTO,
  CreateFeedStockAdjustmentParams,
  createFeedStockAdjustmentParamsDTO,
  CreateFeedStockAdjustmentResponse,
  createFeedStockAdjustmentResponseDTO,
  GetFeedStockSummaryGroupByTypeResponse,
  getFeedStockSummaryGroupByTypeResponseDTO,
  GetFeedStockSummaryParams,
  getFeedStockSummaryParamsDTO,
  GetFeedStockSummaryQuery,
  getFeedStockSummaryQueryDTO,
  GetFeedStockSummaryResponse,
  getFeedStockSummaryResponseDTO,
} from '../../dto/feedstock.dto';
import { FeedStockService } from '../../services/feedstock.service';
import { verifyAccess } from '../hooks/onRequest/verifyAccess';

@Controller({
  route: '/feedstocks',
  type: 0,
  tags: [{ name: 'feedstocks' }],
})
export class FeedStockController {
  @Inject(FeedStockService)
  private service!: FeedStockService;

  @GET({
    url: '/:farmingCycleId/summaries',
    options: {
      schema: {
        querystring: getFeedStockSummaryQueryDTO,
        params: getFeedStockSummaryParamsDTO,
        response: {
          200: getFeedStockSummaryResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async getSummaries(
    request: FastifyRequest<{
      Querystring: GetFeedStockSummaryQuery;
      Params: GetFeedStockSummaryParams;
    }>,
  ): Promise<GetFeedStockSummaryResponse> {
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
        params: getFeedStockSummaryParamsDTO,
        response: {
          200: getFeedStockSummaryGroupByTypeResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async getSummariesByType(
    request: FastifyRequest<{
      Params: GetFeedStockSummaryParams;
    }>,
  ): Promise<GetFeedStockSummaryGroupByTypeResponse> {
    const data = await this.service.getSummariesGroupBySubcategory(request.params);

    return {
      code: 200,
      data,
    };
  }

  @POST({
    url: '/:farmingCycleId/adjustments',
    options: {
      schema: {
        params: createFeedStockAdjustmentParamsDTO,
        body: createFeedStockAdjustmentBodyDTO,
        response: {
          '2xx': createFeedStockAdjustmentResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async createAdjustment(
    request: FastifyRequest<{
      Params: CreateFeedStockAdjustmentParams;
      Body: CreateFeedStockAdjustmentBody;
    }>,
    reply: FastifyReply,
  ): Promise<CreateFeedStockAdjustmentResponse> {
    const data = await this.service.createAdjustments(request.params, request.body, request.user);

    reply.status(201);

    return {
      code: 201,
      data,
    };
  }
}
