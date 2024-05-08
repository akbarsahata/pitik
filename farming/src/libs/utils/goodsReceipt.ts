import { Inject, Service } from 'fastify-decorators';
import { DeepPartial, QueryRunner } from 'typeorm';
import { GoodsReceiptDAO } from '../../dao/goodsReceipt.dao';
import { GoodsReceiptProductDAO } from '../../dao/goodsReceiptProduct.dao';
import { TransferRequestDAO } from '../../dao/transferRequest.dao';
import { GoodsReceiptProduct } from '../../datasources/entity/pgsql/GoodsReceiptProduct.entity';
import { CreateGoodsReceiptTransferRequestResponseItem } from '../../dto/goodsReceipt.dto';
import { GoodsReceiptCreatedQueue } from '../../jobs/queues/goods-receipt-created.queue';
import { ERR_TRANSFER_REQUEST_NOT_FOUND } from '../constants/errors';
import { RequestUser } from '../types/index.d';
import { omit } from './helpers';

@Service()
export class GoodsReceiptUtil {
  @Inject(GoodsReceiptDAO)
  private dao: GoodsReceiptDAO;

  @Inject(GoodsReceiptProductDAO)
  private grProductDAO: GoodsReceiptProductDAO;

  @Inject(TransferRequestDAO)
  private trDAO: TransferRequestDAO;

  @Inject(GoodsReceiptCreatedQueue)
  private grCreatedQueue: GoodsReceiptCreatedQueue;

  async createGoodsReceiptFromTransferRequest(
    transferRequestId: string,
    user: RequestUser,
    queryRunner: QueryRunner,
  ): Promise<CreateGoodsReceiptTransferRequestResponseItem> {
    const transferRequest = await this.trDAO.getOneWithTx(
      {
        where: {
          id: transferRequestId,
        },
        relations: {
          transferRequestProducts: true,
          farmingCycleTarget: true,
        },
      },
      queryRunner,
    );

    if (!transferRequest) {
      throw ERR_TRANSFER_REQUEST_NOT_FOUND();
    }

    const goodsReceipt = await this.dao.createOneWithTx(
      {
        transferRequestId: transferRequest.id,
        receivedDate: transferRequest.datePlanned,
        remarks: transferRequest.remarks,
        notes: transferRequest.notes,
      },
      user,
      queryRunner,
    );

    const details = await this.grProductDAO.createManyWithTx(
      transferRequest.transferRequestProducts.map<DeepPartial<GoodsReceiptProduct>>((d) => ({
        ...omit(d, ['transferRequestId']),
        goodsReceiptId: goodsReceipt.id,
      })),
      user,
      queryRunner,
    );

    await this.dao.commitTransaction(queryRunner, false);

    await this.grCreatedQueue.addJob({
      ...goodsReceipt,
      transferRequest,
      farmingCycleId: transferRequest.farmingCycleTargetId || '',
      farmingCycleCode: transferRequest.farmingCycleTarget?.farmingCycleCode || '',
    });

    return {
      ...goodsReceipt,
      details,
      photos: [],
    };
  }
}
