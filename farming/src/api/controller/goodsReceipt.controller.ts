import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, GET, Inject, POST } from 'fastify-decorators';
import {
  CreateGoodsReceiptPurchaseOrderBody,
  createGoodsReceiptPurchaseOrderBodyDTO,
  CreateGoodsReceiptPurchaseOrderResponse,
  createGoodsReceiptPurchaseOrderResponseDTO,
  CreateGoodsReceiptTransferRequestBody,
  createGoodsReceiptTransferRequestBodyDTO,
  CreateGoodsReceiptTransferRequestResponse,
  createGoodsReceiptTransferRequestResponseDTO,
  GetProductNameParams,
  getProductNameParamsDTO,
  GetProductNameResponse,
  getProductNameResponseDTO,
} from '../../dto/goodsReceipt.dto';
import { GoodsReceiptService } from '../../services/farming/goodsReceipt.service';
import { GoodsReceiptUsecase } from '../../usecases/goodsReceipt.usecase';
import { verifyAccess } from '../hooks/onRequest/verifyAccess';

@Controller({
  route: '/',
  type: 0,
  tags: [{ name: 'goods-receipts' }],
})
export class GoodsReceiptController {
  @Inject(GoodsReceiptService)
  private service: GoodsReceiptService;

  @Inject(GoodsReceiptUsecase)
  private usecase: GoodsReceiptUsecase;

  @POST({
    url: '/goods-receipts/purchase-orders',
    options: {
      schema: {
        body: createGoodsReceiptPurchaseOrderBodyDTO,
        response: {
          '2xx': createGoodsReceiptPurchaseOrderResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async createGoodsReceiptPurchaseOrder(
    request: FastifyRequest<{
      Body: CreateGoodsReceiptPurchaseOrderBody;
    }>,
    reply: FastifyReply,
  ): Promise<CreateGoodsReceiptPurchaseOrderResponse> {
    const data = await this.usecase.createGoodsReceiptPurchaseOrder(request.body, request.user);

    reply.code(201);

    return { code: 201, data };
  }

  @POST({
    url: '/goods-receipts/transfer-requests',
    options: {
      schema: {
        body: createGoodsReceiptTransferRequestBodyDTO,
        response: {
          '2xx': createGoodsReceiptTransferRequestResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async createGoodsReceiptTransferRequest(
    request: FastifyRequest<{
      Body: CreateGoodsReceiptTransferRequestBody;
    }>,
    reply: FastifyReply,
  ): Promise<CreateGoodsReceiptTransferRequestResponse> {
    const data = await this.usecase.createGoodsReceiptTransferRequest(request.body, request.user);

    reply.code(201);

    return { code: 201, data };
  }

  @GET({
    url: '/farming-cycles/:farmingCycleId/goods-receipts/:categoryCode/product-names',
    options: {
      schema: {
        params: getProductNameParamsDTO,
        response: {
          200: getProductNameResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async getProductNames(
    req: FastifyRequest<{
      Params: GetProductNameParams;
    }>,
  ): Promise<GetProductNameResponse> {
    const productNames = await this.service.getProductNames(
      req.params.farmingCycleId,
      req.params.categoryCode,
    );

    return {
      code: 200,
      data: productNames,
    };
  }
}
