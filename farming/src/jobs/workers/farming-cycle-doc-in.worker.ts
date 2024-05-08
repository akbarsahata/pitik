import { JobsOptions } from 'bullmq';
import { Inject, Service } from 'fastify-decorators';
import { DeepPartial } from 'typeorm';
import { SlackDAO } from '../../dao/external/slack.dao';
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
  private fcDAO!: FarmingCycleDAO;

  @Inject(PurchaseOrderDAO)
  private poDAO!: PurchaseOrderDAO;

  @Inject(GoodsReceiptDAO)
  private grDAO!: GoodsReceiptDAO;

  @Inject(GoodsReceiptProductDAO)
  private grProductDAO!: GoodsReceiptProductDAO;

  @Inject(GoodsReceiptPhotoDAO)
  private grPhotoDAO!: GoodsReceiptPhotoDAO;

  @Inject(SlackDAO)
  private slackDAO!: SlackDAO;

  @Inject(GoodsReceiptCreatedQueue)
  private grCreatedQueue!: GoodsReceiptCreatedQueue;

  @Inject(Logger)
  private logger!: Logger;

  protected workerName = QUEUE_FARMING_CYCLE_DOC_IN;

  protected async handle(
    data: UpdateDOCinJob,
    attemptsMade: number,
    opts: JobsOptions,
    jobId?: string,
  ) {
    const queryRunner = await this.fcDAO.startTransaction();
    try {
      const docPO = await this.poDAO.getOneStrict({
        where: {
          erpCode: data.body.erpCode ? data.body.erpCode : data.body.poCode,
          farmingCycleId: data.params.farmingCycleId,
          isDoc: true,
          isApproved: true,
        },
        relations: {
          purchaseOrderProducts: true,
          farmingCycle: true,
        },
        order: {
          createdDate: 'DESC',
        },
      });

      const goodsReceipt = await this.grDAO.getOneStrict({
        where: {
          purchaseOrderId: docPO.id,
        },
      });

      const { farmingCycle } = docPO;

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
            quantity: data.body.initialPopulation || d.quantity,
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
            ...data.body.suratJalanPhotos.map<DeepPartial<GoodsReceiptPhoto>>((d) => ({
              goodsReceiptId: goodsReceipt.id,
              url: d.url,
              type: GOOD_RECEIPT_PHOTO_TYPE.SURAT_JALAN,
            })),
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

      await this.grCreatedQueue.addJob({
        ...goodsReceipt,
        purchaseOrder: docPO,
        farmingCycleId: farmingCycle.id,
        farmingCycleCode: farmingCycle.farmingCycleCode,
      });
    } catch (error) {
      await this.fcDAO.rollbackTransaction(queryRunner);

      this.logger.error(error);

      if (attemptsMade === opts.attempts) {
        await this.slackDAO.alertFailedJobs(this.workerName, error, data, jobId);
      }

      throw error;
    }
  }
}
