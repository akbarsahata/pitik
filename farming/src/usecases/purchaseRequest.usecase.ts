import { Inject, Service } from 'fastify-decorators';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { TransferRequest } from '../datasources/entity/pgsql/TransferRequest.entity';
import {
  ApprovePurchaseRequestBody,
  ApproveRejectPurchaseRequestParams,
  ApproveRejectPurchaseRequestResponseItem,
  CreatePurchaseRequestBody,
  CreatePurchaseRequestResponseItem,
  CreatePurchaseRequestSapronakBody,
  GetDetailPurchaseRequestParams,
  GetDetailPurchaseRequestResponseItem,
  GetListPurchaseRequestQuery,
  GetListPurchaseRequestResponseItem,
  RejectPurchaseRequestBody,
  UpdatePurchaseRequestBody,
  UpdatePurchaseRequestResponseItem,
} from '../dto/purchaseRequest.dto';
import {
  CreateTransferRequestResponseItem,
  GetTransferRequestDetailResponseItem,
  UpdateTransferRequestResponseItem,
} from '../dto/transferRequest.dto';
import { FarmingCycleCreatedQueue } from '../jobs/queues/farming-cycle-created.queue';
import { PurchaseRequestApprovedQueue } from '../jobs/queues/purchase-request-approved.queue';
import { PurchaseRequestCreatedQueue } from '../jobs/queues/purchase-request-created.queue';
import { PurchaseRequestRejectedQueue } from '../jobs/queues/purchase-request-rejected.queue';
import { TransferRequestApprovedQueue } from '../jobs/queues/transfer-request-approved.queue';
import { RequestUser } from '../libs/types/index.d';
import { CoopCacheUtil } from '../libs/utils/coopCache';
import { BranchSapronakStockService } from '../services/farming/branchSapronakStock.service';
import { PurchaseRequestService } from '../services/farming/purchaseRequest.service';
import { TransferRequestService } from '../services/farming/transferRequest.service';

@Service()
export class PurchaseRequestUsecase {
  @Inject(PostgreSQLConnection)
  private database: PostgreSQLConnection;

  @Inject(PurchaseRequestService)
  private purchaseRequestService: PurchaseRequestService;

  @Inject(TransferRequestService)
  private transferRequestService: TransferRequestService;

  @Inject(BranchSapronakStockService)
  private branchSapronakStockService: BranchSapronakStockService;

  @Inject(PurchaseRequestCreatedQueue)
  private purchaseRequestCreatedQueue: PurchaseRequestCreatedQueue;

  @Inject(PurchaseRequestApprovedQueue)
  private purchaseRequestApprovedQueue: PurchaseRequestApprovedQueue;

  @Inject(PurchaseRequestRejectedQueue)
  private purchaseRequestRejectedQueue: PurchaseRequestRejectedQueue;

  @Inject(FarmingCycleCreatedQueue)
  private farmingCycleCreatedQueue: FarmingCycleCreatedQueue;

  @Inject(TransferRequestApprovedQueue)
  private transferRequestApprovedQueue: TransferRequestApprovedQueue;

  @Inject(CoopCacheUtil)
  private coopCacheUtil!: CoopCacheUtil;

  async createPurchaseRequest(
    data: CreatePurchaseRequestBody,
    user: RequestUser,
  ): Promise<CreatePurchaseRequestResponseItem> {
    const queryRunner = await this.database.startTransaction();

    try {
      let internalOvkTransferRequest: CreateTransferRequestResponseItem | undefined;

      if (data.internalOvkTransferRequest && data.type === 'ovk') {
        const { transferRequestCreated, transferRequestPhotos, transferRequestProducts } =
          await this.transferRequestService.createTransferRequest(
            {
              ...data.internalOvkTransferRequest,
              route: 'BRANCH-TO-COOP',
            },
            user,
            queryRunner,
          );

        await this.branchSapronakStockService.bookSapronakStocks(
          {
            ...transferRequestCreated,
            transferRequestProducts,
          },
          queryRunner,
        );

        internalOvkTransferRequest = {
          ...transferRequestCreated,
          photos: transferRequestPhotos,
          details: transferRequestProducts.map((trp) => ({ ...trp, remaining: trp.quantity })),
        };
      }

      const { purchaseRequest } = await this.purchaseRequestService.createPurchaseRequest(
        {
          ...data,
          internalOvkTransferRequest,
        },
        user,
        queryRunner,
      );

      await this.database.commitTransaction(queryRunner);

      await this.purchaseRequestCreatedQueue.addJob({ id: purchaseRequest.id });

      return {
        ...purchaseRequest,
        internalOvkTransferRequest,
      };
    } catch (error) {
      await this.database.rollbackTransaction(queryRunner);

      throw error;
    }
  }

  async createPurchaseRequestAndInternalTransferRequestSapronak(
    data: CreatePurchaseRequestSapronakBody,
    user: RequestUser,
  ): Promise<CreatePurchaseRequestResponseItem> {
    const queryRunner = await this.database.startTransaction();

    try {
      let internalOvkTransferRequest: CreateTransferRequestResponseItem | undefined;

      if (data.internalOvkTransferRequest) {
        if (data.internalOvkTransferRequest.id) {
          const { transferRequesWithProductstDeleted: transferRequestDeleted } =
            await this.transferRequestService.deleteTransferRequest(
              data.internalOvkTransferRequest.id,
              data.internalOvkTransferRequest,
              queryRunner,
            );

          await this.branchSapronakStockService.abortBookedSapronakStocks(
            transferRequestDeleted,
            queryRunner,
          );
        }

        const { transferRequestCreated, transferRequestPhotos, transferRequestProducts } =
          await this.transferRequestService.createTransferRequest(
            {
              ...data.internalOvkTransferRequest,
              route: 'BRANCH-TO-COOP',
            },
            user,
            queryRunner,
          );

        await this.branchSapronakStockService.bookSapronakStocks(
          {
            ...transferRequestCreated,
            transferRequestProducts,
          },
          queryRunner,
        );

        internalOvkTransferRequest = {
          ...transferRequestCreated,
          photos: transferRequestPhotos,
          details: transferRequestProducts.map((trp) => ({ ...trp, remaining: trp.quantity })),
        };
      }

      const { purchaseRequest, chickInRequest } =
        await this.purchaseRequestService.createPurchaseRequestSapronak(
          {
            ...data,
            internalOvkTransferRequest,
          },
          user,
          queryRunner,
        );

      await this.database.commitTransaction(queryRunner);

      await this.coopCacheUtil.invalidateCoopCache(data.coopId, 'idle');

      await this.purchaseRequestCreatedQueue.addJob({ id: purchaseRequest.id });

      if (chickInRequest) {
        await this.farmingCycleCreatedQueue.addJob(chickInRequest);
      }

      return {
        ...purchaseRequest,
        internalOvkTransferRequest,
      };
    } catch (error) {
      await this.database.rollbackTransaction(queryRunner);

      throw error;
    }
  }

  async getPurchaseRequestList(
    params: GetListPurchaseRequestQuery,
    user: RequestUser,
  ): Promise<[GetListPurchaseRequestResponseItem[], number]> {
    const [purchaseRequests, count] = await this.purchaseRequestService.getPurchaseRequestList(
      params,
      user,
    );

    return [purchaseRequests, count];
  }

  async getPurchaseRequestDetail(
    params: GetDetailPurchaseRequestParams,
  ): Promise<GetDetailPurchaseRequestResponseItem> {
    const { purchaseRequest, logisticInfo } =
      await this.purchaseRequestService.getPurchaseRequestWithLogisticInfo(params);

    /* prettier-ignore */
    const internalOvkTransferRequest: GetTransferRequestDetailResponseItem | undefined =
      purchaseRequest.internalOvkTransferRequest
        ? {
          id: purchaseRequest.internalOvkTransferRequest.id,
          erpCode: purchaseRequest.internalOvkTransferRequest.erpCode || '',
          description: TransferRequestService.transferRequestDescription(
            purchaseRequest.internalOvkTransferRequest.transferRequestProducts,
          ),
          deliveryDate: purchaseRequest.internalOvkTransferRequest.datePlanned,
          farmingCycleSourceId: purchaseRequest.internalOvkTransferRequest.farmingCycleId,
          farmingCycleTargetId: purchaseRequest.internalOvkTransferRequest.farmingCycleTargetId || '',
          coopSourceId: purchaseRequest.internalOvkTransferRequest.coopSourceId || '',
          coopTargetId: purchaseRequest.internalOvkTransferRequest.coopTargetId || '',
          coopSourceName: purchaseRequest.internalOvkTransferRequest.coopSource?.coopName || '',
          coopTargetName: purchaseRequest.internalOvkTransferRequest.coopTarget?.coopName || '',
          branchSourceName: purchaseRequest.internalOvkTransferRequest.branchSource?.name || '',
          branchTargetName: purchaseRequest.internalOvkTransferRequest.branchTarget?.name || '',
          subcategoryCode: purchaseRequest.internalOvkTransferRequest.subcategoryCode,
          subcategoryName: purchaseRequest.internalOvkTransferRequest.subcategoryName,
          quantity: purchaseRequest.internalOvkTransferRequest.quantity,
          type: purchaseRequest.internalOvkTransferRequest.type,
          status: TransferRequestService
            .transferRequestStatus(purchaseRequest.internalOvkTransferRequest).number,
          statusText: TransferRequestService
            .transferRequestStatus(purchaseRequest.internalOvkTransferRequest).text,
          notes: purchaseRequest.internalOvkTransferRequest.notes,
          route: purchaseRequest.internalOvkTransferRequest.route,
          photos: purchaseRequest.internalOvkTransferRequest.photos,
          productName: purchaseRequest.internalOvkTransferRequest.productName,
          logisticOption: purchaseRequest.internalOvkTransferRequest.logisticOption,
          details: purchaseRequest.internalOvkTransferRequest.transferRequestProducts.map(
            (trp) => ({ ...trp, remaining: trp.quantity }),
          ),
          goodsReceipts: [],
        }
        : undefined;

    const status = this.purchaseRequestService.purchaseRequestStatus(purchaseRequest);

    return {
      ...purchaseRequest,
      erpCode: purchaseRequest.erpCode || '',
      status: status.number,
      statusText: status.text,
      deliveryDate: purchaseRequest.purchaseOrders.length
        ? purchaseRequest.purchaseOrders[0].datePlanned
        : purchaseRequest.requestSchedule,
      details: purchaseRequest.products.map((p) => ({ ...p, purchaseUom: p.uom })),
      description: this.purchaseRequestService.purchaseRequestDescription([
        ...purchaseRequest.products,
        ...(purchaseRequest.internalOvkTransferRequest?.transferRequestProducts || []),
      ]),
      ...logisticInfo,
      internalOvkTransferRequest,
    };
  }

  async approvePurchaseRequestAndInternalTransferRequest(
    params: ApproveRejectPurchaseRequestParams,
    data: ApprovePurchaseRequestBody,
    user: RequestUser,
  ): Promise<ApproveRejectPurchaseRequestResponseItem> {
    const queryRunner = await this.database.startTransaction();

    let transferRequestApproved: TransferRequest | undefined;

    try {
      const { purchaseRequestApproved, farmingCycle } =
        await this.purchaseRequestService.approvePurchaseRequest(params, data, user, queryRunner);

      if (purchaseRequestApproved.internalOvkTransferRequestId) {
        ({ transferRequestApproved } = await this.transferRequestService.approveTransferRequest(
          {
            transferRequestId: purchaseRequestApproved.internalOvkTransferRequestId,
          },
          {
            remarks: data.remarks,
          },
          user,
          queryRunner,
        ));
      }

      await this.database.commitTransaction(queryRunner);

      await this.purchaseRequestApprovedQueue.addJob({
        ...purchaseRequestApproved,
        farmingCycleCode: farmingCycle.farmingCycleCode,
      });

      if (transferRequestApproved) {
        await this.transferRequestApprovedQueue.addJob({
          ...transferRequestApproved,
          sourceFarmingCycleId: transferRequestApproved.farmingCycleId || '',
          sourceFarmingCycleCode: transferRequestApproved.farmingCycle?.farmingCycleCode || '',
          targetFarmingCycleId: transferRequestApproved.farmingCycleTargetId || '',
          targetFarmingCycleCode:
            transferRequestApproved.farmingCycleTarget?.farmingCycleCode || '',
        });
      }

      return {
        id: purchaseRequestApproved.id,
        isApproved: purchaseRequestApproved.isApproved,
        remarks: purchaseRequestApproved.remarks,
        approvedBy: purchaseRequestApproved.approvedBy,
      };
    } catch (error) {
      await this.database.rollbackTransaction(queryRunner);

      throw error;
    }
  }

  async rejectPurchaseRequest(
    params: ApproveRejectPurchaseRequestParams,
    data: RejectPurchaseRequestBody,
    user: RequestUser,
  ): Promise<ApproveRejectPurchaseRequestResponseItem> {
    const queryRunner = await this.database.startTransaction();

    try {
      const { purchaseRequestRejected } = await this.purchaseRequestService.rejectPurchaseRequest(
        params,
        data,
        user,
        queryRunner,
      );

      await this.database.commitTransaction(queryRunner);

      await this.purchaseRequestRejectedQueue.addJob({ id: purchaseRequestRejected.id });

      return {
        id: purchaseRequestRejected.id,
        isApproved: purchaseRequestRejected.isApproved,
        remarks: purchaseRequestRejected.remarks,
        approvedBy: purchaseRequestRejected.approvedBy,
      };
    } catch (error) {
      await this.database.rollbackTransaction(queryRunner);

      throw error;
    }
  }

  async rejectPurchaseRequestByProcurement(
    params: ApproveRejectPurchaseRequestParams,
    data: RejectPurchaseRequestBody,
    user: RequestUser,
  ): Promise<ApproveRejectPurchaseRequestResponseItem> {
    const queryRunner = await this.database.startTransaction();

    try {
      const { purchaseRequestRejected } = await this.purchaseRequestService.rejectPurchaseRequest(
        params,
        {
          ...data,
          remarks: data.remarks
            ? `(Ditolak oleh Procurement) ${data.remarks}`
            : '(Ditolak oleh Procurement)',
        },
        user,
        queryRunner,
      );

      await this.database.commitTransaction(queryRunner);

      await this.purchaseRequestCreatedQueue.addJob({ id: purchaseRequestRejected.id });

      return {
        id: purchaseRequestRejected.id,
        isApproved: purchaseRequestRejected.isApproved,
        remarks: purchaseRequestRejected.remarks,
        approvedBy: purchaseRequestRejected.approvedBy,
      };
    } catch (error) {
      await this.database.rollbackTransaction(queryRunner);

      throw error;
    }
  }

  async cancelPurchaseRequestAndInternalTransferRequest(
    params: ApproveRejectPurchaseRequestParams,
    data: RejectPurchaseRequestBody,
    user: RequestUser,
  ): Promise<ApproveRejectPurchaseRequestResponseItem> {
    const queryRunner = await this.database.startTransaction();

    try {
      const { purchaseRequestCancelled, internalOvkTransferRequest } =
        await this.purchaseRequestService.cancelPurchaseRequest(params, data, user, queryRunner);

      if (internalOvkTransferRequest) {
        const { route, transferRequesWithProductstDeleted } =
          await this.transferRequestService.deleteTransferRequest(
            internalOvkTransferRequest.id,
            internalOvkTransferRequest,
            queryRunner,
          );

        if (route === 'BRANCH-TO-COOP') {
          await this.branchSapronakStockService.abortBookedSapronakStocks(
            transferRequesWithProductstDeleted,
            queryRunner,
          );
        }
      }

      await this.database.commitTransaction(queryRunner);

      return { ...purchaseRequestCancelled };
    } catch (error) {
      await this.database.rollbackTransaction(queryRunner);

      throw error;
    }
  }

  async updatePurchaseRequestAndInternalTransferRequest(
    params: GetDetailPurchaseRequestParams,
    data: UpdatePurchaseRequestBody,
    user: RequestUser,
  ): Promise<UpdatePurchaseRequestResponseItem> {
    const queryRunner = await this.database.startTransaction();
    try {
      const { purchaseRequest: purchaseRequestExisting } =
        await this.purchaseRequestService.getPurchaseRequestWithLogisticInfo(params);

      let internalOvkTransferRequest: UpdateTransferRequestResponseItem | undefined;

      if (
        (data.internalOvkTransferRequest || purchaseRequestExisting.internalOvkTransferRequest) &&
        data.type === 'ovk'
      ) {
        if (
          purchaseRequestExisting.internalOvkTransferRequest?.id &&
          data.internalOvkTransferRequest?.id
        ) {
          const {
            transferRequestUpdated,
            transferRequestPhotos,
            transferRequestProducts,
            transferRequestExisting,
          } = await this.transferRequestService.updateTransferRequest(
            data.internalOvkTransferRequest.id,
            {
              ...data.internalOvkTransferRequest,
              route: 'BRANCH-TO-COOP',
            },
            user,
            queryRunner,
          );

          await this.branchSapronakStockService.abortBookedSapronakStocks(
            transferRequestExisting,
            queryRunner,
          );

          await this.branchSapronakStockService.bookSapronakStocks(
            {
              ...transferRequestUpdated,
              transferRequestProducts,
            },
            queryRunner,
          );

          internalOvkTransferRequest = {
            ...transferRequestUpdated,
            photos: transferRequestPhotos,
            details: transferRequestProducts.map((trp) => ({
              ...trp,
              remaining: trp.quantity,
            })),
          };
        } else if (
          !purchaseRequestExisting.internalOvkTransferRequest?.id &&
          data.internalOvkTransferRequest &&
          !data.internalOvkTransferRequest.id
        ) {
          const { transferRequestCreated, transferRequestPhotos, transferRequestProducts } =
            await this.transferRequestService.createTransferRequest(
              {
                ...data.internalOvkTransferRequest,
                route: 'BRANCH-TO-COOP',
              },
              user,
              queryRunner,
            );

          await this.branchSapronakStockService.bookSapronakStocks(
            {
              ...transferRequestCreated,
              transferRequestProducts,
            },
            queryRunner,
          );

          internalOvkTransferRequest = {
            ...transferRequestCreated,
            photos: transferRequestPhotos,
            details: transferRequestProducts.map((trp) => ({
              ...trp,
              remaining: trp.quantity,
            })),
          };
        } else if (
          purchaseRequestExisting.internalOvkTransferRequest?.id &&
          !data.internalOvkTransferRequest?.id
        ) {
          const { route, transferRequesWithProductstDeleted } =
            await this.transferRequestService.deleteTransferRequest(
              purchaseRequestExisting.internalOvkTransferRequest.id,
              purchaseRequestExisting.internalOvkTransferRequest,
              queryRunner,
            );

          if (route === 'BRANCH-TO-COOP') {
            await this.branchSapronakStockService.abortBookedSapronakStocks(
              transferRequesWithProductstDeleted,
              queryRunner,
            );
          }
        }
      }

      const { purchaseRequestUpdated, purchaseRequestProductUpserted } =
        await this.purchaseRequestService.updatePurchaseRequestAndInternalTransferRequest(
          params,
          data,
          user,
          queryRunner,
        );

      await this.database.commitTransaction(queryRunner);

      return {
        ...purchaseRequestUpdated,
        details: purchaseRequestProductUpserted,
        internalOvkTransferRequest,
      };
    } catch (error) {
      await this.database.rollbackTransaction(queryRunner);

      throw error;
    }
  }
}
