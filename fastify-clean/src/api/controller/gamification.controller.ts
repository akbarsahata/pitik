import { FastifyRequest } from 'fastify';
import { Controller, GET, Inject } from 'fastify-decorators';
import {
  GamificationCoopPointHistoryParams,
  gamificationCoopPointHistoryParamsDTO,
  GamificationCoopPointHistoryResponse,
  gamificationCoopPointHistoryResponseDTO,
  GamificationPointHistoryParams,
  gamificationPointHistoryParamsDTO,
  GamificationPointHistoryQuery,
  gamificationPointHistoryQueryDTO,
  GamificationPointHistoryResponse,
  gamificationPointHistoryResponseDTO,
  GamificationPointSummaryParams,
  gamificationPointSummaryParamsDTO,
  GamificationPointSummaryResponse,
  gamificationPointSummaryResponseDTO,
} from '../../dto/gamification.dto';
import { GamificationService } from '../../services/gamification.service';
import { verifyAccess } from '../hooks/onRequest/verifyAccess';

type GetPointSummaryRequest = FastifyRequest<{
  Params: GamificationPointSummaryParams;
}>;

type GetPointHistoryRequest = FastifyRequest<{
  Querystring: GamificationPointHistoryQuery;
  Params: GamificationPointHistoryParams;
}>;

type GetCoopPointHistoryRequest = FastifyRequest<{
  Params: GamificationCoopPointHistoryParams;
}>;

@Controller({
  route: '/gamification',
  type: 0,
  tags: [{ name: 'gamification' }],
})
export class GamificationController {
  @Inject(GamificationService)
  private service!: GamificationService;

  @GET({
    url: '/point-summary/:farmingCycleId',
    options: {
      schema: {
        params: gamificationPointSummaryParamsDTO,
        response: {
          200: gamificationPointSummaryResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async getPointSummary(
    request: GetPointSummaryRequest,
  ): Promise<GamificationPointSummaryResponse> {
    const summary = await this.service.getCurrentPointSummaryByFarmingCycle(
      request.params.farmingCycleId,
    );

    return {
      data: summary,
    };
  }

  @GET({
    url: '/point-history/:farmingCycleId',
    options: {
      schema: {
        params: gamificationPointHistoryParamsDTO,
        querystring: gamificationPointHistoryQueryDTO,
        response: {
          200: gamificationPointHistoryResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async getPointHistory(
    request: GetPointHistoryRequest,
  ): Promise<GamificationPointHistoryResponse> {
    const history = await this.service.getPointHistoryByFarmingCycle(
      request.params.farmingCycleId,
      request.query.date,
    );

    return {
      data: history,
    };
  }

  @GET({
    url: '/coop-point-history/:farmingCycleId',
    options: {
      schema: {
        params: gamificationCoopPointHistoryParamsDTO,
        response: {
          200: gamificationCoopPointHistoryResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async getCoopPointHistory(
    request: GetCoopPointHistoryRequest,
  ): Promise<GamificationCoopPointHistoryResponse> {
    const coopPointHistory = await this.service.getCoopPointHistoryByFarmingCycle(
      request.params.farmingCycleId,
    );

    return {
      data: coopPointHistory,
    };
  }
}
