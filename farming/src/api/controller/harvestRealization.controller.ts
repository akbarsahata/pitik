import { FastifyRequest } from 'fastify';
import { Controller, GET, Inject, POST, PUT } from 'fastify-decorators';
import {
  HarvestRealizationDealInput,
  harvestRealizationDealInputDTO,
  HarvestRealizationDealUpdate,
  harvestRealizationDealUpdateDTO,
  HarvestRealizationDetailParams,
  harvestRealizationDetailParamsDTO,
  HarvestRealizationDetailResponse,
  harvestRealizationDetailResponseDTO,
  HarvestRealizationInput,
  harvestRealizationInputDTO,
  HarvestRealizationInputResponse,
  harvestRealizationInputResponseDTO,
  HarvestRealizationListParams,
  harvestRealizationListParamsDTO,
  HarvestRealizationListResponse,
  harvestRealizationListResponseDTO,
  HarvestRealizationUpdate,
  harvestRealizationUpdateDTO,
  HarvestRealizationUpdateParams,
  harvestRealizationUpdateParamsDTO,
  HarvestRealizationUpdateResponse,
  harvestRealizationUpdateResponseDTO,
} from '../../dto/harvestRealization.dto';
import { HarvestRealizationService } from '../../services/harvestRealization.service';
import { verifyAccess } from '../hooks/onRequest/verifyAccess';

type InsertHarvestRealizationRequest = FastifyRequest<{
  Body: HarvestRealizationInput;
}>;

type UpdateHarvestRealizationRequest = FastifyRequest<{
  Params: HarvestRealizationUpdateParams;
  Body: HarvestRealizationUpdate;
}>;

type InsertHarvestRealizationDealRequest = FastifyRequest<{
  Body: HarvestRealizationDealInput;
}>;

type UpdateHarvestRealizationDealRequest = FastifyRequest<{
  Params: HarvestRealizationUpdateParams;
  Body: HarvestRealizationDealUpdate;
}>;

@Controller({
  route: '/harvest-realizations',
  type: 0,
  tags: [{ name: 'harvest-realizations' }],
})
export class HarvestRealizationController {
  @Inject(HarvestRealizationService)
  private service!: HarvestRealizationService;

  @POST({
    url: '/',
    options: {
      schema: {
        body: harvestRealizationInputDTO,
        response: {
          200: harvestRealizationInputResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async insertHarvestRealization(
    request: InsertHarvestRealizationRequest,
  ): Promise<HarvestRealizationInputResponse> {
    const harvestRealization = await this.service.create(request.body, request.user);

    return {
      code: 200,
      data: harvestRealization,
    };
  }

  @PUT({
    url: '/:harvestRealizationId',
    options: {
      schema: {
        params: harvestRealizationUpdateParamsDTO,
        body: harvestRealizationUpdateDTO,
        response: {
          200: harvestRealizationUpdateResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async updateHarvestRealization(
    request: UpdateHarvestRealizationRequest,
  ): Promise<HarvestRealizationUpdateResponse> {
    const harvestRealization = await this.service.update(
      request.params,
      {
        ...request.body,
        id: request.params.harvestRealizationId,
      },
      request.user,
    );
    return {
      code: 200,
      data: harvestRealization,
    };
  }

  @GET({
    url: '/',
    options: {
      schema: {
        querystring: harvestRealizationListParamsDTO,
        response: {
          200: harvestRealizationListResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async getHarvestRealizationList(
    req: FastifyRequest<{
      Querystring: HarvestRealizationListParams;
    }>,
  ): Promise<HarvestRealizationListResponse> {
    const data = await this.service.getHarvestRealizationList(req.query);

    return {
      code: 200,
      data,
    };
  }

  @GET({
    url: '/:harvestRealizationId',
    options: {
      schema: {
        params: harvestRealizationDetailParamsDTO,
        response: {
          200: harvestRealizationDetailResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async getHarvestRealizationDetail(
    req: FastifyRequest<{
      Params: HarvestRealizationDetailParams;
    }>,
  ): Promise<HarvestRealizationDetailResponse> {
    const data = await this.service.getHarvestRealizationDetail(req.params);

    return {
      code: 200,
      data,
    };
  }

  @POST({
    url: '/with-deal',
    options: {
      schema: {
        body: harvestRealizationDealInputDTO,
        response: {
          200: harvestRealizationInputResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async insertHarvestRealizationDeal(
    request: InsertHarvestRealizationDealRequest,
  ): Promise<HarvestRealizationInputResponse> {
    const harvestRealization = await this.service.createWithDeal(request.body, request.user);

    return {
      code: 200,
      data: harvestRealization,
    };
  }

  @PUT({
    url: '/with-deal/:harvestRealizationId',
    options: {
      schema: {
        params: harvestRealizationUpdateParamsDTO,
        body: harvestRealizationDealUpdateDTO,
        response: {
          200: harvestRealizationUpdateResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async updateHarvestRealizationDeal(
    request: UpdateHarvestRealizationDealRequest,
  ): Promise<HarvestRealizationUpdateResponse> {
    const harvestRealization = await this.service.updateWithDeal(
      request.params,
      {
        ...request.body,
        id: request.params.harvestRealizationId,
      },
      request.user,
    );
    return {
      code: 200,
      data: harvestRealization,
    };
  }
}
