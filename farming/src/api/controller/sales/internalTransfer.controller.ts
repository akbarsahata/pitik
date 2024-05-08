import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, GET, Inject, POST, PUT } from 'fastify-decorators';
import {
  CheckInBody,
  checkInBodyDTO,
  CheckInResponse,
  checkInResponseDTO,
  GetInternalTransfersQuery,
  getInternalTransfersQueryDTO,
  InternalTransferDeliveredBody,
  internalTransferDeliveredBodyDTO,
  InternalTransferDetailResponse,
  internalTransferDetailResponseDTO,
  InternalTransferForm,
  internalTransferFormDTO,
  InternalTransferIdParam,
  internalTransferIdParamDTO,
  InternalTransferListResponse,
  internalTransferListResponseDTO,
  InternalTransferPickUpBody,
  internalTransferPickUpBodyDTO,
  InternalTransfersetDriver,
  internalTransfersetDriverDTO,
  OkResponse,
  okResponseDTO,
} from '../../../dto/sales/internalTransfer.dto';
import { GetSalesOrderDetailParam } from '../../../dto/sales/salesOrder.dto';
import { InternalTransferService } from '../../../services/sales/internalTransfer.service';
import { verifyAccess } from '../../hooks/onRequest/verifyAccess';

@Controller({
  route: '/sales/internal-transfers',
  type: 0,
  tags: [{ name: 'sales-internal-transfers' }],
})
export class InternalTransferController {
  @Inject(InternalTransferService)
  private internalTransferService: InternalTransferService;

  @POST({
    url: '/',
    options: {
      schema: {
        body: internalTransferFormDTO,
        response: {
          '2xx': internalTransferDetailResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async create(
    req: FastifyRequest<{
      Body: InternalTransferForm;
    }>,
    rep: FastifyReply,
  ): Promise<InternalTransferDetailResponse> {
    const result = await this.internalTransferService.create(req);

    rep.status(201);
    return {
      code: 201,
      data: result,
    };
  }

  @PUT({
    url: '/:id',
    options: {
      schema: {
        params: internalTransferIdParamDTO,
        body: internalTransferFormDTO,
        response: {
          200: internalTransferDetailResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async update(
    req: FastifyRequest<{
      Params: InternalTransferIdParam;
      Body: InternalTransferForm;
    }>,
  ): Promise<InternalTransferDetailResponse> {
    const result = await this.internalTransferService.update(req);

    return {
      code: 200,
      data: result,
    };
  }

  @GET({
    url: '/:id',
    options: {
      schema: {
        params: internalTransferIdParamDTO,
        response: {
          200: internalTransferDetailResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async getById(
    req: FastifyRequest<{
      Params: InternalTransferIdParam;
    }>,
  ): Promise<InternalTransferDetailResponse> {
    const result = await this.internalTransferService.getById(req);

    return {
      code: 200,
      data: result,
    };
  }

  @GET({
    url: '/',
    options: {
      schema: {
        querystring: getInternalTransfersQueryDTO,
        response: {
          200: internalTransferListResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async getMany(
    request: FastifyRequest<{
      Querystring: GetInternalTransfersQuery;
    }>,
  ): Promise<InternalTransferListResponse> {
    const [data, count] = await this.internalTransferService.getInternalTransfers(
      request.query,
      request.user,
      request.appId,
    );

    return {
      code: 200,
      count,
      data,
    };
  }

  @POST({
    url: '/:id/cancel',
    options: {
      schema: {
        params: internalTransferIdParamDTO,
        response: {
          200: okResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async cancel(
    req: FastifyRequest<{
      Params: InternalTransferIdParam;
    }>,
  ): Promise<OkResponse> {
    await this.internalTransferService.cancel(req);

    return {
      code: 200,
      data: {
        message: 'OK',
      },
    };
  }

  @POST({
    url: '/:id/book-stock',
    options: {
      schema: {
        params: internalTransferIdParamDTO,
        response: {
          200: okResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async bookStock(
    req: FastifyRequest<{
      Params: InternalTransferIdParam;
    }>,
  ): Promise<OkResponse> {
    await this.internalTransferService.bookStock(req);

    return {
      code: 200,
      data: {
        message: 'OK',
      },
    };
  }

  @POST({
    url: '/:id/book-stock/cancel',
    options: {
      schema: {
        params: internalTransferIdParamDTO,
        response: {
          200: okResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async cancelBokStock(
    req: FastifyRequest<{
      Params: InternalTransferIdParam;
    }>,
  ): Promise<OkResponse> {
    await this.internalTransferService.cancelBookStock(req);

    return {
      code: 200,
      data: {
        message: 'OK',
      },
    };
  }

  @POST({
    url: '/:id/set-driver',
    options: {
      schema: {
        params: internalTransferIdParamDTO,
        body: internalTransfersetDriverDTO,
        response: {
          200: okResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async setDriver(
    req: FastifyRequest<{
      Params: InternalTransferIdParam;
      Body: InternalTransfersetDriver;
    }>,
  ): Promise<OkResponse> {
    await this.internalTransferService.setDriver(req);

    return {
      code: 200,
      data: {
        message: 'OK',
      },
    };
  }

  @POST({
    url: '/:id/ready-to-deliver/cancel',
    options: {
      schema: {
        params: internalTransferIdParamDTO,
        response: {
          200: okResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async cancelReadyToDeliver(
    req: FastifyRequest<{
      Params: InternalTransferIdParam;
    }>,
  ): Promise<OkResponse> {
    await this.internalTransferService.cancelReadyToDeliver(req);

    return {
      code: 200,
      data: {
        message: 'OK',
      },
    };
  }

  @POST({
    url: '/:id/pick-up',
    options: {
      schema: {
        params: internalTransferIdParamDTO,
        body: internalTransferPickUpBodyDTO,
        response: {
          200: okResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async pickUp(
    req: FastifyRequest<{
      Params: InternalTransferIdParam;
      Body: InternalTransferPickUpBody;
    }>,
  ): Promise<OkResponse> {
    await this.internalTransferService.pickUp(req);

    return {
      code: 200,
      data: {
        message: 'OK',
      },
    };
  }

  @POST({
    url: '/:id/delivered',
    options: {
      schema: {
        params: internalTransferIdParamDTO,
        body: internalTransferDeliveredBodyDTO,
      },
      onRequest: verifyAccess,
    },
  })
  async delivered(
    req: FastifyRequest<{
      Body: InternalTransferDeliveredBody;
      Params: InternalTransferIdParam;
    }>,
  ): Promise<OkResponse> {
    await this.internalTransferService.delivered(req);

    return {
      code: 200,
      data: {
        message: 'OK',
      },
    };
  }

  @POST({
    url: '/:id/check-in',
    options: {
      schema: {
        params: internalTransferIdParamDTO,
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
    const distance = await this.internalTransferService.checkIn({
      id: req.params.id,
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
