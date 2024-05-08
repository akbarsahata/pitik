import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, GET, Inject, PATCH, POST, PUT } from 'fastify-decorators';
import {
  ClosingParams,
  closingParamsDTO,
  ClosingQuery,
  closingQueryDTO,
  ClosingResponse,
  FeedAdjustmentBody,
  feedAdjustmentBodyDTO,
  FeedAdjustmentParams,
  feedAdjustmentParamsDTO,
  GetClosingIpResponse,
  getClosingIpResponseDTO,
  GetFeedAdjustmentResponse,
  getFeedAdjustmentResponseDTO,
  GetFeedLeftoverResponse,
  getFeedLeftoverResponseDTO,
  GetMortalityAdjustmentResponse,
  getMortalityAdjustmentResponseDTO,
  GetOvkLeftoverResponse,
  getOvkLeftoverResponseDTO,
  GetRemainingPopulationResponse,
  getRemainingPopulationResponseDTO,
  MortalityAdjustmentBody,
  mortalityAdjustmentBodyDTO,
  MortalityAdjustmentParams,
  mortalityAdjustmentParamsDTO,
  OvkLeftoverParams,
  ovkLeftoverParamsDTO,
  SetFeedAdjustmentResponse,
  setFeedAdjustmentResponseDTO,
  SetMortalityAdjustmentResponse,
  setMortalityAdjustmentResponseDTO,
} from '../../dto/closing.dto';
import {
  AssignOperatorsToFarmingCycleBody,
  assignOperatorsToFarmingCycleBodyDTO,
  assignOperatorsToFarmingCycleResponseDTO,
  CalculateDailyMonitoringsQuery,
  calculateDailyMonitoringsQueryDTO,
  CreateFarmingCycleBody,
  createFarmingCycleBodyDTO,
  CreateFarmingCycleResponse,
  createFarmingCycleResponseDTO,
  DailyMonitoringVariableParams,
  dailyMonitoringVariableParamsDTO,
  DailyMonitoringVariableResponse,
  dailyMonitoringVariableResponseDTO,
  DailyReportMarkAsReviewedParam,
  dailyReportMarkAsReviewedParamDTO,
  DailyReportsParam,
  dailyReportsParamDTO,
  DailyReportsQuery,
  dailyReportsQueryDTO,
  DailyReportsResponse,
  dailyReportsResponseDTO,
  FarmingCycleByIdParams,
  farmingCycleByIdParamsDTO,
  FarmingCycleByIdResponse,
  farmingCycleByIdResponseDTO,
  FarmingCycleOperatorParams,
  farmingCycleOperatorParamsDTO,
  FarmingCycleOperatorResponse,
  farmingCycleOperatorResponseDTO,
  FarmingCyclePplInfoParams,
  farmingCyclePplInfoParamsDTO,
  FarmingCyclePplInfoResponse,
  farmingCyclePplInfoResponseDTO,
  FarmingCycleSummaryParams,
  farmingCycleSummaryParamsDTO,
  FarmingCycleSummaryResponse,
  farmingCycleSummaryResponseDTO,
  GetAllDailyMonitoringsParams,
  getAllDailyMonitoringsParamsDTO,
  GetAllDailyMonitoringsResponse,
  getAllDailyMonitoringsResponseDTO,
  GetDailyMonitoringDateParams,
  getDailyMonitoringDateParamsDTO,
  GetDailyMonitoringDateResponse,
  getDailyMonitoringDateResponseDTO,
  GetDailyMonitoringDetailParams,
  getDailyMonitoringDetailParamsDTO,
  GetDailyMonitoringDetailResponse,
  getDailyMonitoringDetailResponseDTO,
  GetDailyReportParam,
  getDailyReportParamDTO,
  GetDailyReportResponse,
  getDailyReportResponseDTO,
  GetFarmingCyclePerformanceParams,
  getFarmingCyclePerformanceParamsDTO,
  GetFarmingCyclePerformanceResponse,
  getFarmingCyclePerformanceResponseDTO,
  GetFarmingCyclesQuery,
  getFarmingCyclesQueryDTO,
  GetFarmingCyclesResponse,
  getFarmingCyclesResponseDTO,
  RequestDailyMonitoringRevisionBody,
  requestDailyMonitoringRevisionBodyDTO,
  RequestDailyMonitoringRevisionParams,
  requestDailyMonitoringRevisionParamsDTO,
  SubmitDailyReportBody,
  submitDailyReportBodyDTO,
  SubmitDailyReportParam,
  submitDailyReportParamDTO,
  SubmitDailyReportResponse,
  submitDailyReportResponseDTO,
  UpdateDOCinBody,
  updateDOCinBodyDTO,
  UpdateDOCinParams,
  updateDOCinParamsDTO,
  UpdateDOCinResponse,
  updateDOCinResponseDTO,
  UpdateFarmingCycleBody,
  updateFarmingCycleBodyDTO,
  UpdateFarmingCycleParam,
  updateFarmingCycleParamDTO,
  UpdateFarmingCycleResponse,
  updateFarmingCycleResponseDTO,
} from '../../dto/farmingCycle.dto';
import {
  CreateRepopulationBody,
  createRepopulationBodyDTO,
  GetRepopulationsResponse,
  getRepopulationsResponseDTO,
  RepopulationItemResponse,
  repopulationItemResponseDTO,
  RepopulationParams,
  repopulationParamsDTO,
} from '../../dto/repopulation.dto';
import { ClosingService } from '../../services/closing.service';
import { DailyMonitoringService } from '../../services/dailyMonitoring.service';
import { FarmingCycleService } from '../../services/farmingCycle.service';
import { RepopulationService } from '../../services/repopulation.service';
import { SensorService } from '../../services/sensor.service';
import { FarmingCycleUsecase } from '../../usecases/farmingCycle.usecase';
import { verifyAccess } from '../hooks/onRequest/verifyAccess';

type CreateFarmingCycleRequest = FastifyRequest<{
  Body: CreateFarmingCycleBody;
}>;

type UpdateFarmingCycleRequest = FastifyRequest<{
  Params: UpdateFarmingCycleParam;
  Body: UpdateFarmingCycleBody;
}>;

type GetFarmingCyclesRequest = FastifyRequest<{
  Querystring: GetFarmingCyclesQuery;
}>;

type FarmingCycleOperatorRequest = FastifyRequest<{
  Params: FarmingCycleOperatorParams;
}>;

type FarmingCycleByIdRequest = FastifyRequest<{
  Params: FarmingCycleByIdParams;
}>;

type FarmingCycleSummaryRequest = FastifyRequest<{
  Params: FarmingCycleSummaryParams;
}>;

type FarmingCyclePplInfoRequest = FastifyRequest<{
  Params: FarmingCyclePplInfoParams;
}>;

type AssignOperatorsToFarmingCycleRequest = FastifyRequest<{
  Params: FarmingCycleOperatorParams;
  Body: AssignOperatorsToFarmingCycleBody;
}>;

type GetRepopulateFarmingCycleRequest = FastifyRequest<{
  Params: RepopulationParams;
}>;

type RepopulateFarmingCycleRequest = FastifyRequest<{
  Params: RepopulationParams;
  Body: CreateRepopulationBody;
}>;

@Controller({
  route: '/farming-cycles',
  type: 0,
  tags: [{ name: 'farming-cycles' }],
})
export class FarmingCycleController {
  @Inject(FarmingCycleService)
  private service!: FarmingCycleService;

  @Inject(FarmingCycleUsecase)
  private farmingCycleUsecase!: FarmingCycleUsecase;

  @Inject(SensorService)
  private sensorService!: SensorService;

  @Inject(RepopulationService)
  private repopulationService!: RepopulationService;

  @Inject(DailyMonitoringService)
  private dailyMonitoringService!: DailyMonitoringService;

  @Inject(ClosingService)
  private closingService!: ClosingService;

  @POST({
    url: '/',
    options: {
      schema: {
        body: createFarmingCycleBodyDTO,
        response: {
          '2xx': createFarmingCycleResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async createFarmingCycle(
    request: CreateFarmingCycleRequest,
    reply: FastifyReply,
  ): Promise<CreateFarmingCycleResponse> {
    const farmingCycle = await this.service.createFarmingCycle(request.body, request.user);

    reply.code(201);

    return {
      code: 201,
      data: farmingCycle,
    };
  }

  @GET({
    url: '/',
    options: {
      schema: {
        querystring: getFarmingCyclesQueryDTO,
        response: {
          200: getFarmingCyclesResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async getFarmingCycles(request: GetFarmingCyclesRequest): Promise<GetFarmingCyclesResponse> {
    const [farmingCycles, count] = await this.service.getFarmingCycles(request.query);
    return {
      code: 200,
      count,
      data: farmingCycles,
    };
  }

  @GET({
    url: '/:farmingCycleId/operators',
    options: {
      schema: {
        params: farmingCycleOperatorParamsDTO,
        response: {
          200: farmingCycleOperatorResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async getFarmingCycleOperators(
    request: FarmingCycleOperatorRequest,
  ): Promise<FarmingCycleOperatorResponse> {
    const fcOperators = await this.service.getFarmingCycleOperators(request.params.farmingCycleId);

    return { data: fcOperators };
  }

  @GET({
    url: '/:farmingCycleId/operators/available',
    options: {
      schema: {
        params: farmingCycleOperatorParamsDTO,
        response: {
          200: farmingCycleOperatorResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async getAvailableOperators(
    request: FarmingCycleOperatorRequest,
  ): Promise<FarmingCycleOperatorResponse> {
    const availableOps = await this.service.getAvailableOperators(
      request.params.farmingCycleId,
      request.user.id,
    );

    return {
      data: availableOps,
    };
  }

  @POST({
    url: '/:farmingCycleId/operators',
    options: {
      schema: {
        params: farmingCycleOperatorParamsDTO,
        body: assignOperatorsToFarmingCycleBodyDTO,
        response: {
          200: assignOperatorsToFarmingCycleResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async addOperatorsToFarmingCyle(request: AssignOperatorsToFarmingCycleRequest) {
    const fcMembers = await this.service.addOperatorsToFarmingCycle(
      request.body,
      request.params.farmingCycleId,
      request.user.id,
    );

    return {
      data: {
        farmingCycleMemberIds: fcMembers,
      },
    };
  }

  @GET({
    url: '/:farmingCycleId',
    options: {
      schema: {
        params: farmingCycleByIdParamsDTO,
        response: {
          200: farmingCycleByIdResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async getFarmingCycleById(request: FarmingCycleByIdRequest): Promise<FarmingCycleByIdResponse> {
    const farmingCycle = await this.service.getFarmingCycleById(request.params.farmingCycleId);

    return {
      data: farmingCycle,
    };
  }

  @PATCH({
    url: '/:farmingCycleId/doc-in',
    options: {
      schema: {
        body: updateDOCinBodyDTO,
        params: updateDOCinParamsDTO,
        response: {
          200: updateDOCinResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async updateFarmingCyleDOCin(
    request: FastifyRequest<{
      Params: UpdateDOCinParams;
      Body: UpdateDOCinBody;
    }>,
  ): Promise<UpdateDOCinResponse> {
    const data = await this.service.updateDOCin(request.params, request.body, request.user);

    return { code: 200, data };
  }

  @GET({
    url: '/:farmingCycleId/doc-in',
    options: {
      schema: {
        params: updateDOCinParamsDTO,
        response: {
          200: updateDOCinResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async getFarmingCyleDOCin(
    request: FastifyRequest<{
      Params: UpdateDOCinParams;
      Body: UpdateDOCinBody;
    }>,
  ): Promise<UpdateDOCinResponse> {
    const data = await this.service.getDOCin(request.params);

    return { code: 200, data };
  }

  @GET({
    url: '/:farmingCycleId/summary',
    options: {
      schema: {
        params: farmingCycleSummaryParamsDTO,
        response: {
          200: farmingCycleSummaryResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async getFarmingCycleSummary(
    request: FarmingCycleSummaryRequest,
  ): Promise<FarmingCycleSummaryResponse> {
    const farmingInfo = await this.service.getFarmingCycleSummary(request.params.farmingCycleId);

    return {
      code: 200,
      data: {
        farmingInfo,
      },
    };
  }

  @GET({
    url: '/:farmingCycleId/ppl-info',
    options: {
      schema: {
        params: farmingCyclePplInfoParamsDTO,
        response: {
          200: farmingCyclePplInfoResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async getFarmingCyclePplList(
    request: FarmingCyclePplInfoRequest,
  ): Promise<FarmingCyclePplInfoResponse> {
    const ppls = await this.service.getFarmingCyclePplList(request.params.farmingCycleId);
    return {
      code: 200,
      data: ppls,
    };
  }

  @GET({
    url: '/:farmingCycleId/daily-reports',
    options: {
      schema: {
        params: dailyReportsParamDTO,
        querystring: dailyReportsQueryDTO,
        response: {
          200: dailyReportsResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async getFarmingCycleDailyReports(
    req: FastifyRequest<{
      Params: DailyReportsParam;
      Querystring: DailyReportsQuery;
    }>,
  ): Promise<DailyReportsResponse> {
    const dailyReports = await this.service.getFarmingCycleDailyReports(
      req.params.farmingCycleId,
      req.user,
      req.query.$page && req.query.$page > 0 ? req.query.$page || 1 : 1,
      req.query.$limit && req.query.$limit > 0 ? req.query.$limit || 50 : 50,
    );

    return {
      code: 200,
      data: dailyReports,
    };
  }

  @POST({
    url: '/:farmingCycleId/daily-reports/:taskTicketId',
    options: {
      schema: {
        params: submitDailyReportParamDTO,
        body: submitDailyReportBodyDTO,
        response: {
          200: submitDailyReportResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async submitDailyReport(
    req: FastifyRequest<{
      Params: SubmitDailyReportParam;
      Body: SubmitDailyReportBody;
    }>,
  ): Promise<SubmitDailyReportResponse> {
    const data = await this.farmingCycleUsecase.submitDailyReport(
      req.user,
      req.params.farmingCycleId,
      req.params.taskTicketId,
      req.body,
    );

    return {
      code: 200,
      data,
    };
  }

  @GET({
    url: '/:farmingCycleId/daily-reports/:taskTicketId',
    options: {
      schema: {
        params: getDailyReportParamDTO,
        response: {
          200: getDailyReportResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async getDailyReport(
    req: FastifyRequest<{
      Params: GetDailyReportParam;
    }>,
  ): Promise<GetDailyReportResponse> {
    const data = await this.service.getDailyReport(
      req.params.farmingCycleId,
      req.params.taskTicketId,
    );

    return {
      code: 200,
      data,
    };
  }

  @POST({
    url: '/:farmingCycleId/daily-reports/:taskTicketId/mark-as-reviewed',
    options: {
      schema: {
        params: dailyReportMarkAsReviewedParamDTO,
        response: {
          200: submitDailyReportResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async dailyReportMarkAsReviewed(
    req: FastifyRequest<{
      Params: DailyReportMarkAsReviewedParam;
    }>,
  ): Promise<SubmitDailyReportResponse> {
    await this.service.dailyReportMarkAsReviewed(
      req.user,
      req.params.farmingCycleId,
      req.params.taskTicketId,
    );

    const data = await this.service.submitDailyReportResponse(
      req.params.farmingCycleId,
      req.params.taskTicketId,
    );

    const { temperature, relativeHumidity, heatStressIndex } =
      await this.sensorService.getCoopSensorLatestCondition(
        { farmingCycleId: req.params.farmingCycleId },
        data.date,
      );

    data.temperature = (temperature && `${temperature.value} ${temperature.uom}`) || undefined;
    data.humidity =
      (relativeHumidity && `${relativeHumidity.value} ${relativeHumidity.uom}`) || undefined;
    data.heatStress = (heatStressIndex && `${heatStressIndex.value}`) || undefined;

    return {
      code: 200,
      data,
    };
  }

  @GET({
    url: '/:farmingCycleId/daily-monitorings/variables/:variable',
    options: {
      schema: {
        params: dailyMonitoringVariableParamsDTO,
        response: {
          200: dailyMonitoringVariableResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  getDailyMonitoringsByVariable(
    req: FastifyRequest<{
      Params: DailyMonitoringVariableParams;
    }>,
  ): Promise<DailyMonitoringVariableResponse> {
    const result = this.dailyMonitoringService.getDailyMonitoringsByVariable(
      req.params.farmingCycleId,
      req.params.variable,
    );
    return result;
  }

  @GET({
    url: '/:farmingCycleId/daily-monitorings/date',
    options: {
      schema: {
        params: getDailyMonitoringDateParamsDTO,
        response: {
          200: getDailyMonitoringDateResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  getDailyMonitoringDate(
    req: FastifyRequest<{
      Params: GetDailyMonitoringDateParams;
    }>,
  ): Promise<GetDailyMonitoringDateResponse> {
    return this.dailyMonitoringService.getDailyMonitoringDate(req.params.farmingCycleId);
  }

  @GET({
    url: '/:farmingCycleId/daily-monitorings/:taskTicketId',
    options: {
      schema: {
        params: getDailyMonitoringDetailParamsDTO,
        response: {
          200: getDailyMonitoringDetailResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async getDailyMonitoringDetail(
    req: FastifyRequest<{
      Params: GetDailyMonitoringDetailParams;
    }>,
  ): Promise<GetDailyMonitoringDetailResponse> {
    const data = await this.dailyMonitoringService.getDailyMonitoringDetail(
      req.params.farmingCycleId,
      req.params.taskTicketId,
      req.user,
    );

    return {
      code: 200,
      data,
    };
  }

  @GET({
    url: '/:farmingCycleId/daily-monitorings',
    options: {
      schema: {
        params: getAllDailyMonitoringsParamsDTO,
        response: {
          200: getAllDailyMonitoringsResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async getAllDailyMonitorings(
    req: FastifyRequest<{
      Params: GetAllDailyMonitoringsParams;
    }>,
  ): Promise<GetAllDailyMonitoringsResponse> {
    const data = await this.dailyMonitoringService.getAllDailyMonitorings(
      req.params.farmingCycleId,
      { user: req.user },
    );

    return {
      code: 200,
      data,
    };
  }

  @POST({
    url: '/:farmingCycleId/daily-monitorings/calculate',
    options: {
      schema: {
        params: getAllDailyMonitoringsParamsDTO,
        querystring: calculateDailyMonitoringsQueryDTO,
      },
      onRequest: [verifyAccess],
    },
  })
  async calculateDailyMonitoring(
    req: FastifyRequest<{
      Params: GetAllDailyMonitoringsParams;
      Querystring: CalculateDailyMonitoringsQuery;
    }>,
  ): Promise<string> {
    await this.dailyMonitoringService.manualTriggerDailyMonitoringCalculation(
      req.params.farmingCycleId,
      req.query.taskTicketId,
    );

    return 'OK';
  }

  @GET({
    url: '/:farmingCycleId/performance',
    options: {
      schema: {
        params: getFarmingCyclePerformanceParamsDTO,
        response: {
          200: getFarmingCyclePerformanceResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async getCurrentPerformance(
    req: FastifyRequest<{
      Params: GetFarmingCyclePerformanceParams;
    }>,
  ): Promise<GetFarmingCyclePerformanceResponse> {
    const result = await this.dailyMonitoringService.getCurrentPerformance(
      req.params.farmingCycleId,
    );

    const { temperature } = await this.sensorService.getCoopSensorLatestCondition({
      farmingCycleId: req.params.farmingCycleId,
    });

    result.data.currentTemperature = (temperature && temperature.value) || null;
    return result;
  }

  @PUT({
    url: '/:farmingCycleId',
    options: {
      schema: {
        params: updateFarmingCycleParamDTO,
        body: updateFarmingCycleBodyDTO,
        response: {
          200: updateFarmingCycleResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async updateFarmingCycleById(
    request: UpdateFarmingCycleRequest,
  ): Promise<UpdateFarmingCycleResponse> {
    const farmingCycle = await this.service.updateFarmingCycle(
      request.params.farmingCycleId,
      request.body,
      request.user,
    );

    return {
      code: 200,
      data: farmingCycle,
    };
  }

  @GET({
    url: '/:farmingCycleId/repopulations',
    options: {
      schema: {
        params: repopulationParamsDTO,
        response: {
          200: getRepopulationsResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async getFarmingCycleRepopulations(
    request: GetRepopulateFarmingCycleRequest,
  ): Promise<GetRepopulationsResponse> {
    const [repopulations, count] = await this.repopulationService.getByFarmingCycleId(
      request.params.farmingCycleId,
    );

    return {
      code: 200,
      data: repopulations,
      count,
    };
  }

  @POST({
    url: '/:farmingCycleId/repopulations',
    options: {
      schema: {
        params: repopulationParamsDTO,
        body: createRepopulationBodyDTO,
        response: {
          '2xx': repopulationItemResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async farmingCycleRepopulation(
    request: RepopulateFarmingCycleRequest,
    reply: FastifyReply,
  ): Promise<RepopulationItemResponse> {
    const repopulation = await this.repopulationService.create(
      request.params.farmingCycleId,
      request.body,
      request.user,
    );

    reply.code(201);

    return {
      code: 201,
      data: repopulation,
    };
  }

  @PATCH({
    url: '/:farmingCycleId/closing/mortality-adjustment',
    options: {
      schema: {
        params: mortalityAdjustmentParamsDTO,
        body: mortalityAdjustmentBodyDTO,
        response: {
          200: setMortalityAdjustmentResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async setMortalityAdjustment(
    req: FastifyRequest<{
      Params: MortalityAdjustmentParams;
      Body: MortalityAdjustmentBody;
    }>,
  ): Promise<SetMortalityAdjustmentResponse> {
    await this.closingService.setMortalityAdjustment(req.params.farmingCycleId, req.body, req.user);

    return {
      code: 200,
      data: { message: 'set mortality adjustment success' },
    };
  }

  @GET({
    url: '/:farmingCycleId/closing/mortality-adjustment',
    options: {
      schema: {
        params: mortalityAdjustmentParamsDTO,
        response: {
          200: getMortalityAdjustmentResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async getMortalityAdjustment(
    req: FastifyRequest<{
      Params: MortalityAdjustmentParams;
    }>,
  ): Promise<GetMortalityAdjustmentResponse> {
    const data = await this.closingService.getMortalityAdjustment(req.params.farmingCycleId);

    return {
      code: 200,
      data,
    };
  }

  @GET({
    url: '/:farmingCycleId/closing/remaining-population',
    options: {
      schema: {
        params: mortalityAdjustmentParamsDTO,
        response: {
          200: getRemainingPopulationResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async getRemainingPopulation(
    req: FastifyRequest<{
      Params: MortalityAdjustmentParams;
    }>,
  ): Promise<GetRemainingPopulationResponse> {
    const [farmingCycle, remainingPopulation, margin] = await Promise.all([
      this.service.getFarmingCycleById(req.params.farmingCycleId),
      this.closingService.getRemainingPopulation(req.params.farmingCycleId),
      this.closingService.getPopulationMargin(req.params.farmingCycleId),
    ]);

    return {
      code: 200,
      data: {
        initialPopulation: farmingCycle.initialPopulation,
        remainingPopulation,
        margin,
      },
    };
  }

  @GET({
    url: '/:farmingCycleId/closing/feed-leftover',
    options: {
      schema: {
        params: feedAdjustmentParamsDTO,
        response: {
          200: getFeedLeftoverResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async getFeedLeftover(
    req: FastifyRequest<{
      Params: FeedAdjustmentParams;
    }>,
  ): Promise<GetFeedLeftoverResponse> {
    const data = await this.closingService.getFeedLeftover(req.params.farmingCycleId);

    return {
      code: 200,
      data,
    };
  }

  @GET({
    url: '/:farmingCycleId/closing/ovk-leftover',
    options: {
      schema: {
        params: ovkLeftoverParamsDTO,
        response: {
          200: getOvkLeftoverResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async getOvkLeftover(
    req: FastifyRequest<{
      Params: OvkLeftoverParams;
    }>,
  ): Promise<GetOvkLeftoverResponse> {
    const data = await this.closingService.getOvkLeftover(req.params.farmingCycleId);

    return {
      code: 200,
      data,
    };
  }

  @PATCH({
    url: '/:farmingCycleId/closing/feed-adjustment',
    options: {
      schema: {
        params: feedAdjustmentParamsDTO,
        body: feedAdjustmentBodyDTO,
        response: {
          200: setFeedAdjustmentResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async setFeedAdjustment(
    req: FastifyRequest<{
      Params: FeedAdjustmentParams;
      Body: FeedAdjustmentBody;
    }>,
  ): Promise<SetFeedAdjustmentResponse> {
    await this.closingService.setFeedAdjustment(req.params.farmingCycleId, req.body, req.user);

    return {
      code: 200,
      data: { message: 'set feed adjustment success' },
    };
  }

  @GET({
    url: '/:farmingCycleId/closing/feed-adjustment',
    options: {
      schema: {
        params: feedAdjustmentParamsDTO,
        response: {
          200: getFeedAdjustmentResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async getFeedAdjustment(
    req: FastifyRequest<{
      Params: FeedAdjustmentParams;
    }>,
  ): Promise<GetFeedAdjustmentResponse> {
    const data = await this.closingService.getFeedAdjustment(req.params.farmingCycleId);

    return {
      code: 200,
      data,
    };
  }

  @PATCH({
    url: '/:farmingCycleId/closing',
    options: {
      schema: {
        params: closingParamsDTO,
      },
      onRequest: [verifyAccess],
    },
  })
  async submitClosing(
    req: FastifyRequest<{
      Params: ClosingParams;
    }>,
  ): Promise<ClosingResponse> {
    const data = await this.closingService.closeFarmingcycle(req.params.farmingCycleId, req.user);

    return {
      code: 200,
      data,
    };
  }

  @GET({
    url: '/:farmingCycleId/closing/calculate-ip',
    options: {
      schema: {
        params: feedAdjustmentParamsDTO,
        querystring: closingQueryDTO,
        response: {
          200: getClosingIpResponseDTO,
        },
      },
      // onRequest: [verifyAccess],
    },
  })
  async getClosingIp(
    req: FastifyRequest<{
      Params: FeedAdjustmentParams;
      Querystring: ClosingQuery;
    }>,
  ): Promise<GetClosingIpResponse> {
    const data = await this.service.calculateIpClosing(req.params.farmingCycleId, req.query.feed);

    return {
      code: 200,
      data,
    };
  }

  @GET({
    url: '/:farmingCycleId/closing',
    options: {
      schema: {
        params: closingParamsDTO,
      },
    },
  })
  async getDetailClosing(
    req: FastifyRequest<{
      Params: ClosingParams;
    }>,
  ) {
    const data = await this.closingService.getDetailClosing(req.params.farmingCycleId);

    return {
      code: 200,
      data,
    };
  }

  @POST({
    url: '/:farmingCycleId/daily-reports/:dailyReportDate/revision',
    options: {
      schema: {
        params: requestDailyMonitoringRevisionParamsDTO,
        body: requestDailyMonitoringRevisionBodyDTO,
      },
      onRequest: [verifyAccess],
    },
  })
  async requestDailyReportRevision(
    req: FastifyRequest<{
      Params: RequestDailyMonitoringRevisionParams;
      Body: RequestDailyMonitoringRevisionBody;
    }>,
  ) {
    await this.farmingCycleUsecase.requestDailyMonitoringRevision(
      req.user,
      req.params.farmingCycleId,
      req.params.dailyReportDate,
      req.body,
    );
    return {
      code: 201,
      data: {},
    };
  }
}
