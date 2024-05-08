import { FastifyRequest } from 'fastify';
import { Controller, GET, Inject, POST, PUT } from 'fastify-decorators';
import {
  activeFarmingCycleResponseDTO,
  CreateFarmBody,
  createFarmBodyDTO,
  CreateFarmResponse,
  createFarmResponseDTO,
  GetFarmByIdParam,
  getFarmByIdParamDTO,
  GetFarmByIdResponse,
  getFarmByIdResponseDTO,
  GetFarmsQuery,
  getFarmsQueryDTO,
  GetFarmsResponse,
  getFarmsResponseDTO,
  UpdateFarmBody,
  updateFarmBodyDTO,
  UpdateFarmParam,
  updateFarmParamDTO,
  UpdateFarmResponse,
  updateFarmResponseDTO,
} from '../../dto/farm.dto';
import { FarmUsecase } from '../../usecases/farm.usecase';
import { verifyAccess } from '../hooks/onRequest/verifyAccess';

type ActiveFarmingCycleRequest = FastifyRequest;

type CreateFarmRequest = FastifyRequest<{
  Body: CreateFarmBody;
}>;

type GetFarmsRequest = FastifyRequest<{
  Querystring: GetFarmsQuery;
}>;

type GetFarmByIdRequest = FastifyRequest<{
  Params: GetFarmByIdParam;
}>;

type UpdateFarmRequest = FastifyRequest<{
  Params: UpdateFarmParam;
  Body: UpdateFarmBody;
}>;

@Controller({
  route: '/farms',
  type: 0,
  tags: [{ name: 'farms' }],
})
export class FarmController {
  @Inject(FarmUsecase)
  private usecase!: FarmUsecase;

  @GET({
    url: '/active-farming-cycle',
    options: {
      schema: {
        response: {
          200: activeFarmingCycleResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async getActiveFarmingCycles(request: ActiveFarmingCycleRequest) {
    const activeFarmingCycles = await this.usecase.getActiveFarmingCycle(request.user);

    return {
      code: 200,
      data: activeFarmingCycles,
    };
  }

  @POST({
    url: '/',
    options: {
      schema: {
        body: createFarmBodyDTO,
        response: {
          '2xx': createFarmResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async create(request: CreateFarmRequest): Promise<CreateFarmResponse> {
    const farm = await this.usecase.createFarm(request.body, request.user);
    return {
      code: 201,
      data: farm,
    };
  }

  @GET({
    url: '/',
    options: {
      schema: {
        querystring: getFarmsQueryDTO,
        response: {
          200: getFarmsResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async getFarms(request: GetFarmsRequest): Promise<GetFarmsResponse> {
    const [farms, count] = await this.usecase.getFarms(request.query);
    return {
      code: 200,
      count,
      data: farms.map((farm) => ({
        ...farm,
        branchCode: farm.branch?.code || '',
        branchName: farm.branch?.name || '',
        provinceName: farm.province.provinceName,
        cityName: farm.city.cityName,
        districtName: farm.district.districtName,
        ownerName: farm.owner.fullName,
        modifiedDate: farm.modifiedDate.toISOString(),
        modifiedBy: farm.userModifier?.fullName || farm.modifiedBy,
      })),
    };
  }

  @GET({
    url: '/:id',
    options: {
      schema: {
        params: getFarmByIdParamDTO,
        response: {
          200: getFarmByIdResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async getFarmById(request: GetFarmByIdRequest): Promise<GetFarmByIdResponse> {
    const farm = await this.usecase.getFarmById(request.params.id);
    return {
      code: 200,
      data: {
        ...farm,
        branchId: farm.branch?.id || '',
        branchCode: farm.branch?.code || '',
        branchName: farm.branch?.name || '',
        provinceName: farm.province.provinceName,
        cityName: farm.city.cityName,
        districtName: farm.district.districtName,
        ownerName: farm.owner.fullName,
        modifiedDate: farm.modifiedDate.toISOString(),
      },
    };
  }

  @PUT({
    url: '/:id',
    options: {
      schema: {
        params: updateFarmParamDTO,
        body: updateFarmBodyDTO,
        response: {
          200: updateFarmResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async updateFarm(request: UpdateFarmRequest): Promise<UpdateFarmResponse> {
    const farm = await this.usecase.updateFarm(
      request.params.id,
      {
        ...request.body,
        id: request.params.id, // override id from params
      },
      request.user,
    );
    return {
      code: 200,
      data: {
        ...farm,
        modifiedDate: farm.modifiedDate.toISOString(),
      },
    };
  }
}
