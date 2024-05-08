import { differenceInCalendarDays } from 'date-fns';
import { FastifyRequest } from 'fastify';
import { Controller, GET, Inject, PUT } from 'fastify-decorators';
import {
  GetDailyPerformanceDetailParams,
  getDailyPerformanceDetailParamsDTO,
  GetDailyPerformanceDetailResponse,
  getDailyPerformanceDetailResponseDTO,
  GetDailyPerformanceQuery,
  getDailyPerformanceQueryDTO,
  GetDailyPerformanceResponse,
  getDailyPerformanceResponseDTO,
  GetDailyPerformanceSummaryParams,
  getDailyPerformanceSummaryParamsDTO,
  GetDailyPerformanceSummaryResponse,
  getDailyPerformanceSummaryResponseDTO,
  SaveDailyPerformanceDetailBody,
  saveDailyPerformanceDetailBodyDTO,
  SaveDailyPerformanceDetailsParams,
  saveDailyPerformanceDetailsParamsDTO,
} from '../../dto/dailyPerformance.dto';
import { DailyReportItem } from '../../dto/farmingCycle.dto';
import { DailyMonitoringService } from '../../services/dailyMonitoring.service';
import { DailyPerformanceService } from '../../services/dailyPerformance.service';
import { FarmingCycleService } from '../../services/farmingCycle.service';
import { verifyAccess } from '../hooks/onRequest/verifyAccess';

@Controller({
  route: '/daily-performances',
  type: 0,
  tags: [{ name: 'daily-performances' }],
})
export class DailyPerformanceController {
  @Inject(DailyPerformanceService)
  private service: DailyPerformanceService;

  @Inject(FarmingCycleService)
  private farmingCycleService: FarmingCycleService;

  @Inject(DailyMonitoringService)
  private dailyMonitoringService: DailyMonitoringService;

  @GET({
    url: '/',
    options: {
      schema: {
        querystring: getDailyPerformanceQueryDTO,
        response: {
          200: getDailyPerformanceResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async get(
    request: FastifyRequest<{
      Querystring: GetDailyPerformanceQuery;
    }>,
  ): Promise<GetDailyPerformanceResponse> {
    const [dailyPerformances, count] = await this.service.getMany(request.query);

    return {
      code: 200,
      count,
      data: dailyPerformances.map((dp) => ({
        ...dp,
        farmingCycleStartDate: dp.farmingCycleStartDate && dp.farmingCycleStartDate.toString(),
        age: dp.farmingCycleStartDate
          ? differenceInCalendarDays(new Date(), new Date(dp.farmingCycleStartDate.toString()))
          : 0,
        summary: dp.summary && dp.summary.length ? dp.summary[0] : undefined,
      })),
    };
  }

  @GET({
    url: '/farming-cycles/:farmingCycleId',
    options: {
      schema: {
        params: getDailyPerformanceSummaryParamsDTO,
        response: {
          200: getDailyPerformanceSummaryResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async getDailyPerformanceSummary(
    request: FastifyRequest<{
      Params: GetDailyPerformanceSummaryParams;
    }>,
  ): Promise<GetDailyPerformanceSummaryResponse> {
    const summary = await this.dailyMonitoringService.getDailyPerformanceSummary(
      request.params.farmingCycleId,
    );

    return {
      code: 200,
      data: summary,
    };
  }

  @GET({
    url: '/farming-cycles/:farmingCycleId/details',
    options: {
      schema: {
        params: getDailyPerformanceDetailParamsDTO,
        response: {
          200: getDailyPerformanceDetailResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async getDailyPerformanceDetails(
    req: FastifyRequest<{
      Params: GetDailyPerformanceDetailParams;
    }>,
  ): Promise<GetDailyPerformanceDetailResponse> {
    const dailyMonitorings = await this.dailyMonitoringService.getAllDailyMonitorings(
      req.params.farmingCycleId,
      { user: req.user },
    );

    const results = await this.service.getDailyPerformanceDetails(
      dailyMonitorings,
      req.params.farmingCycleId,
    );

    return {
      code: 200,
      data: results,
    };
  }

  @PUT({
    url: '/farming-cycles/:farmingCycleId/details',
    options: {
      schema: {
        params: saveDailyPerformanceDetailsParamsDTO,
        body: saveDailyPerformanceDetailBodyDTO,
        response: {
          200: getDailyPerformanceDetailResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async bulkSaveDailyPerformance(
    req: FastifyRequest<{
      Params: SaveDailyPerformanceDetailsParams;
      Body: SaveDailyPerformanceDetailBody;
    }>,
  ): Promise<GetDailyPerformanceDetailResponse> {
    // reuse daily report API
    await this.farmingCycleService.saveDailyReports(
      req.user,
      req.body.map<DailyReportItem>((item) => ({
        ...item,
        feedType: null,
      })),
    );

    // save summary, issues, and treatment
    await this.service.bulkSave(req.user, req.params.farmingCycleId, req.body);

    const dailyMonitorings = await this.dailyMonitoringService.getAllDailyMonitorings(
      req.params.farmingCycleId,
      { user: req.user },
    );

    const results = await this.service.getDailyPerformanceDetails(
      dailyMonitorings,
      req.params.farmingCycleId,
    );

    return {
      code: 200,
      data: results,
    };
  }
}
