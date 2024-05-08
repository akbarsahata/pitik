import { hoursToMilliseconds, isAfter, isBefore, startOfDay } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { Inject, Service } from 'fastify-decorators';
import { Between, DeepPartial, Equal, ILike, In, IsNull, Not, QueryRunner } from 'typeorm';
import { BranchSapronakStockDAO } from '../../dao/branchSapronakStock.dao';
import { CoopDAO } from '../../dao/coop.dao';
import { ProductESDAO } from '../../dao/es/product.es.dao';
import { FarmDAO } from '../../dao/farm.dao';
import { FarmingCycleDAO } from '../../dao/farmingCycle.dao';
import { FarmingCycleFeedStockDDAO } from '../../dao/farmingCycleFeedStockD.dao';
import { FarmingCycleFeedStockSummaryDAO } from '../../dao/farmingCycleFeedStockSummary.dao';
import { FarmingCycleOvkStockSummaryDAO } from '../../dao/farmingCycleOvkStockSummary.dao';
import { TransferRequestDAO } from '../../dao/transferRequest.dao';
import { TransferRequestPhotoDAO } from '../../dao/transferRequestPhoto.dao';
import { TransferRequestProductDAO } from '../../dao/transferRequestProduct.dao';
import { TransferRequest } from '../../datasources/entity/pgsql/TransferRequest.entity';
import { TransferRequestPhoto } from '../../datasources/entity/pgsql/TransferRequestPhoto.entity';
import { TransferRequestProduct } from '../../datasources/entity/pgsql/TransferRequestProduct.entity';
import {
  ApproveRejectTransferRequestParams,
  ApproveTransferRequestBody,
  CancelTransferRequestBody,
  CancelTransferRequestParams,
  CreateTransferRequestBody,
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
  UpdateTransferRequestProductBody,
} from '../../dto/transferRequest.dto';
import { DEFAULT_TIME_ZONE, FEED_STOCK_NOTES } from '../../libs/constants';
import {
  ERR_BAD_REQUEST,
  ERR_TRANSFER_REQUEST_ALREADY_APPROVED,
  ERR_TRANSFER_REQUEST_INVALID_DATE,
  ERR_TRANSFER_REQUEST_INVALID_PRODUCT,
  ERR_TRANSFER_REQUEST_MALFORMED,
  ERR_TRANSFER_REQUEST_NOT_FOUND,
  ERR_TRANSFER_REQUEST_QTY_EXCEED_STOCK,
} from '../../libs/constants/errors';
import { Transactional } from '../../libs/decorators/transactional';
import { RequestUser } from '../../libs/types/index.d';
import { mapActivityStatusBasedRoleRank } from '../../libs/utils/mappers';

interface ValidTransferRequestInfo {
  coopSourceId: string | null;
  coopTargetId: string | null;
  farmingCycleTargetId: string | null;
  branchSourceId: string | null;
  branchTargetId: string | null;
  route: 'COOP-TO-COOP' | 'COOP-TO-BRANCH' | 'BRANCH-TO-COOP';
  details:
    | Omit<
        TransferRequestProduct,
        'id' | 'transferRequestId' | 'transferRequest' | 'returnedDate'
      >[]
    | null;
}

interface TransferRequestStatus {
  number: 0 | 1 | 2 | 3;
  text: 'Pengajuan' | 'Dikirim' | 'Diterima' | 'Dibatalkan' | 'Ditolak';
}

@Service()
export class TransferRequestService {
  @Inject(TransferRequestDAO)
  private dao!: TransferRequestDAO;

  @Inject(TransferRequestPhotoDAO)
  private transferRequestPhotoDAO!: TransferRequestPhotoDAO;

  @Inject(TransferRequestProductDAO)
  private transferRequestProductDAO!: TransferRequestProductDAO;

  @Inject(CoopDAO)
  private coopDAO!: CoopDAO;

  @Inject(FarmDAO)
  private farmDAO!: FarmDAO;

  @Inject(FarmingCycleDAO)
  private fcDAO!: FarmingCycleDAO;

  @Inject(FarmingCycleFeedStockDDAO)
  private farmingCycleFeedStockDDAO!: FarmingCycleFeedStockDDAO;

  @Inject(FarmingCycleFeedStockSummaryDAO)
  private farmingCycleFeedStockSummaryDAO: FarmingCycleFeedStockSummaryDAO;

  @Inject(FarmingCycleOvkStockSummaryDAO)
  private farmingCycleOvkStockSummaryDAO: FarmingCycleOvkStockSummaryDAO;

  @Inject(BranchSapronakStockDAO)
  private branchSapronakStockSummaryDAO: BranchSapronakStockDAO;

  @Inject(ProductESDAO)
  private productESDAO: ProductESDAO;

  @Transactional()
  async createTransferRequest(
    data: CreateTransferRequestBody,
    user: RequestUser,
    queryRunner: QueryRunner,
  ) {
    if (
      isBefore(
        new Date(data.datePlanned),
        startOfDay(utcToZonedTime(new Date(), DEFAULT_TIME_ZONE)),
      )
    ) {
      throw ERR_TRANSFER_REQUEST_INVALID_DATE();
    }

    const type = data.type ? data.type : 'pakan';

    const {
      coopSourceId,
      coopTargetId,
      branchSourceId,
      branchTargetId,
      farmingCycleTargetId,
      route,
      details: validatedDetails,
    } = await this.validateTransferRequestDestination(data);

    let {
      subcategoryCode,
      subcategoryName,
      quantity,
      productName,
      productCode,
      details: productDetails,
    } = data;

    if (!validatedDetails || !validatedDetails.length) {
      const productEsDetail = await this.productESDAO.getProductByProductName(
        data.productName as string,
      );

      productDetails = [
        {
          categoryCode: type.toUpperCase(),
          categoryName: type.toUpperCase(),
          subcategoryCode: data.subcategoryCode,
          subcategoryName: data.subcategoryName,
          productCode: productEsDetail?.productCode || '',
          productName: data.productName || productEsDetail?.productName || '',
          quantity: data.quantity,
          uom: productEsDetail?.purchaseUom || '',
        },
      ];
    } else {
      productDetails = validatedDetails;
    }

    subcategoryCode = productDetails[0].subcategoryCode;

    subcategoryName = productDetails[0].subcategoryName;

    quantity = productDetails[0].quantity;

    productName = productDetails[0].productName;

    productCode = productDetails[0].productCode;

    const transferRequestCreated = await this.dao.createOneWithTx(
      {
        coopSourceId,
        coopTargetId,
        branchSourceId,
        branchTargetId,
        farmingCycleTargetId,
        type,
        subcategoryCode,
        subcategoryName,
        productName,
        productCode,
        quantity,
        route,
        farmingCycleId: data.farmingCycleId,
        datePlanned: data.datePlanned,
        logisticOption: data.logisticOption,
        notes: data.notes,
      },
      user,
      queryRunner,
    );

    const transferRequestPhotos = await this.transferRequestPhotoDAO.createManyWithTx(
      data.photos.map<DeepPartial<TransferRequestPhoto>>((p) => ({
        url: p.url,
        transferRequestId: transferRequestCreated.id,
      })),
      user,
      queryRunner,
    );

    const transferRequestProducts = await this.transferRequestProductDAO.createManyWithTx(
      productDetails!.map((pd) => ({
        ...pd,
        transferRequestId: transferRequestCreated.id,
      })),
      user,
      queryRunner,
    );

    return {
      transferRequestCreated,
      transferRequestProducts,
      transferRequestPhotos: transferRequestPhotos.map((trp) => ({
        id: trp.id,
        url: trp.url,
      })),
      route,
    };
  }

  async getEnteringTransferRequests(
    params: GetTransferRequestQuery,
    user: RequestUser,
  ): Promise<GetTransferRequestList> {
    if ((params.fromDate && !params.untilDate) || (!params.fromDate && params.untilDate)) {
      throw ERR_BAD_REQUEST('query fromDate & untilDate must exist together');
    }

    if (
      params.fromDate &&
      params.untilDate &&
      isAfter(new Date(params.fromDate), new Date(params.untilDate))
    ) {
      throw ERR_BAD_REQUEST('fromDate cannot be more than untilDate');
    }

    const fc = await this.fcDAO.getOneById(params.farmingCycleId);

    const [transferRequests] = await this.dao.getMany({
      where: {
        coopTargetId: fc.coopId,
        farmingCycleTargetId: fc.id,
        approvedBy: Not(IsNull()),
        route: 'COOP-TO-COOP',
        ...(params.type && {
          type: params.type,
        }),
        // prettier-ignore
        ...(params.fromDate &&
          params.untilDate && {
          datePlanned: Between(params.fromDate, params.untilDate),
        }),
      },
      select: {
        id: true,
        erpCode: true,
        datePlanned: true,
        farmingCycleId: true,
        coopSourceId: true,
        coopTargetId: true,
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
        farmingCycleTargetId: true,
        route: true,
        type: true,
        branchSource: {
          name: true,
        },
        branchTarget: {
          name: true,
        },
      },
      order: {
        datePlanned: 'DESC',
      },
      relations: {
        coopSource: true,
        coopTarget: true,
        goodsReceipts: true,
        transferRequestProducts: true,
        branchSource: true,
        branchTarget: true,
      },
      relationLoadStrategy: 'join',
    });

    return transferRequests.map<GetTransferRequestItem>((tr) => {
      const status = mapActivityStatusBasedRoleRank(
        user,
        TransferRequestService.transferRequestStatus(tr),
        'TRANSFER_REQUEST',
      );

      return {
        id: tr.id,
        erpCode: tr.erpCode,
        description: TransferRequestService.transferRequestDescription(tr.transferRequestProducts),
        deliveryDate: tr.datePlanned,
        farmingCycleSourceId: tr.farmingCycleId,
        farmingCycleTargetId: tr.farmingCycleTargetId || '',
        coopSourceId: tr.coopSourceId || '',
        coopTargetId: tr.coopTargetId || '',
        coopSourceName: tr.coopSource?.coopName || '',
        coopTargetName: tr.coopTarget?.coopName || '',
        branchSourceName: tr.branchSource?.name || '',
        branchTargetName: tr.branchTarget?.name || '',
        subcategoryCode: tr.subcategoryCode,
        subcategoryName: tr.subcategoryName,
        quantity: tr.quantity,
        status: status.number,
        type: tr.type,
        statusText: status.text,
        productName: tr.productName,
        notes: tr.notes,
        logisticOption: tr.logisticOption,
        route: tr.route,
      };
    });
  }

  async getExitingTransferRequests(
    params: GetTransferRequestQuery,
    user: RequestUser,
  ): Promise<GetTransferRequestList> {
    if ((params.fromDate && !params.untilDate) || (!params.fromDate && params.untilDate)) {
      throw ERR_BAD_REQUEST('query fromDate & untilDate must exist together');
    }

    if (
      params.fromDate &&
      params.untilDate &&
      isAfter(new Date(params.fromDate), new Date(params.untilDate))
    ) {
      throw ERR_BAD_REQUEST('fromDate cannot be more than untilDate');
    }

    const [transferRequests] = await this.dao.getMany({
      where: {
        farmingCycleId: params.farmingCycleId,
        route: Not('BRANCH-TO-COOP'),
        ...(params.type && {
          type: params.type,
        }),
        // prettier-ignore
        ...(params.fromDate &&
          params.untilDate && {
          datePlanned: Between(params.fromDate, params.untilDate),
        }),
      },
      select: {
        id: true,
        erpCode: true,
        farmingCycleId: true,
        coopSourceId: true,
        coopTargetId: true,
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
        route: true,
        type: true,
        goodsReceipts: {
          id: true,
        },
        productName: true,
        logisticOption: true,
        farmingCycleTargetId: true,
        transferRequestProducts: true,
        branchSource: {
          name: true,
        },
        branchTarget: {
          name: true,
        },
      },
      relations: {
        coopSource: true,
        coopTarget: true,
        goodsReceipts: true,
        transferRequestProducts: true,
        branchSource: true,
        branchTarget: true,
      },
      order: {
        datePlanned: 'DESC',
      },
      relationLoadStrategy: 'join',
    });

    let results = transferRequests.map<GetTransferRequestItem>((tr) => {
      const status = mapActivityStatusBasedRoleRank(
        user,
        TransferRequestService.transferRequestStatus(tr),
        'TRANSFER_REQUEST',
      );

      return {
        id: tr.id,
        erpCode: tr.erpCode,
        description: TransferRequestService.transferRequestDescription(tr.transferRequestProducts),
        deliveryDate: tr.datePlanned,
        farmingCycleSourceId: tr.farmingCycleId,
        farmingCycleTargetId: tr.farmingCycleTargetId || '',
        coopSourceId: tr.coopSourceId || '',
        coopTargetId: tr.coopTargetId || '',
        coopSourceName: tr.coopSource?.coopName || '',
        coopTargetName: tr.coopTarget?.coopName || '',
        branchSourceName: tr.branchSource?.name || '',
        branchTargetName: tr.branchTarget?.name || '',
        subcategoryCode: tr.subcategoryCode,
        subcategoryName: tr.subcategoryName,
        quantity: tr.quantity,
        status: status.number,
        statusText: status.text,
        type: tr.type,
        productName: tr.productName,
        notes: tr.notes,
        logisticOption: tr.logisticOption,
        route: tr.route,
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

  // TODO: refactor to each service based on the DAOs
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
          branchId: true,
        },
      },
      relations: {
        farm: true,
      },
      relationLoadStrategy: 'join',
    });

    const [farmList] = await this.farmDAO.getAll({
      where: [
        {
          provinceId: sourceCoop.farm.provinceId,
          status: true,
        },
        {
          branchId: sourceCoop.farm.branchId,
          status: true,
        },
      ],
      select: {
        id: true,
      },
      cache: hoursToMilliseconds(1),
    });

    const [availableCoops] = await this.coopDAO.getMany({
      where: {
        id: Not(Equal(params.coopSourceId)),
        activeFarmingCycleId: Not(IsNull()),
        ...(farmList.length && {
          farmId: In(farmList.map((f) => f.id)),
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
        erpCode: true,
        cancellationRequestBy: true,
        datePlanned: true,
        farmingCycleId: true,
        farmingCycleTargetId: true,
        coopSourceId: true,
        coopTargetId: true,
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
        photos: true,
        productName: true,
        logisticOption: true,
        transferRequestProducts: true,
        route: true,
        type: true,
        branchSource: {
          name: true,
        },
        branchTarget: {
          name: true,
        },
      },
      relations: {
        coopSource: true,
        coopTarget: true,
        branchSource: true,
        branchTarget: true,
        goodsReceipts: {
          photos: true,
          goodsReceiptProducts: true,
        },
        photos: true,
        transferRequestProducts: true,
      },
      relationLoadStrategy: 'join',
    });

    const status = mapActivityStatusBasedRoleRank(
      user,
      TransferRequestService.transferRequestStatus(transferRequest),
      'TRANSFER_REQUEST',
    );

    const productSumMap = new Map<string, number>();

    const goodsReceipts = transferRequest.goodsReceipts.map((gr) => {
      gr.goodsReceiptProducts.forEach((grp) => {
        if (productSumMap.has(grp.productCode)) {
          let sum = Number(productSumMap.get(grp.productCode)) || 0;

          sum += Number(grp.quantity);

          productSumMap.set(grp.productCode, sum);
        } else {
          productSumMap.set(grp.productCode, grp.quantity);
        }
      });

      return {
        receivedDate: gr.receivedDate,
        remarks: gr.remarks,
        notes: gr.notes,
        details: gr.goodsReceiptProducts.map((grp) => ({ ...grp, isReturned: !!grp.isReturned })),
        photos: gr.photos,
      };
    });

    return {
      id: transferRequest.id,
      erpCode: transferRequest.erpCode,
      description: TransferRequestService.transferRequestDescription(
        transferRequest.transferRequestProducts,
      ),
      deliveryDate: transferRequest.datePlanned,
      farmingCycleSourceId: transferRequest.farmingCycleId,
      farmingCycleTargetId: transferRequest.farmingCycleTargetId || '',
      coopSourceId: transferRequest.coopSourceId || '',
      coopTargetId: transferRequest.coopTargetId || '',
      coopSourceName: transferRequest.coopSource?.coopName || '',
      coopTargetName: transferRequest.coopTarget?.coopName || '',
      branchSourceName: transferRequest.branchSource?.name || '',
      branchTargetName: transferRequest.branchTarget?.name || '',
      subcategoryCode: transferRequest.subcategoryCode,
      subcategoryName: transferRequest.subcategoryName,
      quantity: transferRequest.quantity,
      type: transferRequest.type,
      status: status.number,
      statusText: status.text,
      notes: transferRequest.notes,
      route: transferRequest.route,
      photos: transferRequest.photos,
      productName: transferRequest.productName,
      logisticOption: transferRequest?.logisticOption,
      goodsReceipts,
      details: transferRequest.transferRequestProducts.map((trp) => {
        const remaining = trp.quantity - (productSumMap.get(trp.productCode) || 0);

        return {
          ...trp,
          remaining: remaining < 0 ? 0 : remaining,
        };
      }),
    };
  }

  @Transactional()
  async approveTransferRequest(
    params: ApproveRejectTransferRequestParams,
    data: ApproveTransferRequestBody,
    user: RequestUser,
    queryRunner: QueryRunner,
  ) {
    const transferRequest = await this.dao.getOneWithTx(
      {
        where: {
          id: params.transferRequestId,
        },
        relations: {
          farmingCycle: true,
          farmingCycleTarget: true,
        },
      },
      queryRunner,
    );

    if (!transferRequest) {
      throw ERR_TRANSFER_REQUEST_NOT_FOUND(params.transferRequestId);
    }

    const transferRequestApproved = await this.dao.updateOneWithTx(
      {
        id: params.transferRequestId,
      },
      {
        ...data,
        isApproved: true,
        approvedBy: user.id,
      },
      user,
      queryRunner,
    );

    return { transferRequestApproved };
  }

  @Transactional()
  async rejectTransferRequest(
    params: ApproveRejectTransferRequestParams,
    data: RejectTransferRequestBody,
    user: RequestUser,
    queryRunner: QueryRunner,
  ) {
    const transferRequestRejected = await this.dao.updateOneWithTx(
      {
        id: params.transferRequestId,
      },
      {
        ...data,
        isApproved: false,
        approvedBy: user.id,
      },
      user,
      queryRunner,
    );

    return { transferRequestRejected };
  }

  @Transactional()
  async cancelTransferRequest(
    params: CancelTransferRequestParams,
    data: CancelTransferRequestBody,
    user: RequestUser,
    queryRunner: QueryRunner,
  ): Promise<TransferRequest> {
    const tr = await this.dao.getOneStrict({
      where: {
        id: params.transferRequestId,
      },
    });

    await this.dao.updateOneWithTx(
      {
        id: params.transferRequestId,
      },
      {
        remarks: data.remarks,
        cancellationRequestBy: user.id,
      },
      user,
      queryRunner,
    );

    // TODO: refactor this to usecase
    await this.farmingCycleFeedStockDDAO.deleteManyWithTx(
      {
        farmingCycleId: tr.farmingCycleId,
        notes: ILike(FEED_STOCK_NOTES.MINUS_TR.replace('%', tr.id)),
      },
      queryRunner,
    );

    return tr;
  }

  async updateTransferRequest(
    id: string,
    data: UpdateTransferRequestBody,
    user: RequestUser,
    queryRunner: QueryRunner,
  ) {
    const transferRequestExisting = await this.dao.getOneStrict({
      where: { id },
      relations: { transferRequestProducts: true },
    });

    if (transferRequestExisting.isApproved) {
      throw ERR_TRANSFER_REQUEST_ALREADY_APPROVED();
    }

    const type = data.type ? data.type : 'pakan';

    const {
      coopSourceId,
      coopTargetId,
      branchSourceId,
      branchTargetId,
      farmingCycleTargetId,
      route,
      details: validatedDetails,
    } = await this.validateTransferRequestDestination(data);

    let { subcategoryCode, subcategoryName, quantity, productName, details: productDetails } = data;

    if (!validatedDetails || !validatedDetails.length) {
      const productEsDetail = await this.productESDAO.getProductByProductName(
        data.productName as string,
      );

      productDetails = [
        {
          categoryCode: type.toUpperCase(),
          categoryName: type.toUpperCase(),
          subcategoryCode: data.subcategoryCode,
          subcategoryName: data.subcategoryName,
          productCode: productEsDetail?.productCode || '',
          productName: data.productName || productEsDetail?.productName || '',
          quantity: data.quantity,
          uom: productEsDetail?.purchaseUom || '',
        },
      ];
    } else {
      productDetails = validatedDetails;
    }

    subcategoryCode = productDetails[0].subcategoryCode;

    subcategoryName = productDetails[0].subcategoryName;

    quantity = productDetails[0].quantity;

    productName = productDetails[0].productName;

    const transferRequestUpdated = await this.dao.updateOneWithTx(
      { id },
      {
        coopSourceId,
        coopTargetId,
        branchSourceId,
        branchTargetId,
        farmingCycleTargetId,
        type,
        subcategoryCode,
        subcategoryName,
        productName,
        quantity,
        route,
        farmingCycleId: data.farmingCycleId,
        datePlanned: data.datePlanned,
        logisticOption: data.logisticOption,
        notes: data.notes,
      },
      user,
      queryRunner,
    );

    await Promise.all([
      this.transferRequestProductDAO.deleteManyWithTx(
        {
          transferRequestId: id,
        },
        queryRunner,
      ),
      this.transferRequestPhotoDAO.deleteManyWithTx(
        {
          transferRequestId: id,
        },
        queryRunner,
      ),
    ]);

    const transferRequestPhotos = await this.transferRequestPhotoDAO.createManyWithTx(
      (data.photos || []).map<DeepPartial<TransferRequestPhoto>>((p) => ({
        url: p.url,
        transferRequestId: id,
      })),
      user,
      queryRunner,
    );

    const transferRequestProducts = await this.transferRequestProductDAO.createManyWithTx(
      productDetails!.map((pd) => ({ ...pd, transferRequestId: id })),
      user,
      queryRunner,
    );

    return {
      transferRequestExisting,
      transferRequestUpdated,
      transferRequestProducts,
      transferRequestPhotos: transferRequestPhotos.map((trp) => ({
        id: trp.id,
        url: trp.url,
      })),
      route,
    };
  }

  async markProductsAsReturned(
    params: { transferRequestId: string },
    data: UpdateTransferRequestProductBody,
    user: RequestUser,
    queryRunner: QueryRunner,
  ) {
    const transferRequest = this.dao.getOneWithTx(
      {
        where: {
          id: params.transferRequestId,
        },
        select: {
          id: true,
        },
      },
      queryRunner,
    );

    if (!transferRequest) {
      throw ERR_TRANSFER_REQUEST_NOT_FOUND(`ID: ${params.transferRequestId}`);
    }

    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const updatedProducts = await this.transferRequestProductDAO.updateManyWithTx(
      {
        transferRequestId: params.transferRequestId,
        productCode: In(data.details.map((d) => d.productCode)),
      },
      { returnedDate: now },
      user,
      queryRunner,
    );

    return updatedProducts;
  }

  async deleteTransferRequest(
    id: string,
    data: UpdateTransferRequestBody,
    queryRunner: QueryRunner,
  ) {
    const oldTransferRequestWithProducts = await this.dao.getOneWithTx(
      {
        where: { id },
        relations: { transferRequestProducts: true },
      },
      queryRunner,
    );

    if (!oldTransferRequestWithProducts) {
      throw ERR_TRANSFER_REQUEST_NOT_FOUND(`id: ${id}`);
    }

    if (oldTransferRequestWithProducts.isApproved) {
      throw ERR_TRANSFER_REQUEST_ALREADY_APPROVED();
    }

    const { route } = await this.validateTransferRequestDestination(data);

    await Promise.all([
      this.transferRequestProductDAO.deleteManyWithTx(
        {
          transferRequestId: id,
        },
        queryRunner,
      ),
      this.transferRequestPhotoDAO.deleteManyWithTx(
        {
          transferRequestId: id,
        },
        queryRunner,
      ),
    ]);

    return {
      transferRequesWithProductstDeleted: oldTransferRequestWithProducts,
      route,
    };
  }

  private async validateTransferRequestDestination(
    data: CreateTransferRequestBody | UpdateTransferRequestBody,
  ): Promise<ValidTransferRequestInfo> {
    const type = data.type ? data.type : 'pakan';

    const route = data.route || 'COOP-TO-COOP';

    let coopSourceId: string | null = null;

    let coopTargetId: string | null = null;

    let farmingCycleTargetId: string | null = null;

    let branchSourceId: string | null = null;

    let branchTargetId: string | null = null;

    if (data.route === 'COOP-TO-COOP') {
      if (!data.coopSourceId || !data.coopTargetId) {
        throw ERR_BAD_REQUEST(
          `for route ${data.route}`,
          'coopSourceId and coopTargetId are required!',
        );
      }
      coopSourceId = data.coopSourceId;

      coopTargetId = data.coopTargetId;

      const coopTarget = await this.coopDAO.getOneStrict({
        where: {
          id: data.coopTargetId,
        },
      });

      if (!coopTarget.activeFarmingCycleId) {
        throw ERR_BAD_REQUEST(`kandang ${coopTarget.coopName} tidak memiliki farming cycle aktif!`);
      }

      farmingCycleTargetId = coopTarget.activeFarmingCycleId;
    } else if (data.route === 'COOP-TO-BRANCH') {
      if (!data.coopSourceId) {
        throw ERR_BAD_REQUEST(`for route ${data.route}`, 'coopSourceId is required!');
      }

      const coopSource = await this.coopDAO.getOneStrict({
        where: {
          id: data.coopSourceId,
        },
        relations: {
          farm: true,
          contract: true,
        },
      });

      coopSourceId = data.coopSourceId;

      if (!coopSource.contract.branchId && !coopSource.farm.branchId) {
        throw ERR_BAD_REQUEST('coop branch is not set properly!');
      }

      branchTargetId = coopSource.contract.branchId || coopSource.farm.branchId;
    } else if (data.route === 'BRANCH-TO-COOP') {
      if (!data.coopTargetId) {
        throw ERR_BAD_REQUEST(`for route ${data.route}`, 'coopTargetId is required!');
      }

      const coopTarget = await this.coopDAO.getOneStrict({
        where: {
          id: data.coopTargetId,
        },
        relations: {
          farm: true,
          contract: true,
        },
      });

      coopTargetId = data.coopTargetId;

      if (!coopTarget.contract.branchId && !coopTarget.farm.branchId) {
        throw ERR_BAD_REQUEST(
          'kandang tidak memiliki kontrak atau peternakan tidak memiliki cabang!',
        );
      }

      branchSourceId = coopTarget.contract.branchId || coopTarget.farm.branchId;

      if (!coopTarget.activeFarmingCycleId && !data.farmingCycleId) {
        throw ERR_BAD_REQUEST(`kandang ${coopTarget.coopName} belum mulai siklus!`);
      }

      farmingCycleTargetId = coopTarget.activeFarmingCycleId || data.farmingCycleId;
    } else {
      if (!data.coopSourceId || !data.coopTargetId) {
        throw ERR_BAD_REQUEST('coopSourceId and coopTargetId are required!');
      }
      coopSourceId = data.coopSourceId;

      coopTargetId = data.coopTargetId;

      const coopTarget = await this.coopDAO.getOneStrict({
        where: {
          id: data.coopTargetId,
        },
      });

      farmingCycleTargetId = coopTarget.activeFarmingCycleId;
    }

    const details =
      !data.details || !data.details.length
        ? null
        : await Promise.all(
            (data.details || []).map(async (pd) => {
              let { productCode } = pd;

              if (type === 'pakan' && route !== 'BRANCH-TO-COOP') {
                const summary = await this.farmingCycleFeedStockSummaryDAO.getOne({
                  where: {
                    farmingCycleId: data.farmingCycleId,
                    productCode: pd.productCode || 'PREVENT EMPTY CODE',
                  },
                });

                if (!summary) {
                  throw ERR_TRANSFER_REQUEST_INVALID_PRODUCT(pd.productCode || '', pd.productName);
                }

                const remainingQty = summary.remainingQuantity - summary.bookedQuantity;

                const availableQty = remainingQty < 0 ? 0 : remainingQty;

                if (availableQty < pd.quantity) {
                  throw ERR_TRANSFER_REQUEST_QTY_EXCEED_STOCK(
                    `\n${summary.productCode} - ${pd.productName} (${pd.quantity})`,
                    `\ntersedia ${summary.remainingQuantity} karung`,
                  );
                } else {
                  productCode = summary.productCode;

                  return {
                    categoryCode: type.toUpperCase(),
                    categoryName: type.toUpperCase(),
                    subcategoryCode: pd.subcategoryCode || type.toUpperCase(),
                    subcategoryName: pd.subcategoryName || type.toUpperCase(),
                    productCode,
                    productName: summary.productName,
                    quantity: pd.quantity,
                    uom: pd.uom || '',
                  };
                }
              }

              if (type === 'ovk' && route !== 'BRANCH-TO-COOP') {
                const summary = await this.farmingCycleOvkStockSummaryDAO.getOne({
                  where: {
                    farmingCycleId: data.farmingCycleId,
                    productCode: pd.productCode || 'PREVENT EMPTY CODE',
                  },
                });

                if (!summary) {
                  throw ERR_TRANSFER_REQUEST_INVALID_PRODUCT(pd.productCode || '', pd.productName);
                }

                const remainingQty = summary.remainingQuantity - summary.bookedQuantity;

                const availableQty = remainingQty < 0 ? 0 : remainingQty;

                if (availableQty < pd.quantity) {
                  throw ERR_TRANSFER_REQUEST_QTY_EXCEED_STOCK(
                    `\n${summary.productCode} - ${pd.productName} (${pd.quantity})`,
                    `\ntersedia ${summary.remainingQuantity} buah`,
                  );
                } else {
                  productCode = summary.productCode;

                  return {
                    categoryCode: type.toUpperCase(),
                    categoryName: type.toUpperCase(),
                    subcategoryCode: pd.subcategoryCode || type.toUpperCase(),
                    subcategoryName: pd.subcategoryName || type.toUpperCase(),
                    productCode,
                    productName: summary.productName,
                    quantity: pd.quantity,
                    uom: pd.uom || '',
                  };
                }
              }

              if (route === 'BRANCH-TO-COOP') {
                const summary = await this.branchSapronakStockSummaryDAO.getOne({
                  where: {
                    branchId: branchSourceId!,
                    productCode: pd.productCode || 'PREVENT EMPTY CODE',
                  },
                });

                if (!summary) {
                  throw ERR_TRANSFER_REQUEST_INVALID_PRODUCT(pd.productCode || '', pd.productName);
                }

                const remainingQty = summary.quantity - summary.bookedQuantity;

                const availableQty = remainingQty < 0 ? 0 : remainingQty;

                if (availableQty < pd.quantity) {
                  throw ERR_TRANSFER_REQUEST_QTY_EXCEED_STOCK(
                    `\n${summary.productCode} - ${pd.productName} (${pd.quantity})`,
                    `\ntersedia ${availableQty} buah`,
                  );
                } else {
                  productCode = summary.productCode;

                  return {
                    categoryCode: type.toUpperCase(),
                    categoryName: type.toUpperCase(),
                    subcategoryCode: pd.subcategoryCode || type.toUpperCase(),
                    subcategoryName: pd.subcategoryName || type.toUpperCase(),
                    productCode,
                    productName: summary.productName,
                    quantity: pd.quantity,
                    uom: pd.uom || '',
                  };
                }
              }

              return {
                categoryCode: type.toUpperCase(),
                categoryName: type.toUpperCase(),
                subcategoryCode: pd.subcategoryCode || type.toUpperCase(),
                subcategoryName: pd.subcategoryName || type.toUpperCase(),
                productCode,
                productName: pd.productName,
                quantity: pd.quantity,
                uom: pd.uom,
              };
            }),
          );

    return {
      coopSourceId,
      coopTargetId,
      farmingCycleTargetId,
      branchSourceId,
      branchTargetId,
      route,
      details,
    };
  }

  // eslint-disable-next-line class-methods-use-this
  static transferRequestDescription(trp: TransferRequestProduct[]): string {
    if (!trp.length) return '';

    let text = trp[0].productName || trp[0].subcategoryName;

    if (trp.length > 1) {
      text += ` dan ${trp.length - 1} lainnya`;
    }

    return text;
  }

  // eslint-disable-next-line class-methods-use-this
  static transferRequestStatus(tr: TransferRequest): TransferRequestStatus {
    if (tr.cancellationRequestBy) {
      return { number: 3, text: 'Dibatalkan' };
    }

    if (!tr.isApproved && !tr.approvedBy) {
      return { number: 0, text: 'Pengajuan' };
    }

    if (tr.isApproved && !tr.goodsReceipts.length) {
      return { number: 0, text: 'Dikirim' };
    }

    if (tr.isApproved && tr.goodsReceipts.length) {
      return { number: 2, text: 'Diterima' };
    }

    if (!tr.isApproved && tr.approvedBy) {
      return { number: 3, text: 'Ditolak' };
    }

    throw ERR_TRANSFER_REQUEST_MALFORMED(tr.id);
  }
}
