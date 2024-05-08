import { addDays, differenceInCalendarDays, format, isBefore } from 'date-fns';
import { formatInTimeZone, utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';
import { Inject, Service } from 'fastify-decorators';
import { In, IsNull, Not, Raw } from 'typeorm';
import { ChickInRequestDAO } from '../dao/chickInRequest.dao';
import { CoopDAO } from '../dao/coop.dao';
import { FarmingCycleDAO } from '../dao/farmingCycle.dao';
import { LogisticInfoDAO } from '../dao/logisticInfo.dao';
import { PurchaseRequestDAO } from '../dao/purchaseRequest.dao';
import { PurchaseRequestProductDAO } from '../dao/purchaseRequestProduct.dao';
import { ChickInRequest } from '../datasources/entity/pgsql/ChickInRequest.entity';
import {
  PurchaseRequest,
  PurchaseRequestTypeEnum,
} from '../datasources/entity/pgsql/PurchaseRequest.entity';
import {
  ApproveChickInRequestBody,
  ApproveChickInRequestResponseItem,
  ChickInRequestProductResponseItem,
  ChickInRequestProductResponseList,
  GetChickInRequestDetailResponseItem,
  RejectChickInRequestBody,
  RejectChickInRequestResponseItem,
  UpdateChickInRequestBody,
  UpdateChickInRequestParams,
  UpdateChickInRequestResponseItem,
  upsertChickInRequestBody,
  upsertChickInRequestResponseItem,
} from '../dto/chickInRequest.dto';
import { GetTransferRequestDetailResponseItem } from '../dto/transferRequest.dto';
import { ChickInRequestApprovedQueue } from '../jobs/queues/chick-in-request-approved.queue';
import { ChickInRequestUpdatedQueue } from '../jobs/queues/chick-in-request-updated.queue';
import { PurchaseRequestApprovedQueue } from '../jobs/queues/purchase-request-approved.queue';
import {
  DATETIME_SQL_FORMAT,
  DATE_SQL_FORMAT,
  DEFAULT_TIME_ZONE,
  FC_FARMING_STATUS,
} from '../libs/constants';
import {
  ERR_CHICK_IN_REQ_ALREADY_APPROVED,
  ERR_CHICK_IN_REQ_ALREADY_CANCELED,
  ERR_CHICK_IN_REQ_ALREADY_EXISTS,
  ERR_CHICK_IN_REQ_BLOCKED_BY_PR_OVK,
  ERR_CHICK_IN_REQ_FC_STILL_OPENED,
  ERR_CHICK_IN_REQ_INVALID_DATE,
  ERR_CHICK_IN_REQ_SAPRONAK_REQUIRED,
  ERR_CHICK_IN_REQ_UPDATE_DIFF_FC,
  ERR_CHICK_IN_REQ_WIHTOUT_DOC,
  ERR_CHICK_IN_REQ_WIHTOUT_PR,
  ERR_PURCHASE_REQUEST_NOT_FOUND,
} from '../libs/constants/errors';
import { RequestUser } from '../libs/types/index.d';
import { CoopCacheUtil } from '../libs/utils/coopCache';
import { TransferRequestService } from './farming/transferRequest.service';

interface ChickInRequestProducts {
  doc: ChickInRequestProductResponseItem;
  pakan: ChickInRequestProductResponseList;
  ovk: ChickInRequestProductResponseList;
}

interface ChickInRequestMergedLogisticInfo {
  mergedLogistic: boolean;
  mergedLogisticCoopName: string | null;
  mergedLogisticFarmingCycleDays: number | null;
}

@Service()
export class ChickInRequestService {
  @Inject(ChickInRequestDAO)
  private dao!: ChickInRequestDAO;

  @Inject(FarmingCycleDAO)
  private fcDAO!: FarmingCycleDAO;

  @Inject(PurchaseRequestDAO)
  private purchaseRequestDAO!: PurchaseRequestDAO;

  @Inject(PurchaseRequestProductDAO)
  private purchaseRequestProductDAO!: PurchaseRequestProductDAO;

  @Inject(CoopDAO)
  private coopDAO!: CoopDAO;

  @Inject(PurchaseRequestApprovedQueue)
  private prApprovedQueue!: PurchaseRequestApprovedQueue;

  @Inject(ChickInRequestApprovedQueue)
  private cirApprovedQueue!: ChickInRequestApprovedQueue;

  @Inject(ChickInRequestUpdatedQueue)
  private cirUpdatedQueue!: ChickInRequestUpdatedQueue;

  @Inject(CoopCacheUtil)
  private coopCacheUtil!: CoopCacheUtil;

  @Inject(LogisticInfoDAO)
  private logisticInfoDAO!: LogisticInfoDAO;

  async upsertChickIn(
    data: upsertChickInRequestBody,
    user: RequestUser,
  ): Promise<upsertChickInRequestResponseItem> {
    const queryRunner = await this.dao.startTransaction();

    try {
      // chickInDate must be at least 2 days from now
      if (
        isBefore(
          zonedTimeToUtc(new Date(data.chickInDate), DEFAULT_TIME_ZONE),
          addDays(new Date(), 1),
        )
      ) {
        throw ERR_CHICK_IN_REQ_INVALID_DATE();
      }

      const existingRequest = await this.dao.getOne({
        where: {
          coopId: data.coopId,
          isApproved: Raw((alias) => `(${alias} is null or ${alias} = true)`),
          farmingCycle: {
            farmingStatus: Not(FC_FARMING_STATUS.CLOSED),
          },
        },
        order: {
          createdDate: 'DESC',
        },
        relations: {
          farmingCycle: true,
        },
      });

      if (existingRequest?.isApproved === null) {
        throw ERR_CHICK_IN_REQ_ALREADY_EXISTS();
      }

      const coop = await this.coopDAO.getOneStrict({
        where: {
          id: data.coopId,
        },
        relations: {
          farm: true,
          purchaseRequestSapronak: true,
        },
        relationLoadStrategy: 'join',
      });

      if (!coop.purchaseRequestSapronak) {
        throw ERR_CHICK_IN_REQ_SAPRONAK_REQUIRED();
      }

      if (coop.activeFarmingCycleId) {
        throw ERR_CHICK_IN_REQ_FC_STILL_OPENED();
      }

      let chickInReqToProcess: ChickInRequest | undefined;

      if (!existingRequest) {
        chickInReqToProcess = await this.dao.createOneWithTx(
          {
            coopId: coop.id,
            farmId: coop.farm.id,
            userOwnerId: coop.farm.userOwnerId,
            farmingCycleId: coop.purchaseRequestSapronak.farmingCycleId,
            chickInDate: data.chickInDate,
            initialPopulation: data.initialPopulation,
            notes: data.notes,
          },
          user,
          queryRunner,
        );
      } else {
        if (existingRequest.farmingCycleId !== coop.purchaseRequestSapronak.farmingCycleId) {
          throw ERR_CHICK_IN_REQ_UPDATE_DIFF_FC();
        }

        chickInReqToProcess = await this.dao.updateOneWithTx(
          {
            id: existingRequest.id,
          },
          {
            isApproved: null,
            approvedBy: null,
            chickInDate: data.chickInDate,
            initialPopulation: data.initialPopulation,
            notes: data.notes,
          },
          user,
          queryRunner,
        );

        const purchaseRequestToBeDeleted = await this.purchaseRequestDAO.getOneStrict({
          where: {
            chickInRequestId: existingRequest.id,
          },
          select: {
            id: true,
          },
        });

        await this.purchaseRequestProductDAO.deleteManyWithTx(
          {
            purchaseRequestId: purchaseRequestToBeDeleted.id,
          },
          queryRunner,
        );

        await this.purchaseRequestDAO.deleteOneWithTx(
          {
            id: purchaseRequestToBeDeleted.id,
          },
          queryRunner,
        );
      }

      const purchaseReq = await this.purchaseRequestDAO.createOneWithTx(
        {
          type: PurchaseRequestTypeEnum.doc,
          farmingCycleId: coop.purchaseRequestSapronak.farmingCycleId,
          chickInRequestId: chickInReqToProcess.id,
          requestSchedule: data.chickInDate,
        },
        user,
        queryRunner,
      );

      await this.purchaseRequestProductDAO.createManyWithTx(
        [
          {
            ...data.doc,
            purchaseRequestId: purchaseReq.id,
            uom: data.doc.purchaseUom,
          },
        ],
        user,
        queryRunner,
      );

      await this.coopDAO.updateOneWithTx(
        {
          id: data.coopId,
        },
        {
          chickInRequestId: chickInReqToProcess.id,
        },
        user,
        queryRunner,
      );

      await this.coopCacheUtil.invalidateCoopCache(data.coopId, 'idle');

      await this.dao.commitTransaction(queryRunner);

      return {
        id: chickInReqToProcess.id,
        chickInDate: chickInReqToProcess.chickInDate,
        initialPopulation: chickInReqToProcess.initialPopulation,
        coopId: chickInReqToProcess.coopId,
        farmId: chickInReqToProcess.farmId,
        farmingCycleId: chickInReqToProcess.farmingCycleId,
        userOwnerId: chickInReqToProcess.userOwnerId,
        doc: data.doc,
        notes: chickInReqToProcess.notes,
      };
    } catch (error) {
      await this.dao.rollbackTransaction(queryRunner);

      throw error;
    }
  }

  async getChickInRequestDetail(id: string): Promise<GetChickInRequestDetailResponseItem> {
    const chickIn = await this.dao.getOneStrict({
      where: {
        id,
      },
      select: {
        id: true,
        chickInDate: true,
        initialPopulation: true,
        coopId: true,
        notes: true,
      },
      relations: {
        purchaseRequests: {
          products: true,
          internalOvkTransferRequest: {
            photos: true,
            transferRequestProducts: true,
            branchSource: true,
            branchTarget: true,
          },
        },
      },
      relationLoadStrategy: 'join',
    });

    const coop = await this.coopDAO.getOneStrict({
      where: {
        id: chickIn.coopId,
      },
      relations: {
        purchaseRequestOvk: {
          products: true,
        },
      },
    });

    if (!chickIn.purchaseRequests.length) {
      throw ERR_PURCHASE_REQUEST_NOT_FOUND();
    }

    let mappedProduct: ChickInRequestProducts = {
      doc: {} as ChickInRequestProductResponseItem,
      pakan: [],
      ovk: [],
    };

    mappedProduct = chickIn.purchaseRequests
      .flatMap((pr) => pr.products)
      .reduce((p, c) => {
        if (/^doc/gi.test(c.categoryCode)) {
          Reflect.set(p, 'doc', {
            ...c,
            purchaseUom: c.uom,
          });

          return p;
        }

        if (/^pakan/gi.test(c.categoryCode)) {
          Reflect.set(p, 'pakan', [
            ...(p.pakan || []),
            {
              ...c,
              purchaseUom: c.uom,
            },
          ]);
        }

        if (/^ovk/gi.test(c.categoryCode)) {
          Reflect.set(p, 'ovk', [
            ...(p.ovk || []),
            {
              ...c,
              purchaseUom: c.uom,
            },
          ]);

          return p;
        }

        return p;
      }, mappedProduct);

    if (!mappedProduct.doc) {
      throw ERR_CHICK_IN_REQ_WIHTOUT_DOC();
    }

    const previousOvk = coop.purchaseRequestOvk
      ? coop.purchaseRequestOvk.products.map<ChickInRequestProductResponseItem>((prp) => ({
          ...prp,
          purchaseUom: prp.uom,
        }))
      : [];

    const purchaseReqPakan: Partial<PurchaseRequest> = chickIn.purchaseRequests.find(
      (pr) => pr.type === PurchaseRequestTypeEnum.pakan,
    ) as Partial<PurchaseRequest>;

    const logisticInfo: ChickInRequestMergedLogisticInfo | undefined = purchaseReqPakan
      ? await this.chickInRequestMergedLogisticInfo(purchaseReqPakan)
      : undefined;

    let internalOvkTransferRequest: GetTransferRequestDetailResponseItem | undefined;

    chickIn.purchaseRequests.forEach((pr) => {
      if (pr.internalOvkTransferRequestId && pr.internalOvkTransferRequest) {
        internalOvkTransferRequest = {
          id: pr.internalOvkTransferRequest.id,
          erpCode: pr.internalOvkTransferRequest.erpCode,
          description: TransferRequestService.transferRequestDescription(
            pr.internalOvkTransferRequest.transferRequestProducts,
          ),
          deliveryDate: pr.internalOvkTransferRequest.datePlanned,
          farmingCycleSourceId: pr.internalOvkTransferRequest.farmingCycleId,
          farmingCycleTargetId: pr.internalOvkTransferRequest.farmingCycleTargetId || '',
          coopSourceId: pr.internalOvkTransferRequest.coopSourceId || '',
          coopTargetId: pr.internalOvkTransferRequest.coopTargetId || '',
          coopSourceName: pr.internalOvkTransferRequest.coopSource?.coopName || '',
          coopTargetName: pr.internalOvkTransferRequest.coopTarget?.coopName || '',
          branchSourceName: pr.internalOvkTransferRequest.branchSource?.name || '',
          branchTargetName: pr.internalOvkTransferRequest.branchTarget?.name || '',
          subcategoryCode: pr.internalOvkTransferRequest.subcategoryCode,
          subcategoryName: pr.internalOvkTransferRequest.subcategoryName,
          quantity: pr.internalOvkTransferRequest.quantity,
          type: pr.internalOvkTransferRequest.type,
          status: TransferRequestService.transferRequestStatus(pr.internalOvkTransferRequest)
            .number,
          statusText: TransferRequestService.transferRequestStatus(pr.internalOvkTransferRequest)
            .text,
          notes: pr.internalOvkTransferRequest.notes,
          route: pr.internalOvkTransferRequest.route,
          photos: pr.internalOvkTransferRequest.photos,
          productName: pr.internalOvkTransferRequest.productName,
          logisticOption: pr.internalOvkTransferRequest.logisticOption,
          details: pr.internalOvkTransferRequest.transferRequestProducts.map((trp) => ({
            ...trp,
            remaining: trp.quantity,
          })),
          goodsReceipts: [],
        };
      }
    });

    return {
      id: chickIn.id,
      chickInDate: chickIn.chickInDate,
      initialPopulation: chickIn.initialPopulation,
      coopId: chickIn.coopId,
      previousOvk,
      notes: chickIn.notes,
      internalOvkTransferRequest,
      ...mappedProduct,
      ...logisticInfo,
    };
  }

  async approveChickIn(
    id: string,
    body: ApproveChickInRequestBody,
    user: RequestUser,
  ): Promise<ApproveChickInRequestResponseItem> {
    const queryRunner = await this.dao.startTransaction();

    try {
      const chickIn = await this.dao.getOneStrict({
        where: {
          id,
        },
        select: {
          id: true,
          chickInDate: true,
          isApproved: true,
          approvedBy: true,
        },
        relations: {
          coop: {
            purchaseRequestOvk: true,
          },
          farmingCycle: true,
        },
      });

      const { farmingCycle } = chickIn;

      if (chickIn.isApproved) {
        throw ERR_CHICK_IN_REQ_ALREADY_APPROVED();
      }

      if (chickIn.approvedBy && !chickIn.isApproved) {
        throw ERR_CHICK_IN_REQ_ALREADY_CANCELED();
      }

      if (chickIn.coop.purchaseRequestOvk && !chickIn.coop.purchaseRequestOvk.isApproved) {
        throw ERR_CHICK_IN_REQ_BLOCKED_BY_PR_OVK();
      }

      // if changed from initially requested
      // chickInDate must be at least 2 days from now
      if (
        body.chickInDate &&
        body.chickInDate !== chickIn.chickInDate &&
        isBefore(
          zonedTimeToUtc(new Date(body.chickInDate), DEFAULT_TIME_ZONE),
          addDays(new Date(), 1),
        )
      ) {
        throw ERR_CHICK_IN_REQ_INVALID_DATE();
      }

      const approvedDate = body.chickInDate
        ? formatInTimeZone(body.chickInDate, DEFAULT_TIME_ZONE, DATETIME_SQL_FORMAT)
        : chickIn.chickInDate;

      const approvedChickIn = await this.dao.updateOneWithTx(
        {
          id,
        },
        {
          isApproved: true,
          approvedBy: user.id,
          approvedDate,
        },
        user,
        queryRunner,
      );

      const approvedPR = await this.purchaseRequestDAO.updateOneWithTx(
        {
          chickInRequestId: approvedChickIn.id,
        },
        {
          requestSchedule: approvedChickIn.approvedDate,
          isApproved: true,
          approvedBy: user.id,
        },
        user,
        queryRunner,
      );

      await this.dao.commitTransaction(queryRunner);

      await this.prApprovedQueue.addJob({
        ...approvedPR,
        farmingCycleCode: farmingCycle.farmingCycleCode,
      });

      await this.cirApprovedQueue.addJob({
        ...approvedChickIn,
        farmingCycleCode: farmingCycle.farmingCycleCode,
      });

      return approvedChickIn;
    } catch (error) {
      await this.dao.rollbackTransaction(queryRunner);

      throw error;
    }
  }

  async rejectChickIn(
    id: string,
    body: RejectChickInRequestBody,
    user: RequestUser,
  ): Promise<RejectChickInRequestResponseItem> {
    const queryRunner = await this.dao.startTransaction();

    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    try {
      const chickIn = await this.dao.getOneStrict({ where: { id } });

      if (chickIn.approvedBy && chickIn.isApproved) {
        throw ERR_CHICK_IN_REQ_ALREADY_APPROVED();
      }

      const rejectedChickIn = await this.dao.updateOneWithTx(
        {
          id,
        },
        {
          isApproved: false,
          approvedBy: user.id,
          approvedDate: format(now, DATE_SQL_FORMAT),
          remarks: body.remarks,
        },
        user,
        queryRunner,
      );

      const updatedCoop = await this.coopDAO.updateOneWithTx(
        {
          chickInRequestId: id,
        },
        {
          chickInRequestId: null,
          activeFarmingCycleId: null,
        },
        user,
        queryRunner,
      );

      await this.fcDAO.deleteOneWithTx({ id: rejectedChickIn.farmingCycleId }, queryRunner);

      await this.coopCacheUtil.invalidateCoopCache(updatedCoop.id, 'idle');

      await this.dao.commitTransaction(queryRunner);

      await this.cirApprovedQueue.addJob({
        ...rejectedChickIn,
        farmingCycleCode: rejectedChickIn.farmingCycle.farmingCycleCode,
      });

      return rejectedChickIn;
    } catch (error) {
      await this.dao.rollbackTransaction(queryRunner);

      throw error;
    }
  }

  async updateChickInRequest(
    params: UpdateChickInRequestParams,
    data: UpdateChickInRequestBody,
    user: RequestUser,
  ): Promise<UpdateChickInRequestResponseItem> {
    const queryRunner = await this.dao.startTransaction();

    try {
      const chickInRequest = await this.dao.getOneStrict({
        where: {
          id: params.chickInReqId,
        },
        relations: {
          purchaseRequests: true,
        },
      });

      if (chickInRequest.isApproved) {
        throw ERR_CHICK_IN_REQ_ALREADY_APPROVED();
      }

      if (chickInRequest.approvedBy && !chickInRequest.isApproved) {
        throw ERR_CHICK_IN_REQ_ALREADY_CANCELED();
      }

      if (!chickInRequest.purchaseRequests.length) {
        throw ERR_CHICK_IN_REQ_WIHTOUT_PR();
      }

      // chickInDate must be at least 2 days from now
      if (
        isBefore(
          zonedTimeToUtc(new Date(data.chickInDate), DEFAULT_TIME_ZONE),
          addDays(new Date(), 1),
        )
      ) {
        throw ERR_CHICK_IN_REQ_INVALID_DATE();
      }

      const coop = await this.coopDAO.getOneStrict({
        where: {
          id: data.coopId,
        },
        relations: {
          farm: true,
          purchaseRequestSapronak: true,
        },
        relationLoadStrategy: 'join',
      });

      if (!coop.purchaseRequestSapronak) {
        throw ERR_CHICK_IN_REQ_SAPRONAK_REQUIRED();
      }

      if (coop.activeFarmingCycleId) {
        throw ERR_CHICK_IN_REQ_FC_STILL_OPENED();
      }

      const oldPurchaseRequestIds = chickInRequest.purchaseRequests.map((pr) => pr.id);

      await this.purchaseRequestProductDAO.deleteManyWithTx(
        {
          purchaseRequestId: In(oldPurchaseRequestIds),
        },
        queryRunner,
      );

      await this.purchaseRequestDAO.deleteManyWithTx(
        {
          id: In(oldPurchaseRequestIds),
        },
        queryRunner,
      );

      const updated = await this.dao.updateOneWithTx(
        {
          id: params.chickInReqId,
          isApproved: IsNull(),
        },
        {
          chickInDate: data.chickInDate,
          initialPopulation: data.doc.quantity,
          notes: data.notes,
        },
        user,
        queryRunner,
      );

      const newPurchaseRequest = await this.purchaseRequestDAO.createOneWithTx(
        {
          type: PurchaseRequestTypeEnum.doc,
          farmingCycleId: chickInRequest.farmingCycleId,
          chickInRequestId: chickInRequest.id,
          requestSchedule: data.chickInDate,
        },
        user,
        queryRunner,
      );

      await this.purchaseRequestProductDAO.createManyWithTx(
        [
          {
            ...data.doc,
            purchaseRequestId: newPurchaseRequest.id,
            uom: data.doc.purchaseUom,
          },
        ],
        user,
        queryRunner,
      );

      await this.dao.commitTransaction(queryRunner);

      await this.cirUpdatedQueue.addJob(updated);

      return {
        id: params.chickInReqId,
        chickInDate: updated.chickInDate,
        initialPopulation: updated.initialPopulation,
        coopId: updated.coopId,
        farmId: updated.farmId,
        farmingCycleId: updated.farmingCycleId,
        userOwnerId: updated.userOwnerId,
        notes: updated.notes,
        doc: data.doc,
      };
    } catch (error) {
      await this.dao.rollbackTransaction(queryRunner);

      throw error;
    }
  }

  private async chickInRequestMergedLogisticInfo(
    data: Partial<PurchaseRequest>,
  ): Promise<ChickInRequestMergedLogisticInfo> {
    if (data.mergedLogistic && data.logisticInfoId) {
      const [logisticInfo, farmingCycle] = await Promise.all([
        this.logisticInfoDAO.getOneStrict({
          where: {
            id: data.logisticInfoId,
          },
        }),
        this.fcDAO.getOneStrict({
          where: {
            id: data.farmingCycleId,
          },
        }),
      ]);

      const coopPartner = await this.coopDAO.getOneStrict({
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
        },
        relations: {
          activeFarmingCycle: true,
        },
      });

      const farmingCycleDaysCount = coopPartner?.activeFarmingCycle?.farmingCycleStartDate
        ? differenceInCalendarDays(
            new Date(),
            coopPartner?.activeFarmingCycle?.farmingCycleStartDate,
          )
        : 0;

      return {
        mergedLogistic: data.mergedLogistic,
        mergedLogisticCoopName: coopPartner?.coopName,
        mergedLogisticFarmingCycleDays: farmingCycleDaysCount,
      };
    }

    return {
      mergedLogistic: false,
      mergedLogisticCoopName: null,
      mergedLogisticFarmingCycleDays: null,
    };
  }
}
