import { FastifyRequest } from 'fastify';
import { Controller, GET, Inject } from 'fastify-decorators';
import {
  performanceActualDTO,
  performanceHistoryDTO,
  PerformanceHistoryQuery,
  performanceHistoryQueryDTO,
  performanceProjectionDTO,
  PerformanceQuery,
  performanceQueryDTO,
} from '../../dto/performance.dto';
import { ERR_AUTH_FORBIDDEN } from '../../libs/constants/errors';
import { FarmingCycleService } from '../../services/farmingCycle.service';
import { PerformanceService } from '../../services/performance.service';
import { verifyAccess } from '../hooks/onRequest/verifyAccess';

export type PerformanceRequest = FastifyRequest<{
  Querystring: PerformanceQuery;
}>;

export type PerformanceHistoryRequest = FastifyRequest<{
  Querystring: PerformanceHistoryQuery;
}>;

@Controller({
  route: '/performance',
  type: 0,
  tags: [{ name: 'performance' }],
})
export class PerformanceController {
  @Inject(PerformanceService)
  private service!: PerformanceService;

  @Inject(FarmingCycleService)
  private farmingCycleService!: FarmingCycleService;

  @GET({
    url: '/projection',
    options: {
      schema: {
        querystring: performanceQueryDTO,
        response: {
          200: performanceProjectionDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async getPerformanceProjection(request: PerformanceRequest) {
    const ownFarmingCycle = await this.farmingCycleService.checkFarmingCycleOwnership(
      request.query.farmingCycleId,
      request.user.id,
    );

    if (!ownFarmingCycle) {
      throw ERR_AUTH_FORBIDDEN('not farming cycle member');
    }

    return this.service.getPerformanceProjection(request.query.farmingCycleId);
  }

  @GET({
    url: '/actual',
    options: {
      schema: {
        querystring: performanceQueryDTO,
        response: {
          200: performanceActualDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async getPerformanceActualStatus(request: PerformanceRequest) {
    const ownFarmingCycle = await this.farmingCycleService.checkFarmingCycleOwnership(
      request.query.farmingCycleId,
      request.user.id,
    );

    if (!ownFarmingCycle) {
      throw ERR_AUTH_FORBIDDEN('not farming cycle member');
    }

    return this.service.getActualPerformance(request.query.farmingCycleId);
  }

  @GET({
    url: '/history',
    options: {
      schema: {
        querystring: performanceHistoryQueryDTO,
        response: {
          200: performanceHistoryDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async getPerformanceActualHistory(request: PerformanceHistoryRequest) {
    const ownFarmingCycle = await this.farmingCycleService.checkFarmingCycleOwnership(
      request.query.farmingCycleId,
      request.user.id,
    );

    if (!ownFarmingCycle) {
      throw ERR_AUTH_FORBIDDEN('not farming cycle member');
    }

    return this.service.getHistoricalPerformance(
      request.query.farmingCycleId,
      request.query.$page,
      request.query.$limit,
    );
  }
}
