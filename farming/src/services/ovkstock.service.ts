import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { Inject, Service } from 'fastify-decorators';
import { FarmingCycleOvkStockAdjustmentDAO } from '../dao/farmingCycleOvkStockAdjustment.dao';
import { FarmingCycleOvkStockLogDAO } from '../dao/farmingCycleOvkStockLog.dao';
import { FarmingCycleOvkStockSummaryDAO } from '../dao/farmingCycleOvkStockSummary.dao';
import { OvkStockAdjustmentTypeEnum } from '../datasources/entity/pgsql/FarmingCycleOvkStockAdjustment.entity';
import { OvkStockOperatorEnum } from '../datasources/entity/pgsql/FarmingCycleOvkStockLog.entity';
import {
  GetFeedStockSummaryGroupByTypeResponseItem,
  GetFeedStockSummaryParams,
} from '../dto/feedstock.dto';
import {
  CreateOvkStockAdjustmentBody,
  CreateOvkStockAdjustmentParams,
  CreateOvkStockAdjustmentResponseList,
  CreateOvkStockClosingAdjustmentBody,
  GetOvkStockSummaryParams,
  GetOvkStockSummaryQuery,
  OvkStockSummaryItem,
  OvkStockSummaryResponseList,
} from '../dto/ovkstock.dto';
import { OvkStockAdjustmentCreatedQueue } from '../jobs/queues/ovk-stock-adjustment-created.queue';
import { CONTRACT_TYPE, DATE_TIME_FORMAT_SLASH, DEFAULT_TIME_ZONE } from '../libs/constants';
import {
  ERR_OVK_ADJUSTMENT_QUANTITY_MISMATCH,
  ERR_OVK_STOCK_ADJUSTMENT_CANNOT_BE_DONE,
} from '../libs/constants/errors';
import { TASK_LAPORAN_AKHIR_HARI } from '../libs/constants/taskCodes';
import { RequestUser } from '../libs/types/index.d';
import { FarmingCycleService } from './farmingCycle.service';

@Service()
export class OvkStockService {
  @Inject(FarmingCycleService)
  farmingCycleService: FarmingCycleService;

  @Inject(FarmingCycleOvkStockSummaryDAO)
  stockSummaryDAO!: FarmingCycleOvkStockSummaryDAO;

  @Inject(FarmingCycleOvkStockAdjustmentDAO)
  stockAdjustmentDAO!: FarmingCycleOvkStockAdjustmentDAO;

  @Inject(FarmingCycleOvkStockLogDAO)
  ovkStockLogDAO!: FarmingCycleOvkStockLogDAO;

  @Inject(OvkStockAdjustmentCreatedQueue)
  adjustmentCreatedQueue: OvkStockAdjustmentCreatedQueue;

  async getSummaries(
    params: GetOvkStockSummaryParams,
    query: GetOvkStockSummaryQuery,
  ): Promise<OvkStockSummaryResponseList> {
    const [summaries] = await this.stockSummaryDAO.getMany({
      where: {
        farmingCycleId: params.farmingCycleId,
        ...(query.subcategoryCode && {
          subcategoryCode: query.subcategoryCode,
        }),
        ...(query.subcategoryName && {
          subcategoryCode: query.subcategoryCode,
        }),
        ...(query.productCode && {
          subcategoryCode: query.subcategoryCode,
        }),
        ...(query.productName && {
          subcategoryCode: query.subcategoryCode,
        }),
      },
      order: {
        productName: 'ASC',
      },
    });

    const [logs] = await this.ovkStockLogDAO.getMany({
      where: {
        farmingCycleId: params.farmingCycleId,
      },
      relations: {
        taskTicket: {
          farmingCycleTask: true,
        },
      },
    });

    const farmingCycle = await this.farmingCycleService.getFarmingCycleById(params.farmingCycleId);

    const details = summaries.map((item) => ({
      ...item,
      used: 0,
      transfer: 0,
      in: 0,
    }));

    const detailsMappedByProductCode = details.reduce((prev, item) => {
      prev.set(item.productCode, item);
      return prev;
    }, new Map<string, OvkStockSummaryItem>());

    logs.forEach((item) => {
      if (detailsMappedByProductCode.has(item.productCode)) {
        if (item.operator === '-' && item.notes.includes('tr_id')) {
          detailsMappedByProductCode.get(item.productCode)!.transfer += item.quantity;
        } else if (
          item.operator === '-' &&
          (item.taskTicket?.farmingCycleTask?.taskCode === TASK_LAPORAN_AKHIR_HARI ||
            item.notes.includes('ovk_stock_minus - fc_ovkstock_summary_id:'))
        ) {
          detailsMappedByProductCode.get(item.productCode)!.used += item.quantity;
        } else if (item.operator === '+') {
          detailsMappedByProductCode.get(item.productCode)!.in += item.quantity;
        }
      }
    });

    return details.map((item) => {
      const stock = item;
      if (
        (farmingCycle.contractType &&
          farmingCycle.contractType.contractName !== CONTRACT_TYPE.OWN_FARM) ||
        (!farmingCycle.contractType && farmingCycle.contract?.id !== CONTRACT_TYPE.OWN_FARM)
      ) {
        stock.used = stock.in;
        stock.transfer = 0;
        stock.remainingQuantity = 0;
      }

      stock.purchaseUom = item.uom;

      return stock;
    });
  }

  async getSummariesGroupBySubcategory(
    params: GetFeedStockSummaryParams,
  ): Promise<GetFeedStockSummaryGroupByTypeResponseItem> {
    const summaries = await this.stockSummaryDAO.getManyGroupBySubcategory(params.farmingCycleId);

    return {
      date: format(utcToZonedTime(new Date(), DEFAULT_TIME_ZONE), DATE_TIME_FORMAT_SLASH),
      summaries: summaries.map((s) => ({
        ...s,
        purchaseUom: s.uom,
        remainingQuantity: s.remainingQuantity - s.bookedQuantity,
      })),
    };
  }

  async getSummaryByFarmingCycle(
    params: GetFeedStockSummaryParams,
  ): Promise<GetFeedStockSummaryGroupByTypeResponseItem> {
    const summary = await this.stockSummaryDAO.getTotalRemainingByFarmingCycleId(
      params.farmingCycleId,
    );

    return {
      date: format(utcToZonedTime(new Date(), DEFAULT_TIME_ZONE), DATE_TIME_FORMAT_SLASH),
      summaries: summary
        ? [
            {
              ...summary,
              subcategoryCode: '',
              remainingQuantity: summary.remainingQuantity - summary.bookedQuantity,
            },
          ]
        : [],
    };
  }

  async createAdjustments(
    params: CreateOvkStockAdjustmentParams,
    body: CreateOvkStockAdjustmentBody,
    user: RequestUser,
    isClosing = false,
  ): Promise<CreateOvkStockAdjustmentResponseList> {
    const queryRunner = await this.stockAdjustmentDAO.startTransaction();

    try {
      const results = await body.reduce<Promise<CreateOvkStockAdjustmentResponseList>>(
        async (prev, current) => {
          const previousResults = await prev;

          const [summary, [consumptions]] = await Promise.all([
            this.stockSummaryDAO.getOneStrict({
              where: {
                id: current.ovkStockSummaryId,
              },
            }),
            this.ovkStockLogDAO.getMany({
              where: {
                notes: `ovk_stock_minus - fc_ovkstock_summary_id:${current.ovkStockSummaryId}`,
              },
            }),
          ]);

          const {
            subcategoryCode,
            subcategoryName,
            productCode,
            productName,
            remainingQuantity,
            bookedQuantity,
            farmingCycleId,
          } = summary;

          let { adjustmentQuantity } = current;

          let operator = OvkStockOperatorEnum.PLUS;

          if (current.type === OvkStockAdjustmentTypeEnum.Pengurangan) {
            if (remainingQuantity - bookedQuantity <= 0) {
              throw ERR_OVK_STOCK_ADJUSTMENT_CANNOT_BE_DONE(
                `untuk OVK ${productName}`,
                `karena stok saat ini: ${remainingQuantity - bookedQuantity} karung`,
              );
            }

            adjustmentQuantity *= -1;

            operator = OvkStockOperatorEnum.MINUS;
          }

          const totalConsumption = consumptions.reduce(
            (total, feedStock) => total + Number(feedStock.quantity),
            0,
          );

          if (current.adjustmentQuantity > totalConsumption && !isClosing) {
            throw ERR_OVK_STOCK_ADJUSTMENT_CANNOT_BE_DONE(
              `untuk OVK ${productName}`,
              `karena melebihi total penggunaan (${totalConsumption})`,
            );
          }

          const adjustment = await this.stockAdjustmentDAO.createOneWithTx(
            {
              ...current,
              ...params,
            },
            user,
            queryRunner,
          );

          await this.stockSummaryDAO.incrementRemainingQuantityWithTx(
            {
              id: current.ovkStockSummaryId,
            },
            adjustmentQuantity,
            user,
            queryRunner,
          );

          await this.ovkStockLogDAO.createOneWithTx(
            {
              subcategoryCode,
              subcategoryName,
              productCode,
              productName,
              farmingCycleId,
              operator,
              quantity: current.adjustmentQuantity,
              notes: `ovk-stock-adjustment:${summary.farmingCycleId}`,
            },
            user,
            queryRunner,
          );

          return [...previousResults, adjustment];
        },
        Promise.resolve([] as CreateOvkStockAdjustmentResponseList),
      );

      await this.stockAdjustmentDAO.commitTransaction(queryRunner);

      await this.adjustmentCreatedQueue.addJob(results);

      return results;
    } catch (error) {
      await this.stockAdjustmentDAO.rollbackTransaction(queryRunner);

      throw error;
    }
  }

  async createClosingAdjustment(
    params: CreateOvkStockAdjustmentParams,
    body: CreateOvkStockClosingAdjustmentBody,
    user: RequestUser,
  ): Promise<CreateOvkStockClosingAdjustmentBody> {
    const currentStock = await this.stockSummaryDAO.getTotalRemainingByFarmingCycleId(
      params.farmingCycleId,
    );

    if (!currentStock) {
      if (body.value !== 0) {
        throw ERR_OVK_ADJUSTMENT_QUANTITY_MISMATCH();
      } else {
        return body;
      }
    }

    if (currentStock) {
      if (currentStock.remainingQuantity !== body.value) {
        throw ERR_OVK_ADJUSTMENT_QUANTITY_MISMATCH();
      } else if (currentStock.remainingQuantity === 0 && body.value === 0) {
        return body;
      }
    }

    const [stockSummaries] = await this.stockSummaryDAO.getMany({
      where: {
        farmingCycleId: params.farmingCycleId,
      },
    });

    const adjusmentBody = stockSummaries.map((stockSummary) => ({
      ovkStockSummaryId: stockSummary.id,
      adjustmentQuantity: stockSummary.remainingQuantity,
      type: OvkStockAdjustmentTypeEnum.Pengurangan,
      remarks: body.remarks,
    }));

    await this.createAdjustments(params, adjusmentBody, user, true);

    return body;
  }

  async getClosingAdjustment(
    params: CreateOvkStockAdjustmentParams,
  ): Promise<CreateOvkStockClosingAdjustmentBody> {
    const totalAdjustment = await this.stockAdjustmentDAO.totalMinusAdjustment(
      params.farmingCycleId,
    );

    const adjustment = await this.stockAdjustmentDAO.getOne({
      where: {
        farmingCycleId: params.farmingCycleId,
      },
    });

    return {
      value: totalAdjustment || 0,
      remarks: adjustment?.remarks || '',
    };
  }
}
