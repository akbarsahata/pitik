import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, GET, Inject, PATCH, POST } from 'fastify-decorators';
import {
  ApproveRejectTransferRequestParams,
  approveRejectTransferRequestParamsDTO,
  ApproveRejectTransferRequestResponse,
  approveRejectTransferRequestResponseDTO,
  ApproveTransferRequestBody,
  approveTransferRequestBodyDTO,
  CancelTransferRequestBody,
  cancelTransferRequestBodyDTO,
  CancelTransferRequestParams,
  cancelTransferRequestParamsDTO,
  CreateTransferRequestBody,
  createTransferRequestBodyDTO,
  CreateTransferRequestResponse,
  createTransferRequestResponseDTO,
  GetTransferRequestDetailParams,
  getTransferRequestDetailParamsDTO,
  GetTransferRequestDetailResponse,
  getTransferRequestDetailResponseDTO,
  getTransferRequestListQueryDTO,
  GetTransferRequestListResponse,
  getTransferRequestListResponseDTO,
  GetTransferRequestQuery,
  GetTransferRequestTargetParams,
  getTransferRequestTargetParamsDTO,
  GetTransferRequestTargetQuery,
  getTransferRequestTargetQueryDTO,
  GetTransferRequestTargetResponse,
  getTransferRequestTargetResponseDTO,
  RejectTransferRequestBody,
  rejectTransferRequestBodyDTO,
  TransferRequestParams,
  transferRequestParamsDTO,
  updateTransferRequestTargetResponseDTO,
  UpdateTransferRequestTargetResponseDTO,
} from '../../dto/transferRequest.dto';
import { TransferRequestService } from '../../services/transferRequest.service';
import { verifyAccess } from '../hooks/onRequest/verifyAccess';

@Controller({
  route: '/transfer-requests',
  type: 0,
  tags: [{ name: 'transfer-requests' }],
})
export class TransferRequestController {
  @Inject(TransferRequestService)
  private service!: TransferRequestService;

  @POST({
    url: '/',
    options: {
      schema: {
        body: createTransferRequestBodyDTO,
        response: {
          201: createTransferRequestResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async createTransferRequest(
    request: FastifyRequest<{
      Body: CreateTransferRequestBody;
    }>,
    reply: FastifyReply,
  ): Promise<CreateTransferRequestResponse> {
    reply.code(201);

    const data = await this.service.createTransferRequest(request.body, request.user);

    return { code: 201, data };
  }

  @GET({
    url: '/enter',
    options: {
      schema: {
        querystring: getTransferRequestListQueryDTO,
        response: {
          200: getTransferRequestListResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async getEnteringTransferRequestList(
    request: FastifyRequest<{
      Querystring: GetTransferRequestQuery;
    }>,
  ): Promise<GetTransferRequestListResponse> {
    const data = await this.service.getEnteringTransferRequests(request.query, request.user);

    return { code: 200, data };
  }

  @GET({
    url: '/exit',
    options: {
      schema: {
        querystring: getTransferRequestListQueryDTO,
        response: {
          200: getTransferRequestListResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async getExitingTransferRequestList(
    request: FastifyRequest<{
      Querystring: GetTransferRequestQuery;
    }>,
  ): Promise<GetTransferRequestListResponse> {
    const data = await this.service.getExitingTransferRequests(request.query, request.user);

    return { code: 200, data };
  }

  @GET({
    url: '/target-coops/:coopSourceId',
    options: {
      schema: {
        querystring: getTransferRequestTargetQueryDTO,
        params: getTransferRequestTargetParamsDTO,
        response: {
          200: getTransferRequestTargetResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async getTranferRequestTarget(
    request: FastifyRequest<{
      Querystring: GetTransferRequestTargetQuery;
      Params: GetTransferRequestTargetParams;
    }>,
  ): Promise<GetTransferRequestTargetResponse> {
    const data = await this.service.getTransferRequestTargetCoops(request.query, request.params);

    return {
      code: 200,
      data,
    };
  }

  @GET({
    url: '/:transferRequestId',
    options: {
      schema: {
        params: getTransferRequestDetailParamsDTO,
        response: {
          200: getTransferRequestDetailResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async getTransferRequestDetail(
    request: FastifyRequest<{
      Params: GetTransferRequestDetailParams;
    }>,
  ): Promise<GetTransferRequestDetailResponse> {
    const data = await this.service.getTransferRequestDetail(request.params, request.user);

    return { code: 200, data };
  }

  @PATCH({
    url: '/:transferRequestId/approve',
    options: {
      schema: {
        params: approveRejectTransferRequestParamsDTO,
        body: approveTransferRequestBodyDTO,
        response: {
          200: approveRejectTransferRequestResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async approveTransferRequest(
    request: FastifyRequest<{
      Params: ApproveRejectTransferRequestParams;
      Body: ApproveTransferRequestBody;
    }>,
  ): Promise<ApproveRejectTransferRequestResponse> {
    const data = await this.service.approveTransferRequest(
      request.params,
      request.body,
      request.user,
    );

    return { code: 200, data };
  }

  @PATCH({
    url: '/:transferRequestId/reject',
    options: {
      schema: {
        params: approveRejectTransferRequestParamsDTO,
        body: rejectTransferRequestBodyDTO,
        response: {
          200: approveRejectTransferRequestResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async rejectTransferRequest(
    request: FastifyRequest<{
      Params: ApproveRejectTransferRequestParams;
      Body: RejectTransferRequestBody;
    }>,
  ): Promise<ApproveRejectTransferRequestResponse> {
    const data = await this.service.rejectTransferRequest(
      request.params,
      request.body,
      request.user,
    );

    return { code: 200, data };
  }

  @PATCH({
    url: '/:transferRequestId/cancel',
    options: {
      schema: {
        params: cancelTransferRequestParamsDTO,
        body: cancelTransferRequestBodyDTO,
      },
      onRequest: verifyAccess,
    },
  })
  async cancelTransferRequest(
    request: FastifyRequest<{
      Params: CancelTransferRequestParams;
      Body: CancelTransferRequestBody;
    }>,
  ): Promise<string> {
    await this.service.cancelTransferRequest(request.params, request.body, request.user);

    return 'OK';
  }

  @PATCH({
    url: '/:transferRequestId',
    options: {
      schema: {
        params: transferRequestParamsDTO,
        body: createTransferRequestBodyDTO,
        response: {
          200: updateTransferRequestTargetResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async updateTransferRequest(
    request: FastifyRequest<{
      Params: TransferRequestParams;
      Body: CreateTransferRequestBody;
    }>,
  ): Promise<UpdateTransferRequestTargetResponseDTO> {
    const data = await this.service.updateTranferRequest(
      request.params.transferRequestId,
      request.body,
      request.user,
    );

    return { code: 200, data };
  }
}
