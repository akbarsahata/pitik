import { FastifyRequest } from 'fastify';
import { Controller, DELETE, GET, Inject, POST, PUT } from 'fastify-decorators';
import {
  CreateRealizationBody,
  createRealizationBodyDTO,
  DeleteRealizationResponse,
  deleteRealizationResponseDTO,
  GetFarmingCycleDetailParam,
  getFarmingCycleDetailParamDTO,
  GetFarmingCycleDetailResponse,
  getFarmingCycleDetailResponseDTO,
  GetFarmingCycleHarvestsQuery,
  getFarmingCycleHarvestsQueryDTO,
  GetFarmingCycleHarvestsResponse,
  getFarmingCycleHarvestsResponseDTO,
  GetHarvestRealizationQuery,
  getHarvestRealizationQueryDTO,
  GetHarvestRealizationResponse,
  getHarvestRealizationResponseDTO,
  GetRealizationDetailParam,
  getRealizationDetailParamDTO,
  GetRealizationDetailResponse,
  getRealizationDetailResponseDTO,
  UpdateRealizationBody,
  updateRealizationBodyDTO,
} from '../../dto/harvest.dto';
import { ERR_FARM_CYCLE_NOT_FOUND } from '../../libs/constants/errors';
import { HarvestService } from '../../services/harvest.service';
import { HarvestRealizationService } from '../../services/harvestRealization.service';
import { verifyAccess } from '../hooks/onRequest/verifyAccess';

@Controller('/harvests')
export class HarvestController {
  @Inject(HarvestService)
  private harvestService: HarvestService;

  @Inject(HarvestRealizationService)
  private harvestRealizationService: HarvestRealizationService;

  @GET({
    url: '/farming-cycles',
    options: {
      schema: {
        querystring: getFarmingCycleHarvestsQueryDTO,
        response: {
          200: getFarmingCycleHarvestsResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async getFarmingCycleHarvest(
    request: FastifyRequest<{
      Querystring: GetFarmingCycleHarvestsQuery;
    }>,
  ): Promise<GetFarmingCycleHarvestsResponse> {
    const [farmingCycles, count] = await this.harvestService.getFarmingCycleHarvests({
      filter: request.query,
      user: request.user,
    });

    return {
      code: 200,
      data: {
        count,
        farmingCycles,
      },
    };
  }

  @GET({
    url: '/farming-cycles/:farmingCycleId',
    options: {
      schema: {
        params: getFarmingCycleDetailParamDTO,
        response: {
          200: getFarmingCycleDetailResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async getFarmingCycleDetail(
    request: FastifyRequest<{
      Params: GetFarmingCycleDetailParam;
    }>,
  ): Promise<GetFarmingCycleDetailResponse> {
    const [farmingCycles] = await this.harvestService.getFarmingCycleHarvests({
      filter: {
        $limit: 1,
        $page: 1,
        farmingCycleId: request.params.farmingCycleId,
      },
      user: request.user,
    });

    if (farmingCycles.length < 1) throw ERR_FARM_CYCLE_NOT_FOUND();

    return {
      code: 200,
      data: farmingCycles[0],
    };
  }

  @GET({
    url: '/farming-cycles/:farmingCycleId/realizations',
    options: {
      schema: {
        params: getFarmingCycleDetailParamDTO,
        querystring: getHarvestRealizationQueryDTO,
        response: {
          200: getHarvestRealizationResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async getRealizations(
    request: FastifyRequest<{
      Params: GetFarmingCycleDetailParam;
      Querystring: GetHarvestRealizationQuery;
    }>,
  ): Promise<GetHarvestRealizationResponse> {
    const [realizations, count] = await this.harvestService.getHarvestRealizations({
      farmingCycleId: request.params.farmingCycleId,
      filter: request.query,
    });

    return {
      code: 200,
      data: {
        count,
        realizations,
      },
    };
  }

  @GET({
    url: '/farming-cycles/:farmingCycleId/realizations/:realizationId',
    options: {
      schema: {
        params: getRealizationDetailParamDTO,
        response: {
          200: getRealizationDetailResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async getHarvestRealizationDetail(
    request: FastifyRequest<{
      Params: GetRealizationDetailParam;
    }>,
  ): Promise<GetRealizationDetailResponse> {
    const realizationDetail = await this.harvestRealizationService.getHarvestRealizationDetailFMS({
      farmingCycleId: request.params.farmingCycleId,
      realizationId: request.params.realizationId,
    });

    return {
      code: 200,
      data: realizationDetail,
    };
  }

  @POST({
    url: '/farming-cycles/:farmingCycleId/realizations',
    options: {
      schema: {
        params: getFarmingCycleDetailParamDTO,
        body: createRealizationBodyDTO,
        response: {
          200: getRealizationDetailResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async createRealization(
    request: FastifyRequest<{
      Body: CreateRealizationBody;
      Params: GetFarmingCycleDetailParam;
    }>,
  ): Promise<GetRealizationDetailResponse> {
    const realizationDetail = await this.harvestRealizationService.createFromFMS({
      body: request.body,
      farmingCycleId: request.params.farmingCycleId,
      user: request.user,
    });

    return {
      code: 200,
      data: realizationDetail,
    };
  }

  @PUT({
    url: '/farming-cycles/:farmingCycleId/realizations/:realizationId',
    options: {
      schema: {
        params: getRealizationDetailParamDTO,
        body: updateRealizationBodyDTO,
        response: {
          200: getRealizationDetailResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async updateRealization(
    request: FastifyRequest<{
      Body: UpdateRealizationBody;
      Params: GetRealizationDetailParam;
    }>,
  ): Promise<GetRealizationDetailResponse> {
    const realizationDetail = await this.harvestRealizationService.updateFromFMS({
      body: request.body,
      farmingCycleId: request.params.farmingCycleId,
      realizationId: request.params.realizationId,
      user: request.user,
    });

    return {
      code: 200,
      data: realizationDetail,
    };
  }

  @DELETE({
    url: '/farming-cycles/:farmingCycleId/realizations/:realizationId',
    options: {
      schema: {
        params: getRealizationDetailParamDTO,
        response: {
          200: deleteRealizationResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async deleteRealization(
    request: FastifyRequest<{
      Params: GetRealizationDetailParam;
    }>,
  ): Promise<DeleteRealizationResponse> {
    await this.harvestRealizationService.deleteRealizationFMS({
      farmingCycleId: request.params.farmingCycleId,
      realizationId: request.params.realizationId,
      user: request.user,
    });

    return {
      code: 200,
      data: {
        message: 'OK',
      },
    };
  }
}
