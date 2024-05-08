import { isBefore } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';
import { Inject, Service } from 'fastify-decorators';
import { DeepPartial, IsNull, Not } from 'typeorm';
import { ChickInRequestDAO } from '../dao/chickInRequest.dao';
import { CoopDAO } from '../dao/coop.dao';
import { FarmingCycleDAO } from '../dao/farmingCycle.dao';
import { PurchaseRequestDAO } from '../dao/purchaseRequest.dao';
import { PurchaseRequestProductDAO } from '../dao/purchaseRequestProduct.dao';
import { ChickInRequest } from '../datasources/entity/pgsql/ChickInRequest.entity';
import { FarmingCycle } from '../datasources/entity/pgsql/FarmingCycle.entity';
import {
  PurchaseRequest,
  PurchaseRequestTypeEnum,
} from '../datasources/entity/pgsql/PurchaseRequest.entity';
import { PurchaseRequestProduct } from '../datasources/entity/pgsql/PurchaseRequestProduct.entity';
import {
  ApprovePurchaseRequestBody,
  ApproveRejectPurchaseRequestParams,
  ApproveRejectPurchaseRequestResponseItem,
  CreatePurchaseRequestBody,
  CreatePurchaseRequestOvkBody,
  CreatePurchaseRequestResponseItem,
  GetDetailPurchaseRequestParams,
  GetListPurchaseRequestQuery,
  GetListPurchaseRequestResponseItem,
  RejectPurchaseRequestBody,
  UpdatePurchaseRequestBody,
  UpdatePurchaseRequestResponseItem,
} from '../dto/purchaseRequest.dto';
import { FarmingCycleCreatedQueue } from '../jobs/queues/farming-cycle-created.queue';
import { PurchaseRequestApprovedQueue } from '../jobs/queues/purchase-request-approved.queue';
import { PurchaseRequestCreatedQueue } from '../jobs/queues/purchase-request-created.queue';
import {
  DEFAULT_TIME_ZONE,
  FARMING_ACTIVITIES,
  FC_CYCLE_STATUS,
  FC_FARMING_STATUS,
} from '../libs/constants';
import {
  ERR_PURCHASE_REQUEST_ALREADY_APPROVED,
  ERR_PURCHASE_REQUEST_ALREADY_CANCELED,
  ERR_PURCHASE_REQUEST_ALREADY_REJECTED,
  ERR_PURCHASE_REQUEST_INVALID_DATE,
  ERR_PURCHASE_REQUEST_MALFORMED,
  ERR_PURCHASE_REQUEST_OVK_CIR_EXIST,
  ERR_PURCHASE_REQUEST_OVK_INVALID_DATE,
} from '../libs/constants/errors';
import { RequestUser } from '../libs/types/index.d';
import { CoopCacheUtil } from '../libs/utils/coopCache';
import { mapActivityStatusBasedRoleRank } from '../libs/utils/mappers';

interface PurchaseRequestStatus {
  number: 0 | 1 | 2 | 3 | 4;
  text: 'Diajukan' | 'Disetujui' | 'Dikirim' | 'Ditolak' | 'Dibatalkan';
}

@Service()
export class PurchaseRequestService {
  @Inject(PurchaseRequestDAO)
  private dao!: PurchaseRequestDAO;

  @Inject(PurchaseRequestProductDAO)
  private prProdDAO!: PurchaseRequestProductDAO;

  @Inject(FarmingCycleDAO)
  private fcDAO!: FarmingCycleDAO;

  @Inject(CoopDAO)
  private coopDAO!: CoopDAO;

  @Inject(ChickInRequestDAO)
  private cirDAO!: ChickInRequestDAO;

  @Inject(PurchaseRequestCreatedQueue)
  private prCreatedQueue: PurchaseRequestCreatedQueue;

  @Inject(PurchaseRequestApprovedQueue)
  private prApprovedQueue!: PurchaseRequestApprovedQueue;

  @Inject(FarmingCycleCreatedQueue)
  private fcCreatedQueue!: FarmingCycleCreatedQueue;

  @Inject(CoopCacheUtil)
  private coopCacheUtil!: CoopCacheUtil;

  async createPurchaseRequest(
    data: CreatePurchaseRequestBody,
    user: RequestUser,
  ): Promise<CreatePurchaseRequestResponseItem> {
    const queryRunner = await this.dao.startTransaction();

    try {
      if (isBefore(zonedTimeToUtc(new Date(data.requestSchedule), DEFAULT_TIME_ZONE), new Date())) {
        throw ERR_PURCHASE_REQUEST_INVALID_DATE();
      }

      const purchaseRequest = await this.dao.createOneWithTx(
        {
          farmingCycleId: data.farmingCycleId,
          requestSchedule: data.requestSchedule,
          type: data.type,
          notes: data.notes,
        },
        user,
        queryRunner,
      );

      const purchaseRequestProducts = await this.prProdDAO.createManyWithTx(
        data.details.map<DeepPartial<PurchaseRequestProduct>>((d) => ({
          ...d,
          purchaseRequestId: purchaseRequest.id,
        })),
        user,
        queryRunner,
      );

      await this.dao.commitTransaction(queryRunner);

      await this.prCreatedQueue.addJob(purchaseRequest);

      return {
        ...purchaseRequest,
        details: purchaseRequestProducts,
      };
    } catch (error) {
      await this.dao.rollbackTransaction(queryRunner);

      throw error;
    }
  }

  async createPurchaseRequestOvk(
    data: CreatePurchaseRequestOvkBody,
    user: RequestUser,
  ): Promise<CreatePurchaseRequestResponseItem> {
    const queryRunner = await this.dao.startTransaction();

    try {
      if (isBefore(zonedTimeToUtc(new Date(data.requestSchedule), DEFAULT_TIME_ZONE), new Date())) {
        throw ERR_PURCHASE_REQUEST_OVK_INVALID_DATE();
      }

      let prInitialCreator: RequestUser = user;
      let prModifier: RequestUser | null = null;

      const coop = await this.coopDAO.getOneStrict({
        where: {
          id: data.coopId,
        },
        relations: {
          purchaseRequestOvk: true,
        },
      });

      if (coop.activeFarmingCycleId) {
        throw ERR_PURCHASE_REQUEST_OVK_CIR_EXIST();
      }

      const latestChickInReq = await this.cirDAO.getOne({
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
        },
      });

      let fc = new FarmingCycle();

      let chickInReq: ChickInRequest | undefined;

      if (!latestChickInReq) {
        if (!coop.purchaseRequestOvk) {
          // new PR OVK
          fc = await this.fcDAO.createOneWithTx(
            {
              coopId: coop.id,
              farmId: coop.farmId,
              initialPopulation: 0,
            },
            prInitialCreator,
            queryRunner,
          );

          chickInReq = new ChickInRequest();
          chickInReq.farmingCycleId = fc.id;
        } else {
          // upsert PR OVK
          fc.id = coop.purchaseRequestOvk.farmingCycleId;

          prInitialCreator = {
            id: coop.purchaseRequestOvk.createdBy,
            role: '',
          };

          prModifier = user;
        }
      } else if (
        latestChickInReq.farmingCycle.cycleStatus === FC_CYCLE_STATUS.INACTIVE ||
        latestChickInReq.farmingCycle.farmingStatus === FC_FARMING_STATUS.CLOSED
      ) {
        fc = await this.fcDAO.createOneWithTx(
          {
            coopId: coop.id,
            farmId: coop.farmId,
            initialPopulation: 0,
          },
          prInitialCreator,
          queryRunner,
        );

        chickInReq = new ChickInRequest();
        chickInReq.farmingCycleId = fc.id;
      } else {
        fc.id = latestChickInReq.farmingCycleId;

        prInitialCreator = user;

        prModifier = user;
      }

      if (coop.purchaseRequestOvkId) {
        await this.prProdDAO.deleteManyWithTx(
          {
            purchaseRequestId: coop.purchaseRequestOvkId,
          },
          queryRunner,
        );

        await this.dao.deleteOneWithTx(
          {
            id: coop.purchaseRequestOvkId,
          },
          queryRunner,
        );
      }

      const purchaseRequest = await this.dao.createOneWithTx(
        {
          farmingCycleId: fc.id,
          requestSchedule: data.requestSchedule,
          type: PurchaseRequestTypeEnum.ovk,
          ...(prModifier && {
            modifiedBy: prModifier.id,
            modifiedDate: new Date(),
          }),
        },
        prInitialCreator,
        queryRunner,
      );

      const purchaseRequestProducts = await this.prProdDAO.createManyWithTx(
        data.details.map<DeepPartial<PurchaseRequestProduct>>((d) => ({
          ...d,
          purchaseRequestId: purchaseRequest.id,
        })),
        prInitialCreator,
        queryRunner,
      );

      await this.coopDAO.updateOneWithTx(
        {
          id: data.coopId,
        },
        {
          purchaseRequestOvkId: purchaseRequest.id,
        },
        prInitialCreator,
        queryRunner,
      );

      await this.coopCacheUtil.invalidateCoopCache(data.coopId, 'idle');

      this.dao.commitTransaction(queryRunner);

      await this.prCreatedQueue.addJob(purchaseRequest);

      if (chickInReq) {
        await this.fcCreatedQueue.addJob(chickInReq);
      }

      return {
        ...purchaseRequest,
        details: purchaseRequestProducts,
      };
    } catch (error) {
      await this.dao.rollbackTransaction(queryRunner);

      throw error;
    }
  }

  async getPurchaseRequestList(
    params: GetListPurchaseRequestQuery,
    user: RequestUser,
  ): Promise<GetListPurchaseRequestResponseItem[]> {
    const [purchaseRequests] = await this.dao.getMany({
      where: {
        farmingCycleId: params.farmingCycleId,
        type: !params.type ? Not('doc') : params.type,
      },
      order: {
        createdDate: 'ASC',
        purchaseOrders: {
          createdDate: 'ASC',
        },
      },
      select: {
        id: true,
        type: true,
        requestSchedule: true,
        isApproved: true,
        approvedBy: true,
        notes: true,
        purchaseOrders: {
          id: true,
          datePlanned: true,
        },
        cancellationRequestBy: true,
      },
      relations: {
        products: true,
        purchaseOrders: true,
      },
      relationLoadStrategy: 'join',
    });

    return purchaseRequests.reduce((response, pr): GetListPurchaseRequestResponseItem[] => {
      const status = mapActivityStatusBasedRoleRank(
        user,
        this.purchaseRequestStatus(pr),
        FARMING_ACTIVITIES.PURCHASE_REQUEST,
      );

      if (!status) return response;

      return [
        ...response,
        {
          id: pr.id,
          type: pr.type,
          notes: pr.notes,
          deliveryDate: pr.purchaseOrders.length
            ? pr.purchaseOrders[0].datePlanned
            : pr.requestSchedule,
          status: status.number,
          statusText: status.text,
          details: pr.products,
        },
      ];
    }, [] as GetListPurchaseRequestResponseItem[]);
  }

  async getPurchaseRequestDetail(
    params: GetDetailPurchaseRequestParams,
    user: RequestUser,
  ): Promise<GetListPurchaseRequestResponseItem> {
    const purchaseRequest = await this.dao.getOneStrict({
      where: {
        id: params.purchaseRequestId,
      },
      select: {
        id: true,
        type: true,
        requestSchedule: true,
        isApproved: true,
        approvedBy: true,
        notes: true,
        purchaseOrders: {
          id: true,
          datePlanned: true,
        },
        cancellationRequestBy: true,
      },
      relations: {
        products: true,
        purchaseOrders: true,
      },
      relationLoadStrategy: 'join',
    });

    const status = mapActivityStatusBasedRoleRank(
      user,
      this.purchaseRequestStatus(purchaseRequest),
      FARMING_ACTIVITIES.PURCHASE_REQUEST,
    );

    return {
      ...purchaseRequest,
      status: status.number,
      statusText: status.text,
      deliveryDate: purchaseRequest.purchaseOrders.length
        ? purchaseRequest.purchaseOrders[0].datePlanned
        : purchaseRequest.requestSchedule,
      details: purchaseRequest.products,
    };
  }

  async approvePurchaseRequest(
    params: ApproveRejectPurchaseRequestParams,
    data: ApprovePurchaseRequestBody,
    user: RequestUser,
  ): Promise<ApproveRejectPurchaseRequestResponseItem> {
    let approvedPR = await this.dao.getOneStrict({
      where: {
        id: params.purchaseRequestId,
      },
    });

    if (approvedPR.isApproved) {
      throw ERR_PURCHASE_REQUEST_ALREADY_APPROVED();
    }

    approvedPR = await this.dao.updateOne(
      {
        id: params.purchaseRequestId,
      },
      {
        isApproved: true,
        approvedBy: user.id,
        remarks: data.remarks,
      },
      user,
    );

    await this.prApprovedQueue.addJob(approvedPR);

    return { ...approvedPR };
  }

  async rejectPurchaseRequest(
    params: ApproveRejectPurchaseRequestParams,
    data: RejectPurchaseRequestBody,
    user: RequestUser,
  ): Promise<ApproveRejectPurchaseRequestResponseItem> {
    const existingPR = await this.dao.getOneStrict({
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

    const approvedPR = await this.dao.updateOne(
      {
        id: params.purchaseRequestId,
      },
      {
        isApproved: false,
        approvedBy: user.id,
        remarks: data.remarks,
      },
      user,
    );

    return { ...approvedPR };
  }

  // eslint-disable-next-line class-methods-use-this
  private purchaseRequestStatus(pr: PurchaseRequest): PurchaseRequestStatus {
    if (pr.cancellationRequestBy) {
      return { number: 4, text: 'Dibatalkan' };
    }

    if (!pr.isApproved && !pr.approvedBy) {
      return { number: 0, text: 'Diajukan' };
    }

    if (pr.isApproved && !pr.purchaseOrders.length) {
      return { number: 1, text: 'Disetujui' };
    }

    if (pr.isApproved && pr.purchaseOrders.length) {
      return { number: 2, text: 'Dikirim' };
    }

    if (!pr.isApproved && pr.approvedBy) {
      return { number: 3, text: 'Ditolak' };
    }

    throw ERR_PURCHASE_REQUEST_MALFORMED(pr.id);
  }

  async updatePurchaseRequest(
    params: GetDetailPurchaseRequestParams,
    data: UpdatePurchaseRequestBody,
    user: RequestUser,
  ): Promise<UpdatePurchaseRequestResponseItem> {
    const existingPR = await this.dao.getOneStrict({
      where: {
        id: params.purchaseRequestId,
      },
    });

    if (existingPR.cancellationRequestBy) {
      throw ERR_PURCHASE_REQUEST_ALREADY_CANCELED();
    }

    if (existingPR.approvedBy) {
      if (existingPR.isApproved) {
        throw ERR_PURCHASE_REQUEST_ALREADY_APPROVED();
      } else {
        throw ERR_PURCHASE_REQUEST_ALREADY_REJECTED();
      }
    }

    if (isBefore(zonedTimeToUtc(new Date(data.requestSchedule), DEFAULT_TIME_ZONE), new Date())) {
      throw ERR_PURCHASE_REQUEST_OVK_INVALID_DATE();
    }

    const queryRunner = await this.dao.startTransaction();

    try {
      const updatedPR = await this.dao.updateOneWithTx(
        { id: params.purchaseRequestId },
        {
          farmingCycleId: data.farmingCycleId,
          requestSchedule: data.requestSchedule,
          type: data.type,
          notes: data.notes,
        },
        user,
        queryRunner,
      );

      const upsertedPRProducts = await this.prProdDAO.upsertManyWithTx(
        (data.details ?? []).map<DeepPartial<PurchaseRequestProduct>>((o) =>
          Object.fromEntries(Object.entries(o).filter(([, value]) => value !== null)),
        ),
        { purchaseRequestId: params.purchaseRequestId },
        user,
        queryRunner,
      );

      await this.dao.commitTransaction(queryRunner);

      return {
        ...updatedPR,
        details: upsertedPRProducts,
      };
    } catch (error) {
      await this.dao.rollbackTransaction(queryRunner);

      throw error;
    }
  }

  async cancelPurchaseRequest(
    params: ApproveRejectPurchaseRequestParams,
    data: RejectPurchaseRequestBody,
    user: RequestUser,
  ): Promise<ApproveRejectPurchaseRequestResponseItem> {
    const existingPR = await this.dao.getOneStrict({
      where: {
        id: params.purchaseRequestId,
      },
    });

    if (existingPR.cancellationRequestBy) {
      throw ERR_PURCHASE_REQUEST_ALREADY_CANCELED();
    }

    if (existingPR.approvedBy) {
      if (existingPR.isApproved) {
        throw ERR_PURCHASE_REQUEST_ALREADY_APPROVED();
      } else {
        throw ERR_PURCHASE_REQUEST_ALREADY_REJECTED();
      }
    }

    try {
      const canceledPR = await this.dao.updateOne(
        {
          id: params.purchaseRequestId,
        },
        {
          cancellationRequestBy: user.id,
          remarks: data.remarks,
        },
        user,
      );

      return canceledPR;
    } catch (error) {
      throw new Error(error);
    }
  }
}
