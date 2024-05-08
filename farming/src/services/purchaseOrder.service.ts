import { differenceInCalendarDays, isAfter } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { Inject, Service } from 'fastify-decorators';
import { Between, DeepPartial, In, IsNull, Not, QueryRunner, Raw } from 'typeorm';
import { ChickInRequestDAO } from '../dao/chickInRequest.dao';
import { CoopDAO } from '../dao/coop.dao';
import { FarmingCycleDAO } from '../dao/farmingCycle.dao';
import { FarmingCycleChickStockDDAO } from '../dao/farmingCycleChickStockD.dao';
import { PurchaseOrderDAO } from '../dao/purchaseOrder.dao';
import { PurchaseOrderProductDAO } from '../dao/purchaseOrderProduct.dao';
import { PurchaseRequestDAO } from '../dao/purchaseRequest.dao';
import { TransferRequestDAO } from '../dao/transferRequest.dao';
import { LogisticInfo } from '../datasources/entity/pgsql/LogisticInfo.entity';
import { PurchaseOrder } from '../datasources/entity/pgsql/PurchaseOrder.entity';
import { PurchaseOrderProduct } from '../datasources/entity/pgsql/PurchaseOrderProduct.entity';
import { TransferRequestProduct } from '../datasources/entity/pgsql/TransferRequestProduct.entity';
import {
  FeedHistoryItem,
  GetPurchaseOrderDetailItem,
  GetPurchaseOrderDetailParams,
  GetPurchaseOrderItem,
  GetPurchaseOrderList,
  GetPurchaseOrderProductItem,
  GetPurchaseOrderQuery,
  GoodsReceiptItem,
  OvkHistoryItem,
  PurchaseOrderFulfilledBody,
  UpdatePurchaseOrderProductBody,
  UpdatePurchaseOrderProductParams,
  UpsertPurchaseOrderBody,
} from '../dto/purchaseOrder.dto';
import { PurchaseOrderApprovedNotificationQueue } from '../jobs/queues/purchase-order-approved-notification.queue';
import { PurchaseOrderApprovedQueue } from '../jobs/queues/purchase-order-approved.queue';
import { PurchaseOrderRejectedQueue } from '../jobs/queues/purchase-order-rejected.queue';
import { CHICK_IN_REQ_REMARKS, DEFAULT_TIME_ZONE, FC_FARMING_STATUS } from '../libs/constants';
import {
  ERR_BAD_REQUEST,
  ERR_PO_PR_FILTER_DATE_INCOMPLETE_DATES,
  ERR_PO_PR_FILTER_DATE_INVALID_DATES,
  ERR_PURCHASE_ORDER_MALFORMED,
  ERR_PURCHASE_ORDER_MULTITYPE,
  ERR_PURCHASE_ORDER_NOT_FOUND,
  ERR_PURCHASE_REQUEST_NOT_FOUND,
} from '../libs/constants/errors';
import { RequestUser } from '../libs/types/index.d';
import { CoopCacheUtil } from '../libs/utils/coopCache';
import { TransferRequestService } from './farming/transferRequest.service';

interface PurchaseOrderStatus {
  number: 0 | 1 | 2;
  text: 'Dikirim' | 'Sebagian' | 'Lengkap' | 'Diproses' | 'Ditolak';
}

interface PurchaseOrderMergedLogisticInfo {
  mergedLogisticCoopName: string | null;
  mergedLogisticFarmingCycleDays: number | null;
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

  @Inject(TransferRequestDAO)
  private transferRequestDAO: TransferRequestDAO;

  @Inject(ChickInRequestDAO)
  private chickInRequestDAO: ChickInRequestDAO;

  @Inject(PurchaseOrderApprovedQueue)
  private purchaseOrderApprovedQueue: PurchaseOrderApprovedQueue;

  @Inject(PurchaseOrderApprovedNotificationQueue)
  private purchaseOrderApprovedNotificationQueue: PurchaseOrderApprovedNotificationQueue;

  @Inject(PurchaseOrderRejectedQueue)
  private purchaseOrderRejectedQueue: PurchaseOrderRejectedQueue;

  @Inject(FarmingCycleChickStockDDAO)
  private farmingCycleChickStockDDAO: FarmingCycleChickStockDDAO;

  @Inject(CoopCacheUtil)
  private coopCacheUtil: CoopCacheUtil;

  async upsertPurchaseOrder(input: UpsertPurchaseOrderBody, user: RequestUser): Promise<string> {
    const queryRunner = await this.dao.startTransaction();

    try {
      if (input.isReverted && input.purchaseOrderIdReference) {
        const poToRevert = await this.dao.getOneWithTx(
          {
            where: {
              id: input.purchaseOrderIdReference,
            },
            relations: {
              goodsReceipts: true,
            },
          },
          queryRunner,
        );

        if (!poToRevert) {
          throw ERR_PURCHASE_ORDER_NOT_FOUND(
            '\nTidak bisa dilakukan revert PO',
            `\nID reference: ${input.purchaseOrderIdReference}`,
          );
        }

        if (poToRevert.goodsReceipts.length) {
          throw ERR_PURCHASE_ORDER_MALFORMED(
            '\nTidak bisa dilakukan revert PO karena sudah memiliki GR',
            `\nID reference: ${input.purchaseOrderIdReference}, kode: ${poToRevert.erpCode || ''}`,
          );
        }

        await this.dao.updateOneWithTx(
          {
            id: input.purchaseOrderIdReference,
          },
          {
            isReverted: true,
            isApproved: false,
            approvedBy: user.id,
          },
          user,
          queryRunner,
        );
      }

      const purchaseRequest = await this.purchaseRequestDAO.getOneWithTx(
        {
          where: {
            erpCode: input.purchaseRequestCode,
          },
          relations: {
            farmingCycle: true,
          },
          relationLoadStrategy: 'join',
        },
        queryRunner,
      );

      if (!purchaseRequest) {
        throw ERR_PURCHASE_REQUEST_NOT_FOUND(`ERP Code: ${input.purchaseRequestCode}`);
      }

      let type = input.isDoc ? 'doc' : undefined;

      const isOvk = input.details.some((d) => /^ovk/gi.test(d.categoryCode || ''));

      const isPakan = input.details.some((d) => /^pakan/gi.test(d.categoryCode || ''));

      if (isOvk && isPakan) {
        throw ERR_PURCHASE_ORDER_MULTITYPE();
      }

      if (isOvk && !isPakan) type = 'ovk';

      if (!isOvk && isPakan) type = 'pakan';

      const purchaseOrder = await this.dao.getOneWithTx(
        {
          where: {
            erpCode: input.purchaseOrderCode,
          },
        },
        queryRunner,
      );

      if (!purchaseOrder) {
        const newPurchaseOrder = await this.dao.createOneWithTx(
          {
            type,
            farmingCycleId: purchaseRequest.farmingCycleId,
            erpCode: input.purchaseOrderCode,
            purchaseRequestId: purchaseRequest.id,
            datePlanned: input.datePlanned,
            isDoc: input.isDoc,
          },
          user,
          queryRunner,
        );

        await this.purchaseOrderProductDAO.createManyWithTx(
          input.details.map<Partial<PurchaseOrderProduct>>((detail) => ({
            purchaseOrderId: newPurchaseOrder.id,
            categoryCode: detail.categoryCode,
            categoryName: detail.categoryName,
            subcategoryCode:
              detail.subcategoryCode && detail.subcategoryCode !== 'false'
                ? detail.subcategoryCode
                : detail.categoryCode,
            subcategoryName:
              detail.subcategoryCode && detail.subcategoryName !== 'false'
                ? detail.subcategoryName
                : detail.categoryName,
            productCode: detail.productCode,
            productName: detail.productName,
            quantity: detail.quantity,
            uom: detail.uom,
          })),
          user,
          queryRunner,
        );

        await this.dao.commitTransaction(queryRunner);

        return newPurchaseOrder.id;
      }

      if (input.status === 'draft') {
        await this.dao.updateOneWithTx({ id: purchaseOrder.id }, { type }, user, queryRunner);

        await this.purchaseOrderProductDAO.deleteManyWithTx(
          { purchaseOrderId: purchaseOrder.id },
          queryRunner,
        );

        await this.purchaseOrderProductDAO.createManyWithTx(
          input.details.map<Partial<PurchaseOrderProduct>>((detail) => ({
            purchaseOrderId: purchaseOrder!.id,
            categoryCode: detail.categoryCode,
            categoryName: detail.categoryName,
            subcategoryCode:
              detail.subcategoryCode && detail.subcategoryCode !== 'false'
                ? detail.subcategoryCode
                : detail.categoryCode,
            subcategoryName:
              detail.subcategoryCode && detail.subcategoryName !== 'false'
                ? detail.subcategoryName
                : detail.categoryName,
            productCode: detail.productCode,
            productName: detail.productName,
            quantity: detail.quantity,
            uom: detail.uom,
          })),
          user,
          queryRunner,
        );
      } else if (input.status === 'rejected') {
        await this.dao.updateOneWithTx(
          {
            id: purchaseOrder.id,
          },
          {
            isApproved: false,
            approvedBy: user.id,
          },
          user,
          queryRunner,
        );

        if (input.isDoc) {
          await this.chickInRequestDAO.updateOneWithTx(
            {
              id: purchaseRequest.chickInRequestId,
            },
            {
              remarks: CHICK_IN_REQ_REMARKS.REJECTED_BY_PROC,
            },
            user,
            queryRunner,
          );
        }
      } else if (input.status === 'approved') {
        await this.dao.updateOneWithTx(
          {
            id: purchaseOrder.id,
          },
          {
            isApproved: true,
            approvedBy: user.id,
          },
          user,
          queryRunner,
        );

        if (input.isDoc) {
          await this.farmingCycleDAO.updateOneWithTx(
            { id: purchaseOrder.farmingCycleId },
            {
              farmingStatus: FC_FARMING_STATUS.NEW,
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

          await this.farmingCycleChickStockDDAO.upsertOneWithTx(
            {
              qty: input.details[0].quantity,
              notes: 'Initial Population',
              operator: '+',
              farmingCycleId: purchaseRequest.farmingCycleId,
            },
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
        } else {
          await this.purchaseOrderApprovedNotificationQueue.addJob({
            ...purchaseOrder,
            isApproved: true,
            farmingCycleCode: purchaseRequest.farmingCycle.farmingCycleCode,
          });
        }
      }

      await this.dao.commitTransaction(queryRunner);

      if (input.isDoc && input.status === 'approved' && !purchaseOrder.isApproved) {
        await this.purchaseOrderApprovedQueue.addJob({
          ...purchaseOrder,
          isApproved: true,
          approvedBy: user.id,
          farmingCycleCode: purchaseRequest.farmingCycle.farmingCycleCode,
        });
      } else if (input.isDoc && input.status === 'rejected' && purchaseOrder.isApproved === null) {
        await this.purchaseOrderRejectedQueue.addJob({
          ...purchaseOrder,
          isApproved: false,
          approvedBy: user.id,
          farmingCycleCode: purchaseRequest.farmingCycle.farmingCycleCode,
        });
      }

      return purchaseOrder.id;
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

  async getPurchaseOrderList(
    params: GetPurchaseOrderQuery,
  ): Promise<[GetPurchaseOrderList, number]> {
    if ((params.fromDate && !params.untilDate) || (!params.fromDate && params.untilDate)) {
      throw ERR_PO_PR_FILTER_DATE_INCOMPLETE_DATES();
    }

    if (
      params.fromDate &&
      params.untilDate &&
      isAfter(new Date(params.fromDate), new Date(params.untilDate))
    ) {
      throw ERR_PO_PR_FILTER_DATE_INVALID_DATES();
    }

    if (!params.coopId && !params.farmingCycleId) {
      throw ERR_BAD_REQUEST('Either coopId or farmingCycleId must be supplied in query');
    }

    const farmingCycle = await this.farmingCycleDAO.getOne({
      where: {
        ...(params.isBeforeDoc &&
          params.coopId && {
            farmingStatus: FC_FARMING_STATUS.NEW,
          }),
        ...(params.coopId && {
          coopId: params.coopId,
        }),
        ...(params.farmingCycleId && {
          id: params.farmingCycleId,
        }),
      },
      order: {
        createdDate: 'DESC',
      },
    });

    if (!farmingCycle) return [[], 0];

    const statuses = params.status?.split(',') || [];

    const shouldGetDraft = statuses.some((status) => status === 'draft');

    const shouldGetRejected = statuses.some((status) => status === 'rejected');

    const shouldGetApproved = statuses.some((status) => status === 'approved');

    const isApproved = statuses.length
      ? Raw((alias) => {
          const where = [];

          if (shouldGetDraft) {
            where.push(`${alias} is null`);
          }

          if (shouldGetRejected) {
            where.push(`${alias} = false`);
          }

          if (shouldGetApproved) {
            where.push(`${alias} = true`);
          }

          return `(${where.join(' OR ')})`;
        })
      : undefined;

    const [[transferRequests], [purchaseOrders]] = await Promise.all([
      isApproved === undefined || shouldGetApproved
        ? this.transferRequestDAO.getMany({
            where: {
              coopTargetId: farmingCycle.coopId,
              route: 'BRANCH-TO-COOP',
              isApproved: true,
              cancellationRequestBy: IsNull(),
              type: params.type && params.type !== 'doc' ? params.type : undefined,
              farmingCycleTargetId: farmingCycle.id,
              ...(params.fromDate &&
                params.untilDate && {
                  datePlanned: Between(params.fromDate, params.untilDate),
                }),
            },
            select: {
              id: true,
              erpCode: true,
              datePlanned: true,
              isApproved: true,
              approvedBy: true,
              type: true,
              transferRequestProducts: true,
              notes: true,
              goodsReceipts: {
                id: true,
                receivedDate: true,
              },
            },
            relations: {
              purchaseRequests: true,
              transferRequestProducts: true,
              goodsReceipts: true,
            },
            relationLoadStrategy: 'join',
          })
        : Promise.resolve([[]]),
      this.dao.getMany({
        where: {
          farmingCycleId: farmingCycle.id,
          type: params.type ? params.type : Not('doc'),
          isReverted: false,
          isApproved: params.type === 'doc' ? true : isApproved,
          ...(params.fromDate &&
            params.untilDate && {
              datePlanned: Between(params.fromDate, params.untilDate),
            }),
          isFulfilled: params.isFulfilled === false ? IsNull() : params.isFulfilled,
        },
        select: {
          id: true,
          erpCode: true,
          datePlanned: true,
          isFulfilled: true,
          type: true,
          isApproved: true,
          approvedBy: true,
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
          purchaseRequest: true,
          purchaseOrderProducts: true,
          goodsReceipts: true,
        },
        relationLoadStrategy: 'join',
      }),
    ]);

    const transferRequestsMapped = transferRequests.map<GetPurchaseOrderItem>((tr) => {
      const status = TransferRequestService.transferRequestStatus(tr);

      return {
        id: tr.id,
        erpCode: tr.erpCode,
        purchaseRequestErpCode: tr.purchaseRequests[0]?.erpCode || '',
        deliveryDate: tr.datePlanned,
        arrivalDate: tr.goodsReceipts?.length ? tr.goodsReceipts[0].receivedDate : '',
        isFulfilled: false,
        status: status.number,
        statusText: status.text,
        notes: tr.notes,
        type: tr.type,
        details: tr.transferRequestProducts.map<GetPurchaseOrderProductItem>((trp) => ({
          ...trp,
          categoryCode: trp.categoryCode || '',
          categoryName: trp.categoryName || '',
          subcategoryCode: trp.subcategoryCode || '',
          subcategoryName: trp.subcategoryName || '',
          productCode: trp.productCode || '',
          productName: trp.productName || '',
          isReturned: false,
        })),
        description: this.purchaseOrderDescription(tr.transferRequestProducts),
        isTransferRequest: true,
      };
    });

    const purchaseOrdersMapped = purchaseOrders.map<GetPurchaseOrderItem>((po) => {
      const status = this.purchaseOrderStatus(po);

      return {
        id: po.id,
        erpCode: po.erpCode,
        purchaseRequestErpCode: po.purchaseRequest?.erpCode || '',
        deliveryDate: po.datePlanned,
        arrivalDate: po.goodsReceipts?.length ? po.goodsReceipts[0].receivedDate : '',
        isFulfilled: po.isFulfilled,
        status: status.number,
        statusText: status.text,
        type: po.type,
        notes: po.notes,
        details: po.purchaseOrderProducts.map<GetPurchaseOrderProductItem>((pop) => ({
          ...pop,
          categoryCode: pop.categoryCode || '',
          categoryName: pop.categoryName || '',
          subcategoryCode: pop.subcategoryCode || '',
          subcategoryName: pop.subcategoryName || '',
          productCode: pop.productCode || '',
          productName: pop.productName || '',
          isReturned: !!pop.returnedDate,
        })),
        description: this.purchaseOrderDescription(po.purchaseOrderProducts),
        isTransferRequest: false,
      };
    });

    // sorted by delivery date DESC
    const purchaseOrderWithTransferRequest = [
      ...transferRequestsMapped,
      ...purchaseOrdersMapped,
    ].sort((a, b) => new Date(b.deliveryDate).getTime() - new Date(a.deliveryDate).getTime());

    // Special condition (to be used by purchase-orders closing - GR validation case)
    if (params.isFulfilled === false) return [purchaseOrdersMapped, purchaseOrdersMapped.length];

    return [purchaseOrderWithTransferRequest, purchaseOrderWithTransferRequest.length];
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
        farmingCycleId: true,
        purchaseOrderProducts: true,
        purchaseRequestId: true,
        type: true,
        isApproved: true,
        approvedBy: true,
        purchaseRequest: {
          erpCode: true,
          mergedLogistic: true,
          logisticInfoId: true,
          logisticInfo: {
            matchingNumber: true,
            coopIdLeader: true,
            coopIdFollower: true,
          },
        },
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
        purchaseRequest: {
          logisticInfo: true,
        },
        purchaseOrderProducts: true,
        goodsReceipts: {
          goodsReceiptProducts: true,
          photos: true,
        },
        farmingCycle: true,
      },
      relationLoadStrategy: 'join',
    });

    const status = this.purchaseOrderStatus(purchaseOrder);

    const receivedProductsMapByCode = new Map<string, number>();

    const goodsReceipts = purchaseOrder.goodsReceipts.map<GoodsReceiptItem>((gr) => {
      gr.goodsReceiptProducts.forEach((grp) => {
        if (receivedProductsMapByCode.has(grp.productCode)) {
          let sum = Number(receivedProductsMapByCode.get(grp.productCode)) || 0;

          sum += Number(grp.quantity);

          receivedProductsMapByCode.set(grp.productCode, sum);
        } else {
          receivedProductsMapByCode.set(grp.productCode, grp.quantity);
        }
      });

      return {
        receivedDate: gr.receivedDate,
        remarks: gr.remarks,
        notes: gr.notes,
        photos: gr.photos,
        details: gr.goodsReceiptProducts.map((grp) => ({ ...grp, isReturned: !!grp.isReturned })),
      };
    });

    const details = purchaseOrder.purchaseOrderProducts.reduce<GetPurchaseOrderProductItem[]>(
      (prev, pop) => {
        const remaining = pop.quantity - (receivedProductsMapByCode.get(pop.productCode) || 0);

        if (pop.returnedDate) return prev;

        return [
          ...prev,
          {
            ...pop,
            categoryCode: pop.categoryCode || '',
            categoryName: pop.categoryName || '',
            subcategoryCode: pop.subcategoryCode || '',
            subcategoryName: pop.subcategoryName || '',
            productCode: pop.productCode || '',
            productName: pop.productName || '',
            remaining: remaining < 0 ? 0 : remaining, // prevent showing negative remaining
          },
        ];
      },
      [],
    );

    const logisticInfo: PurchaseOrderMergedLogisticInfo =
      await this.purchaseOrderMergedLogisticInfo(
        purchaseOrder.purchaseRequest.mergedLogistic,
        purchaseOrder.purchaseRequest.logisticInfo,
        purchaseOrder.purchaseRequest.farmingCycleId,
      );

    return {
      id: purchaseOrder.id,
      erpCode: purchaseOrder.erpCode,
      purchaseRequestErpCode: purchaseOrder.purchaseRequest?.erpCode || '',
      deliveryDate: purchaseOrder.datePlanned,
      arrivalDate: purchaseOrder.goodsReceipts?.length
        ? purchaseOrder.goodsReceipts[0].receivedDate
        : '',
      isFulfilled: purchaseOrder.isFulfilled,
      status: status.number,
      statusText: status.text,
      type: purchaseOrder.type,
      notes: purchaseOrder.notes,
      details,
      goodsReceipts,
      description: this.purchaseOrderDescription(purchaseOrder.purchaseOrderProducts),
      mergedLogistic: purchaseOrder.purchaseRequest.mergedLogistic,
      isTransferRequest: false,
      ...logisticInfo,
    };
  }

  async markProductsAsReturned(
    params: UpdatePurchaseOrderProductParams,
    data: UpdatePurchaseOrderProductBody,
    user: RequestUser,
    queryRunner: QueryRunner,
  ) {
    const purchaseOrder = this.dao.getOneWithTx(
      {
        where: {
          id: params.purchaseOrderId,
        },
        select: {
          id: true,
        },
      },
      queryRunner,
    );

    if (!purchaseOrder) {
      throw ERR_PURCHASE_ORDER_NOT_FOUND(`ID: ${params.purchaseOrderId}`);
    }

    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const updatedProducts = await this.purchaseOrderProductDAO.updateManyWithTx(
      {
        purchaseOrderId: params.purchaseOrderId,
        productCode: In(data.details.map((d) => d.productCode)),
      },
      { returnedDate: now },
      user,
      queryRunner,
    );

    return updatedProducts;
  }

  getSapronakHistory(
    farmingCycleId: string,
    // eslint-disable-next-line no-unused-vars
  ): (categoryName: 'OVK' | 'PAKAN') => Promise<FeedHistoryItem[]> {
    return async (categoryName: 'OVK' | 'PAKAN'): Promise<FeedHistoryItem[]> => {
      const [[purchaseOrders], [transferRequests]] = await Promise.all([
        this.dao.getMany({
          where: {
            farmingCycleId,
            goodsReceipts: {
              goodsReceiptProducts: {
                categoryName,
              },
            },
            isFulfilled: true,
          },
          relations: {
            goodsReceipts: {
              goodsReceiptProducts: true,
            },
          },
          order: {
            goodsReceipts: {
              createdDate: 'ASC',
            },
          },
        }),
        this.transferRequestDAO.getMany({
          where: {
            farmingCycleId,
            route: 'BRANCH-TO-COOP',
            goodsReceipts: {
              goodsReceiptProducts: {
                categoryName,
              },
            },
          },
          relations: {
            goodsReceipts: {
              goodsReceiptProducts: true,
            },
          },
          order: {
            goodsReceipts: {
              createdDate: 'ASC',
            },
          },
        }),
      ]);

      const history: OvkHistoryItem[] = [];

      purchaseOrders.forEach((po) => {
        po.goodsReceipts.forEach((gr) => {
          gr.goodsReceiptProducts.forEach((grp) => {
            history.push({
              date: po.datePlanned,
              productCode: grp.productCode,
              productName: grp.productName,
              subcategoryCode: grp.subcategoryCode,
              subcategoryName: grp.subcategoryName,
              quantity: grp.quantity,
            });
          });
        });
      });

      transferRequests.forEach((po) => {
        po.goodsReceipts.forEach((gr) => {
          gr.goodsReceiptProducts.forEach((grp) => {
            history.push({
              date: po.datePlanned,
              productCode: grp.productCode,
              productName: grp.productName,
              subcategoryCode: grp.subcategoryCode,
              subcategoryName: grp.subcategoryName,
              quantity: grp.quantity,
            });
          });
        });
      });

      history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      return history;
    };
  }

  // eslint-disable-next-line class-methods-use-this
  private purchaseOrderStatus(po: PurchaseOrder): PurchaseOrderStatus {
    if (!po.approvedBy && po.isApproved === null) {
      return { number: 0, text: 'Diproses' };
    }

    if (po.approvedBy && po.isApproved === false) {
      return { number: 2, text: 'Ditolak' };
    }

    if (!po.isFulfilled && !po.goodsReceipts.length) {
      return { number: 0, text: 'Dikirim' };
    }

    if (!po.isFulfilled && po.goodsReceipts.length) {
      return { number: 1, text: 'Sebagian' };
    }

    if (po.isFulfilled) {
      return { number: 2, text: 'Lengkap' };
    }

    throw ERR_PURCHASE_ORDER_MALFORMED(po.id);
  }

  // eslint-disable-next-line class-methods-use-this
  private purchaseOrderDescription(pop: PurchaseOrderProduct[] | TransferRequestProduct[]): string {
    if (!pop.length) return '';

    let text = pop[0].productName || pop[0].subcategoryName;

    if (pop.length > 1) {
      text += ` dan ${pop.length - 1} lainnya`;
    }

    return text;
  }

  private async purchaseOrderMergedLogisticInfo(
    mergedLogistic: boolean,
    logisticInfo?: DeepPartial<LogisticInfo>,
    currentFarmingCycle?: string,
  ): Promise<PurchaseOrderMergedLogisticInfo> {
    if (mergedLogistic && logisticInfo) {
      const farmingCycle = await this.farmingCycleDAO.getOneStrict({
        where: {
          id: currentFarmingCycle,
        },
      });

      const coop = await this.coopDAO.getOne({
        select: {
          id: true,
          coopName: true,
          activeFarmingCycle: {
            farmingCycleStartDate: true,
          },
        },
        where: {
          id:
            farmingCycle.coopId === logisticInfo.coopIdFollower
              ? logisticInfo.coopIdLeader
              : logisticInfo.coopIdFollower,
          activeFarmingCycle: Not(IsNull()),
        },
        relations: {
          activeFarmingCycle: true,
        },
      });

      const mergedLogisticFarmingCycleDays = coop?.activeFarmingCycle?.farmingCycleStartDate
        ? differenceInCalendarDays(new Date(), coop?.activeFarmingCycle?.farmingCycleStartDate)
        : 0;

      return {
        mergedLogisticCoopName: coop?.coopName || '-',
        mergedLogisticFarmingCycleDays,
      };
    }

    return {
      mergedLogisticCoopName: null,
      mergedLogisticFarmingCycleDays: null,
    };
  }
}
