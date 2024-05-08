import { differenceInCalendarDays, isAfter, isBefore } from 'date-fns';
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';
import { Inject, Service } from 'fastify-decorators';
import { Between, DeepPartial, IsNull, Not, QueryRunner } from 'typeorm';
import { ChickInRequestDAO } from '../../dao/chickInRequest.dao';
import { CoopDAO } from '../../dao/coop.dao';
import { FarmingCycleDAO } from '../../dao/farmingCycle.dao';
import { LogisticInfoDAO } from '../../dao/logisticInfo.dao';
import { PurchaseRequestDAO } from '../../dao/purchaseRequest.dao';
import { PurchaseRequestProductDAO } from '../../dao/purchaseRequestProduct.dao';
import { AutoNumbering } from '../../datasources/entity/pgsql/AutoNumbering.entity';
import { ChickInRequest } from '../../datasources/entity/pgsql/ChickInRequest.entity';
import { FarmingCycle } from '../../datasources/entity/pgsql/FarmingCycle.entity';
import { LogisticInfo } from '../../datasources/entity/pgsql/LogisticInfo.entity';
import { PurchaseRequest } from '../../datasources/entity/pgsql/PurchaseRequest.entity';
import { PurchaseRequestProduct } from '../../datasources/entity/pgsql/PurchaseRequestProduct.entity';
import { TransferRequestProduct } from '../../datasources/entity/pgsql/TransferRequestProduct.entity';
import {
  ApprovePurchaseRequestBody,
  ApproveRejectPurchaseRequestParams,
  CreatePurchaseRequestBody,
  CreatePurchaseRequestSapronakBody,
  GetDetailPurchaseRequestParams,
  GetListPurchaseRequestQuery,
  GetListPurchaseRequestResponseItem,
  RejectPurchaseRequestBody,
  UpdatePurchaseRequestBody,
} from '../../dto/purchaseRequest.dto';
import {
  AUTO_NUMBERING_TRX_TYPE,
  DEFAULT_TIME_ZONE,
  FC_CYCLE_STATUS,
  FC_FARMING_STATUS,
} from '../../libs/constants';
import {
  ERR_BAD_REQUEST,
  ERR_PO_PR_FILTER_DATE_INCOMPLETE_DATES,
  ERR_PO_PR_FILTER_DATE_INVALID_DATES,
  ERR_PURCHASE_REQUEST_ALREADY_APPROVED,
  ERR_PURCHASE_REQUEST_ALREADY_CANCELED,
  ERR_PURCHASE_REQUEST_ALREADY_REJECTED,
  ERR_PURCHASE_REQUEST_INVALID_DATE,
  ERR_PURCHASE_REQUEST_MALFORMED,
  ERR_PURCHASE_REQUEST_OVK_CIR_EXIST,
  ERR_PURCHASE_REQUEST_OVK_INVALID_DATE,
} from '../../libs/constants/errors';
import { Transactional } from '../../libs/decorators/transactional';
import { RequestUser } from '../../libs/types/index.d';
import { generateErpCode } from '../../libs/utils/helpers';
import { mapActivityStatusBasedRoleRank } from '../../libs/utils/mappers';

interface PurchaseRequestStatus {
  number: 0 | 1 | 2;
  text: 'Diajukan' | 'Disetujui' | 'Dibatalkan' | 'Ditolak';
}

interface PurchaseRequestMergedLogisticInfo {
  mergedLogisticCoopName: string | null;
  mergedLogisticFarmingCycleDays: number | null;
}

@Service()
export class PurchaseRequestService {
  @Inject(PurchaseRequestDAO)
  private purchaseRequestDAO!: PurchaseRequestDAO;

  @Inject(PurchaseRequestProductDAO)
  private purchaseRequestProductDAO!: PurchaseRequestProductDAO;

  @Inject(FarmingCycleDAO)
  private farmingCycleDAO!: FarmingCycleDAO;

  @Inject(CoopDAO)
  private coopDAO!: CoopDAO;

  @Inject(ChickInRequestDAO)
  private chickInRequestDAO!: ChickInRequestDAO;

  @Inject(LogisticInfoDAO)
  private logisticInfoDAO!: LogisticInfoDAO;

  @Transactional()
  async createPurchaseRequest(
    data: CreatePurchaseRequestBody,
    user: RequestUser,
    queryRunner: QueryRunner,
  ) {
    if (isBefore(zonedTimeToUtc(new Date(data.requestSchedule), DEFAULT_TIME_ZONE), new Date())) {
      throw ERR_PURCHASE_REQUEST_INVALID_DATE();
    }

    const purchaseRequest = await this.purchaseRequestDAO.createOneWithTx(
      {
        farmingCycleId: data.farmingCycleId,
        requestSchedule: data.requestSchedule,
        type: data.type,
        notes: data.notes,
        mergedLogistic: data.mergedLogistic,
        internalOvkTransferRequestId: data.internalOvkTransferRequest?.id || undefined,
      },
      user,
      queryRunner,
    );

    if (data.mergedLogistic && data.mergedCoopId) {
      await this.addMergedLogisticInfo(queryRunner, data, purchaseRequest, user);
    }

    const purchaseRequestProducts = await this.purchaseRequestProductDAO.createManyWithTx(
      data.details.map<DeepPartial<PurchaseRequestProduct>>((d) => ({
        ...d,
        purchaseRequestId: purchaseRequest.id,
      })),
      user,
      queryRunner,
    );

    return {
      purchaseRequest: {
        ...purchaseRequest,
        details: purchaseRequestProducts,
      },
    };
  }

  @Transactional()
  async createPurchaseRequestSapronak(
    data: CreatePurchaseRequestSapronakBody,
    user: RequestUser,
    queryRunner: QueryRunner,
  ) {
    if (isBefore(zonedTimeToUtc(new Date(data.requestSchedule), DEFAULT_TIME_ZONE), new Date())) {
      throw ERR_PURCHASE_REQUEST_INVALID_DATE();
    }

    let userInitialCreator: RequestUser = user;
    let userModifier: RequestUser | null = null;

    const coop = await this.coopDAO.getOneStrict({
      where: {
        id: data.coopId,
      },
      relations: {
        contract: true,
        purchaseRequestSapronak: true,
      },
    });

    if (coop.activeFarmingCycleId) {
      throw ERR_PURCHASE_REQUEST_OVK_CIR_EXIST();
    }

    const latestChickInRequest = await this.chickInRequestDAO.getOne({
      where: [
        {
          coopId: data.coopId,
          isApproved: true,
        },
        {
          coopId: data.coopId,
          isApproved: IsNull(),
        },
      ],
      order: {
        createdDate: 'DESC',
      },
      relations: {
        farmingCycle: true,
        coop: true,
      },
    });

    let farmingCycle = new FarmingCycle();

    let chickInRequest: ChickInRequest | undefined;

    if (
      !latestChickInRequest ||
      latestChickInRequest.farmingCycle.cycleStatus === FC_CYCLE_STATUS.INACTIVE ||
      latestChickInRequest.farmingCycle.farmingStatus === FC_FARMING_STATUS.CLOSED
    ) {
      if (!coop.purchaseRequestSapronak) {
        farmingCycle = await this.farmingCycleDAO.createOneWithTx(
          {
            coopId: coop.id,
            farmId: coop.farmId,
            initialPopulation: 0,
            contractId: coop.contract.id,
          },
          userInitialCreator,
          queryRunner,
        );

        chickInRequest = new ChickInRequest();
        chickInRequest.farmingCycleId = farmingCycle.id;
      } else {
        farmingCycle.id = coop.purchaseRequestSapronak.farmingCycleId;

        userInitialCreator = {
          id: coop.purchaseRequestSapronak.createdBy,
          role: '',
        };

        userModifier = user;
      }
    } else {
      farmingCycle.id = latestChickInRequest.farmingCycleId;

      userInitialCreator = user;

      userModifier = user;
    }

    const purchaseRequest = await this.purchaseRequestDAO.createOneWithTx(
      {
        farmingCycleId: farmingCycle.id,
        requestSchedule: data.requestSchedule,
        type: data.type,
        internalOvkTransferRequestId: data.internalOvkTransferRequest?.id || undefined,
        ...(userModifier && {
          modifiedBy: userModifier.id,
          modifiedDate: utcToZonedTime(new Date(), DEFAULT_TIME_ZONE),
        }),
        mergedLogistic: data.mergedLogistic,
        notes: `Purchase Request Pre-DOC tipe: ${data.type.toUpperCase()}`,
      },
      userInitialCreator,
      queryRunner,
    );

    if (data.mergedLogistic && data.mergedCoopId) {
      await this.addMergedLogisticInfo(
        queryRunner,
        {
          ...data,
          farmingCycleId: farmingCycle.id,
        },
        purchaseRequest,
        user,
      );
    }

    const purchaseRequestProducts = await this.purchaseRequestProductDAO.createManyWithTx(
      data.details.map<DeepPartial<PurchaseRequestProduct>>((d) => ({
        ...d,
        purchaseRequestId: purchaseRequest.id,
      })),
      userInitialCreator,
      queryRunner,
    );

    await this.coopDAO.updateOneWithTx(
      {
        id: data.coopId,
      },
      {
        purchaseRequestSapronakId: purchaseRequest.id,
      },
      userInitialCreator,
      queryRunner,
    );

    return {
      purchaseRequest: {
        ...purchaseRequest,
        details: purchaseRequestProducts,
      },
      chickInRequest,
    };
  }

  async getPurchaseRequestList(
    params: GetListPurchaseRequestQuery,
    user: RequestUser,
  ): Promise<[GetListPurchaseRequestResponseItem[], number]> {
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

    const [purchaseRequests] = await this.purchaseRequestDAO.getMany({
      where: {
        farmingCycleId: farmingCycle.id,
        type: !params.type ? Not('doc') : params.type,
        purchaseOrders: {
          id: IsNull(),
        },
        ...(params.fromDate &&
          params.untilDate && {
            requestSchedule: Between(params.fromDate, params.untilDate),
          }),
      },
      order: {
        requestSchedule: 'DESC',
      },
      select: {
        id: true,
        erpCode: true,
        type: true,
        requestSchedule: true,
        isApproved: true,
        approvedBy: true,
        notes: true,
        purchaseOrders: {
          id: true,
        },
        internalOvkTransferRequest: {
          id: true,
          transferRequestProducts: true,
        },
        cancellationRequestBy: true,
      },
      relations: {
        products: true,
        purchaseOrders: true,
        internalOvkTransferRequest: {
          transferRequestProducts: true,
        },
      },
      relationLoadStrategy: 'join',
    });

    const data = purchaseRequests.reduce((response, pr): GetListPurchaseRequestResponseItem[] => {
      const status = mapActivityStatusBasedRoleRank(
        user,
        this.purchaseRequestStatus(pr),
        'PURCHASE_REQUEST',
      );

      if (pr.isApproved && pr.internalOvkTransferRequest && !pr.products.length) {
        return response;
      }

      return [
        ...response,
        {
          id: pr.id,
          erpCode: pr.erpCode || '',
          type: pr.type,
          notes: pr.notes,
          deliveryDate: pr.requestSchedule,
          status: status.number,
          statusText: status.text,
          details: pr.products.map((p) => ({ ...p, purchaseUom: p.uom })),
          description: this.purchaseRequestDescription([
            ...pr.products,
            ...(pr.internalOvkTransferRequest?.transferRequestProducts || []),
          ]),
          ...(pr.internalOvkTransferRequest?.id && {
            internalOvkTransferRequestId: pr.internalOvkTransferRequest.id,
          }),
        },
      ];
    }, [] as GetListPurchaseRequestResponseItem[]);

    return [data, data.length];
  }

  async getPurchaseRequestWithLogisticInfo(params: GetDetailPurchaseRequestParams) {
    const purchaseRequest = await this.purchaseRequestDAO.getOneStrict({
      where: {
        id: params.purchaseRequestId,
      },
      select: {
        id: true,
        type: true,
        erpCode: true,
        requestSchedule: true,
        isApproved: true,
        approvedBy: true,
        notes: true,
        farmingCycleId: true,
        mergedLogistic: true,
        logisticInfoId: true,
        logisticInfo: {
          matchingNumber: true,
          coopIdLeader: true,
          coopIdFollower: true,
        },
        purchaseOrders: {
          id: true,
          datePlanned: true,
          goodsReceipts: {
            id: true,
          },
        },
        cancellationRequestBy: true,
      },
      relations: {
        logisticInfo: true,
        products: true,
        purchaseOrders: {
          goodsReceipts: true,
        },
        internalOvkTransferRequest: {
          transferRequestProducts: true,
          photos: true,
          goodsReceipts: true,
          branchSource: true,
          branchTarget: true,
        },
      },
      relationLoadStrategy: 'join',
    });

    const logisticInfo: PurchaseRequestMergedLogisticInfo =
      await this.purchaseRequestMergedLogisticInfo(
        purchaseRequest.mergedLogistic,
        purchaseRequest.logisticInfo,
        purchaseRequest.farmingCycleId,
      );

    return {
      purchaseRequest,
      logisticInfo,
    };
  }

  @Transactional()
  async approvePurchaseRequest(
    params: ApproveRejectPurchaseRequestParams,
    data: ApprovePurchaseRequestBody,
    user: RequestUser,
    queryRunner: QueryRunner,
  ) {
    const purchaseRequest = await this.purchaseRequestDAO.getOneStrict({
      where: {
        id: params.purchaseRequestId,
      },
      relations: {
        farmingCycle: true,
      },
    });

    const { farmingCycle } = purchaseRequest;

    if (purchaseRequest.isApproved) {
      throw ERR_PURCHASE_REQUEST_ALREADY_APPROVED();
    }

    const purchaseRequestApproved = await this.purchaseRequestDAO.updateOneWithTx(
      {
        id: params.purchaseRequestId,
      },
      {
        isApproved: true,
        approvedBy: user.id,
        remarks: data.remarks,
      },
      user,
      queryRunner,
    );

    return { purchaseRequestApproved, farmingCycle };
  }

  @Transactional()
  async rejectPurchaseRequest(
    params: ApproveRejectPurchaseRequestParams,
    data: RejectPurchaseRequestBody,
    user: RequestUser,
    queryRunner: QueryRunner,
  ) {
    const existingPR = await this.purchaseRequestDAO.getOneStrict({
      where: {
        id: params.purchaseRequestId,
      },
    });

    if (existingPR.approvedBy) {
      if (existingPR.isApproved) {
        throw ERR_PURCHASE_REQUEST_ALREADY_APPROVED();
      } else {
        throw ERR_PURCHASE_REQUEST_ALREADY_REJECTED();
      }
    }

    const purchaseRequestRejected = await this.purchaseRequestDAO.updateOneWithTx(
      {
        id: params.purchaseRequestId,
      },
      {
        isApproved: false,
        approvedBy: user.id,
        remarks: data.remarks,
      },
      user,
      queryRunner,
    );

    return { purchaseRequestRejected };
  }

  @Transactional()
  async cancelPurchaseRequest(
    params: ApproveRejectPurchaseRequestParams,
    data: RejectPurchaseRequestBody,
    user: RequestUser,
    queryRunner: QueryRunner,
  ) {
    const existingPurchaseRequest = await this.purchaseRequestDAO.getOneStrict({
      where: {
        id: params.purchaseRequestId,
      },
      relations: {
        internalOvkTransferRequest: {
          transferRequestProducts: true,
        },
      },
    });

    if (existingPurchaseRequest.cancellationRequestBy) {
      throw ERR_PURCHASE_REQUEST_ALREADY_CANCELED();
    }

    if (existingPurchaseRequest.approvedBy) {
      if (existingPurchaseRequest.isApproved) {
        throw ERR_PURCHASE_REQUEST_ALREADY_APPROVED();
      } else {
        throw ERR_PURCHASE_REQUEST_ALREADY_REJECTED();
      }
    }

    const purchaseRequestCancelled = await this.purchaseRequestDAO.updateOneWithTx(
      {
        id: params.purchaseRequestId,
      },
      {
        internalOvkTransferRequestId:
          existingPurchaseRequest.internalOvkTransferRequest?.id || undefined,
        cancellationRequestBy: user.id,
        remarks: data.remarks,
      },
      user,
      queryRunner,
    );

    return {
      purchaseRequestCancelled,
      internalOvkTransferRequest: existingPurchaseRequest.internalOvkTransferRequest,
    };
  }

  @Transactional()
  async updatePurchaseRequestAndInternalTransferRequest(
    params: GetDetailPurchaseRequestParams,
    data: UpdatePurchaseRequestBody,
    user: RequestUser,
    queryRunner: QueryRunner,
  ) {
    const purchaseRequestExisting = await this.purchaseRequestDAO.getOneStrict({
      where: {
        id: params.purchaseRequestId,
      },
      relations: {
        internalOvkTransferRequest: true,
        logisticInfo: true,
      },
    });

    if (purchaseRequestExisting.cancellationRequestBy) {
      throw ERR_PURCHASE_REQUEST_ALREADY_CANCELED();
    }

    if (purchaseRequestExisting.approvedBy) {
      if (purchaseRequestExisting.isApproved) {
        throw ERR_PURCHASE_REQUEST_ALREADY_APPROVED();
      } else {
        throw ERR_PURCHASE_REQUEST_ALREADY_REJECTED();
      }
    }

    if (isBefore(zonedTimeToUtc(new Date(data.requestSchedule), DEFAULT_TIME_ZONE), new Date())) {
      throw ERR_PURCHASE_REQUEST_OVK_INVALID_DATE();
    }

    const purchaseRequestUpdated = await this.purchaseRequestDAO.updateOneWithTx(
      { id: params.purchaseRequestId },
      {
        farmingCycleId: data.farmingCycleId || purchaseRequestExisting.farmingCycleId,
        requestSchedule: data.requestSchedule,
        type: data.type,
        notes: data.notes,
        mergedLogistic: data.mergedLogistic,
        internalOvkTransferRequestId: data.internalOvkTransferRequest?.id || null,
      },
      user,
      queryRunner,
    );

    if (
      purchaseRequestExisting.mergedLogistic !== data.mergedLogistic ||
      (purchaseRequestExisting.mergedLogistic === true && data.mergedLogistic === true)
    ) {
      // Case when PR edited from not include merged logistic to include merged logistic
      // or
      // Case when PR edited from include merged logistic to include merged logistic
      // with diff merged coopId
      if (data.mergedCoopId) {
        const coopIdsInMergedLogistic = [
          purchaseRequestExisting.logisticInfo.coopIdLeader,
          purchaseRequestExisting.logisticInfo.coopIdFollower,
        ];

        if (!coopIdsInMergedLogistic.includes(data.mergedCoopId)) {
          await this.addMergedLogisticInfo(
            queryRunner,
            {
              ...data,
              farmingCycleId: data.farmingCycleId || purchaseRequestExisting.farmingCycleId,
            },
            purchaseRequestUpdated,
            user,
          );
        }
      }

      // Case when PR edited from include merged logistic to not include merged logistic
      if (purchaseRequestExisting.mergedLogistic === true && !data.mergedCoopId) {
        await this.addMergedLogisticInfo(
          queryRunner,
          {
            ...data,
            farmingCycleId: data.farmingCycleId || purchaseRequestExisting.farmingCycleId,
          },
          purchaseRequestUpdated,
          user,
          purchaseRequestExisting.logisticInfoId,
        );
      }
    }

    const purchaseRequestProductUpserted = await this.purchaseRequestProductDAO.upsertManyWithTx(
      (data.details ?? []).map<DeepPartial<PurchaseRequestProduct>>((o) =>
        Object.fromEntries(Object.entries(o).filter(([, value]) => value !== null)),
      ),
      { purchaseRequestId: params.purchaseRequestId },
      user,
      queryRunner,
    );

    return {
      purchaseRequestExisting,
      purchaseRequestUpdated,
      purchaseRequestProductUpserted,
    };
  }

  // eslint-disable-next-line class-methods-use-this
  purchaseRequestDescription(
    products: (PurchaseRequestProduct | TransferRequestProduct)[],
  ): string {
    if (!products.length) return '';

    let text = products[0].productName || products[0].subcategoryName;

    if (products.length > 1) {
      text += ` dan ${products.length - 1} lainnya`;
    }

    return text;
  }

  // eslint-disable-next-line class-methods-use-this
  purchaseRequestStatus(pr: PurchaseRequest): PurchaseRequestStatus {
    if (pr.cancellationRequestBy) {
      return { number: 2, text: 'Dibatalkan' };
    }

    if (!pr.isApproved && !pr.approvedBy) {
      return { number: 0, text: 'Diajukan' };
    }

    if (pr.approvedBy && pr.isApproved) {
      return { number: 1, text: 'Disetujui' };
    }

    if (pr.approvedBy && !pr.isApproved) {
      return { number: 2, text: 'Ditolak' };
    }

    throw ERR_PURCHASE_REQUEST_MALFORMED(pr.id);
  }

  private async addMergedLogisticInfo(
    queryRunner: QueryRunner,
    data: CreatePurchaseRequestBody,
    purchaseReq: DeepPartial<PurchaseRequest>,
    user: RequestUser,
    logisticInfoId?: string,
  ): Promise<DeepPartial<LogisticInfo>> {
    try {
      await queryRunner.startTransaction();

      const farmingCycle = await queryRunner.manager.findOneOrFail(FarmingCycle, {
        where: {
          id: data.farmingCycleId,
        },
      });

      let logisticInfo: Partial<LogisticInfo> | null;
      if (logisticInfoId) {
        logisticInfo = await this.logisticInfoDAO.getOne({
          where: {
            id: logisticInfoId,
          },
        });
      } else {
        logisticInfo = await this.logisticInfoDAO.getOne({
          where: [
            {
              coopIdLeader: data.mergedCoopId,
              coopIdFollower: farmingCycle.coopId,
              purchaseRequestIdLeader: Not(IsNull()),
              purchaseRequestIdFollower: IsNull(),
            },
            {
              coopIdLeader: data.mergedCoopId,
              coopIdFollower: farmingCycle.coopId,
              purchaseRequestIdLeader: '',
              purchaseRequestIdFollower: IsNull(),
            },
          ],
        });
      }

      if (!logisticInfo) {
        const numberingMn = await queryRunner.manager.findOneOrFail(AutoNumbering, {
          where: {
            transactionType: AUTO_NUMBERING_TRX_TYPE.MATCHING_NUMBER,
          },
        });

        const matchingNumber: string = generateErpCode(
          numberingMn.lastNumber,
          numberingMn.digitCount,
          numberingMn.prefix,
        );

        const logisticInfoBodyPayload: Partial<LogisticInfo> = {
          matchingNumber,
          coopIdLeader: farmingCycle.coopId,
          coopIdFollower: data.mergedCoopId,
          purchaseRequestIdLeader: purchaseReq.id,
        };

        const newLogisticInfo = await this.logisticInfoDAO.createOneWithTx(
          logisticInfoBodyPayload,
          user,
          queryRunner,
        );

        await queryRunner.manager.update(PurchaseRequest, purchaseReq.id, {
          notes: 'Pengiriman digabung',
          logisticInfoId: newLogisticInfo.id,
        });

        await queryRunner.manager.update(AutoNumbering, numberingMn.id, {
          lastNumber: () => 'last_number + 1',
        });

        await queryRunner.commitTransaction();

        return newLogisticInfo;
      }

      // Case when edited PR cancel merged logistic
      if (data.mergedLogistic === false && purchaseReq.mergedLogistic === true && purchaseReq.id) {
        await queryRunner.manager.update(PurchaseRequest, purchaseReq.id, {
          notes: 'Pengiriman tidak jadi digabung dengan pengiriman kandang',
          mergedLogistic: false,
          logisticInfoId: '',
        });
      } else {
        await this.logisticInfoDAO.updateOneWithTx(
          { id: logisticInfo.id },
          {
            coopIdFollower: farmingCycle.coopId,
            purchaseRequestIdFollower: purchaseReq.id,
          },
          user,
          queryRunner,
        );

        await queryRunner.manager.update(PurchaseRequest, purchaseReq.id, {
          notes: 'Pengiriman digabung',
          logisticInfoId: logisticInfo.id,
        });
      }

      await queryRunner.commitTransaction();

      return logisticInfo;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw error;
    }
  }

  private async purchaseRequestMergedLogisticInfo(
    mergedLogistic: boolean,
    logisticInfo?: DeepPartial<LogisticInfo>,
    currentFarmingCycle?: string,
  ): Promise<PurchaseRequestMergedLogisticInfo> {
    if (mergedLogistic && logisticInfo) {
      const farmingCycle = await this.farmingCycleDAO.getOneStrict({
        where: {
          id: currentFarmingCycle,
        },
      });

      const coop = await this.coopDAO.getOneStrict({
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

      const farmingCycleDaysCount = coop?.activeFarmingCycle?.farmingCycleStartDate
        ? differenceInCalendarDays(new Date(), coop?.activeFarmingCycle?.farmingCycleStartDate)
        : 0;

      return {
        mergedLogisticCoopName: coop?.coopName,
        mergedLogisticFarmingCycleDays: farmingCycleDaysCount,
      };
    }

    return {
      mergedLogisticCoopName: null,
      mergedLogisticFarmingCycleDays: null,
    };
  }
}
