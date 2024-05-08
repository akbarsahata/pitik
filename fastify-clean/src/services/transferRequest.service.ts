import { addDays, format, hoursToMilliseconds, isBefore } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';
import { Inject, Service } from 'fastify-decorators';
import { Between, DeepPartial, Equal, ILike, In, IsNull, Like, Not } from 'typeorm';
import env from '../config/env';
import { CoopDAO } from '../dao/coop.dao';
import { ErpDAO } from '../dao/erp.dao';
import { FarmDAO } from '../dao/farm.dao';
import { FarmingCycleDAO } from '../dao/farmingCycle.dao';
import { FarmingCycleFeedStockDDAO } from '../dao/farmingCycleFeedStockD.dao';
import { TransferRequestDAO } from '../dao/transferRequest.dao';
import { TransferRequestPhotoDAO } from '../dao/transferRequestPhoto.dao';
import { TransferRequest } from '../datasources/entity/pgsql/TransferRequest.entity';
import { TransferRequestPhoto } from '../datasources/entity/pgsql/TransferRequestPhoto.entity';
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
  GetTransferRequestItem,
  GetTransferRequestList,
  GetTransferRequestQuery,
  GetTransferRequestTargetParams,
  GetTransferRequestTargetQuery,
  GetTransferRequestTargetResponseItem,
  GetTransferRequestTargetResponseList,
  RejectTransferRequestBody,
  UpdateTransferRequestBody,
} from '../dto/transferRequest.dto';
import { TransferRequestApprovedQueue } from '../jobs/queues/transfer-request-approved.queue';
import { TransferRequestCancelQueue } from '../jobs/queues/transfer-request-cancel.queue';
import { TransferRequestCreatedQueue } from '../jobs/queues/transfer-request-created.queue';
import {
  DATE_SQL_FORMAT,
  DEFAULT_TIME_ZONE,
  FARMING_ACTIVITIES,
  FEED_STOCK_NOTES,
} from '../libs/constants';
import {
  ERR_TRANSFER_REQUEST_ALREADY_APPROVED,
  ERR_TRANSFER_REQUEST_INVALID_DATE,
  ERR_TRANSFER_REQUEST_MALFORMED,
} from '../libs/constants/errors';
import { RequestUser } from '../libs/types/index.d';
import { mapActivityStatusBasedRoleRank } from '../libs/utils/mappers';

interface TransferRequestStatus {
  number: 0 | 1 | 2 | 3;
  text: 'Pengajuan' | 'Disetujui' | 'Diterima' | 'Dibatalkan';
}

@Service()
export class TransferRequestService {
  @Inject(TransferRequestDAO)
  private dao!: TransferRequestDAO;

  @Inject(TransferRequestPhotoDAO)
  private trPhotoDAO!: TransferRequestPhotoDAO;

  @Inject(ErpDAO)
  private erpDAO!: ErpDAO;

  @Inject(CoopDAO)
  private coopDAO!: CoopDAO;

  @Inject(FarmDAO)
  private farmDAO!: FarmDAO;

  @Inject(FarmingCycleDAO)
  private fcDAO!: FarmingCycleDAO;

  @Inject(FarmingCycleFeedStockDDAO)
  private farmingCycleFeedStockDDAO!: FarmingCycleFeedStockDDAO;

  @Inject(TransferRequestCreatedQueue)
  private trfCreatedQueue!: TransferRequestCreatedQueue;

  @Inject(TransferRequestApprovedQueue)
  private trfApprovedQueue!: TransferRequestApprovedQueue;

  @Inject(TransferRequestCancelQueue)
  private trfCancelQueue!: TransferRequestCancelQueue;

  async createTransferRequest(
    data: CreateTransferRequestBody,
    user: RequestUser,
  ): Promise<CreateTransferRequestResponseItem> {
    const coopTarget = await this.coopDAO.getOne({
      where: {
        id: data.coopTargetId,
      },
    });

    const queryRunner = await this.dao.startTransaction();

    try {
      if (isBefore(zonedTimeToUtc(new Date(data.datePlanned), DEFAULT_TIME_ZONE), new Date())) {
        throw ERR_TRANSFER_REQUEST_INVALID_DATE();
      }

      const transferRequest = await this.dao.createOneWithTx(
        {
          farmingCycleId: data.farmingCycleId,
          coopSourceId: data.coopSourceId,
          coopTargetId: data.coopTargetId,
          datePlanned: data.datePlanned,
          logisticOption: data.logisticOption,
          subcategoryCode: data.subcategoryCode,
          subcategoryName: data.subcategoryName,
          quantity: data.quantity,
          productName: data.productName,
          notes: data.notes,
          farmingCycleTargetId: coopTarget?.activeFarmingCycleId,
        },
        user,
        queryRunner,
      );

      const transferRequestPhotos = await this.trPhotoDAO.createManyWithTx(
        data.photos.map<DeepPartial<TransferRequestPhoto>>((p) => ({
          url: p.url,
          transferRequestId: transferRequest.id,
        })),
        user,
        queryRunner,
      );

      await this.dao.commitTransaction(queryRunner);

      await this.trfCreatedQueue.addJob(transferRequest);

      return {
        ...transferRequest,
        photos: transferRequestPhotos.map((trp) => ({
          id: trp.id,
          url: trp.url,
        })),
      };
    } catch (error) {
      await this.dao.rollbackTransaction(queryRunner);

      throw error;
    }
  }

  async getEnteringTransferRequests(
    params: GetTransferRequestQuery,
    user: RequestUser,
  ): Promise<GetTransferRequestList> {
    const fc = await this.fcDAO.getOneById(params.farmingCycleId);

    const [transferRequests] = await this.dao.getMany({
      where: [
        {
          coopTargetId: fc.coopId,
          datePlanned: Between(
            format(fc.farmingCycleStartDate, DATE_SQL_FORMAT),
            format(addDays(fc.farmingCycleStartDate, 50), DATE_SQL_FORMAT),
          ),
          approvedBy: Not(IsNull()),
        },
        {
          farmingCycleTargetId: fc.id,
          approvedBy: Not(IsNull()),
        },
      ],
      select: {
        id: true,
        datePlanned: true,
        coopSource: {
          coopName: true,
        },
        coopTarget: {
          coopName: true,
        },
        subcategoryCode: true,
        subcategoryName: true,
        quantity: true,
        isApproved: true,
        approvedBy: true,
        notes: true,
        goodsReceipts: {
          id: true,
        },
        productName: true,
        logisticOption: true,
      },
      order: {
        datePlanned: 'DESC',
        createdDate: 'DESC',
      },
      relations: {
        coopSource: true,
        coopTarget: true,
        goodsReceipts: true,
      },
      relationLoadStrategy: 'join',
    });

    return transferRequests.map<GetTransferRequestItem>((tr) => {
      const status = mapActivityStatusBasedRoleRank(
        user,
        this.transferRequestStatus(tr),
        FARMING_ACTIVITIES.TRANSFER_REQUEST,
      );

      return {
        id: tr.id,
        deliveryDate: tr.datePlanned,
        coopSourceName: tr.coopSource.coopName,
        coopTargetName: tr.coopTarget.coopName,
        subcategoryCode: tr.subcategoryCode,
        subcategoryName: tr.subcategoryName,
        quantity: tr.quantity,
        status: status.number,
        statusText: status.text,
        productName: tr.productName,
        notes: tr.notes,
        logisticOption: tr.logisticOption,
      };
    });
  }

  async getExitingTransferRequests(
    params: GetTransferRequestQuery,
    user: RequestUser,
  ): Promise<GetTransferRequestList> {
    const [transferRequests] = await this.dao.getMany({
      where: {
        farmingCycleId: params.farmingCycleId,
      },
      select: {
        id: true,
        cancellationRequestBy: true,
        datePlanned: true,
        coopSource: {
          coopName: true,
        },
        coopTarget: {
          coopName: true,
        },
        subcategoryCode: true,
        subcategoryName: true,
        quantity: true,
        isApproved: true,
        approvedBy: true,
        notes: true,
        goodsReceipts: {
          id: true,
        },
        productName: true,
        logisticOption: true,
      },
      relations: {
        coopSource: true,
        coopTarget: true,
        goodsReceipts: true,
      },
      relationLoadStrategy: 'join',
    });

    let results = transferRequests.map<GetTransferRequestItem>((tr) => {
      const status = mapActivityStatusBasedRoleRank(
        user,
        this.transferRequestStatus(tr),
        FARMING_ACTIVITIES.TRANSFER_REQUEST,
      );

      return {
        id: tr.id,
        deliveryDate: tr.datePlanned,
        coopSourceName: tr.coopSource.coopName,
        coopTargetName: tr.coopTarget.coopName,
        subcategoryCode: tr.subcategoryCode,
        subcategoryName: tr.subcategoryName,
        quantity: tr.quantity,
        status: status.number,
        statusText: status.text,
        productName: tr.productName,
        notes: tr.notes,
        logisticOption: tr.logisticOption,
      };
    });

    if (params.status) {
      const status = Array.isArray(params.status) ? params.status : [params.status];
      results = results.reduce<GetTransferRequestItem[]>((prev, item) => {
        if (status.some((val) => val === item.status)) {
          prev.push(item);
        }
        return prev;
      }, [] as GetTransferRequestItem[]);
    }
    return results;
  }

  async getTransferRequestTargetCoops(
    query: GetTransferRequestTargetQuery,
    params: GetTransferRequestTargetParams,
  ): Promise<GetTransferRequestTargetResponseList> {
    const sourceCoop = await this.coopDAO.getOneStrict({
      where: {
        id: params.coopSourceId,
      },
      select: {
        id: true,
        farmId: true,
        farm: {
          provinceId: true,
        },
      },
      relations: {
        farm: true,
      },
      relationLoadStrategy: 'join',
    });

    const [sameProvinceFarms] = await this.farmDAO.getAll({
      where: {
        provinceId: sourceCoop.farm.provinceId,
        status: true,
      },
      select: {
        id: true,
      },
      cache: hoursToMilliseconds(1),
    });

    const [availableCoops] = await this.coopDAO.getMany({
      where: {
        id: Not(Equal(params.coopSourceId)),
        activeFarmingCycleId: Not(IsNull()),
        ...(sameProvinceFarms.length && {
          farmId: In(sameProvinceFarms.map((f) => f.id)),
        }),
        ...(query.coopName && {
          coop: {
            coopName: ILike(`%${query.coopName}%`),
          },
        }),
      },
      select: {
        id: true,
        coopName: true,
        farm: {
          farmName: true,
        },
      },
      order: {
        farm: {
          farmName: 'ASC',
        },
      },
      relations: {
        farm: true,
      },
      cache: query.coopName ? hoursToMilliseconds(1) : false,
    });

    return availableCoops.map<GetTransferRequestTargetResponseItem>((c) => ({
      id: c.id,
      coopName: c.coopName,
      farmName: c.farm.farmName,
    }));
  }

  async getTransferRequestDetail(
    params: GetTransferRequestDetailParams,
    user: RequestUser,
  ): Promise<GetTransferRequestDetailResponseItem> {
    const transferRequest = await this.dao.getOneStrict({
      where: {
        id: params.transferRequestId,
      },
      select: {
        id: true,
        cancellationRequestBy: true,
        datePlanned: true,
        coopSource: {
          coopName: true,
        },
        coopTarget: {
          coopName: true,
        },
        subcategoryCode: true,
        subcategoryName: true,
        quantity: true,
        isApproved: true,
        approvedBy: true,
        notes: true,
        goodsReceipts: {
          id: true,
        },
        photos: true,
        productName: true,
        logisticOption: true,
      },
      relations: {
        coopSource: true,
        coopTarget: true,
        goodsReceipts: true,
        photos: true,
      },
      relationLoadStrategy: 'join',
    });

    const status = mapActivityStatusBasedRoleRank(
      user,
      this.transferRequestStatus(transferRequest),
      FARMING_ACTIVITIES.TRANSFER_REQUEST,
    );

    return {
      id: transferRequest.id,
      deliveryDate: transferRequest.datePlanned,
      coopSourceName: transferRequest.coopSource.coopName,
      coopTargetName: transferRequest.coopTarget.coopName,
      subcategoryCode: transferRequest.subcategoryCode,
      subcategoryName: transferRequest.subcategoryName,
      quantity: transferRequest.quantity,
      status: status.number,
      statusText: status.text,
      notes: transferRequest.notes,
      photos: transferRequest.photos,
      productName: transferRequest.productName,
      logisticOption: transferRequest?.logisticOption,
    };
  }

  async approveTransferRequest(
    params: ApproveRejectTransferRequestParams,
    data: ApproveTransferRequestBody,
    user: RequestUser,
  ): Promise<ApproveRejectTransferRequestResponseItem> {
    const approved = await this.dao.updateOne(
      {
        id: params.transferRequestId,
      },
      {
        ...data,
        isApproved: true,
        approvedBy: user.id,
      },
      user,
    );

    await this.trfApprovedQueue.addJob(approved);

    return {
      id: approved.id,
      isApproved: approved.isApproved,
      remarks: approved.remarks,
      approvedBy: approved.approvedBy,
    };
  }

  async rejectTransferRequest(
    params: ApproveRejectTransferRequestParams,
    data: RejectTransferRequestBody,
    user: RequestUser,
  ): Promise<ApproveRejectTransferRequestResponseItem> {
    const rejected = await this.dao.updateOne(
      {
        id: params.transferRequestId,
      },
      {
        ...data,
        isApproved: false,
        approvedBy: user.id,
      },
      user,
    );

    return {
      id: rejected.id,
      isApproved: rejected.isApproved,
      remarks: rejected.remarks,
      approvedBy: rejected.approvedBy,
    };
  }

  async cancelTransferRequest(
    params: CancelTransferRequestParams,
    data: CancelTransferRequestBody,
    user: RequestUser,
  ) {
    const tr = await this.dao.getOneStrict({
      where: {
        id: params.transferRequestId,
      },
    });

    const qr = await this.dao.startTransaction();

    try {
      await this.dao.updateOneWithTx(
        {
          id: params.transferRequestId,
        },
        {
          remarks: data.remarks,
          cancellationRequestBy: user.id,
        },
        user,
        qr,
      );

      await this.farmingCycleFeedStockDDAO.deleteManyWithTx(
        {
          farmingCycleId: tr.farmingCycleId,
          notes: Like(FEED_STOCK_NOTES.MINUS_TR.replace('%', tr.id)),
        },
        qr,
      );

      if (env.USE_ERP) {
        await this.erpDAO.cancelTransferRequest(tr);
      }

      await this.dao.commitTransaction(qr);

      await this.trfCancelQueue.addJob({
        transferRequestId: tr.id,
        isApproved: tr.isApproved,
      });
    } catch (error) {
      await this.dao.rollbackTransaction(qr);
      throw error;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  private transferRequestStatus(tr: TransferRequest): TransferRequestStatus {
    if (tr.cancellationRequestBy) {
      return { number: 3, text: 'Dibatalkan' };
    }

    if (!tr.isApproved && !tr.approvedBy) {
      return { number: 0, text: 'Pengajuan' };
    }

    if (tr.isApproved && !tr.goodsReceipts.length) {
      return { number: 1, text: 'Disetujui' };
    }

    if (tr.isApproved && tr.goodsReceipts.length) {
      return { number: 2, text: 'Diterima' };
    }

    throw ERR_TRANSFER_REQUEST_MALFORMED(tr.id);
  }

  async updateTranferRequest(
    id: string,
    data: UpdateTransferRequestBody,
    user: RequestUser,
  ): Promise<TransferRequest> {
    const transfer = await this.dao.getOneStrict({
      where: { id },
    });

    if (transfer.isApproved) {
      throw ERR_TRANSFER_REQUEST_ALREADY_APPROVED();
    }

    const queryRunner = await this.dao.startTransaction();

    try {
      const updatedTransfer = await this.dao.updateOneWithTx(
        { id },
        {
          coopSourceId: data.coopSourceId,
          coopTargetId: data.coopTargetId,
          farmingCycleId: data.farmingCycleId,
          subcategoryCode: data.subcategoryCode,
          subcategoryName: data.subcategoryName,
          quantity: data.quantity,
          datePlanned: data.datePlanned,
          logisticOption: data.logisticOption,
          productName: data.productName,
          notes: data.notes,
        },
        user,
        queryRunner,
      );

      const upsertedPhotos = await this.trPhotoDAO.upsertManyWithTx(
        { transferRequestId: id },
        (data.photos || []).map<DeepPartial<TransferRequestPhoto>>((p) => ({
          id: p.id,
          url: p.url,
          transferRequestId: id,
        })),
        user,
        queryRunner,
      );

      await this.dao.commitTransaction(queryRunner);

      return {
        ...updatedTransfer,
        photos: upsertedPhotos,
      };
    } catch (error) {
      await this.dao.rollbackTransaction(queryRunner);

      throw error;
    }
  }
}
