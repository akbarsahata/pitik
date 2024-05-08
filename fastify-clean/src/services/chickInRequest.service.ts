import { format, isBefore } from 'date-fns';
import { formatInTimeZone, utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';
import { Inject, Service } from 'fastify-decorators';
import { IsNull } from 'typeorm';
import { ChickInRequestDAO } from '../dao/chickInRequest.dao';
import { CoopDAO } from '../dao/coop.dao';
import { FarmingCycleDAO } from '../dao/farmingCycle.dao';
import { PurchaseRequestDAO } from '../dao/purchaseRequest.dao';
import { PurchaseRequestProductDAO } from '../dao/purchaseRequestProduct.dao';
import { FarmingCycle } from '../datasources/entity/pgsql/FarmingCycle.entity';
import { PurchaseRequestTypeEnum } from '../datasources/entity/pgsql/PurchaseRequest.entity';
import { PurchaseRequestProduct } from '../datasources/entity/pgsql/PurchaseRequestProduct.entity';
import {
  ApproveChickInRequestBody,
  ApproveChickInRequestResponseItem,
  ChickInRequestItem,
  ChickInRequestProductResponseItem,
  ChickInRequestProductResponseList,
  CreateChickInRequestBody,
  GetChickInRequestDetailResponseItem,
  RejectChickInRequestBody,
  RejectChickInRequestResponseItem,
  UpdateChickInRequestBody,
  UpdateChickInRequestParams,
  UpdateChickInRequestResponseItem,
} from '../dto/chickInRequest.dto';
import { ChickInRequestApprovedQueue } from '../jobs/queues/chick-in-request-approved.queue';
import { ChickInRequestCreatedQueue } from '../jobs/queues/chick-in-request-created.queue';
import { ChickInRequestUpdatedQueue } from '../jobs/queues/chick-in-request-updated.queue';
import { FarmingCycleCreatedQueue } from '../jobs/queues/farming-cycle-created.queue';
import { PurchaseRequestApprovedQueue } from '../jobs/queues/purchase-request-approved.queue';
import { DATETIME_SQL_FORMAT, DATE_SQL_FORMAT, DEFAULT_TIME_ZONE } from '../libs/constants';
import {
  ERR_CHICK_IN_REQ_ALREADY_APPROVED,
  ERR_CHICK_IN_REQ_ALREADY_EXISTS,
  ERR_CHICK_IN_REQ_BLOCKED_BY_PR_OVK,
  ERR_CHICK_IN_REQ_INVALID_DATE,
  ERR_CHICK_IN_REQ_OVK_REQUIRED,
  ERR_CHICK_IN_REQ_WIHTOUT_DOC,
  ERR_CHICK_IN_REQ_WIHTOUT_PR,
  ERR_PURCHASE_REQUEST_NOT_FOUND,
} from '../libs/constants/errors';
import { RequestUser } from '../libs/types/index.d';
import { CoopCacheUtil } from '../libs/utils/coopCache';

interface ChickInRequestProduct {
  doc: ChickInRequestProductResponseItem;
  pakan: ChickInRequestProductResponseItem;
  ovk: ChickInRequestProductResponseList;
}

@Service()
export class ChickInRequestService {
  @Inject(ChickInRequestDAO)
  private dao!: ChickInRequestDAO;

  @Inject(FarmingCycleDAO)
  private fcDAO!: FarmingCycleDAO;

  @Inject(PurchaseRequestDAO)
  private purchaseReqDAO!: PurchaseRequestDAO;

  @Inject(PurchaseRequestProductDAO)
  private purchaseReqProdDAO!: PurchaseRequestProductDAO;

  @Inject(CoopDAO)
  private coopDAO!: CoopDAO;

  @Inject(FarmingCycleCreatedQueue)
  private fcCreatedQueue!: FarmingCycleCreatedQueue;

  @Inject(PurchaseRequestApprovedQueue)
  private prApprovedQueue!: PurchaseRequestApprovedQueue;

  @Inject(ChickInRequestCreatedQueue)
  private cirCreatedQueue!: ChickInRequestCreatedQueue;

  @Inject(ChickInRequestApprovedQueue)
  private cirApprovedQueue!: ChickInRequestApprovedQueue;

  @Inject(ChickInRequestUpdatedQueue)
  private cirUpdatedQueue!: ChickInRequestUpdatedQueue;

  @Inject(CoopCacheUtil)
  private coopCacheUtil!: CoopCacheUtil;

  async createChickIn(
    data: CreateChickInRequestBody,
    user: RequestUser,
  ): Promise<ChickInRequestItem> {
    const queryRunner = await this.dao.startTransaction();

    try {
      const existingRequest = await this.dao.getOne({
        where: {
          coopId: data.coopId,
          isApproved: IsNull(),
        },
      });
      if (existingRequest) {
        throw ERR_CHICK_IN_REQ_ALREADY_EXISTS();
      }

      if (isBefore(zonedTimeToUtc(new Date(data.chickInDate), DEFAULT_TIME_ZONE), new Date())) {
        throw ERR_CHICK_IN_REQ_INVALID_DATE();
      }

      const coop = await this.coopDAO.getOneStrict({
        where: {
          id: data.coopId,
          chickInRequestId: IsNull(),
          activeFarmingCycleId: IsNull(),
        },
        relations: {
          farm: true,
          purchaseRequestOvk: true,
        },
        relationLoadStrategy: 'join',
      });

      let fc: FarmingCycle;

      if (coop.purchaseRequestOvk) {
        fc = await this.fcDAO.getOneById(coop.purchaseRequestOvk.farmingCycleId);
      } else {
        if (data.ovk.length < 1) {
          throw ERR_CHICK_IN_REQ_OVK_REQUIRED();
        }

        fc = await this.fcDAO.createOneWithTx(
          {
            coopId: coop.id,
            farmId: coop.farm.id,
            initialPopulation: data.initialPopulation,
            chickTypeId: coop.chickTypeId,
            contractId: coop.contractId,
          },
          user,
          queryRunner,
        );
      }

      const chickInReq = await this.dao.createOneWithTx(
        {
          coopId: coop.id,
          farmId: coop.farm.id,
          userOwnerId: coop.farm.userOwnerId,
          farmingCycleId: fc.id,
          chickInDate: data.chickInDate,
          initialPopulation: data.initialPopulation,
          notes: data.notes,
        },
        user,
        queryRunner,
      );

      const purchaseReq = await this.purchaseReqDAO.createOneWithTx(
        {
          type: PurchaseRequestTypeEnum.doc,
          farmingCycleId: fc.id,
          chickInRequestId: chickInReq.id,
          requestSchedule: data.chickInDate,
          notes: data.notes,
        },
        user,
        queryRunner,
      );

      await this.purchaseReqProdDAO.createManyWithTx(
        [
          {
            ...data.doc,
            purchaseRequestId: purchaseReq.id,
            uom: data.doc.purchaseUom,
          },
          {
            ...data.pakan,
            purchaseRequestId: purchaseReq.id,
            uom: data.pakan.purchaseUom,
          },
          ...data.ovk.map<Partial<PurchaseRequestProduct>>((o) => ({
            ...o,
            purchaseRequestId: purchaseReq.id,
            uom: o.purchaseUom,
          })),
        ],
        user,
        queryRunner,
      );

      await this.coopDAO.updateOneWithTx(
        {
          id: data.coopId,
        },
        {
          chickInRequestId: chickInReq.id,
        },
        user,
        queryRunner,
      );

      await this.coopCacheUtil.invalidateCoopCache(data.coopId, 'idle');

      await this.dao.commitTransaction(queryRunner);

      if (!coop.purchaseRequestOvkId) {
        await this.fcCreatedQueue.addJob(chickInReq);
      }

      await this.cirCreatedQueue.addJob(chickInReq);

      return {
        chickInDate: chickInReq.chickInDate,
        initialPopulation: chickInReq.initialPopulation,
        coopId: chickInReq.coopId,
        farmId: chickInReq.farmId,
        farmingCycleId: chickInReq.farmingCycleId,
        userOwnerId: chickInReq.userOwnerId,
        doc: data.doc,
        pakan: data.pakan,
        ovk: data.ovk,
        notes: chickInReq.notes,
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
        purchaseRequests: true,
        notes: true,
      },
      relations: {
        purchaseRequests: {
          products: true,
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

    const [purchaseReq] = chickIn.purchaseRequests;

    if (!purchaseReq) {
      throw ERR_PURCHASE_REQUEST_NOT_FOUND();
    }

    let mappedProduct: ChickInRequestProduct = {
      doc: {} as ChickInRequestProductResponseItem,
      pakan: {} as ChickInRequestProductResponseItem,
      ovk: [],
    };

    mappedProduct = purchaseReq.products.reduce((p, c) => {
      if (/^doc/gi.test(c.categoryCode)) {
        Reflect.set(p, 'doc', {
          ...c,
          purchaseUom: c.uom,
        });

        return p;
      }

      if (/^pakan/gi.test(c.categoryCode)) {
        Reflect.set(p, 'pakan', {
          ...c,
          purchaseUom: c.uom,
        });

        return p;
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

    // prettier-ignore
    const previousOvk = coop.purchaseRequestOvk
      ? coop.purchaseRequestOvk.products.map<ChickInRequestProductResponseItem>((prp) => ({
        ...prp,
        purchaseUom: prp.uom,
      }))
      : [];

    return {
      id: chickIn.id,
      chickInDate: chickIn.chickInDate,
      initialPopulation: chickIn.initialPopulation,
      coopId: chickIn.coopId,
      previousOvk,
      notes: chickIn.notes,
      ...mappedProduct,
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
          isApproved: true,
        },
        relations: {
          coop: {
            purchaseRequestOvk: true,
          },
        },
      });

      if (chickIn.isApproved) {
        throw ERR_CHICK_IN_REQ_ALREADY_APPROVED();
      }

      if (chickIn.coop.purchaseRequestOvk && !chickIn.coop.purchaseRequestOvk.isApproved) {
        throw ERR_CHICK_IN_REQ_BLOCKED_BY_PR_OVK();
      }

      const approvedChickIn = await this.dao.updateOneWithTx(
        {
          id,
        },
        {
          isApproved: true,
          approvedBy: user.id,
          ...(body.chickInDate && {
            approvedDate: formatInTimeZone(
              body.chickInDate,
              DEFAULT_TIME_ZONE,
              DATETIME_SQL_FORMAT,
            ),
          }),
        },
        user,
        queryRunner,
      );

      const approvedPR = await this.purchaseReqDAO.updateOneWithTx(
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

      await this.prApprovedQueue.addJob(approvedPR);

      await this.cirApprovedQueue.addJob(approvedChickIn);

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

      await this.cirApprovedQueue.addJob(rejectedChickIn);

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
      const chickInReq = await this.dao.getOneStrict({
        where: {
          id: params.chickInReqId,
        },
        relations: {
          purchaseRequests: true,
        },
      });

      if (chickInReq.isApproved) {
        throw ERR_CHICK_IN_REQ_ALREADY_APPROVED();
      }

      if (!chickInReq.purchaseRequests.length) {
        throw ERR_CHICK_IN_REQ_WIHTOUT_PR();
      }

      if (isBefore(zonedTimeToUtc(new Date(data.chickInDate), DEFAULT_TIME_ZONE), new Date())) {
        throw ERR_CHICK_IN_REQ_INVALID_DATE();
      }

      const coop = await this.coopDAO.getOneStrict({
        where: {
          id: data.coopId,
        },
        relations: {
          purchaseRequestOvk: true,
        },
        relationLoadStrategy: 'join',
      });

      if (!coop.purchaseRequestOvk) {
        if (data.ovk.length < 1) {
          throw ERR_CHICK_IN_REQ_OVK_REQUIRED();
        }
      }

      const [prToBeDeleted] = chickInReq.purchaseRequests;

      await this.purchaseReqProdDAO.deleteManyWithTx(
        {
          purchaseRequestId: prToBeDeleted.id,
        },
        queryRunner,
      );

      await this.purchaseReqDAO.deleteOneWithTx(
        {
          id: prToBeDeleted.id,
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

      const newPR = await this.purchaseReqDAO.createOneWithTx(
        {
          type: PurchaseRequestTypeEnum.doc,
          farmingCycleId: chickInReq.farmingCycleId,
          chickInRequestId: chickInReq.id,
          requestSchedule: data.chickInDate,
          notes: data.notes,
        },
        user,
        queryRunner,
      );

      await this.purchaseReqProdDAO.createManyWithTx(
        [
          {
            ...data.doc,
            purchaseRequestId: newPR.id,
            uom: data.doc.purchaseUom,
          },
          {
            ...data.pakan,
            purchaseRequestId: newPR.id,
            uom: data.pakan.purchaseUom,
          },
          ...data.ovk.map<Partial<PurchaseRequestProduct>>((o) => ({
            ...o,
            purchaseRequestId: newPR.id,
            uom: o.purchaseUom,
          })),
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
        pakan: data.pakan,
        ovk: data.ovk,
      };
    } catch (error) {
      await this.dao.rollbackTransaction(queryRunner);

      throw error;
    }
  }
}
