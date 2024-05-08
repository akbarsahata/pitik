import { captureException } from '@sentry/node';
import { Inject, Service } from 'fastify-decorators';
import { DeepPartial } from 'typeorm';
import { FarmingCycleDAO } from '../../dao/farmingCycle.dao';
import { GoodsReceiptDAO } from '../../dao/goodsReceipt.dao';
import { GoodsReceiptPhotoDAO } from '../../dao/goodsReceiptPhoto.dao';
import { GoodsReceiptProductDAO } from '../../dao/goodsReceiptProduct.dao';
import { PurchaseOrderDAO } from '../../dao/purchaseOrder.dao';
import { GoodsReceiptPhoto } from '../../datasources/entity/pgsql/GoodsReceiptPhoto.entity';
import { GoodsReceiptProduct } from '../../datasources/entity/pgsql/GoodsReceiptProduct.entity';
import { UpdateDOCinJob } from '../../dto/farmingCycle.dto';
import { GOOD_RECEIPT_PHOTO_TYPE } from '../../libs/constants';
import { QUEUE_FARMING_CYCLE_DOC_IN } from '../../libs/constants/queue';
import { Logger } from '../../libs/utils/logger';
import { GoodsReceiptCreatedQueue } from '../queues/goods-receipt-created.queue';
import { BaseWorker } from './base.worker';

@Service()
export class FarmingCycleDOCinWorker extends BaseWorker<UpdateDOCinJob> {
  @Inject(FarmingCycleDAO)
  fcDAO: FarmingCycleDAO;

  @Inject(PurchaseOrderDAO)
  poDAO: PurchaseOrderDAO;

  @Inject(GoodsReceiptDAO)
  grDAO: GoodsReceiptDAO;

  @Inject(GoodsReceiptProductDAO)
  grProductDAO: GoodsReceiptProductDAO;

  @Inject(GoodsReceiptPhotoDAO)
  grPhotoDAO: GoodsReceiptPhotoDAO;

  @Inject(GoodsReceiptCreatedQueue)
  grCreatedQueue: GoodsReceiptCreatedQueue;

  @Inject(Logger)
  private logger: Logger;

  protected workerName = QUEUE_FARMING_CYCLE_DOC_IN;

  protected async handle(data: UpdateDOCinJob) {
    const queryRunner = await this.fcDAO.startTransaction();
    try {
      const docPO = await this.poDAO.getOneStrict({
        where: {
          farmingCycleId: data.params.farmingCycleId,
          isDoc: true,
        },
        relations: {
          purchaseOrderProducts: true,
        },
      });

      const goodsReceipt = await this.grDAO.getOneStrict({
        where: {
          purchaseOrderId: docPO.id,
        },
      });

      await Promise.all([
        this.grProductDAO.createManyWithTx(
          docPO.purchaseOrderProducts.map<DeepPartial<GoodsReceiptProduct>>((d) => ({
            goodsReceiptId: goodsReceipt.id,
            categoryCode: d.categoryCode || '',
            categoryName: d.categoryName || '',
            subcategoryCode: d.subcategoryCode || '',
            subcategoryName: d.subcategoryName || '',
            productCode: d.productCode || '',
            productName: d.productName || '',
            quantity: d.quantity,
            uom: d.uom,
            poProductId: d.id,
          })),
          data.user,
          queryRunner,
        ),
        this.grPhotoDAO.createManyWithTx(
          [
            ...data.body.photos.map<DeepPartial<GoodsReceiptPhoto>>((d) => ({
              goodsReceiptId: goodsReceipt.id,
              url: d.url,
            })),
            // FIXME: remove coalesce if app version > 1.1.4
            ...(data.body.suratJalanPhotos || []).map<DeepPartial<GoodsReceiptPhoto>>((d) => ({
              goodsReceiptId: goodsReceipt.id,
              url: d.url,
              type: GOOD_RECEIPT_PHOTO_TYPE.SURAT_JALAN,
            })),
            // FIXME: remove coalesce if app version > 1.1.4
            ...(data.body.docInFormPhotos || []).map<DeepPartial<GoodsReceiptPhoto>>((d) => ({
              goodsReceiptId: goodsReceipt.id,
              url: d.url,
              type: GOOD_RECEIPT_PHOTO_TYPE.DOC_IN_FORM,
            })),
          ],
          data.user,
          queryRunner,
        ),
      ]);

      await this.fcDAO.commitTransaction(queryRunner);

      await this.grCreatedQueue.addJob(goodsReceipt);
    } catch (error) {
      await this.fcDAO.rollbackTransaction(queryRunner);

      this.logger.error(error);

      captureException(error);

      throw error;
    }
  }
}
