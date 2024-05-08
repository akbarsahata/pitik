import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, GET, Inject, POST, PUT } from 'fastify-decorators';
import {
  CreateSalesStockDisposalBody,
  createSalesStockDisposalBodyDTO,
  CreateSalesStockDisposalResponse,
  createSalesStockDisposalResponseDTO,
  GetSalesStockDisposalByIdParams,
  getSalesStockDisposalByIdParamsDTO,
  GetSalesStockDisposalByIdResponse,
  getSalesStockDisposalByIdResponseDTO,
  GetSalesStockDisposalsQuery,
  getSalesStockDisposalsQueryDTO,
  GetSalesStockDisposalsResponse,
  getSalesStockDisposalsResponseDTO,
  UpdateSalesStockDisposalBody,
  updateSalesStockDisposalBodyDTO,
  UpdateSalesStockDisposalParams,
  updateSalesStockDisposalParamsDTO,
  UpdateSalesStockDisposalResponse,
  updateSalesStockDisposalResponseDTO,
} from '../../../dto/sales/stockDisposal.dto';
import { SalesStockDisposalCreatedQueue } from '../../../jobs/queues/sales-stock-disposal-created.queue';
import { SalesStockDisposalService } from '../../../services/sales/stockDisposal.service';
import { verifyAccess } from '../../hooks/onRequest/verifyAccess';

@Controller({
  route: '/sales/stock-disposals',
  type: 0,
  tags: [{ name: 'sales-stock-disposals' }],
})
export class StockDisposalController {
  @Inject(SalesStockDisposalService)
  private salesStockDisposalService: SalesStockDisposalService;

  @Inject(SalesStockDisposalCreatedQueue)
  private salesStockDisposalCreatedQueue: SalesStockDisposalCreatedQueue;

  @GET({
    url: '/',
    options: {
      schema: {
        querystring: getSalesStockDisposalsQueryDTO,
        response: {
          200: getSalesStockDisposalsResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async getMany(
    req: FastifyRequest<{
      Querystring: GetSalesStockDisposalsQuery;
    }>,
  ): Promise<GetSalesStockDisposalsResponse> {
    const [data, count] = await this.salesStockDisposalService.get(req.query, req.user, req.appId);

    return {
      code: 200,
      count,
      data,
    };
  }

  @GET({
    url: '/:stockDisposalId',
    options: {
      schema: {
        params: getSalesStockDisposalByIdParamsDTO,
        response: {
          200: getSalesStockDisposalByIdResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async getById(
    req: FastifyRequest<{
      Params: GetSalesStockDisposalByIdParams;
    }>,
  ): Promise<GetSalesStockDisposalByIdResponse> {
    const stockDisposal = await this.salesStockDisposalService.getById(req.params.stockDisposalId);

    return {
      code: 200,
      data: stockDisposal,
    };
  }

  @POST({
    url: '/',
    options: {
      schema: {
        body: createSalesStockDisposalBodyDTO,
        response: {
          201: createSalesStockDisposalResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async createStockDisposal(
    request: FastifyRequest<{
      Body: CreateSalesStockDisposalBody;
    }>,
    reply: FastifyReply,
  ): Promise<CreateSalesStockDisposalResponse> {
    const stockDisposal = await this.salesStockDisposalService.createStockDisposal(
      request.body,
      request.user,
    );

    reply.code(201);

    return {
      code: 201,
      data: stockDisposal,
    };
  }

  @PUT({
    url: '/:stockDisposalId',
    options: {
      schema: {
        params: updateSalesStockDisposalParamsDTO,
        body: updateSalesStockDisposalBodyDTO,
        response: {
          200: updateSalesStockDisposalResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async update(
    req: FastifyRequest<{
      Body: UpdateSalesStockDisposalBody;
      Params: UpdateSalesStockDisposalParams;
    }>,
  ): Promise<UpdateSalesStockDisposalResponse> {
    const stockDisposal = await this.salesStockDisposalService.update(
      req.user,
      req.body,
      req.params.stockDisposalId,
    );

    if (stockDisposal.status === 'BOOKED') {
      await this.salesStockDisposalCreatedQueue.addJob({
        stockDisposalId: stockDisposal.id,
      });
    }

    return {
      code: 200,
      data: stockDisposal,
    };
  }
}
