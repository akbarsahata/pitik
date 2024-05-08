import { FastifyRequest } from 'fastify';
import { Controller, GET, Inject, POST } from 'fastify-decorators';
import {
  CreateHarvestDealBody,
  createHarvestDealBodyDTO,
  CreateHarvestDealResponse,
  createHarvestDealResponseDTO,
  GetHarvestDealDetailParams,
  getHarvestDealDetailParamsDTO,
  GetHarvestDealDetailResponse,
  getHarvestDealDetailResponseDTO,
  GetHarvestDealListQuery,
  getHarvestDealListQueryDTO,
  GetHarvestDealListResponse,
  getHarvestDealListResponseDTO,
} from '../../dto/harvestDeal.dto';
import { HarvestDealService } from '../../services/harvestDeal.service';
import { verifyAccess } from '../hooks/onRequest/verifyAccess';

@Controller({
  route: '/',
  type: 0,
  tags: [{ name: 'harvest-deals' }],
})
export class HarvestDealController {
  @Inject(HarvestDealService)
  private service: HarvestDealService;

  @GET({
    url: '/harvest-deals',
    options: {
      schema: {
        querystring: getHarvestDealListQueryDTO,
        response: {
          200: getHarvestDealListResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async getHarvestDealList(
    req: FastifyRequest<{
      Querystring: GetHarvestDealListQuery;
    }>,
  ): Promise<GetHarvestDealListResponse> {
    const data = await this.service.getHarvestDealList(req.query);

    return {
      code: 200,
      data,
    };
  }

  @GET({
    url: '/harvest-deals/:harvestDealId',
    options: {
      schema: {
        params: getHarvestDealDetailParamsDTO,
        response: {
          200: getHarvestDealDetailResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async getHarvestDealDetail(
    req: FastifyRequest<{
      Params: GetHarvestDealDetailParams;
    }>,
  ): Promise<GetHarvestDealDetailResponse> {
    const data = await this.service.getHarvestDealDetail(req.params);

    return {
      code: 200,
      data,
    };
  }

  @POST({
    url: '/internal/harvest-deals',
    options: {
      schema: {
        tags: ['internal'],
        body: createHarvestDealBodyDTO,
        response: {
          200: createHarvestDealResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async internalCreateHarvestDeal(
    req: FastifyRequest<{
      Body: CreateHarvestDealBody;
    }>,
  ): Promise<CreateHarvestDealResponse> {
    await this.service.createHarvestDeal(req.body, req.user);

    return { code: 200 };
  }
}
