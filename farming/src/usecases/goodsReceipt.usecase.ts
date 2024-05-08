import { Initializer, Inject, Service } from 'fastify-decorators';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import {
  CreateGoodsReceiptPurchaseOrderBody,
  CreateGoodsReceiptPurchaseOrderResponseItem,
  CreateGoodsReceiptTransferRequestBody,
  CreateGoodsReceiptTransferRequestResponseItem,
} from '../dto/goodsReceipt.dto';
import { GoodsReceiptCreatedQueue } from '../jobs/queues/goods-receipt-created.queue';
import { RequestUser } from '../libs/types/index.d';
import { GoodsReceiptService } from '../services/farming/goodsReceipt.service';
import { TransferRequestService } from '../services/farming/transferRequest.service';
import { PurchaseOrderService } from '../services/purchaseOrder.service';

@Service()
export class GoodsReceiptUsecase {
  @Inject(PostgreSQLConnection)
  private database!: PostgreSQLConnection;

  @Inject(GoodsReceiptService)
  private goodsReceiptService!: GoodsReceiptService;

  @Inject(PurchaseOrderService)
  private purchaseOrderService!: PurchaseOrderService;

  @Inject(TransferRequestService)
  private transferRequestService!: TransferRequestService;

  @Inject(GoodsReceiptCreatedQueue)
  private goodsReceiptCreatedQueue!: GoodsReceiptCreatedQueue;

  @Inject(GoodsReceiptCreatedQueue)
  private grCreatedQueue!: GoodsReceiptCreatedQueue;

  @Initializer([PostgreSQLConnection])
  init() {
    return this;
  }

  async createGoodsReceiptPurchaseOrder(
    data: CreateGoodsReceiptPurchaseOrderBody,
    user: RequestUser,
  ): Promise<CreateGoodsReceiptPurchaseOrderResponseItem> {
    const queryRunner = await this.database.startTransaction();

    try {
      const goodsReceiptWithPurchaseOrder =
        await this.goodsReceiptService.createGoodsReceiptPurchaseOrder(data, user, queryRunner);

      const returnedProducts = data.details.filter((product) => product.isReturned);

      if (returnedProducts.length) {
        await this.purchaseOrderService.markProductsAsReturned(
          {
            purchaseOrderId: data.purchaseOrderId,
          },
          {
            details: returnedProducts.map((p) => ({
              ...p,
              id: '',
              isReturned: !!p.isReturned,
              purchaseOrderId: p.poProductId!,
            })),
          },
          user,
          queryRunner,
        );
      }

      await this.database.commitTransaction(queryRunner);

      await this.goodsReceiptCreatedQueue.addJob({
        ...goodsReceiptWithPurchaseOrder,
        farmingCycleId: goodsReceiptWithPurchaseOrder.purchaseOrder.farmingCycleId,
        farmingCycleCode: goodsReceiptWithPurchaseOrder.purchaseOrder.farmingCycle.farmingCycleCode,
      });

      return goodsReceiptWithPurchaseOrder;
    } catch (error) {
      await this.database.rollbackTransaction(queryRunner);

      throw error;
    }
  }

  async createGoodsReceiptTransferRequest(
    data: CreateGoodsReceiptTransferRequestBody,
    user: RequestUser,
  ): Promise<CreateGoodsReceiptTransferRequestResponseItem> {
    const queryRunner = await this.database.startTransaction();
    try {
      const goodsReceiptWithTransferRequest =
        await this.goodsReceiptService.createGoodsReceiptTransferRequest(data, user, queryRunner);

      const { transferRequest, details, photos } = goodsReceiptWithTransferRequest;

      const returnedProducts = data.details.filter((product) => product.isReturned);

      if (returnedProducts.length) {
        await this.transferRequestService.markProductsAsReturned(
          {
            transferRequestId: data.transferRequestId,
          },
          {
            details: returnedProducts.map((p) => ({
              ...p,
              id: '',
              isReturned: !!p.isReturned,
              purchaseOrderId: p.poProductId!,
            })),
          },
          user,
          queryRunner,
        );
      }

      this.database.commitTransaction(queryRunner);

      await this.grCreatedQueue.addJob({
        ...goodsReceiptWithTransferRequest,
        transferRequest,
        farmingCycleId: transferRequest.farmingCycleTarget?.id || '',
        farmingCycleCode: transferRequest.farmingCycleTarget?.farmingCycleCode || '',
      });

      return {
        ...goodsReceiptWithTransferRequest,
        details,
        photos,
      };
    } catch (error) {
      await this.database.rollbackTransaction(queryRunner);

      throw error;
    }
  }
}
