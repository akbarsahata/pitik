import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, GET, Inject, POST } from 'fastify-decorators';
import {
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
  PurchaseOrderBody,
  purchaseOrderBodyDTO,
  PurchaseOrderFulfilledBody,
  purchaseOrderFulfilledBodyDTO,
  PurchaseOrderFulfilledResponse,
  purchaseOrderFulfilledResponseDTO,
  PurchaseOrderResponse,
  purchaseOrderResponseDTO,
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
    const data = await this.service.getPurchaseOrderList(request.query);

    return { code: 200, data };
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
        body: purchaseOrderBodyDTO,
        response: {
          200: purchaseOrderResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async createPurchaseOrder(
    req: FastifyRequest<{
      Body: PurchaseOrderBody;
    }>,
  ): Promise<PurchaseOrderResponse> {
    await this.service.createPurchaseOrder(req.body, req.user);
    return {
      code: 200,
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
  getFeedHistory(
    req: FastifyRequest<{
      Params: GetFeedHistoryParams;
    }>,
  ): Promise<GetFeedHistoryResponse> {
    return this.service.feedHistory(req.params.farmingCycleId);
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
  getOvkHistory(
    req: FastifyRequest<{
      Params: GetOvkHistoryParams;
    }>,
  ): Promise<GetOvkHistoryResponse> {
    return this.service.ovkHistory(req.params.farmingCycleId);
  }

  @POST({
    url: '/po-approved-manual-trigger',
  })
  manualTriggerPoApproved(_: FastifyRequest, res: FastifyReply) {
    this.service.manualTriggerPoApproved();

    res.code(204).send();
  }
}
