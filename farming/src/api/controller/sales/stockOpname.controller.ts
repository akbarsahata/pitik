import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, GET, Inject, POST, PUT } from 'fastify-decorators';
import {
  CreateSalesStockOpnameBody,
  createSalesStockOpnameBodyDTO,
  CreateSalesStockOpnameResponse,
  createSalesStockOpnameResponseDTO,
  GetSalesStockOpnameByIdParams,
  getSalesStockOpnameByIdParamsDTO,
  GetSalesStockOpnameByIdResponse,
  getSalesStockOpnameByIdResponseDTO,
  GetSalesStockOpnamesQuery,
  getSalesStockOpnamesQueryDTO,
  GetSalesStockOpnamesResponse,
  getSalesStockOpnamesResponseDTO,
  UpdateSalesStockOpnameBody,
  updateSalesStockOpnameBodyDTO,
  UpdateSalesStockOpnameParams,
  updateSalesStockOpnameParamsDTO,
  UpdateSalesStockOpnameResponse,
  updateSalesStockOpnameResponseDTO,
} from '../../../dto/sales/stockOpname.dto';
import { SalesStockOpnameCreatedQueue } from '../../../jobs/queues/sales-stock-opname-created.queue';
import { SalesStockOpnameService } from '../../../services/sales/stockOpname.service';
import { verifyAccess } from '../../hooks/onRequest/verifyAccess';

@Controller({
  route: '/sales/stock-opnames',
  type: 0,
  tags: [{ name: 'sales-stock-opnames' }],
})
export class StockOpnameController {
  @Inject(SalesStockOpnameService)
  private salesStockOpnameService: SalesStockOpnameService;

  @Inject(SalesStockOpnameCreatedQueue)
  private salesStockOpnameCreatedQueue: SalesStockOpnameCreatedQueue;

  @GET({
    url: '/',
    options: {
      schema: {
        querystring: getSalesStockOpnamesQueryDTO,
        response: {
          200: getSalesStockOpnamesResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async getMany(
    req: FastifyRequest<{
      Querystring: GetSalesStockOpnamesQuery;
    }>,
  ): Promise<GetSalesStockOpnamesResponse> {
    const [data, count] = await this.salesStockOpnameService.get(req.query, req.user, req.appId);

    return {
      code: 200,
      count,
      data,
    };
  }

  @GET({
    url: '/:stockOpnameId',
    options: {
      schema: {
        params: getSalesStockOpnameByIdParamsDTO,
        response: {
          200: getSalesStockOpnameByIdResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async getById(
    req: FastifyRequest<{
      Params: GetSalesStockOpnameByIdParams;
    }>,
  ): Promise<GetSalesStockOpnameByIdResponse> {
    const stockOpname = await this.salesStockOpnameService.getById(req.params.stockOpnameId);

    return {
      code: 200,
      data: stockOpname,
    };
  }

  @POST({
    url: '/',
    options: {
      schema: {
        body: createSalesStockOpnameBodyDTO,
        response: {
          201: createSalesStockOpnameResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async createStockOpname(
    request: FastifyRequest<{
      Body: CreateSalesStockOpnameBody;
    }>,
    reply: FastifyReply,
  ): Promise<CreateSalesStockOpnameResponse> {
    const stockOpname = await this.salesStockOpnameService.createStockOpname(
      request.body,
      request.user,
    );

    await this.salesStockOpnameCreatedQueue.addJob({
      stockOpnameId: stockOpname.id,
    });

    reply.code(201);

    return {
      code: 201,
      data: stockOpname,
    };
  }

  @PUT({
    url: '/:stockOpnameId',
    options: {
      schema: {
        params: updateSalesStockOpnameParamsDTO,
        body: updateSalesStockOpnameBodyDTO,
        response: {
          200: updateSalesStockOpnameResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async update(
    req: FastifyRequest<{
      Body: UpdateSalesStockOpnameBody;
      Params: UpdateSalesStockOpnameParams;
    }>,
  ): Promise<UpdateSalesStockOpnameResponse> {
    const stockOpname = await this.salesStockOpnameService.update(
      req.user,
      req.body,
      req.params.stockOpnameId,
    );

    return {
      code: 200,
      data: stockOpname,
    };
  }
}
