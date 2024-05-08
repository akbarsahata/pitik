import { FastifyRequest } from 'fastify';
import { Controller, GET, Inject, POST, PUT } from 'fastify-decorators';
import {
  CreateBuildingBody,
  createBuildingBodyDTO,
  GetBuildingByCoopIdParams,
  getBuildingByCoopIdParamsDTO,
  GetBuildingByCoopIdResponse,
  GetBuildingParams,
  getBuildingParamsDTO,
  GetBuildingResponse,
  getBuildingResponseDTO,
  GetBuildingsQuery,
  getBuildingsQueryDTO,
  GetBuildingsResponse,
  getBuildingsResponseDTO,
  UpdateBuildingBody,
  updateBuildingBodyDTO,
} from '../../dto/building.dto';
import { BuildingUsecase } from '../../usecases/building.usecase';
import { verifyAccess } from '../hooks/onRequest/verifyAccess';

@Controller({
  route: '/buildings',
  type: 0,
  tags: [{ name: 'buildings' }],
})
export class BuildingController {
  @Inject(BuildingUsecase)
  private buildingUsecase: BuildingUsecase;

  @GET({
    url: '/',
    options: {
      schema: {
        querystring: getBuildingsQueryDTO,
        response: {
          200: getBuildingsResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async get(
    req: FastifyRequest<{
      Querystring: GetBuildingsQuery;
    }>,
  ): Promise<GetBuildingsResponse> {
    const [buildings, count] = await this.buildingUsecase.get(req.query);

    return {
      code: 200,
      count,
      data: buildings,
    };
  }

  @POST({
    url: '/',
    options: {
      schema: {
        body: createBuildingBodyDTO,
        response: {
          200: getBuildingResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async create(
    req: FastifyRequest<{
      Body: CreateBuildingBody;
    }>,
  ): Promise<GetBuildingResponse> {
    const data = await this.buildingUsecase.create(req.body, req.user);

    return {
      code: 200,
      data,
    };
  }

  @GET({
    url: '/:buildingId',
    options: {
      schema: {
        params: getBuildingParamsDTO,
        response: {
          200: getBuildingResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async detail(
    req: FastifyRequest<{
      Params: GetBuildingParams;
    }>,
  ): Promise<GetBuildingResponse> {
    const data = await this.buildingUsecase.getById(req.params.buildingId);

    return {
      code: 200,
      data,
    };
  }

  @PUT({
    url: '/:buildingId',
    options: {
      schema: {
        params: getBuildingParamsDTO,
        body: updateBuildingBodyDTO,
        response: {
          200: getBuildingResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async update(
    req: FastifyRequest<{
      Body: UpdateBuildingBody;
      Params: GetBuildingParams;
    }>,
  ): Promise<GetBuildingResponse> {
    const data = await this.buildingUsecase.update(req.user, req.body, req.params.buildingId);

    return {
      code: 200,
      data,
    };
  }

  @GET({
    url: '/coops/:coopId',
    options: {
      schema: {
        params: getBuildingByCoopIdParamsDTO,
      },
      onRequest: [verifyAccess],
    },
  })
  async getBuildingByCoopId(
    req: FastifyRequest<{
      Params: GetBuildingByCoopIdParams;
    }>,
  ): Promise<GetBuildingByCoopIdResponse> {
    const [result, count] = await this.buildingUsecase.getBuildingByCoopId(req.params.coopId);

    return {
      code: 200,
      count,
      data: result,
    };
  }
}
