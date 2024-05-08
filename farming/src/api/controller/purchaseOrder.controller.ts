import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, GET, Inject, POST } from 'fastify-decorators';
import {
  CreatePurchaseOrderResponse,
  createPurchaseOrderResponseDTO,
  GetFeedHistoryParams,
  getFeedHistoryParamsDTO,
  GetFeedHistoryResponse,
  getFeedHistoryResponseDTO,
  GetOvkHistoryParams,
  getOvkHistoryParamsDTO,
  GetOvkHistoryResponse,
  getOvkHistoryResponseDTO,
  GetPurchaseOrderDetailParams,
  getPurchaseOrderDetailParamsDTO,
  GetPurchaseOrderDetailResponse,
  getPurchaseOrderDetailResponseDTO,
  GetPurchaseOrderQuery,
  getPurchaseOrderQueryDTO,
  GetPurchaseOrderResponse,
  getPurchaseOrderResponseDTO,
  PurchaseOrderFulfilledBody,
  purchaseOrderFulfilledBodyDTO,
  PurchaseOrderFulfilledResponse,
  purchaseOrderFulfilledResponseDTO,
  UpsertPurchaseOrderBody,
  upsertPurchaseOrderBodyDTO,
} from '../../dto/purchaseOrder.dto';
import { PurchaseOrderService } from '../../services/purchaseOrder.service';
import { verifyAccess } from '../hooks/onRequest/verifyAccess';

@Controller({
  route: '/',
  type: 0,
  tags: [{ name: 'purchase-orders' }],
})
export class PurchaseOrderController {
  @Inject(PurchaseOrderService)
  private service: PurchaseOrderService;

  @GET({
    url: '/purchase-orders',
    options: {
      schema: {
        querystring: getPurchaseOrderQueryDTO,
        response: {
          200: getPurchaseOrderResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async getPurchaseOrderList(
    request: FastifyRequest<{
      Querystring: GetPurchaseOrderQuery;
    }>,
  ): Promise<GetPurchaseOrderResponse> {
    const [data, count] = await this.service.getPurchaseOrderList(request.query);

    return { code: 200, data, count };
  }

  @GET({
    url: '/purchase-orders/:purchaseOrderId',
    options: {
      schema: {
        params: getPurchaseOrderDetailParamsDTO,
        response: {
          200: getPurchaseOrderDetailResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async getPurchaseOrderDetail(
    request: FastifyRequest<{
      Params: GetPurchaseOrderDetailParams;
    }>,
  ): Promise<GetPurchaseOrderDetailResponse> {
    const data = await this.service.getPurchaseOrderDetail(request.params);

    return { code: 200, data };
  }

  @POST({
    url: '/internal/purchase-orders',
    options: {
      schema: {
        tags: ['internal'],
        body: upsertPurchaseOrderBodyDTO,
        response: {
          200: createPurchaseOrderResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async createPurchaseOrder(
    req: FastifyRequest<{
      Body: UpsertPurchaseOrderBody;
    }>,
  ): Promise<CreatePurchaseOrderResponse> {
    const id = await this.service.upsertPurchaseOrder(req.body, req.user);

    return {
      code: 200,
      data: {
        id,
      },
    };
  }

  @POST({
    url: '/internal/purchase-orders/fulfilled',
    options: {
      schema: {
        tags: ['internal'],
        body: purchaseOrderFulfilledBodyDTO,
        response: {
          200: purchaseOrderFulfilledResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async fulfillGoodsReceipt(
    req: FastifyRequest<{
      Body: PurchaseOrderFulfilledBody;
    }>,
    rep: FastifyReply,
  ): Promise<PurchaseOrderFulfilledResponse> {
    await this.service.fulfillPurchaseOrder(req.body, req.user);
    rep.status(200);
    return {
      code: 200,
    };
  }

  @GET({
    url: '/farming-cycles/:farmingCycleId/purchase-orders/feed',
    options: {
      schema: {
        params: getFeedHistoryParamsDTO,
        response: {
          200: getFeedHistoryResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async getFeedHistory(
    req: FastifyRequest<{
      Params: GetFeedHistoryParams;
    }>,
  ): Promise<GetFeedHistoryResponse> {
    const data = await this.service.getSapronakHistory(req.params.farmingCycleId)('PAKAN');

    return {
      code: 200,
      data,
    };
  }

  @GET({
    url: '/farming-cycles/:farmingCycleId/purchase-orders/ovk',
    options: {
      schema: {
        params: getOvkHistoryParamsDTO,
        response: {
          200: getOvkHistoryResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async getOvkHistory(
    req: FastifyRequest<{
      Params: GetOvkHistoryParams;
    }>,
  ): Promise<GetOvkHistoryResponse> {
    const data = await this.service.getSapronakHistory(req.params.farmingCycleId)('OVK');

    return {
      code: 200,
      data,
    };
  }
}
