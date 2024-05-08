import { differenceInCalendarDays, format, isAfter } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { Inject, Service } from 'fastify-decorators';
import { DeepPartial, ILike, IsNull, LessThanOrEqual, Not, Raw } from 'typeorm';
import { CoopDAO } from '../dao/coop.dao';
import { DailyMonitoringDAO } from '../dao/dailyMonitoring.dao';
import { FarmingCycleDAO } from '../dao/farmingCycle.dao';
import { FarmingCycleChickStockDDAO } from '../dao/farmingCycleChickStockD.dao';
import { FarmingCycleFeedStockDDAO } from '../dao/farmingCycleFeedStockD.dao';
import { FarmingCycleOvkStockAdjustmentDAO } from '../dao/farmingCycleOvkStockAdjustment.dao';
import { FarmingCycleOvkStockLogDAO } from '../dao/farmingCycleOvkStockLog.dao';
import { HarvestRealizationDAO } from '../dao/harvestRealization.dao';
import { PurchaseOrderDAO } from '../dao/purchaseOrder.dao';
import { TargetDAO } from '../dao/target.dao';
import { TargetDaysDDAO } from '../dao/targetDaysD.dao';
import { TransferRequestDAO } from '../dao/transferRequest.dao';
import { VariableDAO } from '../dao/variable.dao';
import { FarmChickCategory } from '../datasources/entity/pgsql/Farm.entity';
import { FarmingCycle } from '../datasources/entity/pgsql/FarmingCycle.entity';
import { FarmingCycleChickStockD } from '../datasources/entity/pgsql/FarmingCycleChickStockD.entity';
import { FarmingCycleFeedStockD } from '../datasources/entity/pgsql/FarmingCycleFeedStockD.entity';
import { RealizationStatusEnum } from '../datasources/entity/pgsql/HarvestRealization.entity';
import {
  ClosingResponseItem,
  FeedAdjustmentItem,
  FeedLeftoverItem,
  MortalityAdjustmentBody,
  MortalityAdjustmentItem,
} from '../dto/closing.dto';
import { FarmingCycleClosedQueue } from '../jobs/queues/farming-cycle-closed.queue';
import {
  CLOSING_NOTES_PATTERN,
  DATE_SQL_FORMAT,
  DEFAULT_TIME_ZONE,
  FC_CYCLE_STATUS,
  FC_FARMING_STATUS,
  FEED_STOCK_NOTES,
  OVK_STOCK_NOTES,
} from '../libs/constants';
import {
  ERR_CLOSE_FC_FAILED_FEED_LEFTOVER,
  ERR_CLOSE_FC_FAILED_PO_UNFULFILLED,
  ERR_FEED_ADJUSTMENT_FAILED_1,
  ERR_FEED_ADJUSTMENT_FAILED_2,
  ERR_MORTALITY_ADJUSTMENT_FAILED_1,
  ERR_MORTALITY_ADJUSTMENT_FAILED_2,
} from '../libs/constants/errors';
import { VAR_FCR_TARGET_CODE } from '../libs/constants/variableCodes';
import { RequestUser } from '../libs/types/index.d';
import { roundToN, uomConverter } from '../libs/utils/helpers';

@Service()
export class ClosingService {
  @Inject(CoopDAO)
  private coopDAO: CoopDAO;

  @Inject(DailyMonitoringDAO)
  private dailyMonitoringDAO: DailyMonitoringDAO;

  @Inject(FarmingCycleDAO)
  private farmingCycleDAO: FarmingCycleDAO;

  @Inject(FarmingCycleChickStockDDAO)
  private farmingCycleChickStockDDAO: FarmingCycleChickStockDDAO;

  @Inject(FarmingCycleFeedStockDDAO)
  private farmingCycleFeedStockDDAO: FarmingCycleFeedStockDDAO;

  @Inject(FarmingCycleClosedQueue)
  private farmingCycleClosedQueue: FarmingCycleClosedQueue;

  @Inject(HarvestRealizationDAO)
  private harvestRealizationDAO: HarvestRealizationDAO;

  @Inject(TransferRequestDAO)
  private transferRequestDAO: TransferRequestDAO;

  @Inject(FarmingCycleOvkStockLogDAO)
  private farmingCycleOvkStockLogDAO: FarmingCycleOvkStockLogDAO;

  @Inject(FarmingCycleOvkStockAdjustmentDAO)
  private farmingCycleOvkStockAdjustmentDAO: FarmingCycleOvkStockAdjustmentDAO;

  @Inject(PurchaseOrderDAO)
  private purchaseOrderDAO: PurchaseOrderDAO;

  @Inject(VariableDAO)
  private variableDAO!: VariableDAO;

  @Inject(TargetDAO)
  private targetDAO!: TargetDAO;

  @Inject(TargetDaysDDAO)
  private targetDaysDDAO!: TargetDaysDDAO;

  async setMortalityAdjustment(
    farmingCycleId: string,
    input: MortalityAdjustmentBody,
    user: RequestUser,
  ) {
    const [existingAdjustment, remainingPopulation, farmingCycle] = await Promise.all([
      this.getExistingAdjustment(farmingCycleId),
      this.getRemainingPopulation(farmingCycleId),
      this.farmingCycleDAO.getOneById(farmingCycleId),
    ]);

    // margin of error up to 2% of initial population
    const margin = farmingCycle.initialPopulation * 0.02;

    const inputThreshold = margin + remainingPopulation;
    if (input.value > inputThreshold) {
      throw ERR_MORTALITY_ADJUSTMENT_FAILED_1(
        `Penyesuain tidak boleh melebihi ${inputThreshold} ekor`,
      );
    }
    const qr = await this.farmingCycleChickStockDDAO.startTransaction();

    try {
      await this.farmingCycleChickStockDDAO.upsertOneWithTx(
        {
          id: existingAdjustment?.id,
          farmingCycleId,
          notes: ILike(CLOSING_NOTES_PATTERN),
        },
        {
          farmingCycleId,
          notes: CLOSING_NOTES_PATTERN.replace('%', input.remarks),
          operator: '-',
          qty: input.value,
          transactionDate:
            existingAdjustment?.transactionDate || utcToZonedTime(new Date(), DEFAULT_TIME_ZONE),
          userId: existingAdjustment?.userId || user.id,
        },
        user,
        qr,
      );

      await this.farmingCycleChickStockDDAO.commitTransaction(qr);
    } catch (error) {
      await this.farmingCycleChickStockDDAO.rollbackTransaction(qr);
      throw ERR_MORTALITY_ADJUSTMENT_FAILED_2(error);
    }
  }

  async getMortalityAdjustment(farmingCycleId: string): Promise<MortalityAdjustmentItem> {
    const existingAdjustment = await this.getExistingAdjustment(farmingCycleId);

    return {
      value: existingAdjustment?.qty || 0,
      remarks: existingAdjustment?.notes.replace(CLOSING_NOTES_PATTERN.replace('%', ''), '') || '',
    };
  }

  async getRemainingPopulation(farmingCycleId: string): Promise<number> {
    return this.dailyMonitoringDAO.getRemainingPopulation(farmingCycleId);
  }

  async getPopulationMargin(farmingCycleId: string): Promise<number> {
    const farmingcycle = await this.farmingCycleDAO.getOneById(farmingCycleId);
    return 0.02 * farmingcycle.initialPopulation;
  }

  async getFeedLeftover(farmingCycleId: string): Promise<FeedLeftoverItem> {
    // assume all have the same uom
    const [
      received,
      consumed,
      consumedSummary,
      adjustment,
      adjustmentMinus,
      adjustmentPlus,
      transferRequestDeliveredSack,
      transferRequestNotDeliveredYetSack,
    ] = await Promise.all([
      this.farmingCycleFeedStockDDAO.totalAddition(farmingCycleId),
      this.farmingCycleFeedStockDDAO.totalConsumption(farmingCycleId, {
        notes: {
          operator: '=',
          value: FEED_STOCK_NOTES.MINUS,
        },
      }),
      this.farmingCycleFeedStockDDAO.totalConsumption(farmingCycleId, {
        notes: {
          operator: 'like',
          value: FEED_STOCK_NOTES.MINUS_SUMMARY,
        },
      }),
      this.getExistingFeedAdjustment(farmingCycleId),
      this.farmingCycleFeedStockDDAO.totalMinusAdjustment(farmingCycleId),
      this.farmingCycleFeedStockDDAO.totalPlusAdjustment(farmingCycleId),
      this.transferRequestDAO.totalQuantity(farmingCycleId, {
        isDelivered: true,
        source: 'gr',
        isApproved: true,
      }),
      this.transferRequestDAO.totalQuantity(farmingCycleId, {
        isDelivered: false,
        isCancelled: false,
        isApproved: true,
      }),
    ]);

    const [
      receivedQtySack,
      consumedQtySack,
      consumedSummaryQtySack,
      adjustmentMinusQtySack,
      adjustmentPlusQtySack,
    ] = [
      uomConverter(received.totalQty, received.uom, 'karung'),
      uomConverter(consumed.totalQty, consumed.uom, 'karung'),
      uomConverter(consumedSummary.totalQty, consumedSummary.uom, 'karung'),
      uomConverter(adjustmentMinus.totalQty, adjustmentMinus.uom, 'karung'),
      uomConverter(adjustmentPlus.totalQty, adjustmentPlus.uom, 'karung'),
    ];

    const adjusted = adjustment?.qty || 0;
    const leftoverInCoop = parseFloat(
      (
        (receivedQtySack -
          consumedQtySack -
          consumedSummaryQtySack -
          transferRequestDeliveredSack) *
        1.0
      ).toFixed(2),
    );
    const leftoverTotal = parseFloat(
      (
        (leftoverInCoop -
          adjusted +
          adjustmentPlusQtySack -
          adjustmentMinusQtySack -
          transferRequestNotDeliveredYetSack) *
        1.0
      ).toFixed(2),
    );

    return {
      received: receivedQtySack,
      consumed: consumedQtySack + consumedSummaryQtySack,
      transfer: {
        delivered: transferRequestDeliveredSack,
        notDeliveredYet: transferRequestNotDeliveredYetSack,
      },
      adjusted: Math.abs(adjusted + (adjustmentPlusQtySack - adjustmentMinusQtySack)),
      adjustment: {
        plus: adjustmentPlusQtySack,
        minus: adjustmentMinusQtySack,
      },
      leftoverInCoop,
      leftoverTotal,
    };
  }

  async getOvkLeftover(farmingCycleId: string): Promise<FeedLeftoverItem> {
    const [
      received,
      consumed,
      adjustmentMinus,
      adjustmentPlus,
      transferRequestDelivered,
      transferRequestNotDeliveredYet,
    ] = await Promise.all([
      this.farmingCycleOvkStockLogDAO.totalAddition(farmingCycleId),
      this.farmingCycleOvkStockLogDAO.totalConsumption(farmingCycleId, {
        notes: {
          operator: 'like',
          value: OVK_STOCK_NOTES.MINUS,
        },
      }),
      this.farmingCycleOvkStockAdjustmentDAO.totalMinusAdjustment(farmingCycleId),
      this.farmingCycleOvkStockAdjustmentDAO.totalPlusAdjustment(farmingCycleId),
      this.transferRequestDAO.totalQuantity(farmingCycleId, {
        isDelivered: true,
        source: 'gr',
        type: 'ovk',
      }),
      this.transferRequestDAO.totalQuantity(farmingCycleId, {
        isDelivered: false,
        isCancelled: false,
        type: 'ovk',
      }),
    ]);

    const adjusted = Math.abs(adjustmentPlus - adjustmentMinus);
    const leftoverInCoop = parseFloat(
      ((received - consumed - transferRequestDelivered) * 1.0).toFixed(2),
    );
    const leftoverTotal = parseFloat(
      ((leftoverInCoop - adjusted - transferRequestNotDeliveredYet) * 1.0).toFixed(2),
    );

    return {
      received,
      consumed,
      transfer: {
        delivered: transferRequestDelivered,
        notDeliveredYet: transferRequestNotDeliveredYet,
      },
      adjusted,
      adjustment: {
        plus: adjustmentPlus,
        minus: adjustmentMinus,
      },
      leftoverInCoop,
      leftoverTotal,
    };
  }

  async setFeedAdjustment(farmingCycleId: string, input: FeedAdjustmentItem, user: RequestUser) {
    const existingAdjustment = await this.getExistingFeedAdjustment(farmingCycleId);
    const feedLeftover = await this.getFeedLeftover(farmingCycleId);

    if (input.value > feedLeftover.leftoverTotal + feedLeftover.adjusted) {
      throw ERR_FEED_ADJUSTMENT_FAILED_1('current feed stock is:', feedLeftover.leftoverTotal);
    }

    const qr = await this.farmingCycleFeedStockDDAO.startTransaction();

    try {
      let uom = existingAdjustment?.uom || null;
      if (!uom) {
        const { farm } = await this.farmingCycleDAO.getOneStrict({
          where: { farmingCycleId },
          relations: { farm: true },
          select: { farm: { category: true } },
        });
        uom = farm.category === FarmChickCategory.LAYER ? 'kilogram' : 'karung';
      }

      // for layer it is assumed the qty received is already in kilogram
      await this.farmingCycleFeedStockDDAO.upsertOneWithTx(
        {
          id: existingAdjustment?.id,
          farmingCycleId,
          notes: ILike(FEED_STOCK_NOTES.CLOSING_ADJUSTMENT),
        },
        {
          farmingCycleId,
          notes: FEED_STOCK_NOTES.CLOSING_ADJUSTMENT.replace('%', input.remarks),
          operator: '-',
          qty: input.value,
          userId: existingAdjustment?.userId || user.id,
          uom,
        },
        user,
        qr,
      );

      await this.farmingCycleFeedStockDDAO.commitTransaction(qr);
    } catch (error) {
      await this.farmingCycleFeedStockDDAO.rollbackTransaction(qr);
      throw ERR_FEED_ADJUSTMENT_FAILED_2(error);
    }
  }

  async getFeedAdjustment(farmingCycleId: string): Promise<FeedAdjustmentItem> {
    const existingAdjustment = await this.getExistingFeedAdjustment(farmingCycleId);

    return {
      value: existingAdjustment?.qty || 0,
      remarks:
        existingAdjustment?.notes.replace(
          FEED_STOCK_NOTES.CLOSING_ADJUSTMENT.replace('%', ''),
          '',
        ) || '',
    };
  }

  async closeFarmingcycle(farmingCycleId: string, user: RequestUser): Promise<ClosingResponseItem> {
    const [harvestRealizations] = await this.harvestRealizationDAO.getMany({
      where: {
        farmingCycleId,
      },
      order: {
        harvestDate: 'DESC',
      },
    });

    const latestHarvestRealization =
      (harvestRealizations.length > 0 && harvestRealizations[harvestRealizations.length - 1]) ||
      undefined;

    const closedDate =
      (latestHarvestRealization && new Date(latestHarvestRealization.harvestDate)) ||
      utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const [[unfulfilledPurchaseOrders], feedLeftover, latestDailyMonitoring] = await Promise.all([
      this.purchaseOrderDAO.getMany({
        where: {
          farmingCycleId,
          isApproved: true,
          isDoc: false,
          isFulfilled: Raw((alias) => `(${alias} is null OR ${alias} = 0)`),
        },
      }),
      this.getFeedLeftover(farmingCycleId),
      this.dailyMonitoringDAO.getOne({
        where: {
          farmingCycleId,
          bw: Not(IsNull()),
          date: LessThanOrEqual(format(new Date(closedDate), DATE_SQL_FORMAT)),
        },
        order: {
          day: 'DESC',
        },
      }),
    ]);

    const qr = await this.farmingCycleDAO.startTransaction();

    try {
      if (unfulfilledPurchaseOrders.length) {
        throw ERR_CLOSE_FC_FAILED_PO_UNFULFILLED(
          `\n- ${unfulfilledPurchaseOrders.map((po) => po.erpCode || po.id).join('\n- ')}`,
          '\nSegera lengkapi penerimaan atau hubungi admin bila terjadi ketidaksesuaian.',
        );
      }

      if (feedLeftover.leftoverTotal !== 0) {
        throw ERR_CLOSE_FC_FAILED_FEED_LEFTOVER(
          '\nJumlah pakan saat ini tersisa:',
          feedLeftover.leftoverTotal,
        );
      }

      const farmingCycle = await this.farmingCycleDAO.updateOneWithTx(
        {
          id: farmingCycleId,
        },
        {
          closedDate,
          cycleStatus: FC_CYCLE_STATUS.INACTIVE,
          farmingStatus: FC_FARMING_STATUS.CLOSED,
        },
        user,
        qr,
      );

      await this.coopDAO.closeFarmingCycleWithTx(farmingCycle.coopId, qr);

      await this.farmingCycleDAO.commitTransaction(qr);

      await this.farmingCycleClosedQueue.addJob(farmingCycle);

      return {
        harvested: harvestRealizations.reduce((prev, item) => prev + item.quantity, 0),
        mortaled: latestDailyMonitoring?.populationMortaled || 0,
        feedConsumed: feedLeftover.consumed || 0,
      };
    } catch (error) {
      await this.farmingCycleDAO.rollbackTransaction(qr);

      throw new Error(error.message || error);
    }
  }

  async getDetailClosing(farmingCycleId: string) {
    const fc = await this.farmingCycleDAO.getOneStrict({
      where: [
        {
          id: farmingCycleId,
        },
        {
          farmingCycleCode: farmingCycleId,
        },
      ],
      relations: {
        coop: true,
        farm: {
          city: true,
          district: true,
        },
      },
    });

    const [harvestRealizations] = await this.harvestRealizationDAO.getMany({
      where: {
        farmingCycleId: fc.id,
        status: Not(RealizationStatusEnum.DELETED),
      },
      order: {
        harvestDate: 'DESC',
      },
    });

    let latestHarvestRealizationDate = format(fc.farmingCycleStartDate, DATE_SQL_FORMAT);

    const harvest = harvestRealizations.reduce(
      (prev, item) => {
        // get latest harvest date from harvest realization
        if (
          item.harvestDate &&
          isAfter(new Date(item.harvestDate), new Date(latestHarvestRealizationDate))
        ) {
          latestHarvestRealizationDate = item.harvestDate;
        }

        const age =
          differenceInCalendarDays(new Date(item.harvestDate), fc.farmingCycleStartDate) - 1;

        return {
          tonnage: prev.tonnage + item.tonnage,
          quantity: prev.quantity + item.quantity,
          totalAge: prev.totalAge + age * item.quantity,
        };
      },
      {
        tonnage: 0,
        quantity: 0,
        totalAge: 0,
      },
    );

    const averageAge = harvest.totalAge / harvest.quantity;

    // assume all have the same uom
    const [feedConsumed, feedConsumedSummary, feedAdjusted] = await Promise.all([
      this.farmingCycleFeedStockDDAO.totalConsumption(fc.id, {
        notes: FEED_STOCK_NOTES.MINUS,
      }),
      this.farmingCycleFeedStockDDAO.totalConsumption(fc.id, {
        notes: {
          value: FEED_STOCK_NOTES.MINUS_SUMMARY,
          operator: 'like',
        },
      }),
      this.farmingCycleFeedStockDDAO.totalConsumption(fc.id, {
        notes: FEED_STOCK_NOTES.CLOSING_ADJUSTMENT,
      }),
    ]);
    const feedQty = feedConsumed.totalQty + feedAdjusted.totalQty + feedConsumedSummary.totalQty;
    const fcr = uomConverter(feedQty, feedConsumed.uom, 'kilogram') / harvest.tonnage;

    const fcrStd = await this.getFcrStandardForClosing(fc);

    const populationMortaled =
      fc.initialPopulation > harvest.quantity ? fc.initialPopulation - harvest.quantity : 0;

    const ip =
      100 *
      ((roundToN(harvest.tonnage / harvest.quantity) *
        (100 - 100 * roundToN(populationMortaled / fc.initialPopulation))) /
        (fcr * averageAge!));

    const body = {
      feed: feedQty,
      fcrStd,
      tonnage: roundToN(harvest.tonnage),
      ip: Math.round(ip),
      fcrAct: roundToN(fcr, 3),
      deplesi: populationMortaled,
      averageAge: roundToN(averageAge),
      finalPopulation: fc.initialPopulation - populationMortaled,
      farmingCycleCode: fc.farmingCycleCode,
      initialPopulation: fc.initialPopulation,
      date: latestHarvestRealizationDate,
    };

    return body;
  }

  private async getExistingAdjustment(
    farmingCycleId: string,
  ): Promise<FarmingCycleChickStockD | null> {
    return this.farmingCycleChickStockDDAO.getOne({
      where: {
        farmingCycleId,
        notes: ILike(CLOSING_NOTES_PATTERN),
      },
    });
  }

  private async getExistingFeedAdjustment(
    farmingCycleId: string,
  ): Promise<FarmingCycleFeedStockD | null> {
    return this.farmingCycleFeedStockDDAO.getOne({
      where: {
        farmingCycleId,
        notes: ILike(FEED_STOCK_NOTES.CLOSING_ADJUSTMENT),
      },
    });
  }

  private async getFcrStandardForClosing(farmingCycle: DeepPartial<FarmingCycle>): Promise<number> {
    const day = Math.abs(
      differenceInCalendarDays(
        new Date(farmingCycle.farmingCycleStartDate as string),
        new Date(farmingCycle.closedDate as string),
      ),
    );

    const fcrTargetVariable = await this.variableDAO.getOneStrict({
      where: {
        variableCode: VAR_FCR_TARGET_CODE,
      },
    });

    const fcrTarget = await this.targetDAO.getOneStrict({
      where: {
        variableId: fcrTargetVariable.id,
        coopTypeId: farmingCycle.coop?.coopTypeId,
        chickTypeId: farmingCycle.chickTypeId,
      },
    });

    let fcrStandard: number;

    if (day > 50) {
      const targetDays = await this.targetDaysDDAO.getOne({
        where: {
          targetId: fcrTarget.id,
        },
        order: {
          day: 'DESC',
        },
      });

      fcrStandard = Number(targetDays?.maxValue?.toFixed(2)) || 0;
    } else {
      const targetDay = await this.targetDaysDDAO.getOne({
        where: {
          targetId: fcrTarget.id,
          day,
        },
      });

      fcrStandard = Number(targetDay?.maxValue?.toFixed(2)) || 0;
    }
    return fcrStandard;
  }
}
