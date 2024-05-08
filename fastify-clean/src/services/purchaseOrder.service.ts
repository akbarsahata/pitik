import { Inject, Service } from 'fastify-decorators';
import { CoopDAO } from '../dao/coop.dao';
import { FarmingCycleDAO } from '../dao/farmingCycle.dao';
import { FarmingCycleChickStockDDAO } from '../dao/farmingCycleChickStockD.dao';
import { PurchaseOrderDAO } from '../dao/purchaseOrder.dao';
import { PurchaseOrderProductDAO } from '../dao/purchaseOrderProduct.dao';
import { PurchaseRequestDAO } from '../dao/purchaseRequest.dao';
import { PurchaseOrder } from '../datasources/entity/pgsql/PurchaseOrder.entity';
import { PurchaseOrderProduct } from '../datasources/entity/pgsql/PurchaseOrderProduct.entity';
import {
  FeedHistoryItem,
  GetFeedHistoryResponse,
  GetOvkHistoryResponse,
  GetPurchaseOrderDetailItem,
  GetPurchaseOrderDetailParams,
  GetPurchaseOrderItem,
  GetPurchaseOrderList,
  GetPurchaseOrderProductItem,
  GetPurchaseOrderQuery,
  GoodsReceiptItem,
  OvkHistoryItem,
  PurchaseOrderBody,
  PurchaseOrderFulfilledBody,
} from '../dto/purchaseOrder.dto';
import { PurchaseOrderApprovedQueue } from '../jobs/queues/purchase-order-approved.queue';
import { FC_FARMING_STATUS } from '../libs/constants';
import { ERR_PURCHASE_ORDER_MALFORMED } from '../libs/constants/errors';
import { RequestUser } from '../libs/types/index.d';
import { CoopCacheUtil } from '../libs/utils/coopCache';
import { randomHexString } from '../libs/utils/helpers';

interface PurchaseOrderStatus {
  number: 0 | 1 | 2;
  text: 'Dikirim' | 'Sebagian' | 'Lengkap';
}

@Service()
export class PurchaseOrderService {
  @Inject(PurchaseOrderDAO)
  private dao: PurchaseOrderDAO;

  @Inject(PurchaseRequestDAO)
  private purchaseRequestDAO: PurchaseRequestDAO;

  @Inject(PurchaseOrderProductDAO)
  private purchaseOrderProductDAO: PurchaseOrderProductDAO;

  @Inject(FarmingCycleDAO)
  private farmingCycleDAO: FarmingCycleDAO;

  @Inject(CoopDAO)
  private coopDAO: CoopDAO;

  @Inject(PurchaseOrderApprovedQueue)
  private poQueue: PurchaseOrderApprovedQueue;

  @Inject(FarmingCycleChickStockDDAO)
  private farmingCycleChickStockDDAO: FarmingCycleChickStockDDAO;

  @Inject(CoopCacheUtil)
  private coopCacheUtil: CoopCacheUtil;

  async createPurchaseOrder(input: PurchaseOrderBody, user: RequestUser) {
    const purchaseOrder = await this.dao.getOne({
      where: {
        erpCode: input.purchaseOrderCode,
      },
    });

    if (purchaseOrder) return;

    const queryRunner = await this.dao.startTransaction();

    try {
      const purchaseRequest = await this.purchaseRequestDAO.getOneStrict({
        where: {
          erpCode: input.purchaseOrderCode,
        },
        relations: {
          farmingCycle: true,
        },
        relationLoadStrategy: 'join',
      });

      let type = input.isDoc ? 'doc' : undefined;

      const isOvk = input.details.some((d) => /^ovk/gi.test(d.categoryCode || ''));

      const isPakan = input.details.some((d) => /^pakan/gi.test(d.categoryCode || ''));

      if (isOvk && !isPakan) type = 'ovk';

      if (!isOvk && isPakan) type = 'pakan';

      // insert PurchaseOrder record
      const newPurchaseOrder = await this.dao.createOneWithTx(
        {
          type,
          farmingCycleId: purchaseRequest.farmingCycleId,
          erpCode: input.purchaseOrderCode,
          purchaseRequestId: purchaseRequest.id,
          datePlanned: input.datePlanned,
          isDoc: input.isDoc,
          isApproved: input.isApproved,
          approvedBy: input.isApproved ? user.id : undefined,
        },
        user,
        queryRunner,
      );

      await this.purchaseOrderProductDAO.createManyWithTx(
        input.details.map<Partial<PurchaseOrderProduct>>((detail) => ({
          purchaseOrderId: newPurchaseOrder.id,
          categoryCode: detail.categoryCode,
          categoryName: detail.categoryName,
          subcategoryCode: detail.subcategoryCode,
          subcategoryName: detail.subcategoryName,
          productCode: detail.productCode,
          productName: detail.productName,
          quantity: detail.quantity,
          uom: detail.uom,
        })),
        user,
        queryRunner,
      );

      if (input.isDoc) {
        await this.farmingCycleDAO.updateOneWithTx(
          { id: newPurchaseOrder.farmingCycleId },
          {
            farmingStatus: FC_FARMING_STATUS.NEW,
            farmingCycleStartDate: new Date(input.datePlanned),
          },
          user,
          queryRunner,
        );

        await this.coopDAO.updateOneWithTx(
          { id: purchaseRequest.farmingCycle.coopId },
          {
            activeFarmingCycleId: purchaseRequest.farmingCycleId,
            chickInDate: input.datePlanned,
          },
          user,
          queryRunner,
        );

        await this.coopCacheUtil.invalidateCoopCache(purchaseRequest.farmingCycle.coopId, 'both');

        await this.farmingCycleChickStockDDAO.createOneWithTx(
          {
            qty: input.details[0].quantity,
            notes: 'Initial Population',
            operator: '+',
            transactionDate: input.datePlanned,
            farmingCycleId: purchaseRequest.farmingCycleId,
            userId: user.id,
          },
          user,
          queryRunner,
        );
      }

      await this.dao.commitTransaction(queryRunner);

      if (input.isDoc) {
        await this.poQueue.addJob(newPurchaseOrder);
      }
    } catch (error) {
      await this.dao.rollbackTransaction(queryRunner);

      throw error;
    }
  }

  async fulfillPurchaseOrder(input: PurchaseOrderFulfilledBody, user: RequestUser) {
    const queryRunner = await this.dao.startTransaction();

    try {
      const purchaseOrder = await this.dao.getOneStrict({
        where: {
          erpCode: input.purchaseOrderCode,
        },
      });

      await this.dao.updateOneWithTx(
        {
          id: purchaseOrder.id,
        },
        {
          isFulfilled: true,
        },
        user,
        queryRunner,
      );

      await this.dao.commitTransaction(queryRunner);
    } catch (error) {
      await this.dao.rollbackTransaction(queryRunner);

      throw error;
    }
  }

  async getPurchaseOrderList(params: GetPurchaseOrderQuery): Promise<GetPurchaseOrderList> {
    const [purchaseOrders] = await this.dao.getMany({
      where: {
        farmingCycleId: params.farmingCycleId,
        type: params.type,
      },
      select: {
        id: true,
        erpCode: true,
        datePlanned: true,
        isFulfilled: true,
        purchaseOrderProducts: true,
        notes: true,
        goodsReceipts: {
          id: true,
          receivedDate: true,
        },
      },
      order: {
        datePlanned: 'desc',
        goodsReceipts: {
          receivedDate: 'asc',
        },
      },
      relations: {
        purchaseOrderProducts: true,
        goodsReceipts: true,
      },
      relationLoadStrategy: 'join',
    });

    return purchaseOrders.map<GetPurchaseOrderItem>((po) => {
      const status = this.purchaseOrderStatus(po);

      return {
        id: po.id,
        erpCode: po.erpCode,
        deliveryDate: po.datePlanned,
        arrivalDate: po.goodsReceipts?.length ? po.goodsReceipts[0].receivedDate : '',
        isFulfilled: po.isFulfilled,
        status: status.number,
        statusText: status.text,
        notes: po.notes,
        details: po.purchaseOrderProducts.map<GetPurchaseOrderProductItem>((pop) => ({
          ...pop,
          categoryCode: pop.categoryCode || '',
          categoryName: pop.categoryName || '',
          subcategoryCode: pop.subcategoryCode || '',
          subcategoryName: pop.subcategoryName || '',
          productCode: pop.productCode || '',
          productName: pop.productName || '',
        })),
        description: this.purchaseOrderDescription(po.purchaseOrderProducts),
      };
    });
  }

  async getPurchaseOrderDetail(
    params: GetPurchaseOrderDetailParams,
  ): Promise<GetPurchaseOrderDetailItem> {
    const purchaseOrder = await this.dao.getOneStrict({
      where: {
        id: params.purchaseOrderId,
      },
      select: {
        id: true,
        erpCode: true,
        remarks: true,
        datePlanned: true,
        isFulfilled: true,
        notes: true,
        purchaseOrderProducts: true,
        goodsReceipts: {
          id: true,
          receivedDate: true,
          remarks: true,
          notes: true,
          photos: true,
          goodsReceiptProducts: true,
        },
      },
      order: {
        datePlanned: 'desc',
        goodsReceipts: {
          receivedDate: 'asc',
        },
      },
      relations: {
        purchaseOrderProducts: true,
        goodsReceipts: {
          goodsReceiptProducts: true,
          photos: true,
        },
      },
      relationLoadStrategy: 'join',
    });

    const status = this.purchaseOrderStatus(purchaseOrder);

    const productSumMap = new Map<string, number>();

    const goodsReceipts = purchaseOrder.goodsReceipts.map<GoodsReceiptItem>((gr) => {
      gr.goodsReceiptProducts.forEach((grp) => {
        if (productSumMap.has(grp.poProductId)) {
          let sum = Number(productSumMap.get(grp.poProductId)) || 0;

          sum += Number(grp.quantity);

          productSumMap.set(grp.poProductId, sum);
        } else {
          productSumMap.set(grp.poProductId, grp.quantity);
        }
      });

      return {
        receivedDate: gr.receivedDate,
        remarks: gr.remarks,
        notes: gr.notes,
        details: gr.goodsReceiptProducts,
        photos: gr.photos,
      };
    });

    const details = purchaseOrder.purchaseOrderProducts.map<GetPurchaseOrderProductItem>((pop) => {
      const remaining = pop.quantity - (productSumMap.get(pop.id) || 0);

      return {
        ...pop,
        categoryCode: pop.categoryCode || '',
        categoryName: pop.categoryName || '',
        subcategoryCode: pop.subcategoryCode || '',
        subcategoryName: pop.subcategoryName || '',
        productCode: pop.productCode || '',
        productName: pop.productName || '',
        remaining: remaining < 0 ? 0 : remaining, // prevent showing negative remaining
      };
    });

    return {
      id: purchaseOrder.id,
      erpCode: purchaseOrder.erpCode,
      deliveryDate: purchaseOrder.datePlanned,
      arrivalDate: purchaseOrder.goodsReceipts?.length
        ? purchaseOrder.goodsReceipts[0].receivedDate
        : '',
      isFulfilled: purchaseOrder.isFulfilled,
      status: status.number,
      statusText: status.text,
      notes: purchaseOrder.notes,
      details,
      goodsReceipts,
      description: this.purchaseOrderDescription(purchaseOrder.purchaseOrderProducts),
    };
  }

  async feedHistory(farmingCycleId: string): Promise<GetFeedHistoryResponse> {
    const categoryName = 'PAKAN';
    const [purchaseOrders] = await this.dao.getMany({
      where: {
        farmingCycleId,
        isApproved: true,
        isFulfilled: true,
        purchaseOrderProducts: {
          categoryName,
        },
      },
      relations: {
        purchaseOrderProducts: true,
      },
    });

    const data: FeedHistoryItem[] = [];
    purchaseOrders.forEach((po) => {
      po.purchaseOrderProducts.forEach((pop) => {
        if (pop.categoryName === categoryName) {
          data.push({
            date: po.datePlanned,
            productCode: pop.productCode,
            subcategoryName: pop.subcategoryName,
            quantity: pop.quantity,
          });
        }
      });
    });

    return {
      code: 200,
      data,
    };
  }

  async ovkHistory(farmingCycleId: string): Promise<GetOvkHistoryResponse> {
    const categoryName = 'OVK';
    const [purchaseOrders] = await this.dao.getMany({
      where: {
        farmingCycleId,
        isApproved: true,
        isFulfilled: true,
        purchaseOrderProducts: {
          categoryName,
        },
      },
      relations: {
        purchaseOrderProducts: true,
      },
    });

    const data: OvkHistoryItem[] = [];
    purchaseOrders.forEach((po) => {
      po.purchaseOrderProducts.forEach((pop) => {
        if (pop.categoryName === categoryName) {
          data.push({
            date: po.datePlanned,
            productName: pop.productName,
            quantity: pop.quantity,
          });
        }
      });
    });

    return {
      code: 200,
      data,
    };
  }

  async manualTriggerPoApproved() {
    const fakePO = new PurchaseOrder();

    fakePO.id = randomHexString();
    fakePO.isApproved = true;
    fakePO.approvedBy = randomHexString();
    fakePO.isDoc = true;

    await this.poQueue.addJob(fakePO);
  }

  // eslint-disable-next-line class-methods-use-this
  private purchaseOrderStatus(pr: PurchaseOrder): PurchaseOrderStatus {
    if (!pr.isFulfilled && !pr.goodsReceipts.length) {
      return { number: 0, text: 'Dikirim' };
    }

    if (!pr.isFulfilled && pr.goodsReceipts.length) {
      return { number: 1, text: 'Sebagian' };
    }

    if (pr.isFulfilled) {
      return { number: 2, text: 'Lengkap' };
    }

    throw ERR_PURCHASE_ORDER_MALFORMED(pr.id);
  }

  // eslint-disable-next-line class-methods-use-this
  private purchaseOrderDescription(pop: PurchaseOrderProduct[]): string {
    let text = pop[0].productName || pop[0].subcategoryName;

    if (pop.length > 1) {
      text += ` dan ${pop.length - 1} lainnya`;
    }

    return text;
  }
}
