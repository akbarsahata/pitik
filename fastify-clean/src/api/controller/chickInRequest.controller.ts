import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, GET, Inject, PATCH, POST } from 'fastify-decorators';
import {
  ApproveChickInRequestBody,
  approveChickInRequestBodyDTO,
  ApproveChickInRequestParams,
  approveChickInRequestParamsDTO,
  ApproveChickInRequestResponse,
  approveChickInRequestResponseDTO,
  CreateChickInRequestBody,
  createChickInRequestBodyDTO,
  CreateChickInRequestResponse,
  createChickInRequestResponseDTO,
  GetChickInRequestDetailParams,
  getChickInRequestDetailParamsDTO,
  GetChickInRequestDetailResponse,
  getChickInRequestDetailResponseDTO,
  RejectChickInRequestBody,
  RejectChickInRequestParams,
  RejectChickInRequestResponse,
  UpdateChickInRequestBody,
  updateChickInRequestBodyDTO,
  UpdateChickInRequestParams,
  updateChickInRequestParamsDTO,
  UpdateChickInRequestResponse,
  updateChickInRequestResponseDTO,
} from '../../dto/chickInRequest.dto';
import { ChickInRequestService } from '../../services/chickInRequest.service';
import { verifyAccess } from '../hooks/onRequest/verifyAccess';

@Controller({
  route: '/chick-in-requests',
  type: 0,
  tags: [{ name: 'chick-in-requests' }],
})
export class ChickInRequestController {
  @Inject(ChickInRequestService)
  private service!: ChickInRequestService;

  @POST({
    url: '/',
    options: {
      schema: {
        body: createChickInRequestBodyDTO,
        response: {
          201: createChickInRequestResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async createChickInRequest(
    request: FastifyRequest<{
      Body: CreateChickInRequestBody;
    }>,
    reply: FastifyReply,
  ): Promise<CreateChickInRequestResponse> {
    const chickInReq = await this.service.createChickIn(request.body, request.user);

    reply.code(201);

    return {
      code: 201,
      data: chickInReq,
    };
  }

  @PATCH({
    url: '/:chickInReqId',
    options: {
      schema: {
        params: updateChickInRequestParamsDTO,
        body: updateChickInRequestBodyDTO,
        response: {
          200: updateChickInRequestResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async updateChickInRequest(
    request: FastifyRequest<{
      Body: UpdateChickInRequestBody;
      Params: UpdateChickInRequestParams;
    }>,
  ): Promise<UpdateChickInRequestResponse> {
    const data = await this.service.updateChickInRequest(
      request.params,
      request.body,
      request.user,
    );

    return {
      code: 200,
      data,
    };
  }

  @GET({
    url: '/:chickInReqId',
    options: {
      schema: {
        params: getChickInRequestDetailParamsDTO,
        response: {
          200: getChickInRequestDetailResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async getChickInRequestDetail(
    request: FastifyRequest<{
      Params: GetChickInRequestDetailParams;
    }>,
  ): Promise<GetChickInRequestDetailResponse> {
    const data = await this.service.getChickInRequestDetail(request.params.chickInReqId);

    return { code: 200, data };
  }

  @PATCH({
    url: '/:chickInReqId/approve',
    options: {
      schema: {
        params: approveChickInRequestParamsDTO,
        body: approveChickInRequestBodyDTO,
        response: {
          200: approveChickInRequestResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async approveChickInRequest(
    request: FastifyRequest<{
      Params: ApproveChickInRequestParams;
      Body: ApproveChickInRequestBody;
    }>,
  ): Promise<ApproveChickInRequestResponse> {
    const data = await this.service.approveChickIn(
      request.params.chickInReqId,
      request.body,
      request.user,
    );

    return {
      code: 200,
      data,
    };
  }

  @PATCH({
    url: '/:chickInReqId/reject',
    options: {
      schema: {
        params: approveChickInRequestParamsDTO,
        body: approveChickInRequestBodyDTO,
        response: {
          200: approveChickInRequestResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async rejectChickInRequest(
    request: FastifyRequest<{
      Params: RejectChickInRequestParams;
      Body: RejectChickInRequestBody;
    }>,
  ): Promise<RejectChickInRequestResponse> {
    const rejectedChickIn = await this.service.rejectChickIn(
      request.params.chickInReqId,
      request.body,
      request.user,
    );

    return {
      code: 200,
      data: rejectedChickIn,
    };
  }
}
