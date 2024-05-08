import { FastifyRequest } from 'fastify';
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
import { PurchaseRequestService } from '../../services/purchaseRequest.service';
import { verifyAccess } from '../hooks/onRequest/verifyAccess';

@Controller({
  route: '/purchase-requests',
  type: 0,
  tags: [{ name: 'purchase-requests' }],
})
export class PurchaseRequestController {
  @Inject(PurchaseRequestService)
  private service!: PurchaseRequestService;

  @POST({
    url: '/',
    options: {
      schema: {
        body: createPurchaseRequestBodyDTO,
        response: {
          201: createPurchaseRequestResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async createPurchaseRequest(
    request: FastifyRequest<{
      Body: CreatePurchaseRequestBody;
    }>,
  ): Promise<CreatePurchaseRequestResponse> {
    const data = await this.service.createPurchaseRequest(request.body, request.user);

    return { data };
  }

  @POST({
    url: '/ovk-doc-in',
    options: {
      schema: {
        body: createPurchaseRequestOvkBodyDTO,
        response: {
          201: createPurchaseRequestResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async createPurchaseRequestOVK(
    request: FastifyRequest<{
      Body: CreatePurchaseRequestOvkBody;
    }>,
  ): Promise<CreatePurchaseRequestResponse> {
    const data = await this.service.createPurchaseRequestOvk(request.body, request.user);

    return { data };
  }

  @GET({
    url: '/',
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
    const data = await this.service.getPurchaseRequestList(request.query, request.user);

    return { data };
  }

  @GET({
    url: '/:purchaseRequestId',
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
    const data = await this.service.getPurchaseRequestDetail(request.params, request.user);

    return { data };
  }

  @PATCH({
    url: '/:purchaseRequestId/approve',
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
    const data = await this.service.approvePurchaseRequest(
      request.params,
      request.body,
      request.user,
    );

    return { data };
  }

  @PATCH({
    url: '/:purchaseRequestId/reject',
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
    const data = await this.service.rejectPurchaseRequest(
      request.params,
      request.body,
      request.user,
    );

    return { data };
  }

  @PATCH({
    url: '/:purchaseRequestId',
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
    const data = await this.service.updatePurchaseRequest(
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
    url: '/:purchaseRequestId/cancel',
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
    const data = await this.service.cancelPurchaseRequest(
      request.params,
      request.body,
      request.user,
    );

    return { data };
  }
}
