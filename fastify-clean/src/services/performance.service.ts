/* eslint-disable no-restricted-globals */
/* eslint-disable use-isnan */
import { addDays, differenceInCalendarDays, format, subDays } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { Inject, Service } from 'fastify-decorators';
import { IsNull, Not } from 'typeorm';
import { CoopDAO } from '../dao/coop.dao';
import { DailyMonitoringDAO } from '../dao/dailyMonitoring.dao';
import { FarmingCycleDAO } from '../dao/farmingCycle.dao';
import { FarmingCycleChickStockDDAO } from '../dao/farmingCycleChickStockD.dao';
import { FarmingCycleTaskTriggerDDAO } from '../dao/farmingCycleTaskTriggerD.dao';
import { TargetDAO } from '../dao/target.dao';
import { TargetDaysDDAO } from '../dao/targetDaysD.dao';
import { TaskTicketDDAO } from '../dao/taskTicketD.dao';
import { VariableDAO } from '../dao/variable.dao';
import { Coop } from '../datasources/entity/pgsql/Coop.entity';
import { DailyMonitoring } from '../datasources/entity/pgsql/DailyMonitoring.entity';
import { FarmingCycle } from '../datasources/entity/pgsql/FarmingCycle.entity';
import {
  PerformanceActual,
  PerformanceHistory,
  PerformanceHistoryItem,
  PerformanceProjection,
  PerformanceProjectionTopGraph,
} from '../dto/performance.dto';
import { DATE_TIME_FORMAT, DEFAULT_TIME_ZONE } from '../libs/constants';
import {
  VAR_ABW_CODE,
  VAR_FCR_TARGET_CODE,
  VAR_FEED_CON_CODE,
  VAR_KOPA_CODE,
  VAR_TRG_ACC_MORT_CODE,
} from '../libs/constants/variableCodes';

@Service()
export class PerformanceService {
  @Inject(DailyMonitoringDAO)
  private dailyMonitoringDAO: DailyMonitoringDAO;

  @Inject(FarmingCycleDAO)
  private farmingCycleDAO: FarmingCycleDAO;

  @Inject(FarmingCycleTaskTriggerDDAO)
  private farmingCycleTaskTriggerDDao: FarmingCycleTaskTriggerDDAO;

  @Inject(FarmingCycleChickStockDDAO)
  private farmingCycleChickStockDDAO: FarmingCycleChickStockDDAO;

  @Inject(CoopDAO)
  private coopDAO: CoopDAO;

  @Inject(TargetDAO)
  private targetDAO: TargetDAO;

  @Inject(TargetDaysDDAO)
  private targetDaysDDAO: TargetDaysDDAO;

  @Inject(VariableDAO)
  private variableDAO: VariableDAO;

  @Inject(TaskTicketDDAO)
  private taskTicketDDAO: TaskTicketDDAO;

  async getActualPerformance(farmingCycleId: string): Promise<PerformanceActual> {
    const [farmingCycle, variables, latestDailyMonitoring] = await Promise.all([
      this.farmingCycleDAO.getOneStrict({
        where: {
          id: farmingCycleId,
        },
        relations: {
          coop: true,
        },
      }),
      this.variableDAO.getMappedByCode([
        VAR_TRG_ACC_MORT_CODE,
        VAR_ABW_CODE,
        VAR_FEED_CON_CODE,
        VAR_KOPA_CODE,
      ]),
      this.dailyMonitoringDAO.getOne({
        where: {
          farmingCycleId,
          bw: Not(IsNull()),
        },
        relations: {
          taskTicket: {
            details: true,
          },
        },
        order: {
          day: 'DESC',
        },
      }),
    ]);

    const projectedDayNum = await this.farmingCycleTaskTriggerDDao.getFarmingCycleLastDay(
      farmingCycleId,
    );

    let nowLocal = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);
    if (nowLocal.getHours() < 17) {
      nowLocal = subDays(nowLocal, 1);
    }

    let currentDayNum = differenceInCalendarDays(nowLocal, farmingCycle.farmingCycleStartDate);
    currentDayNum = currentDayNum > projectedDayNum ? projectedDayNum : currentDayNum;

    const [tomoTargetToday, weightTargetToday, kopaTargetToday] = await Promise.all([
      this.targetDaysDDAO.getOneStrict({
        where: {
          day: currentDayNum,
          target: {
            coopTypeId: farmingCycle.coop.coopTypeId,
            chickTypeId: farmingCycle.chickTypeId,
            variableId: variables.get(VAR_TRG_ACC_MORT_CODE)!.id,
          },
        },
      }),
      this.targetDaysDDAO.getOneStrict({
        where: {
          day: currentDayNum,
          target: {
            coopTypeId: farmingCycle.coop.coopTypeId,
            chickTypeId: farmingCycle.chickTypeId,
            variableId: variables.get(VAR_ABW_CODE)!.id,
          },
        },
      }),
      this.targetDaysDDAO.getOneStrict({
        where: {
          day: currentDayNum,
          target: {
            coopTypeId: farmingCycle.coop.coopTypeId,
            chickTypeId: farmingCycle.chickTypeId,
            variableId: variables.get(VAR_KOPA_CODE)!.id,
          },
        },
      }),
    ]);

    // prettier-ignore
    const date =
      differenceInCalendarDays(nowLocal, farmingCycle.farmingCycleStartDate) <= projectedDayNum
        ? format(nowLocal, DATE_TIME_FORMAT)
        : format(
          addDays(farmingCycle.farmingCycleStartDate, projectedDayNum),
          DATE_TIME_FORMAT,
        );

    const feedConsumptionDetail =
      latestDailyMonitoring?.taskTicket?.details.find(
        (detail) => detail.variableId === variables.get(VAR_FEED_CON_CODE)!.id,
      ) || null;

    return {
      data: {
        date,
        mortality: {
          actual: latestDailyMonitoring?.mortality || 0,
          target: {
            min: tomoTargetToday.minValue,
            max: tomoTargetToday.maxValue,
          },
        },
        abw: {
          actual: latestDailyMonitoring?.bw || 0,
          target: {
            min: weightTargetToday.minValue,
            max: weightTargetToday.maxValue,
          },
        },
        feedConsumption: {
          actual:
            (feedConsumptionDetail && parseInt(feedConsumptionDetail.dataValue || '0', 10)) || 0,
          target: {
            min: kopaTargetToday.minValue,
            max: kopaTargetToday.maxValue,
          },
        },
        cycle: {
          fcr: latestDailyMonitoring?.fcr || -1,
          mortality: latestDailyMonitoring?.mortality || 0,
          ipProjection: latestDailyMonitoring?.ip || 0,
        },
      },
    };
  }

  async getHistoricalPerformance(
    farmingCycleId: string,
    page: number,
    limit: number,
  ): Promise<PerformanceHistory> {
    const farmingCycle = await this.farmingCycleDAO.getOneById(farmingCycleId);

    const feedConsumptionVariable = await this.variableDAO.getOneStrict({
      where: {
        variableCode: VAR_FEED_CON_CODE,
      },
    });

    const projectedDayNum = await this.farmingCycleTaskTriggerDDao.getFarmingCycleLastDay(
      farmingCycleId,
    );

    const nowLocal = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    let currentDayNum = differenceInCalendarDays(nowLocal, farmingCycle.farmingCycleStartDate);
    currentDayNum = currentDayNum > projectedDayNum ? projectedDayNum : currentDayNum;

    const from = (page - 1) * limit;

    const to = page * limit < currentDayNum ? page * limit + 1 : currentDayNum;

    const dailyMonitorings = await this.dailyMonitoringDAO.getMappedByKey(
      {
        where: {
          farmingCycleId,
        },
        relations: {
          taskTicket: {
            details: true,
          },
        },
        order: {
          day: 'ASC',
        },
      },
      (item: DailyMonitoring) => `${item.day}`,
    );

    const performanceHistory: PerformanceHistoryItem[] = [];

    /**
     * `from` is always from 0, 10, 20, and so on
     * `day` is from 1 to N, therefore day = from + 1
     * to get N record `to` is incremented by 1, because `day` < `to`
     *
     * except on last page, which only until penultimate day of recording can be shown
     */
    for (let day = from + 1; day < to; day += 1) {
      performanceHistory.push(
        (() => {
          const dateStr = format(
            addDays(farmingCycle.farmingCycleStartDate, currentDayNum - day),
            DATE_TIME_FORMAT,
          );

          const previousDailyMonitoring = dailyMonitorings.get(`${currentDayNum - day}`);
          const currentDailyMonitoring = dailyMonitorings.get(`${currentDayNum - day}`);
          const feedConsumption = currentDailyMonitoring?.taskTicket?.details.find(
            (detail) => detail.variableId === feedConsumptionVariable.id,
          );
          return {
            day: currentDayNum - day,
            date: dateStr,
            estimatedPopulation:
              (currentDailyMonitoring &&
                (currentDailyMonitoring.populationTotal || 0) -
                  (currentDailyMonitoring.populationMortaled || 0) -
                  (currentDailyMonitoring.populationHarvested || 0)) ||
              0,
            mortality:
              (previousDailyMonitoring &&
                (currentDailyMonitoring?.populationMortaled || 0) -
                  (previousDailyMonitoring.populationMortaled || 0)) ||
              currentDailyMonitoring?.populationMortaled ||
              0,
            abw: currentDailyMonitoring?.bw || 0,
            feedConsumption:
              (feedConsumption && parseInt(feedConsumption.dataValue || '0', 10)) || 0,
            fcr: currentDailyMonitoring?.fcr || -1,
          };
        })(),
      );
    }

    return {
      data: performanceHistory,
      count: currentDayNum - 1,
    };
  }

  async getPerformanceProjection(farmingCycleId: string): Promise<PerformanceProjection> {
    const farmingCycle = await this.farmingCycleDAO.getOneById(farmingCycleId);

    const projectedDayNum = await this.farmingCycleTaskTriggerDDao.getFarmingCycleLastDay(
      farmingCycleId,
    );

    const nowLocal = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    let currentDayNum = differenceInCalendarDays(nowLocal, farmingCycle.farmingCycleStartDate);

    currentDayNum = currentDayNum > projectedDayNum ? projectedDayNum : currentDayNum;

    const coop = await this.coopDAO.getOneById(farmingCycle.coopId);

    const [weightProjection, fcrProjection, mortalityProjection] = await Promise.all<any>([
      this.getWeightProjection(farmingCycle, coop, currentDayNum, projectedDayNum),
      this.getFcrProjection(farmingCycle, coop, currentDayNum, projectedDayNum),
      this.getMortalityProjection(farmingCycle, coop, currentDayNum, projectedDayNum),
    ]);

    const performanceProjection: PerformanceProjection = {
      data: {
        weight: weightProjection as PerformanceProjectionTopGraph,
        fcr: fcrProjection as PerformanceProjectionTopGraph,
        mortality: mortalityProjection as PerformanceProjectionTopGraph,
      },
    };

    return performanceProjection;
  }

  async getCurrentWeightProjection(farmingCycleId: string): Promise<PerformanceProjectionTopGraph> {
    const farmingCycle = await this.farmingCycleDAO.getOneById(farmingCycleId);

    const projectedDayNum = await this.farmingCycleTaskTriggerDDao.getFarmingCycleLastDay(
      farmingCycleId,
    );

    let currentDayNum = differenceInCalendarDays(new Date(), farmingCycle.farmingCycleStartDate);
    currentDayNum = currentDayNum > projectedDayNum ? projectedDayNum : currentDayNum - 1;

    const coop = await this.coopDAO.getOneById(farmingCycle.coopId);

    const weightVariable = await this.variableDAO.getOneStrict({
      where: {
        variableCode: VAR_ABW_CODE,
      },
    });

    const latestWeight = await this.taskTicketDDAO.getLatestValue(
      weightVariable.id,
      farmingCycle.id,
      0,
      utcToZonedTime(new Date(), DEFAULT_TIME_ZONE),
    );

    const secondLatestWeight = await this.taskTicketDDAO.getLatestValue(
      weightVariable.id,
      farmingCycle.id,
      1,
      utcToZonedTime(new Date(), DEFAULT_TIME_ZONE),
    );

    const target = await this.targetDAO.getOneStrict({
      where: {
        coopTypeId: coop.coopTypeId,
        chickTypeId: farmingCycle.chickTypeId,
        variableId: weightVariable.id,
      },
    });

    const targetToday = await this.targetDaysDDAO.getOneStrict({
      where: {
        targetId: target.id,
        day: currentDayNum,
      },
    });

    const targetProjected = await this.targetDaysDDAO.getOneStrict({
      where: {
        targetId: target.id,
        day: projectedDayNum,
      },
    });

    const weightDeviationPercent =
      Number(latestWeight?.dataValue) / Number(secondLatestWeight?.dataValue) - 1;

    const projectedCurrentWeight =
      Number(latestWeight?.dataValue) * Math.abs(weightDeviationPercent) +
      Number(latestWeight?.dataValue);

    return {
      topGraph: {
        current: {
          dayNum: currentDayNum,
          current: latestWeight ? Number(latestWeight.dataValue) : 0,
          benchmark: targetToday.minValue,
        },
        projected: {
          dayNum: projectedDayNum,
          current: Number(projectedCurrentWeight.toFixed(2)),
          benchmark: targetProjected.minValue,
        },
      },
    };
  }

  async getCurrentFcrProjection(farmingCycleId: string): Promise<PerformanceProjectionTopGraph> {
    const farmingCycle = await this.farmingCycleDAO.getOneById(farmingCycleId);

    const projectedDayNum = await this.farmingCycleTaskTriggerDDao.getFarmingCycleLastDay(
      farmingCycleId,
    );

    let currentDayNum = differenceInCalendarDays(new Date(), farmingCycle.farmingCycleStartDate);
    currentDayNum = currentDayNum > projectedDayNum ? projectedDayNum : currentDayNum - 1;

    const coop = await this.coopDAO.getOneById(farmingCycle.coopId);

    const feedConsumptionVariable = await this.variableDAO.getOneStrict({
      where: {
        variableCode: VAR_FEED_CON_CODE,
      },
    });

    const weightVariable = await this.variableDAO.getOneStrict({
      where: {
        variableCode: VAR_ABW_CODE,
      },
    });

    const latestWeightAverage = await this.taskTicketDDAO.getLatestAverage(
      weightVariable.id,
      farmingCycleId,
    );

    const feedConsumptionTarget = await this.targetDAO.getOneStrict({
      where: {
        coopTypeId: coop.coopTypeId,
        chickTypeId: farmingCycle.chickTypeId,
        variableId: feedConsumptionVariable.id,
      },
    });

    const feedConsumptionTargetToday = await this.targetDaysDDAO.getOneStrict({
      where: {
        targetId: feedConsumptionTarget.id,
        day: currentDayNum,
      },
    });

    const feedConsumptionSum = await this.taskTicketDDAO.getLatestSum(
      feedConsumptionVariable.id,
      farmingCycle.id,
      {
        reportedUntil: utcToZonedTime(new Date(), DEFAULT_TIME_ZONE),
      },
    );

    const toDateCummulativeMortality =
      await this.farmingCycleChickStockDDAO.getTotalMortalityByFarmingCycleId(farmingCycleId);

    const { initialPopulation } = farmingCycle;
    const estimatedPopulation = initialPopulation - toDateCummulativeMortality;

    const kopa = (feedConsumptionSum * 50 * 1000) / estimatedPopulation;
    const kopaBenchmark = (feedConsumptionTargetToday.minValue * 50 * 1000) / estimatedPopulation;

    const currentFcr = kopa / latestWeightAverage;

    const currentFcrBenchmark = kopaBenchmark / latestWeightAverage;

    const fcrTargetVariable = await this.variableDAO.getOneStrict({
      where: {
        variableCode: VAR_FCR_TARGET_CODE,
      },
    });

    const fcrTarget = await this.targetDAO.getOneStrict({
      where: {
        variableId: fcrTargetVariable.id,
        coopTypeId: coop.coopTypeId,
        chickTypeId: farmingCycle.chickTypeId,
      },
    });

    const fcrTargetToday = await this.targetDaysDDAO.getOneStrict({
      where: {
        targetId: fcrTarget.id,
        day: currentDayNum,
      },
    });

    const fcrTargetProjected = await this.targetDaysDDAO.getOneStrict({
      where: {
        targetId: fcrTarget.id,
        day: projectedDayNum,
      },
    });

    return {
      topGraph: {
        current: {
          dayNum: currentDayNum,
          current: Number(currentFcr.toFixed(2)),
          benchmark: Number(fcrTargetToday.maxValue.toFixed(2)),
        },
        projected: {
          dayNum: projectedDayNum,
          current: Number(currentFcrBenchmark.toFixed(2)),
          benchmark: Number(fcrTargetProjected.maxValue.toFixed(2)),
        },
      },
    };
  }

  async getCurrentMortalityProjection(
    farmingCycleId: string,
  ): Promise<PerformanceProjectionTopGraph> {
    const farmingCycle = await this.farmingCycleDAO.getOneById(farmingCycleId);

    const projectedDayNum = await this.farmingCycleTaskTriggerDDao.getFarmingCycleLastDay(
      farmingCycleId,
    );

    let currentDayNum = differenceInCalendarDays(new Date(), farmingCycle.farmingCycleStartDate);
    currentDayNum = currentDayNum > projectedDayNum ? projectedDayNum : currentDayNum - 1;

    const toDateCummulativeMortality =
      await this.farmingCycleChickStockDDAO.getTotalMortalityByFarmingCycleId(farmingCycleId);

    const { initialPopulation } = farmingCycle;

    const coop = await this.coopDAO.getOneById(farmingCycle.coopId);

    const targetMortalityVariable = await this.variableDAO.getOneStrict({
      where: {
        variableCode: VAR_TRG_ACC_MORT_CODE,
      },
    });

    const target = await this.targetDAO.getOneStrict({
      where: {
        coopTypeId: coop.coopTypeId,
        chickTypeId: farmingCycle.chickTypeId,
        variableId: targetMortalityVariable.id,
      },
    });

    const targetToday = await this.targetDaysDDAO.getOneStrict({
      where: {
        targetId: target.id,
        day: currentDayNum,
      },
    });

    const targetProjection = await this.targetDaysDDAO.getOneStrict({
      where: {
        targetId: target.id,
        day: projectedDayNum,
      },
    });

    const currentMortalityPercentage = (toDateCummulativeMortality * 100) / initialPopulation;

    const mortalityDeviationPercentage = currentMortalityPercentage - targetToday.maxValue;

    return {
      topGraph: {
        current: {
          dayNum: currentDayNum,
          current: Number(currentMortalityPercentage.toFixed(2)),
          benchmark: targetToday.maxValue,
        },
        projected: {
          dayNum: projectedDayNum,
          current: Number((mortalityDeviationPercentage + targetProjection.maxValue).toFixed(2)),
          benchmark: targetProjection.maxValue,
        },
      },
    };
  }

  private async getWeightProjection(
    farmingCycle: FarmingCycle,
    coop: Coop,
    currentDayNum: number,
    projectedDayNum: number,
  ): Promise<PerformanceProjectionTopGraph> {
    const weightVariable = await this.variableDAO.getOneStrict({
      where: {
        variableCode: VAR_ABW_CODE,
      },
    });

    const latestWeight = await this.taskTicketDDAO.getLatestValue(
      weightVariable.id,
      farmingCycle.id,
      0,
      utcToZonedTime(new Date(), DEFAULT_TIME_ZONE),
      farmingCycle.farmingCycleStartDate,
    );

    const target = await this.targetDAO.getOneStrict({
      where: {
        coopTypeId: coop.coopTypeId,
        chickTypeId: farmingCycle.chickTypeId,
        variableId: weightVariable.id,
      },
    });

    const targetToday = await this.targetDaysDDAO.getOneStrict({
      where: {
        targetId: target.id,
        day: currentDayNum,
      },
    });

    const targetProjected = await this.targetDaysDDAO.getOneStrict({
      where: {
        targetId: target.id,
        day: projectedDayNum,
      },
    });

    const weightDeviationPercent = Number(latestWeight?.dataValue) / targetToday.minValue - 1;

    const projectedCurrentWeight =
      targetProjected.minValue * weightDeviationPercent + targetProjected.minValue;

    return {
      topGraph: {
        current: {
          dayNum: currentDayNum,
          current: Number(latestWeight?.dataValue) || 0,
          benchmark: targetToday.minValue,
        },
        projected: {
          dayNum: projectedDayNum,
          current: !isNaN(projectedCurrentWeight) ? Number(projectedCurrentWeight.toFixed(2)) : 0,
          benchmark: targetProjected.minValue,
        },
      },
    };
  }

  private async getFcrProjection(
    farmingCycle: FarmingCycle,
    coop: Coop,
    currentDayNum: number,
    projectedDayNum: number,
  ): Promise<PerformanceProjectionTopGraph> {
    const weight = await this.variableDAO.getOneStrict({
      where: {
        variableCode: VAR_ABW_CODE,
      },
    });

    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const latestWeight = await this.taskTicketDDAO.getLatestValue(
      weight.id,
      farmingCycle.id,
      0,
      now,
      farmingCycle.farmingCycleStartDate,
    );

    const feedConsumption = await this.variableDAO.getOneStrict({
      where: {
        variableCode: VAR_FEED_CON_CODE,
      },
    });

    const feedConsumptionSum = await this.taskTicketDDAO.getLatestSum(
      feedConsumption.id,
      farmingCycle.id,
      {
        reportedUntil: now,
      },
    );

    const fcrTargetVariable = await this.variableDAO.getOneStrict({
      where: {
        variableCode: VAR_FCR_TARGET_CODE,
      },
    });

    const fcrTarget = await this.targetDAO.getOneStrict({
      where: {
        variableId: fcrTargetVariable.id,
        coopTypeId: coop.coopTypeId,
        chickTypeId: farmingCycle.chickTypeId,
      },
    });

    const fcrTargetToday = await this.targetDaysDDAO.getOneStrict({
      where: {
        targetId: fcrTarget.id,
        day: currentDayNum,
      },
    });

    const fcrTargetProjected = await this.targetDaysDDAO.getOneStrict({
      where: {
        targetId: fcrTarget.id,
        day: projectedDayNum,
      },
    });

    const toDateCummulativeMortality =
      await this.farmingCycleChickStockDDAO.getTotalMortalityByFarmingCycleId(farmingCycle.id);

    const { initialPopulation } = farmingCycle;
    const estimatedPopulation = initialPopulation - toDateCummulativeMortality;

    const kopa = (feedConsumptionSum * 50 * 1000) / estimatedPopulation;

    let currentFcr = kopa / Number(latestWeight?.dataValue);
    currentFcr = Number(currentFcr.toFixed(2));

    const currentFcrBenchmark = Number(fcrTargetToday.maxValue.toFixed(2));

    const fcrDeviationPercentage = currentFcr / fcrTargetToday.maxValue - 1;

    let projectedFcrCurrent =
      fcrTargetProjected.maxValue * fcrDeviationPercentage + fcrTargetProjected.maxValue;
    projectedFcrCurrent = Number(projectedFcrCurrent.toFixed(2));

    const projectedFcrBenchmark = Number(fcrTargetProjected.maxValue.toFixed(2));

    return {
      topGraph: {
        current: {
          dayNum: currentDayNum,
          current: currentFcr !== Infinity && !isNaN(currentFcr) ? currentFcr : 0,
          benchmark: currentFcrBenchmark,
        },
        projected: {
          dayNum: projectedDayNum,
          current: currentFcr !== Infinity && !isNaN(currentFcr) ? projectedFcrCurrent : 0,
          benchmark: projectedFcrBenchmark,
        },
      },
    };
  }

  private async getMortalityProjection(
    farmingCycle: FarmingCycle,
    coop: Coop,
    currentDayNum: number,
    projectedDayNum: number,
  ): Promise<PerformanceProjectionTopGraph> {
    const toDateCummulativeMortality =
      await this.farmingCycleChickStockDDAO.getTotalMortalityByFarmingCycleId(
        farmingCycle.id,
        utcToZonedTime(new Date(), DEFAULT_TIME_ZONE),
      );

    const { initialPopulation } = farmingCycle;

    const targetMortalityVariable = await this.variableDAO.getOneStrict({
      where: {
        variableCode: VAR_TRG_ACC_MORT_CODE,
      },
    });

    const target = await this.targetDAO.getOneStrict({
      where: {
        coopTypeId: coop.coopTypeId,
        chickTypeId: farmingCycle.chickTypeId,
        variableId: targetMortalityVariable.id,
      },
    });

    const targetToday = await this.targetDaysDDAO.getOneStrict({
      where: {
        targetId: target.id,
        day: currentDayNum,
      },
    });

    const targetProjection = await this.targetDaysDDAO.getOneStrict({
      where: {
        targetId: target.id,
        day: projectedDayNum,
      },
    });

    const currentMortalityPercentage = (toDateCummulativeMortality * 100) / initialPopulation;

    const mortalityDeviationPercentage = currentMortalityPercentage - targetToday.maxValue;

    return {
      topGraph: {
        current: {
          dayNum: currentDayNum,
          current: Number(currentMortalityPercentage.toFixed(2)),
          benchmark: targetToday.maxValue,
        },
        projected: {
          dayNum: projectedDayNum,
          current: Number((mortalityDeviationPercentage + targetProjection.maxValue).toFixed(2)),
          benchmark: targetProjection.maxValue,
        },
      },
    };
  }
}
