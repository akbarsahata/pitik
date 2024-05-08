import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, GET, Inject, POST } from 'fastify-decorators';
import {
  CreateSalesGoodsReceivedBody,
  createSalesGoodsReceivedBodyDTO,
  CreateSalesGoodsReceivedResponse,
  createSalesGoodsReceivedResponseDTO,
  GetSalesGoodsReceivedByIdParams,
  getSalesGoodsReceivedByIdParamsDTO,
  GetSalesGoodsReceivedByIdResponse,
  getSalesGoodsReceivedByIdResponseDTO,
  GetSalesGoodsReceivedQuery,
  getSalesGoodsReceivedQueryDTO,
  GetSalesGoodsReceivedResponse,
  getSalesGoodsReceivedResponseDTO,
} from '../../../dto/sales/goodsReceived.dto';
import { SalesGoodsReceivedService } from '../../../services/sales/goodsReceived.service';
import { verifyAccess } from '../../hooks/onRequest/verifyAccess';

@Controller({
  route: '/sales/goods-received',
  type: 0,
  tags: [{ name: 'sales-goods-received' }],
})
export class GoodsReceivedController {
  @Inject(SalesGoodsReceivedService)
  private service: SalesGoodsReceivedService;

  @GET({
    url: '/',
    options: {
      schema: {
        querystring: getSalesGoodsReceivedQueryDTO,
        response: {
          200: getSalesGoodsReceivedResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async getMany(
    req: FastifyRequest<{
      Querystring: GetSalesGoodsReceivedQuery;
    }>,
  ): Promise<GetSalesGoodsReceivedResponse> {
    const [data, count] = await this.service.get(req.query);

    return {
      code: 200,
      count,
      data,
    };
  }

  @GET({
    url: '/:goodsReceivedId',
    options: {
      schema: {
        params: getSalesGoodsReceivedByIdParamsDTO,
        response: {
          200: getSalesGoodsReceivedByIdResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async getById(
    req: FastifyRequest<{
      Params: GetSalesGoodsReceivedByIdParams;
    }>,
  ): Promise<GetSalesGoodsReceivedByIdResponse> {
    const gr = await this.service.getById(req.params.goodsReceivedId);

    return {
      code: 200,
      data: gr,
    };
  }

  @POST({
    url: '/',
    options: {
      schema: {
        body: createSalesGoodsReceivedBodyDTO,
        response: {
          201: createSalesGoodsReceivedResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async create(
    req: FastifyRequest<{
      Body: CreateSalesGoodsReceivedBody;
    }>,
    rep: FastifyReply,
  ): Promise<CreateSalesGoodsReceivedResponse> {
    const gr = await this.service.create(req.body, req.user);

    rep.code(201);

    return {
      code: 201,
      data: gr,
    };
  }

  @POST({
    url: '/:goodsReceivedId/cancel',
    options: {
      schema: {
        params: getSalesGoodsReceivedByIdParamsDTO,
        response: {
          200: getSalesGoodsReceivedByIdResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async cancel(
    req: FastifyRequest<{
      Params: GetSalesGoodsReceivedByIdParams;
    }>,
  ): Promise<GetSalesGoodsReceivedByIdResponse> {
    const gr = await this.service.cancel(req.params.goodsReceivedId, req.user);

    return {
      code: 200,
      data: gr,
    };
  }
}
