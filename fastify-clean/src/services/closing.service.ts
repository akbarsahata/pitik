import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { Inject, Service } from 'fastify-decorators';
import { IsNull, LessThanOrEqual, Like, Not } from 'typeorm';
import env from '../config/env';
import { CoopDAO } from '../dao/coop.dao';
import { DailyMonitoringDAO } from '../dao/dailyMonitoring.dao';
import { ErpDAO } from '../dao/erp.dao';
import { FarmingCycleDAO } from '../dao/farmingCycle.dao';
import { FarmingCycleChickStockDDAO } from '../dao/farmingCycleChickStockD.dao';
import { FarmingCycleFeedStockDDAO } from '../dao/farmingCycleFeedStockD.dao';
import { HarvestRealizationDAO } from '../dao/harvestRealization.dao';
import { TransferRequestDAO } from '../dao/transferRequest.dao';
import { FarmingCycleChickStockD } from '../datasources/entity/pgsql/FarmingCycleChickStockD.entity';
import { FarmingCycleFeedStockD } from '../datasources/entity/pgsql/FarmingCycleFeedStockD.entity';
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
} from '../libs/constants';
import {
  ERR_CLOSE_FARMING_CYCLE_FAILED_1,
  ERR_CLOSE_FARMING_CYCLE_FAILED_2,
  ERR_FEED_ADJUSTMENT_FAILED_1,
  ERR_FEED_ADJUSTMENT_FAILED_2,
  ERR_MORTALITY_ADJUSTMENT_FAILED_1,
  ERR_MORTALITY_ADJUSTMENT_FAILED_2,
} from '../libs/constants/errors';
import { RequestUser } from '../libs/types/index.d';

@Service()
export class ClosingService {
  @Inject(CoopDAO)
  private coopDAO: CoopDAO;

  @Inject(DailyMonitoringDAO)
  private dailyMonitoringDAO: DailyMonitoringDAO;

  @Inject(ErpDAO)
  private erpDAO: ErpDAO;

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
          notes: Like(CLOSING_NOTES_PATTERN),
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
    const [
      received,
      consumed,
      adjustment,
      transferRequestDelivered,
      transferRequestNotDeliveredYet,
    ] = await Promise.all([
      this.farmingCycleFeedStockDDAO.totalAddition(farmingCycleId),
      this.farmingCycleFeedStockDDAO.totalConsumption(farmingCycleId, {
        notes: {
          operator: '=',
          value: FEED_STOCK_NOTES.MINUS,
        },
      }),
      this.getExistingFeedAdjustment(farmingCycleId),
      this.transferRequestDAO.totalQuantity(farmingCycleId, {
        isDelivered: true,
        source: 'gr',
      }),
      this.transferRequestDAO.totalQuantity(farmingCycleId, {
        isDelivered: false,
        isCancelled: false,
      }),
    ]);

    const adjusted = adjustment?.qty || 0;
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
      await this.farmingCycleFeedStockDDAO.upsertOneWithTx(
        {
          id: existingAdjustment?.id,
          farmingCycleId,
          notes: Like(FEED_STOCK_NOTES.CLOSING_ADJUSTMENT),
        },
        {
          farmingCycleId,
          notes: FEED_STOCK_NOTES.CLOSING_ADJUSTMENT.replace('%', input.remarks),
          operator: '-',
          qty: input.value,
          userId: existingAdjustment?.userId || user.id,
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
    const closedDate = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const feedLeftover = await this.getFeedLeftover(farmingCycleId);

    const [latestDailyMonitoring, feedConsumed, feedAdjusted, [harvestRealizations]] =
      await Promise.all([
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
        this.farmingCycleFeedStockDDAO.totalConsumption(farmingCycleId, {
          notes: FEED_STOCK_NOTES.MINUS,
        }),
        this.farmingCycleFeedStockDDAO.totalConsumption(farmingCycleId, {
          notes: FEED_STOCK_NOTES.CLOSING_ADJUSTMENT,
        }),
        this.harvestRealizationDAO.getMany({
          where: {
            farmingCycleId,
          },
        }),
      ]);

    const qr = await this.farmingCycleDAO.startTransaction();

    try {
      if (feedLeftover.leftoverTotal !== 0) {
        throw ERR_CLOSE_FARMING_CYCLE_FAILED_2(
          'Current feed leftover:',
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

      if (env.USE_ERP) {
        const tonnage = harvestRealizations.reduce((prev, item) => prev + item.tonnage, 0);

        await this.erpDAO.closeFarmingCycle(
          farmingCycle,
          latestDailyMonitoring!,
          feedConsumed + feedAdjusted,
          tonnage,
          0, // FIXME: data standard fcr ambilnya dari mana?
        );
      }

      await this.farmingCycleDAO.commitTransaction(qr);

      await this.farmingCycleClosedQueue.addJob(farmingCycleId);

      return {
        harvested: harvestRealizations.reduce((prev, item) => prev + item.quantity, 0),
        mortaled: latestDailyMonitoring?.populationMortaled || 0,
        feedConsumed: feedLeftover.consumed || 0,
      };
    } catch (error) {
      await this.farmingCycleDAO.rollbackTransaction(qr);
      throw ERR_CLOSE_FARMING_CYCLE_FAILED_1(error);
    }
  }

  private async getExistingAdjustment(
    farmingCycleId: string,
  ): Promise<FarmingCycleChickStockD | null> {
    return this.farmingCycleChickStockDDAO.getOne({
      where: {
        farmingCycleId,
        notes: Like(CLOSING_NOTES_PATTERN),
      },
    });
  }

  private async getExistingFeedAdjustment(
    farmingCycleId: string,
  ): Promise<FarmingCycleFeedStockD | null> {
    return this.farmingCycleFeedStockDDAO.getOne({
      where: {
        farmingCycleId,
        notes: Like(FEED_STOCK_NOTES.CLOSING_ADJUSTMENT),
      },
    });
  }
}
