import { Inject, Service } from 'fastify-decorators';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import {
  ApproveRejectTransferRequestParams,
  ApproveRejectTransferRequestResponseItem,
  ApproveTransferRequestBody,
  CancelTransferRequestBody,
  CancelTransferRequestParams,
  CreateTransferRequestBody,
  CreateTransferRequestResponseItem,
  GetTransferRequestDetailParams,
  GetTransferRequestDetailResponseItem,
  GetTransferRequestList,
  GetTransferRequestQuery,
  GetTransferRequestTargetParams,
  GetTransferRequestTargetQuery,
  GetTransferRequestTargetResponseList,
  RejectTransferRequestBody,
  UpdateTransferRequestBody,
  UpdateTransferRequestResponseItem,
} from '../dto/transferRequest.dto';
import { TransferRequestApprovedQueue } from '../jobs/queues/transfer-request-approved.queue';
import { TransferRequestCreatedQueue } from '../jobs/queues/transfer-request-created.queue';
import { TransferRequestRejectedCancelledQueue } from '../jobs/queues/transfer-request-rejected-cancelled.queue';
import { RequestUser } from '../libs/types/index.d';
import { BranchSapronakStockService } from '../services/farming/branchSapronakStock.service';
import { TransferRequestService } from '../services/farming/transferRequest.service';

@Service()
export class TransferRequestUsecase {
  @Inject(PostgreSQLConnection)
  private database: PostgreSQLConnection;

  @Inject(TransferRequestService)
  private transferRequestService: TransferRequestService;

  @Inject(TransferRequestCreatedQueue)
  private transferRequestCreatedQueue: TransferRequestCreatedQueue;

  @Inject(TransferRequestApprovedQueue)
  private transferRequestApprovedQueue: TransferRequestApprovedQueue;

  @Inject(TransferRequestRejectedCancelledQueue)
  private transferRequestRejectedCancelledQueue: TransferRequestRejectedCancelledQueue;

  @Inject(BranchSapronakStockService)
  private branchSapronakStockService: BranchSapronakStockService;

  async createTransferRequest(
    data: CreateTransferRequestBody,
    user: RequestUser,
  ): Promise<CreateTransferRequestResponseItem> {
    const queryRunner = await this.database.startTransaction();

    try {
      const { transferRequestCreated, transferRequestPhotos, transferRequestProducts, route } =
        await this.transferRequestService.createTransferRequest(data, user, queryRunner);

      if (route === 'BRANCH-TO-COOP') {
        await this.branchSapronakStockService.bookSapronakStocks(
          {
            ...transferRequestCreated,
            transferRequestProducts,
          },
          queryRunner,
        );
      }

      await this.database.commitTransaction(queryRunner);

      await this.transferRequestCreatedQueue.addJob({
        ...transferRequestCreated,
        sourceFarmingCycleId: transferRequestCreated.farmingCycleId || '',
        sourceFarmingCycleCode: transferRequestCreated.farmingCycle?.farmingCycleCode || '',
        targetFarmingCycleId: transferRequestCreated.farmingCycleTargetId || '',
        targetFarmingCycleCode: transferRequestCreated.farmingCycleTarget?.farmingCycleCode || '',
      });

      return {
        ...transferRequestCreated,
        photos: transferRequestPhotos,
        details: transferRequestProducts,
        coopSourceId: transferRequestCreated.coopSourceId || '',
        coopTargetId: transferRequestCreated.coopTargetId || '',
        branchSourceId: transferRequestCreated.branchSourceId || '',
        branchTargetId: transferRequestCreated.branchTargetId || '',
      };
    } catch (error) {
      await this.database.rollbackTransaction(queryRunner);

      throw error;
    }
  }

  async updateTransferRequest(
    id: string,
    data: UpdateTransferRequestBody,
    user: RequestUser,
  ): Promise<UpdateTransferRequestResponseItem> {
    const queryRunner = await this.database.startTransaction();

    try {
      const {
        transferRequestUpdated,
        transferRequestExisting,
        transferRequestPhotos,
        transferRequestProducts,
        route,
      } = await this.transferRequestService.updateTransferRequest(id, data, user, queryRunner);

      if (route === 'BRANCH-TO-COOP') {
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
      }

      await this.database.commitTransaction(queryRunner);

      return {
        ...transferRequestUpdated,
        photos: transferRequestPhotos,
        details: transferRequestProducts,
        coopSourceId: transferRequestUpdated.coopSourceId || '',
        coopTargetId: transferRequestUpdated.coopTargetId || '',
        branchSourceId: transferRequestUpdated.branchSourceId || '',
        branchTargetId: transferRequestUpdated.branchTargetId || '',
      };
    } catch (error) {
      await this.database.rollbackTransaction(queryRunner);

      throw error;
    }
  }

  async approveTransferRequest(
    params: ApproveRejectTransferRequestParams,
    data: ApproveTransferRequestBody,
    user: RequestUser,
  ): Promise<ApproveRejectTransferRequestResponseItem> {
    const queryRunner = await this.database.startTransaction();

    try {
      const { transferRequestApproved } = await this.transferRequestService.approveTransferRequest(
        params,
        data,
        user,
        queryRunner,
      );

      await this.database.commitTransaction(queryRunner);

      await this.transferRequestApprovedQueue.addJob({
        ...transferRequestApproved,
        sourceFarmingCycleId: transferRequestApproved.farmingCycleId || '',
        sourceFarmingCycleCode: transferRequestApproved.farmingCycle?.farmingCycleCode || '',
        targetFarmingCycleId: transferRequestApproved.farmingCycleTargetId || '',
        targetFarmingCycleCode: transferRequestApproved.farmingCycleTarget?.farmingCycleCode || '',
      });

      return {
        id: transferRequestApproved.id,
        isApproved: transferRequestApproved.isApproved,
        remarks: transferRequestApproved.remarks,
        approvedBy: transferRequestApproved.approvedBy,
      };
    } catch (error) {
      await this.database.rollbackTransaction(queryRunner);

      throw error;
    }
  }

  async rejectTransferRequest(
    params: ApproveRejectTransferRequestParams,
    data: RejectTransferRequestBody,
    user: RequestUser,
  ): Promise<ApproveRejectTransferRequestResponseItem> {
    const queryRunner = await this.database.startTransaction();

    try {
      const { transferRequestRejected } = await this.transferRequestService.rejectTransferRequest(
        params,
        data,
        user,
        queryRunner,
      );

      await this.database.commitTransaction(queryRunner);

      await this.transferRequestRejectedCancelledQueue.addJob({
        transferRequestId: transferRequestRejected.id,
        isApproved: transferRequestRejected.isApproved,
      });

      return {
        id: transferRequestRejected.id,
        isApproved: transferRequestRejected.isApproved,
        remarks: transferRequestRejected.remarks,
        approvedBy: transferRequestRejected.approvedBy,
      };
    } catch (error) {
      await this.database.rollbackTransaction(queryRunner);

      throw error;
    }
  }

  async cancelTransferRequest(
    params: CancelTransferRequestParams,
    data: CancelTransferRequestBody,
    user: RequestUser,
  ) {
    const queryRunner = await this.database.startTransaction();

    try {
      const tr = await this.transferRequestService.cancelTransferRequest(
        params,
        data,
        user,
        queryRunner,
      );
      // TODO: uncomment the line below once Odoo is ready for additional api development
      // await this.erpDAO.cancelTransferRequest(tr);

      await this.transferRequestRejectedCancelledQueue.addJob({
        transferRequestId: tr.id,
        isApproved: tr.isApproved,
      });

      await this.database.commitTransaction(queryRunner);
    } catch (error) {
      await this.database.rollbackTransaction(queryRunner);

      throw error;
    }
  }

  async getEnteringTransferRequests(
    params: GetTransferRequestQuery,
    user: RequestUser,
  ): Promise<GetTransferRequestList> {
    const enteringTransferRequestList =
      await this.transferRequestService.getEnteringTransferRequests(params, user);

    return enteringTransferRequestList;
  }

  async getExitingTransferRequests(
    params: GetTransferRequestQuery,
    user: RequestUser,
  ): Promise<GetTransferRequestList> {
    const exitingTransferRequestList = await this.transferRequestService.getExitingTransferRequests(
      params,
      user,
    );

    return exitingTransferRequestList;
  }

  async getTransferRequestTargetCoops(
    query: GetTransferRequestTargetQuery,
    params: GetTransferRequestTargetParams,
  ): Promise<GetTransferRequestTargetResponseList> {
    const transferRequestTargetCoops =
      await this.transferRequestService.getTransferRequestTargetCoops(query, params);

    return transferRequestTargetCoops;
  }

  async getTransferRequestDetail(
    params: GetTransferRequestDetailParams,
    user: RequestUser,
  ): Promise<GetTransferRequestDetailResponseItem> {
    const transferRequestDetail = await this.transferRequestService.getTransferRequestDetail(
      params,
      user,
    );

    return transferRequestDetail;
  }
}
