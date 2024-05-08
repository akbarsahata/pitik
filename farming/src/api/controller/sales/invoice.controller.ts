import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, GET, Inject, POST, PUT } from 'fastify-decorators';
import {
  CreateSalesPurchaseOrderInvoiceBody,
  createSalesPurchaseOrderInvoiceBodyDTO,
  CreateSalesPurchaseOrderInvoiceResponse,
  createSalesPurchaseOrderInvoiceResponseDTO,
  GetSalesPurchaseOrderInvoiceByIdParams,
  getSalesPurchaseOrderInvoiceByIdParamsDTO,
  GetSalesPurchaseOrderInvoiceByIdResponse,
  getSalesPurchaseOrderInvoiceByIdResponseDTO,
  GetSalesPurchaseOrderInvoicesQuery,
  getSalesPurchaseOrderInvoicesQueryDTO,
  GetSalesPurchaseOrderInvoicesResponse,
  getSalesPurchaseOrderInvoicesResponseDTO,
  UpdateSalesPurchaseOrderInvoiceBody,
  updateSalesPurchaseOrderInvoiceBodyDTO,
  UpdateSalesPurchaseOrderInvoiceResponse,
  updateSalesPurchaseOrderInvoiceResponseDTO,
} from '../../../dto/sales/invoice.dto';
import { SalesPurchaseOrderInvoiceService } from '../../../services/sales/invoice.service';
import { verifyAccess } from '../../hooks/onRequest/verifyAccess';

@Controller({
  route: '/sales/invoices',
  type: 0,
  tags: [{ name: 'sales-invoices' }],
})
export class PurchaseOrderInvoiceController {
  @Inject(SalesPurchaseOrderInvoiceService)
  private service: SalesPurchaseOrderInvoiceService;

  @GET({
    url: '/',
    options: {
      schema: {
        querystring: getSalesPurchaseOrderInvoicesQueryDTO,
        response: {
          200: getSalesPurchaseOrderInvoicesResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async getMany(
    req: FastifyRequest<{
      Querystring: GetSalesPurchaseOrderInvoicesQuery;
    }>,
  ): Promise<GetSalesPurchaseOrderInvoicesResponse> {
    const [data, count] = await this.service.get(req.query);

    return {
      code: 200,
      count,
      data,
    };
  }

  @GET({
    url: '/:invoiceId',
    options: {
      schema: {
        params: getSalesPurchaseOrderInvoiceByIdParamsDTO,
        response: {
          200: getSalesPurchaseOrderInvoiceByIdResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async getById(
    req: FastifyRequest<{
      Params: GetSalesPurchaseOrderInvoiceByIdParams;
    }>,
  ): Promise<GetSalesPurchaseOrderInvoiceByIdResponse> {
    const data = await this.service.getById(req.params.invoiceId);

    return {
      code: 200,
      data,
    };
  }

  @POST({
    url: '/',
    options: {
      schema: {
        body: createSalesPurchaseOrderInvoiceBodyDTO,
        response: {
          201: createSalesPurchaseOrderInvoiceResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async create(
    req: FastifyRequest<{
      Body: CreateSalesPurchaseOrderInvoiceBody;
    }>,
    rep: FastifyReply,
  ): Promise<CreateSalesPurchaseOrderInvoiceResponse> {
    const data = await this.service.create(req.body, req.user);

    rep.code(201);

    return {
      code: 201,
      data,
    };
  }

  @PUT({
    url: '/:invoiceId',
    options: {
      schema: {
        params: getSalesPurchaseOrderInvoiceByIdParamsDTO,
        body: updateSalesPurchaseOrderInvoiceBodyDTO,
        response: {
          200: updateSalesPurchaseOrderInvoiceResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async update(
    req: FastifyRequest<{
      Params: GetSalesPurchaseOrderInvoiceByIdParams;
      Body: UpdateSalesPurchaseOrderInvoiceBody;
    }>,
  ): Promise<UpdateSalesPurchaseOrderInvoiceResponse> {
    const data = await this.service.update(req.user, req.body, req.params.invoiceId);

    return {
      code: 200,
      data,
    };
  }
}
