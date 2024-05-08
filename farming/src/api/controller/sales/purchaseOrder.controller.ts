import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, GET, Inject, POST, PUT } from 'fastify-decorators';
import {
  CancelSalesPurchaseOrderResponse,
  cancelSalesPurchaseOrderResponseDTO,
  CreateSalesPurchaseOrderBody,
  createSalesPurchaseOrderBodyDTO,
  CreateSalesPurchaseOrderResponse,
  createSalesPurchaseOrderResponseDTO,
  GetSalesPurchaseOrderByIdParams,
  getSalesPurchaseOrderByIdParamsDTO,
  GetSalesPurchaseOrderByIdResponse,
  getSalesPurchaseOrderByIdResponseDTO,
  GetSalesPurchaseOrdersQuery,
  getSalesPurchaseOrdersQueryDTO,
  GetSalesPurchaseOrdersResponse,
  getSalesPurchaseOrdersResponseDTO,
  UpdateSalesPurchaseOrderBody,
  updateSalesPurchaseOrderBodyDTO,
  UpdateSalesPurchaseOrderResponse,
  updateSalesPurchaseOrderResponseDTO,
} from '../../../dto/sales/purchaseOrder.dto';
import { SalesPurchaseOrderService } from '../../../services/sales/purchaseOrder.service';
import { verifyAccess } from '../../hooks/onRequest/verifyAccess';

@Controller({
  route: '/sales/purchase-orders',
  type: 0,
  tags: [{ name: 'sales-purchase-orders' }],
})
export class PurchaseOrderController {
  @Inject(SalesPurchaseOrderService)
  private salesPurchaseOrderService: SalesPurchaseOrderService;

  @GET({
    url: '/',
    options: {
      schema: {
        querystring: getSalesPurchaseOrdersQueryDTO,
        response: {
          200: getSalesPurchaseOrdersResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async getMany(
    req: FastifyRequest<{
      Querystring: GetSalesPurchaseOrdersQuery;
    }>,
  ): Promise<GetSalesPurchaseOrdersResponse> {
    const [salesPurchaseOrders, count] = await this.salesPurchaseOrderService.getPurchaseOrders(
      req.query,
      req.user,
      req.appId,
    );

    return {
      code: 200,
      count,
      data: salesPurchaseOrders,
    };
  }

  @GET({
    url: '/:purchaseOrderId',
    options: {
      schema: {
        params: getSalesPurchaseOrderByIdParamsDTO,
        response: {
          200: getSalesPurchaseOrderByIdResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async getById(
    req: FastifyRequest<{
      Params: GetSalesPurchaseOrderByIdParams;
    }>,
  ): Promise<GetSalesPurchaseOrderByIdResponse> {
    const data = await this.salesPurchaseOrderService.getById(req.params.purchaseOrderId);

    return {
      code: 200,
      data,
    };
  }

  @POST({
    url: '/',
    options: {
      schema: {
        body: createSalesPurchaseOrderBodyDTO,
        response: {
          201: createSalesPurchaseOrderResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async create(
    req: FastifyRequest<{
      Body: CreateSalesPurchaseOrderBody;
    }>,
    rep: FastifyReply,
  ): Promise<CreateSalesPurchaseOrderResponse> {
    const data = await this.salesPurchaseOrderService.create(req.body, req.user);

    rep.code(201);

    return {
      code: 201,
      data,
    };
  }

  @PUT({
    url: '/:purchaseOrderId',
    options: {
      schema: {
        params: getSalesPurchaseOrderByIdParamsDTO,
        body: updateSalesPurchaseOrderBodyDTO,
        response: {
          200: updateSalesPurchaseOrderResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async update(
    req: FastifyRequest<{
      Params: GetSalesPurchaseOrderByIdParams;
      Body: UpdateSalesPurchaseOrderBody;
    }>,
  ): Promise<UpdateSalesPurchaseOrderResponse> {
    const data = await this.salesPurchaseOrderService.update(
      req.user,
      req.body,
      req.params.purchaseOrderId,
    );

    return {
      code: 200,
      data,
    };
  }

  @PUT({
    url: '/:purchaseOrderId/cancel',
    options: {
      schema: {
        params: getSalesPurchaseOrderByIdParamsDTO,
        response: {
          200: cancelSalesPurchaseOrderResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async cancel(
    req: FastifyRequest<{
      Params: GetSalesPurchaseOrderByIdParams;
    }>,
  ): Promise<CancelSalesPurchaseOrderResponse> {
    await this.salesPurchaseOrderService.cancel(req.user, req.params.purchaseOrderId);

    return {
      code: 200,
      data: {
        message: 'OK',
      },
    };
  }
}
