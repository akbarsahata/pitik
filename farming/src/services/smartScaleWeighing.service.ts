import { differenceInCalendarDays, endOfDay, format } from 'date-fns';
import { formatInTimeZone, utcToZonedTime } from 'date-fns-tz';
import { Inject, Service } from 'fastify-decorators';
import { DailyMonitoringDAO } from '../dao/dailyMonitoring.dao';
import { FarmingCycleDAO } from '../dao/farmingCycle.dao';
import { FarmingCycleChickStockDDAO } from '../dao/farmingCycleChickStockD.dao';
import { SmartScaleWeighingDAO } from '../dao/smartScaleWeighing.dao';
import { SmartScaleWeighingDDAO } from '../dao/smartScaleWeighingD.dao';
import { SmartScaleWeighing } from '../datasources/entity/pgsql/SmartScaleWeighing.entity';
import { SmartScaleWeighingD } from '../datasources/entity/pgsql/SmartScaleWeighingD.entity';
import {
  CreateWeighingBody,
  WeighingBody,
  WeighingDetailResponse,
  WeighingListResponse,
  WeighingSummary,
} from '../dto/smartScaleWeighing.dto';
import { CalculateDailyMonitoringQueue } from '../jobs/queues/calculate-daily-monitoring.queue';
import { DATE_SQL_FORMAT, DEFAULT_TIME_ZONE } from '../libs/constants';
import { ERR_WEIGHING_DATA_NOT_FOUND } from '../libs/constants/errors';
import { RequestUser } from '../libs/types/index.d';

@Service()
export class SmartScaleWeighingService {
  @Inject(SmartScaleWeighingDAO)
  private ssWeighingDAO!: SmartScaleWeighingDAO;

  @Inject(SmartScaleWeighingDDAO)
  private ssWeighingDDAO!: SmartScaleWeighingDDAO;

  @Inject(FarmingCycleDAO)
  private farmingCycleDAO!: FarmingCycleDAO;

  @Inject(FarmingCycleChickStockDDAO)
  private fcChickStockDDAO!: FarmingCycleChickStockDDAO;

  @Inject(DailyMonitoringDAO)
  private dailyMonitoringDAO!: DailyMonitoringDAO;

  @Inject(CalculateDailyMonitoringQueue)
  private calculateDailyMonitoringQueue!: CalculateDailyMonitoringQueue;

  async getList(farmingCycleId: string): Promise<WeighingListResponse> {
    const [list, count] = await this.ssWeighingDAO.getManyByFarmingCycleId(farmingCycleId);

    return {
      data: list.map<WeighingSummary>((ws) => ({
        id: ws.id,
        day: differenceInCalendarDays(
          ws.executedDate,
          utcToZonedTime(ws.farmingCycle.farmingCycleStartDate, DEFAULT_TIME_ZONE),
        ),
        totalCount: ws.totalCount,
        avgWeight: ws.avgWeight,
        date: format(ws.executedDate, DATE_SQL_FORMAT),
        currentPopulation: ws.currentPopulation || 0,
        countPopulationPercentage: ws.currentPopulation
          ? (ws.totalCount / ws.currentPopulation) * 100
          : 0,
      })),
      count,
    };
  }

  async getWeighingDetail(farmingCycleId: string, date: string): Promise<WeighingDetailResponse> {
    const wd = await this.ssWeighingDAO.getOneByFarmingCycleId(farmingCycleId, date);

    if (!wd) {
      throw ERR_WEIGHING_DATA_NOT_FOUND();
    }

    return {
      data: {
        id: wd.id,
        day: differenceInCalendarDays(
          wd.executedDate,
          utcToZonedTime(wd.farmingCycle.farmingCycleStartDate, DEFAULT_TIME_ZONE),
        ),
        totalCount: wd.totalCount,
        avgWeight: wd.avgWeight,
        date: format(wd.executedDate, DATE_SQL_FORMAT),
        currentPopulation: wd.currentPopulation || 0,
        countPopulationPercentage: wd.currentPopulation
          ? (wd.totalCount / wd.currentPopulation) * 100
          : 0,
        details: wd.details.sort((a, b) => a.section - b.section),
      },
    };
  }

  async createWeighing(
    body: CreateWeighingBody,
    farmingCycleId: string,
    user: RequestUser,
  ): Promise<{ data: string[] }> {
    const farmingCycle = await this.farmingCycleDAO.getOneStrict({
      where: {
        id: farmingCycleId,
      },
    });

    const upsertWeighing = async (weighing: WeighingBody) => {
      let totalCount = 0;
      let totalWeight = 0;
      let avgWeight = 0;

      const eodUtcString = formatInTimeZone(
        endOfDay(new Date(weighing.date)),
        'UTC',
        DATE_SQL_FORMAT,
      );

      const weighingDateStr = weighing.date
        ? format(new Date(weighing.date), DATE_SQL_FORMAT)
        : format(utcToZonedTime(new Date(), DEFAULT_TIME_ZONE), DATE_SQL_FORMAT);

      const [reductionToDate, oldWeighing, dailyMonitoring] = await Promise.all([
        this.fcChickStockDDAO.getTotalReductionToDate(farmingCycle.id, eodUtcString),
        this.ssWeighingDAO.getOneByFarmingCycleId(farmingCycle.id, weighing.date),
        this.dailyMonitoringDAO.getOne({
          where: {
            farmingCycleId,
            date: weighingDateStr,
          },
        }),
      ]);

      const currentPopulation = farmingCycle.initialPopulation - reductionToDate;

      weighing.details.forEach((detail) => {
        totalCount += detail.totalCount;
        totalWeight += detail.totalWeight;
      });

      avgWeight = totalCount ? totalWeight / totalCount : 0;

      if (dailyMonitoring && avgWeight > 0) {
        await this.dailyMonitoringDAO.updateOne(
          {
            farmingCycleId,
            date: weighingDateStr,
          },
          {
            bw: avgWeight * 1000, // dailymonitoring saves data in gram
          },
        );

        await this.calculateDailyMonitoringQueue.addJob({
          taskTicketId: dailyMonitoring.taskTicketId || undefined,
          date: dailyMonitoring.date,
          farmingCycleId: dailyMonitoring.farmingCycleId,
          farmingCycleCode: farmingCycle.farmingCycleCode,
        });
      }

      let newWeighing: SmartScaleWeighing;

      if (oldWeighing) {
        newWeighing = await this.ssWeighingDAO.updateOne(
          {
            id: oldWeighing.id,
          },
          {
            executedDate: weighing.date ? new Date(weighing.date) : new Date(),
            totalCount,
            avgWeight,
            currentPopulation,
          },
          user,
        );

        await this.ssWeighingDDAO.deleteMany({
          smartScaleWeighingId: oldWeighing.id,
        });
      } else {
        newWeighing = await this.ssWeighingDAO.createOne(
          {
            farmingCycleId: farmingCycle.id,
            executedDate: weighing.date ? new Date(weighing.date) : new Date(),
            totalCount,
            avgWeight,
            currentPopulation,
          },
          user,
        );
      }

      await this.ssWeighingDDAO.createMany(
        weighing.details.map<Partial<SmartScaleWeighingD>>((d) => ({
          section: d.section,
          totalCount: d.totalCount,
          totalWeight: d.totalWeight,
          smartScaleWeighingId: newWeighing.id,
        })),
      );

      return newWeighing;
    };

    const weighings = await Promise.all<SmartScaleWeighing>(
      body.data.map<Promise<SmartScaleWeighing>>(async (w) => upsertWeighing(w)),
    );

    return {
      data: weighings.map((nw) => nw.id),
    };
  }
}
