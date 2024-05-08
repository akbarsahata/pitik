import { FastifyRequest } from 'fastify';
import { Controller, GET, Inject, PATCH, POST, PUT } from 'fastify-decorators';
import {
  ApproveRejectHarvestRequestBody,
  approveRejectHarvestRequestBodyDTO,
  ApproveRejectHarvestRequestParams,
  approveRejectHarvestRequestParamsDTO,
  ApproveRejectHarvestRequestResponse,
  approveRejectHarvestRequestResponseDTO,
  HarvestRequestDetailParams,
  harvestRequestDetailParamsDTO,
  HarvestRequestDetailResponse,
  harvestRequestDetailResponseDTO,
  HarvestRequestInput,
  harvestRequestInputDTO,
  HarvestRequestInputResponse,
  harvestRequestInputResponseDTO,
  HarvestRequestListResponse,
  harvestRequestListResponseDTO,
  HarvestRequestQueryString,
  harvestRequestQueryStringDTO,
  HarvestRequestUpdate,
  harvestRequestUpdateDTO,
  HarvestRequestUpdateParams,
  harvestRequestUpdateParamsDTO,
  HarvestRequestUpdateResponse,
  harvestRequestUpdateResponseDTO,
} from '../../dto/harvestRequest.dto';
import { HarvestRequestService } from '../../services/harvestRequest.service';
import { verifyAccess } from '../hooks/onRequest/verifyAccess';

type InsertHarvestRequestsRequest = FastifyRequest<{
  Body: HarvestRequestInput;
}>;

type UpdateHarvestRequestRequest = FastifyRequest<{
  Params: HarvestRequestUpdateParams;
  Body: HarvestRequestUpdate;
}>;

@Controller({
  route: '/harvest-requests',
  type: 0,
  tags: [{ name: 'harvest-requests' }],
})
export class HarvestRequestController {
  @Inject(HarvestRequestService)
  private service!: HarvestRequestService;

  @POST({
    url: '/',
    options: {
      schema: {
        body: harvestRequestInputDTO,
        response: {
          200: harvestRequestInputResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async insertHarvestRequest(
    request: InsertHarvestRequestsRequest,
  ): Promise<HarvestRequestInputResponse> {
    const harvestRequests = await this.service.create(request.body, request.user);

    return {
      code: 200,
      data: harvestRequests,
    };
  }

  @PUT({
    url: '/:harvestRequestId',
    options: {
      schema: {
        params: harvestRequestUpdateParamsDTO,
        body: harvestRequestUpdateDTO,
        response: {
          200: harvestRequestUpdateResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async updateHarvestRequest(
    request: UpdateHarvestRequestRequest,
  ): Promise<HarvestRequestUpdateResponse> {
    const harvestRequest = await this.service.update(
      request.params,
      {
        ...request.body,
        id: request.params.harvestRequestId,
      },
      request.user,
    );
    return {
      code: 200,
      data: harvestRequest,
    };
  }

  @GET({
    url: '/',
    options: {
      schema: {
        querystring: harvestRequestQueryStringDTO,
        response: {
          200: harvestRequestListResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async getHarvestRequestList(
    req: FastifyRequest<{
      Querystring: HarvestRequestQueryString;
    }>,
  ): Promise<HarvestRequestListResponse> {
    const data = await this.service.getHarvestRequestList(req.query, req.user);

    return {
      code: 200,
      data,
    };
  }

  @GET({
    url: '/:harvestRequestId',
    options: {
      schema: {
        params: harvestRequestDetailParamsDTO,
        response: {
          200: harvestRequestDetailResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async getHarvestRequestDetail(
    req: FastifyRequest<{
      Params: HarvestRequestDetailParams;
    }>,
  ): Promise<HarvestRequestDetailResponse> {
    const data = await this.service.getHarvestRequestDetail(req.params, req.user);

    return {
      code: 200,
      data,
    };
  }

  @PATCH({
    url: '/:harvestRequestId/approve',
    options: {
      schema: {
        body: approveRejectHarvestRequestBodyDTO,
        params: approveRejectHarvestRequestParamsDTO,
        response: {
          200: approveRejectHarvestRequestResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async approveHarvestRequest(
    request: FastifyRequest<{
      Params: ApproveRejectHarvestRequestParams;
      Body: ApproveRejectHarvestRequestBody;
    }>,
  ): Promise<ApproveRejectHarvestRequestResponse> {
    const data = await this.service.approveHarvestRequest(
      request.params,
      request.body,
      request.user,
    );

    return { data };
  }

  @PATCH({
    url: '/:harvestRequestId/reject',
    options: {
      schema: {
        body: approveRejectHarvestRequestBodyDTO,
        params: approveRejectHarvestRequestParamsDTO,
        response: {
          200: approveRejectHarvestRequestResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async rejectHarvestRequest(
    request: FastifyRequest<{
      Params: ApproveRejectHarvestRequestParams;
      Body: ApproveRejectHarvestRequestBody;
    }>,
  ): Promise<ApproveRejectHarvestRequestResponse> {
    const data = await this.service.rejectHarvestRequest(
      request.params,
      request.body,
      request.user,
    );

    return { data };
  }
}
