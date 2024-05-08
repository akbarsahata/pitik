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
  UpdateTransferRequestBody,
  updateTransferRequestBodyDTO,
  UpdateTransferRequestResponse,
  updateTransferRequestResponseDTO,
} from '../../dto/transferRequest.dto';
import { TransferRequestUsecase } from '../../usecases/transferRequest.usecase';
import { verifyAccess } from '../hooks/onRequest/verifyAccess';

@Controller({
  route: '/transfer-requests',
  type: 0,
  tags: [{ name: 'transfer-requests' }],
})
export class TransferRequestController {
  @Inject(TransferRequestUsecase)
  private usecase!: TransferRequestUsecase;

  @POST({
    url: '/',
    options: {
      schema: {
        body: createTransferRequestBodyDTO,
        response: {
          '2xx': createTransferRequestResponseDTO,
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

    const data = await this.usecase.createTransferRequest(request.body, request.user);

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
    const data = await this.usecase.getEnteringTransferRequests(request.query, request.user);

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
    const data = await this.usecase.getExitingTransferRequests(request.query, request.user);

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
    const data = await this.usecase.getTransferRequestTargetCoops(request.query, request.params);

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
    const data = await this.usecase.getTransferRequestDetail(request.params, request.user);

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
    const data = await this.usecase.approveTransferRequest(
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
    const data = await this.usecase.rejectTransferRequest(
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
    await this.usecase.cancelTransferRequest(request.params, request.body, request.user);

    return 'OK';
  }

  @PATCH({
    url: '/:transferRequestId',
    options: {
      schema: {
        params: transferRequestParamsDTO,
        body: updateTransferRequestBodyDTO,
        response: {
          200: updateTransferRequestResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async updateTransferRequest(
    request: FastifyRequest<{
      Params: TransferRequestParams;
      Body: UpdateTransferRequestBody;
    }>,
  ): Promise<UpdateTransferRequestResponse> {
    const data = await this.usecase.updateTransferRequest(
      request.params.transferRequestId,
      request.body,
      request.user,
    );

    return {
      code: 200,
      data: { ...data, coopSourceId: data.coopSourceId!, coopTargetId: data.coopTargetId! },
    };
  }
}
