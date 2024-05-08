import { isAfter, isBefore } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';
import { Inject, Service } from 'fastify-decorators';
import { DeepPartial, QueryRunner } from 'typeorm';
import { GoodsReceiptDAO } from '../../dao/goodsReceipt.dao';
import { GoodsReceiptPhotoDAO } from '../../dao/goodsReceiptPhoto.dao';
import { GoodsReceiptProductDAO } from '../../dao/goodsReceiptProduct.dao';
import { PurchaseOrderDAO } from '../../dao/purchaseOrder.dao';
import { TransferRequestDAO } from '../../dao/transferRequest.dao';
import { GoodsReceiptPhoto } from '../../datasources/entity/pgsql/GoodsReceiptPhoto.entity';
import { GoodsReceiptProduct } from '../../datasources/entity/pgsql/GoodsReceiptProduct.entity';
import {
  CategoryCodeEnum,
  CreateGoodsReceiptPurchaseOrderBody,
  CreateGoodsReceiptTransferRequestBody,
  ProductNameItem,
} from '../../dto/goodsReceipt.dto';
import { DEFAULT_TIME_ZONE } from '../../libs/constants';
import {
  ERR_GOODS_RECEIPT_INVALID_DATE,
  ERR_GOODS_RECEIPT_INVALID_PRODUCT,
  ERR_GOODS_RECEIPT_INVALID_QUANTITY,
  ERR_GOODS_RECEIPT_PO_INVALID_QUANTITY,
  ERR_PURCHASE_ORDER_NOT_FOUND,
  ERR_PURCHASE_ORDER_REVERTED_CAN_NOT_BE_GR,
  ERR_PURCHASE_ORDER_STILL_PROCESSED,
} from '../../libs/constants/errors';
import { Transactional } from '../../libs/decorators/transactional';
import { RequestUser } from '../../libs/types/index.d';

@Service()
export class GoodsReceiptService {
  @Inject(GoodsReceiptDAO)
  private goodsReceiptDAO: GoodsReceiptDAO;

  @Inject(GoodsReceiptProductDAO)
  private goodsReceiptProductDAO: GoodsReceiptProductDAO;

  @Inject(GoodsReceiptPhotoDAO)
  private goodsReceiptPhotoDAO: GoodsReceiptPhotoDAO;

  @Inject(TransferRequestDAO)
  private transferRequestDAO: TransferRequestDAO;

  @Inject(PurchaseOrderDAO)
  private purchaseOrderDAO: PurchaseOrderDAO;

  @Transactional()
  async createGoodsReceiptPurchaseOrder(
    data: CreateGoodsReceiptPurchaseOrderBody,
    user: RequestUser,
    queryRunner: QueryRunner,
  ) {
    if (isAfter(zonedTimeToUtc(data.receivedDate, DEFAULT_TIME_ZONE), new Date())) {
      throw ERR_GOODS_RECEIPT_INVALID_DATE();
    }

    const [purchaseOrder, [existingGR]] = await Promise.all([
      this.purchaseOrderDAO.getOneWithTx(
        {
          where: {
            id: data.purchaseOrderId,
          },
          relations: {
            purchaseOrderProducts: true,
            farmingCycle: true,
          },
        },
        queryRunner,
      ),
      this.goodsReceiptDAO.getMany({
        where: {
          purchaseOrderId: data.purchaseOrderId,
        },
        relations: {
          goodsReceiptProducts: true,
        },
      }),
    ]);

    if (!purchaseOrder) {
      throw ERR_PURCHASE_ORDER_NOT_FOUND();
    }

    if (purchaseOrder.isReverted) {
      throw ERR_PURCHASE_ORDER_REVERTED_CAN_NOT_BE_GR();
    }

    if (purchaseOrder.isApproved === null) {
      throw ERR_PURCHASE_ORDER_STILL_PROCESSED();
    }

    const poProductMapByCode = purchaseOrder.purchaseOrderProducts.reduce((prev, pop) => {
      Reflect.set(prev, pop.productCode, Number(prev[pop.productCode] || 0) + Number(pop.quantity));

      return prev;
    }, {} as { [key: string]: number });

    data.details.forEach((pop) => {
      if (!poProductMapByCode[pop.productCode]) {
        throw ERR_GOODS_RECEIPT_INVALID_PRODUCT(`(${pop.productCode} - ${pop.productName})`);
      }
    });

    // compare po quantity with existing gr quantity + new gr quantity
    const existingGRProductMapByCode = existingGR.reduce((prev, gr) => {
      gr.goodsReceiptProducts.forEach((grp) => {
        Reflect.set(
          prev,
          grp.productCode,
          Number(prev[grp.productCode] || 0) + Number(grp.quantity),
        );
      });

      return prev;
    }, {} as { [key: string]: number });

    data.details.forEach((pop) => {
      const totalExistingGrQuantity = existingGRProductMapByCode[pop.productCode] || 0;

      if (
        pop.quantity + totalExistingGrQuantity > poProductMapByCode[pop.productCode] &&
        !!pop.isReturned === false
      ) {
        throw ERR_GOODS_RECEIPT_PO_INVALID_QUANTITY(`(${pop.productCode} - ${pop.productName})`);
      }
    });

    const goodsReceipt = await this.goodsReceiptDAO.createOneWithTx(
      {
        purchaseOrderId: data.purchaseOrderId,
        receivedDate: data.receivedDate,
        notes: data.notes,
        remarks: data.remarks,
      },
      user,
      queryRunner,
    );

    const details = await this.goodsReceiptProductDAO.createManyWithTx(
      data.details.map<DeepPartial<GoodsReceiptProduct>>((d) => ({
        ...d,
        isReturned: !!d.isReturned,
        subcategoryCode: d.subcategoryCode !== 'false' ? d.subcategoryCode : d.categoryCode,
        subcategoryName: d.subcategoryName !== 'false' ? d.subcategoryName : d.categoryName,
        goodsReceiptId: goodsReceipt.id,
      })),
      user,
      queryRunner,
    );

    const photos = await this.goodsReceiptPhotoDAO.createManyWithTx(
      data.photos.map<DeepPartial<GoodsReceiptPhoto>>((d) => ({
        goodsReceiptId: goodsReceipt.id,
        url: d.url,
      })),
      user,
      queryRunner,
    );

    return {
      ...goodsReceipt,
      purchaseOrder,
      details,
      photos,
    };
  }

  @Transactional()
  async createGoodsReceiptTransferRequest(
    data: CreateGoodsReceiptTransferRequestBody,
    user: RequestUser,
    queryRunner: QueryRunner,
  ) {
    const transferRequest = await this.transferRequestDAO.getOneStrict({
      where: {
        id: data.transferRequestId,
      },
      relations: {
        transferRequestProducts: true,
        farmingCycleTarget: true,
      },
    });

    if (isBefore(new Date(data.receivedDate), new Date(transferRequest.datePlanned))) {
      throw ERR_GOODS_RECEIPT_INVALID_DATE();
    }

    if (isAfter(zonedTimeToUtc(data.receivedDate, DEFAULT_TIME_ZONE), new Date())) {
      throw ERR_GOODS_RECEIPT_INVALID_DATE();
    }

    const isValidQuantity = data.details.reduce<boolean>((isValid, grp) => {
      const transferReqProduct = transferRequest.transferRequestProducts?.find(
        (tfProduct) => tfProduct.productCode === grp.productCode,
      );

      if (!transferReqProduct) {
        throw ERR_GOODS_RECEIPT_INVALID_PRODUCT(`(${grp.productCode}) ${grp.productName}`);
      }

      if (grp.quantity > transferReqProduct.quantity) {
        throw ERR_GOODS_RECEIPT_INVALID_QUANTITY(
          `(${grp.productCode}) ${grp.productName} - ${grp.quantity}`,
        );
      }

      return isValid;
    }, true);

    if (!isValidQuantity) {
      throw ERR_GOODS_RECEIPT_INVALID_QUANTITY();
    }

    const goodsReceipt = await this.goodsReceiptDAO.createOneWithTx(
      {
        transferRequestId: data.transferRequestId,
        receivedDate: data.receivedDate,
        remarks: data.remarks,
        notes: data.notes,
      },
      user,
      queryRunner,
    );

    const details = await this.goodsReceiptProductDAO.createManyWithTx(
      data.details.map<DeepPartial<GoodsReceiptProduct>>((d) => {
        const trReqProduct = transferRequest.transferRequestProducts?.find(
          (p) => p.productName === d.productName,
        );

        const productCode = trReqProduct ? trReqProduct.productCode : d.productCode;

        return {
          ...d,
          productCode,
          goodsReceiptId: goodsReceipt.id,
          categoryCode: d.categoryCode || 'PAKAN',
          categoryName: d.categoryName || 'PAKAN',
        };
      }),
      user,
      queryRunner,
    );

    const photos = await this.goodsReceiptPhotoDAO.createManyWithTx(
      data.photos.map<DeepPartial<GoodsReceiptPhoto>>((d) => ({
        goodsReceiptId: goodsReceipt.id,
        url: d.url,
      })),
      user,
      queryRunner,
    );

    return {
      ...goodsReceipt,
      transferRequest,
      details,
      photos,
    };
  }

  async getProductNames(
    farmingCycleId: string,
    categoryCode: CategoryCodeEnum,
  ): Promise<ProductNameItem[]> {
    const [products] = await this.goodsReceiptProductDAO.getMany({
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
