import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, GET, Inject, PATCH, POST } from 'fastify-decorators';
import {
  ApprovePurchaseRequestBody,
  approvePurchaseRequestBodyDTO,
  ApproveRejectPurchaseRequestParams,
  approveRejectPurchaseRequestParamsDTO,
  ApproveRejectPurchaseRequestResponse,
  approveRejectPurchaseRequestResponseDTO,
  CreatePurchaseRequestBody,
  createPurchaseRequestBodyDTO,
  CreatePurchaseRequestOvkBody,
  createPurchaseRequestOvkBodyDTO,
  CreatePurchaseRequestResponse,
  createPurchaseRequestResponseDTO,
  CreatePurchaseRequestSapronakBody,
  createPurchaseRequestSapronakBodyDTO,
  GetDetailPurchaseRequestParams,
  getDetailPurchaseRequestParamsDTO,
  GetDetailPurchaseRequestResponse,
  getDetailPurchaseRequestResponseDTO,
  GetListPurchaseRequestQuery,
  getListPurchaseRequestQueryDTO,
  GetlistPurchaseRequestResponse,
  getlistPurchaseRequestResponseDTO,
  RejectPurchaseRequestBody,
  rejectPurchaseRequestBodyDTO,
  UpdatePurchaseRequestBody,
  updatePurchaseRequestBodyDTO,
  UpdatePurchaseRequestResponseDTO,
  updatePurchaseRequestResponseDTO,
} from '../../dto/purchaseRequest.dto';
import { PurchaseRequestUsecase } from '../../usecases/purchaseRequest.usecase';
import { verifyAccess } from '../hooks/onRequest/verifyAccess';

@Controller({
  route: '/',
  type: 0,
  tags: [{ name: 'purchase-requests' }],
})
export class PurchaseRequestController {
  @Inject(PurchaseRequestUsecase)
  private usecase!: PurchaseRequestUsecase;

  @POST({
    url: '/purchase-requests',
    options: {
      schema: {
        body: createPurchaseRequestBodyDTO,
        response: {
          '2xx': createPurchaseRequestResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async createPurchaseRequest(
    request: FastifyRequest<{
      Body: CreatePurchaseRequestBody;
    }>,
    reply: FastifyReply,
  ): Promise<CreatePurchaseRequestResponse> {
    const data = await this.usecase.createPurchaseRequest(request.body, request.user);

    reply.status(201);

    return { code: 201, data };
  }

  @POST({
    url: '/purchase-requests/ovk-doc-in',
    options: {
      schema: {
        body: createPurchaseRequestOvkBodyDTO,
        response: {
          '2xx': createPurchaseRequestResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async createPurchaseRequestOvk(
    request: FastifyRequest<{
      Body: CreatePurchaseRequestOvkBody;
    }>,
  ): Promise<CreatePurchaseRequestResponse> {
    const data = await this.usecase.createPurchaseRequestAndInternalTransferRequestSapronak(
      { ...request.body, type: 'ovk' },
      request.user,
    );

    return { code: 201, data };
  }

  @POST({
    url: '/purchase-requests/sapronak-doc-in',
    options: {
      schema: {
        body: createPurchaseRequestSapronakBodyDTO,
        response: {
          '2xx': createPurchaseRequestResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async createPurchaseRequestSapronak(
    request: FastifyRequest<{
      Body: CreatePurchaseRequestSapronakBody;
    }>,
  ): Promise<CreatePurchaseRequestResponse> {
    const data = await this.usecase.createPurchaseRequestAndInternalTransferRequestSapronak(
      request.body,
      request.user,
    );

    return { code: 201, data };
  }

  @GET({
    url: '/purchase-requests',
    options: {
      schema: {
        querystring: getListPurchaseRequestQueryDTO,
        response: {
          200: getlistPurchaseRequestResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async listPurchaseRequest(
    request: FastifyRequest<{
      Querystring: GetListPurchaseRequestQuery;
    }>,
  ): Promise<GetlistPurchaseRequestResponse> {
    const [data, count] = await this.usecase.getPurchaseRequestList(request.query, request.user);

    return { code: 200, data, count };
  }

  @GET({
    url: '/purchase-requests/:purchaseRequestId',
    options: {
      schema: {
        params: getDetailPurchaseRequestParamsDTO,
        response: {
          200: getDetailPurchaseRequestResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async getDetailPurchaseRequest(
    request: FastifyRequest<{
      Params: GetDetailPurchaseRequestParams;
    }>,
  ): Promise<GetDetailPurchaseRequestResponse> {
    const data = await this.usecase.getPurchaseRequestDetail(request.params);

    return { code: 200, data };
  }

  @PATCH({
    url: '/purchase-requests/:purchaseRequestId/approve',
    options: {
      schema: {
        body: approvePurchaseRequestBodyDTO,
        params: approveRejectPurchaseRequestParamsDTO,
        response: {
          200: approveRejectPurchaseRequestResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async approvePurchaseRequest(
    request: FastifyRequest<{
      Params: ApproveRejectPurchaseRequestParams;
      Body: ApprovePurchaseRequestBody;
    }>,
  ): Promise<ApproveRejectPurchaseRequestResponse> {
    const data = await this.usecase.approvePurchaseRequestAndInternalTransferRequest(
      request.params,
      request.body,
      request.user,
    );

    return { data };
  }

  @PATCH({
    url: '/purchase-requests/:purchaseRequestId/reject',
    options: {
      schema: {
        body: rejectPurchaseRequestBodyDTO,
        params: approveRejectPurchaseRequestParamsDTO,
        response: {
          200: approveRejectPurchaseRequestResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async rejectPurchaseRequest(
    request: FastifyRequest<{
      Params: ApproveRejectPurchaseRequestParams;
      Body: RejectPurchaseRequestBody;
    }>,
  ): Promise<ApproveRejectPurchaseRequestResponse> {
    const data = await this.usecase.rejectPurchaseRequest(
      request.params,
      request.body,
      request.user,
    );

    return { data };
  }

  @POST({
    url: '/internal/purchase-requests/:purchaseRequestId/reject',
    options: {
      schema: {
        tags: ['internal'],
        body: rejectPurchaseRequestBodyDTO,
        params: approveRejectPurchaseRequestParamsDTO,
        response: {
          200: approveRejectPurchaseRequestResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async rejectPurchaseRequestByProcurement(
    request: FastifyRequest<{
      Params: ApproveRejectPurchaseRequestParams;
      Body: RejectPurchaseRequestBody;
    }>,
  ): Promise<ApproveRejectPurchaseRequestResponse> {
    const data = await this.usecase.rejectPurchaseRequestByProcurement(
      request.params,
      request.body,
      request.user,
    );

    return { data };
  }

  @PATCH({
    url: '/purchase-requests/:purchaseRequestId',
    options: {
      schema: {
        body: updatePurchaseRequestBodyDTO,
        params: getDetailPurchaseRequestParamsDTO,
        response: {
          200: updatePurchaseRequestResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async updatePurchaseRequest(
    request: FastifyRequest<{
      Params: GetDetailPurchaseRequestParams;
      Body: UpdatePurchaseRequestBody;
    }>,
  ): Promise<UpdatePurchaseRequestResponseDTO> {
    const data = await this.usecase.updatePurchaseRequestAndInternalTransferRequest(
      request.params,
      request.body,
      request.user,
    );

    return {
      code: 200,
      data,
    };
  }

  @PATCH({
    url: '/purchase-requests/:purchaseRequestId/cancel',
    options: {
      schema: {
        body: rejectPurchaseRequestBodyDTO,
        params: approveRejectPurchaseRequestParamsDTO,
        response: {
          200: approveRejectPurchaseRequestResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async cancelPurchaseRequest(
    request: FastifyRequest<{
      Params: ApproveRejectPurchaseRequestParams;
      Body: RejectPurchaseRequestBody;
    }>,
  ): Promise<ApproveRejectPurchaseRequestResponse> {
    const data = await this.usecase.cancelPurchaseRequestAndInternalTransferRequest(
      request.params,
      request.body,
      request.user,
    );

    return { data };
  }

  @PATCH({
    url: '/purchase-requests/sapronak-doc-in/:purchaseRequestId',
    options: {
      schema: {
        body: updatePurchaseRequestBodyDTO,
        params: getDetailPurchaseRequestParamsDTO,
        response: {
          200: updatePurchaseRequestResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async updatePurchaseRequestSapronakDocIn(
    request: FastifyRequest<{
      Params: GetDetailPurchaseRequestParams;
      Body: UpdatePurchaseRequestBody;
    }>,
  ): Promise<UpdatePurchaseRequestResponseDTO> {
    const data = await this.usecase.updatePurchaseRequestAndInternalTransferRequest(
      request.params,
      request.body,
      request.user,
    );

    return {
      code: 200,
      data,
    };
  }
}
