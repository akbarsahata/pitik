import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, GET, Inject, POST, PUT } from 'fastify-decorators';
import {
  BookStockBody,
  bookStockBodyDTO,
  CheckInBody,
  checkInBodyDTO,
  CheckInResponse,
  checkInResponseDTO,
  CreateSalesOrderBody,
  createSalesOrderBodyDTO,
  DeliverBody,
  deliverBodyDTO,
  DriverPickUpBody,
  driverPickUpBodyDTO,
  GetSalesOrderDetailParam,
  getSalesOrderDetailParamDTO,
  GetSalesOrderDetailResponse,
  getSalesOrderDetailResponseDTO,
  GetSalesOrderListQuery,
  getSalesOrderListQueryDTO,
  GetSalesOrderListResponse,
  getSalesOrderListResponseDTO,
  ReturnProductBody,
  returnProductBodyDTO,
  SetDriverBody,
  setDriverBodyDTO,
  UpdateSalesOrderBody,
  updateSalesOrderBodyDTO,
} from '../../../dto/sales/salesOrder.dto';
import { SalesOrderService } from '../../../services/sales/salesOrder.service';
import { verifyAccess } from '../../hooks/onRequest/verifyAccess';

@Controller({
  route: '/sales/sales-orders',
  type: 0,
  tags: [{ name: 'sales-sales-orders' }],
})
export class SalesOrderController {
  @Inject(SalesOrderService)
  salesOrderService!: SalesOrderService;

  @GET({
    url: '/:id',
    options: {
      schema: {
        params: getSalesOrderDetailParamDTO,
        response: {
          200: getSalesOrderDetailResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async getById(
    req: FastifyRequest<{
      Params: GetSalesOrderDetailParam;
    }>,
  ): Promise<GetSalesOrderDetailResponse> {
    const order = await this.salesOrderService.getById(req);

    return {
      code: 200,
      data: order,
    };
  }

  @POST({
    url: '/',
    options: {
      schema: {
        body: createSalesOrderBodyDTO,
        response: {
          '2xx': getSalesOrderDetailResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async createSalesOrder(
    request: FastifyRequest<{
      Body: CreateSalesOrderBody;
    }>,
    reply: FastifyReply,
  ): Promise<GetSalesOrderDetailResponse> {
    const order = await this.salesOrderService.createSalesOrder(request);

    reply.status(201);

    return {
      code: 201,
      data: order,
    };
  }

  @GET({
    url: '/',
    options: {
      schema: {
        querystring: getSalesOrderListQueryDTO,
        response: {
          200: getSalesOrderListResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async getSalesOrders(
    request: FastifyRequest<{
      Querystring: GetSalesOrderListQuery;
    }>,
  ): Promise<GetSalesOrderListResponse> {
    const [orders, count] = await this.salesOrderService.getSaleOrders(request.query, request.user);

    return {
      code: 200,
      count,
      data: orders,
    };
  }

  @PUT({
    url: '/:id',
    options: {
      schema: {
        params: getSalesOrderDetailParamDTO,
        body: updateSalesOrderBodyDTO,
        response: {
          200: getSalesOrderDetailResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async update(
    req: FastifyRequest<{
      Body: UpdateSalesOrderBody;
      Params: GetSalesOrderDetailParam;
    }>,
  ): Promise<GetSalesOrderDetailResponse> {
    const order = await this.salesOrderService.updateSalesOrder(req);

    return {
      code: 200,
      data: order,
    };
  }

  @POST({
    url: '/:id/cancel',
    options: {
      schema: {
        params: getSalesOrderDetailParamDTO,
        response: {
          200: getSalesOrderDetailResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async cancel(
    req: FastifyRequest<{
      Params: GetSalesOrderDetailParam;
    }>,
  ): Promise<GetSalesOrderDetailResponse> {
    const order = await this.salesOrderService.cancel(req);

    return {
      code: 200,
      data: order,
    };
  }

  @POST({
    url: '/:id/set-driver',
    options: {
      schema: {
        params: getSalesOrderDetailParamDTO,
        body: setDriverBodyDTO,
        response: {
          200: getSalesOrderDetailResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async setDriver(
    req: FastifyRequest<{
      Body: SetDriverBody;
      Params: GetSalesOrderDetailParam;
    }>,
  ): Promise<GetSalesOrderDetailResponse> {
    const order = await this.salesOrderService.setDriver(req);

    return {
      code: 200,
      data: order,
    };
  }

  @POST({
    url: '/:id/ready-to-deliver/cancel',
    options: {
      schema: {
        params: getSalesOrderDetailParamDTO,
        response: {
          200: getSalesOrderDetailResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async cancelReadyToDeliver(
    req: FastifyRequest<{
      Params: GetSalesOrderDetailParam;
    }>,
  ): Promise<GetSalesOrderDetailResponse> {
    const order = await this.salesOrderService.cancelReadyToDeliver(req);

    return {
      code: 200,
      data: order,
    };
  }

  @POST({
    url: '/:id/book-stock',
    options: {
      schema: {
        params: getSalesOrderDetailParamDTO,
        body: bookStockBodyDTO,
        response: {
          200: getSalesOrderDetailResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async bookStock(
    req: FastifyRequest<{
      Body: BookStockBody;
      Params: GetSalesOrderDetailParam;
    }>,
  ): Promise<GetSalesOrderDetailResponse> {
    const order = await this.salesOrderService.bookStock(req);

    return {
      code: 200,
      data: order,
    };
  }

  @POST({
    url: '/:id/book-stock/cancel',
    options: {
      schema: {
        params: getSalesOrderDetailParamDTO,
        response: {
          200: getSalesOrderDetailResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async cancelBookedStock(
    req: FastifyRequest<{
      Params: GetSalesOrderDetailParam;
    }>,
  ): Promise<GetSalesOrderDetailResponse> {
    const order = await this.salesOrderService.cancelBookedStock(req);

    return {
      code: 200,
      data: order,
    };
  }

  @POST({
    url: '/:id/allocated/cancel',
    options: {
      schema: {
        params: getSalesOrderDetailParamDTO,
        response: {
          200: getSalesOrderDetailResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async cancelAllocated(
    req: FastifyRequest<{
      Params: GetSalesOrderDetailParam;
    }>,
  ): Promise<GetSalesOrderDetailResponse> {
    const order = await this.salesOrderService.cancelAllocated(req);

    return {
      code: 200,
      data: order,
    };
  }

  @POST({
    url: '/:id/pick-up',
    options: {
      schema: {
        body: driverPickUpBodyDTO,
        params: getSalesOrderDetailParamDTO,
        response: {
          200: getSalesOrderDetailResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async pickUp(
    req: FastifyRequest<{
      Body: DriverPickUpBody;
      Params: GetSalesOrderDetailParam;
    }>,
  ): Promise<GetSalesOrderDetailResponse> {
    const order = await this.salesOrderService.pickUp(req);

    return {
      code: 200,
      data: order,
    };
  }

  @POST({
    url: '/:id/deliver',
    options: {
      schema: {
        params: getSalesOrderDetailParamDTO,
        body: deliverBodyDTO,
        response: {
          200: getSalesOrderDetailResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async deliver(
    req: FastifyRequest<{
      Body: DeliverBody;
      Params: GetSalesOrderDetailParam;
    }>,
  ): Promise<GetSalesOrderDetailResponse> {
    const order = await this.salesOrderService.deliver(req);

    return {
      code: 200,
      data: order,
    };
  }

  @POST({
    url: '/:id/return-product',
    options: {
      schema: {
        params: getSalesOrderDetailParamDTO,
        body: returnProductBodyDTO,
        response: {
          200: getSalesOrderDetailResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async returnProduct(
    req: FastifyRequest<{
      Body: ReturnProductBody;
      Params: GetSalesOrderDetailParam;
    }>,
  ): Promise<GetSalesOrderDetailResponse> {
    const order = await this.salesOrderService.returnProduct(req);

    return {
      code: 200,
      data: order,
    };
  }

  @POST({
    url: '/:id/check-in',
    options: {
      schema: {
        params: getSalesOrderDetailParamDTO,
        body: checkInBodyDTO,
        response: {
          200: checkInResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async checkIn(
    req: FastifyRequest<{
      Body: CheckInBody;
      Params: GetSalesOrderDetailParam;
    }>,
  ): Promise<CheckInResponse> {
    const distance = await this.salesOrderService.checkIn({
      salesOrderId: req.params.id,
      ...req.body,
    });

    return {
      code: 200,
      data: {
        distance,
      },
    };
  }
}
