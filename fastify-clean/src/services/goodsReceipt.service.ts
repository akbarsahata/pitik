import { isAfter, isBefore } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';
import { Inject, Service } from 'fastify-decorators';
import { DeepPartial } from 'typeorm';
import { GoodsReceiptDAO } from '../dao/goodsReceipt.dao';
import { GoodsReceiptPhotoDAO } from '../dao/goodsReceiptPhoto.dao';
import { GoodsReceiptProductDAO } from '../dao/goodsReceiptProduct.dao';
import { TransferRequestDAO } from '../dao/transferRequest.dao';
import { GoodsReceiptPhoto } from '../datasources/entity/pgsql/GoodsReceiptPhoto.entity';
import { GoodsReceiptProduct } from '../datasources/entity/pgsql/GoodsReceiptProduct.entity';
import {
  CategoryCodeEnum,
  CreateGoodsReceiptPurchaseOrderBody,
  CreateGoodsReceiptPurchaseOrderResponseItem,
  CreateGoodsReceiptTransferRequestBody,
  CreateGoodsReceiptTransferRequestResponseItem,
  ProductNameItem,
} from '../dto/goodsReceipt.dto';
import { GoodsReceiptCreatedQueue } from '../jobs/queues/goods-receipt-created.queue';
import { DEFAULT_TIME_ZONE } from '../libs/constants';
import {
  ERR_GOODS_RECEIPT_INVALID_DATE,
  ERR_GOODS_RECEIPT_INVALID_QUANTITY,
} from '../libs/constants/errors';
import { RequestUser } from '../libs/types/index.d';

@Service()
export class GoodsReceiptService {
  @Inject(GoodsReceiptDAO)
  private dao: GoodsReceiptDAO;

  @Inject(GoodsReceiptProductDAO)
  private grProductDAO: GoodsReceiptProductDAO;

  @Inject(GoodsReceiptPhotoDAO)
  private grPhotoDAO: GoodsReceiptPhotoDAO;

  @Inject(TransferRequestDAO)
  private trDAO: TransferRequestDAO;

  @Inject(GoodsReceiptCreatedQueue)
  private grCreatedQueue: GoodsReceiptCreatedQueue;

  async createGoodsReceiptPurchaseOrder(
    data: CreateGoodsReceiptPurchaseOrderBody,
    user: RequestUser,
  ): Promise<CreateGoodsReceiptPurchaseOrderResponseItem> {
    const queryRunner = await this.dao.startTransaction();

    try {
      if (isAfter(zonedTimeToUtc(data.receivedDate, DEFAULT_TIME_ZONE), new Date())) {
        throw ERR_GOODS_RECEIPT_INVALID_DATE();
      }

      const goodsReceipt = await this.dao.createOneWithTx(
        {
          purchaseOrderId: data.purchaseOrderId,
          receivedDate: data.receivedDate,
          notes: data.notes,
          remarks: data.remarks,
        },
        user,
        queryRunner,
      );

      const details = await this.grProductDAO.createManyWithTx(
        data.details.map<DeepPartial<GoodsReceiptProduct>>((d) => ({
          ...d,
          goodsReceiptId: goodsReceipt.id,
        })),
        user,
        queryRunner,
      );

      const photos = await this.grPhotoDAO.createManyWithTx(
        data.photos.map<DeepPartial<GoodsReceiptPhoto>>((d) => ({
          goodsReceiptId: goodsReceipt.id,
          url: d.url,
        })),
        user,
        queryRunner,
      );

      await this.dao.commitTransaction(queryRunner);

      await this.grCreatedQueue.addJob(goodsReceipt);

      return {
        ...goodsReceipt,
        details,
        photos,
      };
    } catch (error) {
      await this.dao.rollbackTransaction(queryRunner);

      throw error;
    }
  }

  async createGoodsReceiptTransferRequest(
    data: CreateGoodsReceiptTransferRequestBody,
    user: RequestUser,
  ): Promise<CreateGoodsReceiptTransferRequestResponseItem> {
    const queryRunner = await this.dao.startTransaction();

    const tr = await this.trDAO.getOneStrict({
      where: {
        id: data.transferRequestId,
      },
    });

    try {
      if (isBefore(new Date(data.receivedDate), new Date(tr.datePlanned))) {
        throw ERR_GOODS_RECEIPT_INVALID_DATE();
      }

      if (isAfter(zonedTimeToUtc(data.receivedDate, DEFAULT_TIME_ZONE), new Date())) {
        throw ERR_GOODS_RECEIPT_INVALID_DATE();
      }

      const transferRequest = await this.trDAO.getOneStrict({
        where: {
          id: data.transferRequestId,
        },
      });

      const isValidQuantity = data.details.reduce<boolean>((isValid, grp) => {
        if (grp.quantity > transferRequest.quantity) return false;

        return isValid;
      }, true);

      if (!isValidQuantity) {
        throw ERR_GOODS_RECEIPT_INVALID_QUANTITY();
      }

      const goodsReceipt = await this.dao.createOneWithTx(
        {
          transferRequestId: data.transferRequestId,
          receivedDate: data.receivedDate,
          remarks: data.remarks,
          notes: data.notes,
        },
        user,
        queryRunner,
      );

      const details = await this.grProductDAO.createManyWithTx(
        data.details.map<DeepPartial<GoodsReceiptProduct>>((d) => ({
          ...d,
          goodsReceiptId: goodsReceipt.id,
          categoryCode: 'PAKAN',
          categoryName: 'PAKAN',
        })),
        user,
        queryRunner,
      );

      const photos = await this.grPhotoDAO.createManyWithTx(
        data.photos.map<DeepPartial<GoodsReceiptPhoto>>((d) => ({
          goodsReceiptId: goodsReceipt.id,
          url: d.url,
        })),
        user,
        queryRunner,
      );

      await this.dao.commitTransaction(queryRunner);

      await this.grCreatedQueue.addJob(goodsReceipt);

      return {
        ...goodsReceipt,
        details,
        photos,
      };
    } catch (error) {
      await this.dao.rollbackTransaction(queryRunner);

      throw error;
    }
  }

  async getProductNames(
    farmingCycleId: string,
    categoryCode: CategoryCodeEnum,
  ): Promise<ProductNameItem[]> {
    const [products] = await this.grProductDAO.getMany({
      where: {
        categoryCode,
        goodsReceipt: {
          purchaseOrder: {
            farmingCycleId,
          },
        },
      },
      relations: {
        goodsReceipt: {
          purchaseOrder: true,
        },
      },
      order: {
        productName: 'ASC',
      },
    });

    const uniqueProduct = products
      .map((product) => ({
        name: product.productName,
      }))
      .filter((val, idx, self) => self.map((p) => p.name).indexOf(val.name) === idx);
    return uniqueProduct;
  }
}
