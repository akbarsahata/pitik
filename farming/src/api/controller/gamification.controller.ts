/* eslint-disable class-methods-use-this */
/* eslint-disable no-unused-vars */
import { FastifyRequest } from 'fastify';
import { Controller, GET } from 'fastify-decorators';
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
    _request: GetPointSummaryRequest,
  ): Promise<GamificationPointSummaryResponse> {
    return {
      data: {
        targetMaxPoint: 0,
        currentTargetPoint: 0,
        currentTargetLevel: 0,
        currentPoint: 0,
        currentLevel: 0,
        ipPrediction: 0,
      },
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
    _request: GetPointHistoryRequest,
  ): Promise<GamificationPointHistoryResponse> {
    return {
      data: [],
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
    _request: GetCoopPointHistoryRequest,
  ): Promise<GamificationCoopPointHistoryResponse> {
    return {
      data: [],
    };
  }
}
