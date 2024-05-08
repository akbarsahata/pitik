import {
  addDays,
  differenceInCalendarDays,
  format,
  hoursToMilliseconds,
  isAfter,
  isBefore,
} from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { Inject, Service } from 'fastify-decorators';
import {
  DeepPartial,
  FindOptionsWhere,
  In,
  IsNull,
  LessThanOrEqual,
  MoreThan,
  Not,
  Raw,
} from 'typeorm';
import { CoopMemberDDAO } from '../dao/coopMemberD.dao';
import { DailyMonitoringDAO } from '../dao/dailyMonitoring.dao';
import { ErpDAO } from '../dao/erp.dao';
import { FarmingCycleDAO } from '../dao/farmingCycle.dao';
import { FarmingCycleFeedStockDDAO } from '../dao/farmingCycleFeedStockD.dao';
import { PurchaseOrderDAO } from '../dao/purchaseOrder.dao';
import { TargetDAO } from '../dao/target.dao';
import { TargetDaysDDAO } from '../dao/targetDaysD.dao';
import { TaskTicketDAO } from '../dao/taskTicket.dao';
import { TaskTicketDDAO } from '../dao/taskTicketD.dao';
import { VariableDAO } from '../dao/variable.dao';
import { DailyMonitoring } from '../datasources/entity/pgsql/DailyMonitoring.entity';
import { Repopulation } from '../datasources/entity/pgsql/Repopulation.entity';
import { TargetDaysD } from '../datasources/entity/pgsql/TargetDaysD.entity';
import { TaskTicketD } from '../datasources/entity/pgsql/TaskTicketD.entity';
import { GetDailyPerformanceSummaryResponseItem } from '../dto/dailyPerformance.dto';
import {
  DailyMonitoringVariableKey,
  dailyMonitoringVariableKeyToCode,
  dailyMonitoringVariableKeyToStandardValue,
  DailyMonitoringVariableResponse,
  DailyPerformanceMonitoringItem,
  GetDailyMonitoringDateResponse,
  GetFarmingCyclePerformanceResponse,
} from '../dto/farmingCycle.dto';
import { CalculateDailyMonitoringQueue } from '../jobs/queues/calculate-daily-monitoring.queue';
import { FinalizeDailyMonitoringQueue } from '../jobs/queues/finalize-daily-monitoring.queue';
import {
  DAILY_MONITORING_STATUS,
  DAILY_MONITORING_STATUS_ENUM,
  DAILY_REPORT_DEADLINE,
  DATETIME_59_SQL_FORMAT,
  DATETIME_SQL_FORMAT,
  DATE_SQL_FORMAT,
  DEFAULT_TIME_ZONE,
  USER_TYPE,
} from '../libs/constants';
import { TASK_LAPORAN_AKHIR_HARI } from '../libs/constants/taskCodes';
import {
  VAR_ABW_CODE,
  VAR_AVG_WEIGHT_DOC_CODE,
  VAR_CULLED_CODE,
  VAR_DEAD_CHICK_CODE,
  VAR_FCR_TARGET_CODE,
  VAR_FEED_CON_CODE,
  VAR_FEED_TYPE_CODE,
  VAR_HARVESTED_CODE,
  VAR_HARVEST_TONASE_CODE,
  VAR_KOPA_CODE,
  VAR_MOHA_CODE,
  VAR_TOMO_CODE,
  VAR_TRG_ACC_MORT_CODE,
  VAR_TRG_IP_CODE,
  VAR_UNIFORMITY_CODE,
} from '../libs/constants/variableCodes';
import { RequestUser } from '../libs/types/index.d';
import { isRoleAllowed } from '../libs/utils/helpers';

// FIXME: please remove import env once flow with ODOO is ready
import env from '../config/env';
import { HarvestRealizationDAO } from '../dao/harvestRealization.dao';
import { RepopulationDAO } from '../dao/repopulation.dao';
import { SmartScaleWeighingDAO } from '../dao/smartScaleWeighing.dao';
import { TransferRequestDAO } from '../dao/transferRequest.dao';
import { DailyPerformanceD } from '../datasources/entity/pgsql/DailyPerformanceD.entity';
import { RealizationStatusEnum } from '../datasources/entity/pgsql/HarvestRealization.entity';

interface RepopulationConditions {
  isAfterRepopulationPeriod: boolean;
  isExactlyOneDayAfterRepopulation: boolean;
  totalAdjustedPopulation: number;
  totalAdjustedPopulationMortaled: number;
}

@Service()
export class DailyMonitoringService {
  @Inject(DailyMonitoringDAO)
  private dao!: DailyMonitoringDAO;

  @Inject(TaskTicketDAO)
  private taskTicketDAO!: TaskTicketDAO;

  @Inject(TaskTicketDDAO)
  private taskTicketDDAO!: TaskTicketDDAO;

  @Inject(VariableDAO)
  private variableDAO!: VariableDAO;

  @Inject(FarmingCycleFeedStockDDAO)
  private farmingCycleFeedStockDDAO!: FarmingCycleFeedStockDDAO;

  @Inject(TargetDaysDDAO)
  private targetDaysDDAO!: TargetDaysDDAO;

  @Inject(CalculateDailyMonitoringQueue)
  private calculateDailyMonitoringQueue: CalculateDailyMonitoringQueue;

  @Inject(DailyMonitoringDAO)
  private dailyMonitoringDAO!: DailyMonitoringDAO;

  @Inject(FarmingCycleDAO)
  private farmingCycleDAO!: FarmingCycleDAO;

  @Inject(TargetDAO)
  private targetDAO!: TargetDAO;

  @Inject(FinalizeDailyMonitoringQueue)
  private finalizeDailyMonitoringQueue!: FinalizeDailyMonitoringQueue;

  @Inject(ErpDAO)
  private erpDAO!: ErpDAO;

  @Inject(CoopMemberDDAO)
  private coopMemberDDAO!: CoopMemberDDAO;

  @Inject(PurchaseOrderDAO)
  private purchaseOrderDAO!: PurchaseOrderDAO;

  @Inject(RepopulationDAO)
  private repopulationDAO!: RepopulationDAO;

  @Inject(TransferRequestDAO)
  private transferRequestDAO!: TransferRequestDAO;

  @Inject(HarvestRealizationDAO)
  private harvestRealizationDAO!: HarvestRealizationDAO;

  @Inject(SmartScaleWeighingDAO)
  private smartScaleWeighingDAO!: SmartScaleWeighingDAO;

  async getAllDailyMonitorings(
    farmingCycleId: string,
    opts?: {
      taskTicketId?: string;
      user?: RequestUser;
    },
  ): Promise<DailyPerformanceMonitoringItem[]> {
    const farmingCycle = await this.farmingCycleDAO.getOneStrict({
      where: {
        id: farmingCycleId,
      },
      relations: {
        coop: true,
      },
    });

    const [variables, [dailyMonitorings]] = await Promise.all([
      this.variableDAO.getMappedByCode([
        VAR_ABW_CODE,
        VAR_CULLED_CODE,
        VAR_DEAD_CHICK_CODE,
        VAR_FCR_TARGET_CODE,
        VAR_KOPA_CODE,
        VAR_MOHA_CODE,
        VAR_TRG_ACC_MORT_CODE,
        VAR_TRG_IP_CODE,
      ]),
      this.dailyMonitoringDAO.getMany({
        where: {
          farmingCycleId,
          taskTicketId: opts?.taskTicketId,
          date: farmingCycle.closedDate
            ? LessThanOrEqual(format(new Date(farmingCycle.closedDate), DATE_SQL_FORMAT))
            : undefined,
        },
        relations: {
          taskTicket: {
            executor: true,
            details: true,
          },
        },
        order: {
          day: 'ASC',
        },
      }),
    ]);

    const targetDaysFilter = dailyMonitorings.reduce<FindOptionsWhere<TargetDaysD>[]>(
      (prev, item) => {
        prev.push(
          {
            day: item.day,
            target: {
              coopTypeId: farmingCycle.coop.coopTypeId,
              chickTypeId: farmingCycle.chickTypeId,
              variableId: variables.get(VAR_ABW_CODE)!.id,
            },
          },
          {
            day: item.day,
            target: {
              coopTypeId: farmingCycle.coop.coopTypeId,
              chickTypeId: farmingCycle.chickTypeId,
              variableId: variables.get(VAR_TRG_IP_CODE)!.id,
            },
          },
          {
            day: item.day,
            target: {
              coopTypeId: farmingCycle.coop.coopTypeId,
              chickTypeId: farmingCycle.chickTypeId,
              variableId: variables.get(VAR_FCR_TARGET_CODE)!.id,
            },
          },
          {
            day: item.day,
            target: {
              coopTypeId: farmingCycle.coop.coopTypeId,
              chickTypeId: farmingCycle.chickTypeId,
              variableId: variables.get(VAR_TRG_ACC_MORT_CODE)!.id,
            },
          },
          {
            day: item.day,
            target: {
              coopTypeId: farmingCycle.coop.coopTypeId,
              chickTypeId: farmingCycle.chickTypeId,
              variableId: variables.get(VAR_KOPA_CODE)!.id,
            },
          },
          {
            day: item.day,
            target: {
              coopTypeId: farmingCycle.coop.coopTypeId,
              chickTypeId: farmingCycle.chickTypeId,
              variableId: variables.get(VAR_MOHA_CODE)!.id,
            },
          },
        );

        return prev;
      },
      [],
    );

    const mappedTargetDays =
      (targetDaysFilter.length &&
        (await this.targetDaysDDAO.getMappedByVariableAndDay(targetDaysFilter))) ||
      new Map<string, TargetDaysD>();

    const data = dailyMonitorings.map<DailyPerformanceMonitoringItem>((dailyMonitoring) => {
      const bwTarget = mappedTargetDays.get(
        `${variables.get(VAR_ABW_CODE)!.id}-${dailyMonitoring.day}`,
      );

      const bwTargetBefore = mappedTargetDays.get(
        `${variables.get(VAR_ABW_CODE)!.id}-${dailyMonitoring.day - 1}`,
      );

      const adgTarget =
        bwTarget && bwTargetBefore ? bwTarget.minValue - bwTargetBefore.minValue : null;

      let reportStatus =
        opts?.user?.role &&
        isRoleAllowed(opts.user.role, [USER_TYPE.PPL, USER_TYPE.ADM, USER_TYPE.OWN]) &&
        dailyMonitoring.reportStatus === DAILY_MONITORING_STATUS_ENUM.FILLED
          ? DAILY_MONITORING_STATUS.NEED_REVIEW
          : DAILY_MONITORING_STATUS[dailyMonitoring.reportStatus];

      if (
        dailyMonitoring?.taskTicket?.executor?.userType &&
        isRoleAllowed(dailyMonitoring.taskTicket.executor.userType, [USER_TYPE.PPL]) &&
        reportStatus === DAILY_MONITORING_STATUS[DAILY_MONITORING_STATUS_ENUM.REVIEWED]
      ) {
        reportStatus = DAILY_MONITORING_STATUS[DAILY_MONITORING_STATUS_ENUM.FILLED];
      }

      const dead = parseInt(
        dailyMonitoring.taskTicket?.details.find(
          (val) => val.variableId === variables.get(VAR_DEAD_CHICK_CODE)!.id,
        )?.dataValue || '0',
        10,
      );

      const culled = parseInt(
        dailyMonitoring.taskTicket?.details.find(
          (val) => val.variableId === variables.get(VAR_CULLED_CODE)!.id,
        )?.dataValue || '0',
        10,
      );

      return {
        ...dailyMonitoring,
        averageChickenAge: dailyMonitoring.averageChickenAge,
        date: dailyMonitoring.date,
        reportStatus,
        bw: {
          actual: dailyMonitoring.bw,
          standard: bwTarget?.minValue || null,
        },
        adg: {
          actual: dailyMonitoring.adg,
          standard: adgTarget,
        },
        ip: {
          actual: dailyMonitoring.ip,
          standard:
            mappedTargetDays.get(`${variables.get(VAR_TRG_IP_CODE)!.id}-${dailyMonitoring.day}`)
              ?.minValue || null,
        },
        fcr: {
          actual: dailyMonitoring.fcr,
          standard:
            mappedTargetDays.get(`${variables.get(VAR_FCR_TARGET_CODE)!.id}-${dailyMonitoring.day}`)
              ?.maxValue || null,
        },
        feedIntake: {
          actual: dailyMonitoring.feedIntake,
          standard:
            mappedTargetDays.get(`${variables.get(VAR_KOPA_CODE)!.id}-${dailyMonitoring.day}`)
              ?.minValue || null,
        },
        mortality: {
          actual:
            dailyMonitoring.populationTotal &&
            100 * ((dead + culled) / dailyMonitoring.populationTotal),
          standard:
            mappedTargetDays.get(`${variables.get(VAR_MOHA_CODE)!.id}-${dailyMonitoring.day}`)
              ?.maxValue || null,
        },
        mortalityCummulative: {
          actual: dailyMonitoring.mortality,
          standard:
            mappedTargetDays.get(
              `${variables.get(VAR_TRG_ACC_MORT_CODE)!.id}-${dailyMonitoring.day}`,
            )?.maxValue || null,
        },
        feed: {
          remaining: dailyMonitoring.feedRemaining,
          stockoutDate: dailyMonitoring.feedStockoutDate || null,
        },
        population: {
          total: dailyMonitoring.populationTotal,
          harvested: dailyMonitoring.populationHarvested,
          mortality: dailyMonitoring.populationMortaled,
          remaining: !dailyMonitoring.populationTotal
            ? null
            : dailyMonitoring.populationTotal -
              (dailyMonitoring.populationHarvested || 0) -
              (dailyMonitoring.populationMortaled || 0),
        },
      };
    });

    return data;
  }

  async getDailyMonitoringDetail(
    farmingCycleId: string,
    taskTicketId: string,
    user: RequestUser,
  ): Promise<DailyPerformanceMonitoringItem> {
    const data = await this.getAllDailyMonitorings(farmingCycleId, {
      taskTicketId,
      user,
    });

    if (data.length < 1) {
      throw new Error('daily monitoring not found');
    }

    return data[0];
  }

  async getDailyMonitoringsByVariable(
    farmingCycleId: string,
    variableAsked: DailyMonitoringVariableKey,
  ): Promise<DailyMonitoringVariableResponse> {
    const [[dailyMonitorings], variables, farmingCycle] = await Promise.all([
      this.dailyMonitoringDAO.getMany({
        where: {
          farmingCycleId,
        },
        select: {
          farmingCycleId: true,
          taskTicketId: true,
          day: true,
          date: true,
          [variableAsked]: true,
        },
        order: {
          date: 'ASC',
        },
      }),
      this.variableDAO.getMappedByCode([dailyMonitoringVariableKeyToCode[variableAsked]]),
      this.farmingCycleDAO.getOneStrict({
        where: {
          id: farmingCycleId,
        },
        relations: {
          coop: true,
        },
      }),
    ]);

    const variableTarget = await this.targetDAO.getOne({
      where: {
        coopTypeId: farmingCycle.coop.coopTypeId,
        chickTypeId: farmingCycle.chickTypeId,
        variableId: variables.get(dailyMonitoringVariableKeyToCode[variableAsked])!.id,
      },
    });

    const variableTargetDays =
      (variableTarget?.id &&
        (await this.targetDaysDDAO.getMany({
          where: {
            targetId: variableTarget.id,
            day: In(dailyMonitorings.map((item) => item.day)),
          },
        }))) ||
      [];
    const mappedVariableTargetDays = variableTargetDays.reduce((prev, item) => {
      prev.set(item.day, item);
      return prev;
    }, new Map<number, TargetDaysD>());

    return {
      code: 200,
      data: dailyMonitorings.map((item) => {
        const result = {
          actual: item[variableAsked] || 0,
          day: item.day,
          standard: 0,
        };
        const targetDay = mappedVariableTargetDays.get(item.day);
        if (targetDay) {
          result.standard = targetDay[dailyMonitoringVariableKeyToStandardValue[variableAsked]];
        }
        return result;
      }),
    };
  }

  async getDailyMonitoringDate(farmingCycleId: string): Promise<GetDailyMonitoringDateResponse> {
    const [dailyMonitorings] = await this.dailyMonitoringDAO.getMany({
      where: {
        farmingCycleId,
      },
      order: {
        day: 'ASC',
      },
    });

    return {
      code: 200,
      data: dailyMonitorings.map((dailyMonitoring) => ({
        farmingCycleId: dailyMonitoring.farmingCycleId,
        taskTicketId: dailyMonitoring.taskTicketId,
        date: dailyMonitoring.date,
        day: dailyMonitoring.day,
      })),
    };
  }

  async calculateDailyMonitoring(
    farmingCycleId: string,
    taskTicketId: string,
    user?: RequestUser,
    updateStatusStrategy?: 'single' | 'multiple',
  ): Promise<DailyMonitoring> {
    const [taskTicket, variables, [repopulations, count]] = await Promise.all([
      this.taskTicketDAO.getOneStrict({
        where: {
          farmingCycleId,
          id: taskTicketId,
        },
        relations: {
          dailyMonitoring: true,
          farmingCycle: {
            coop: true,
          },
          details: true,
        },
      }),
      this.variableDAO.getMappedByCode([
        VAR_ABW_CODE,
        VAR_TRG_IP_CODE,
        VAR_HARVEST_TONASE_CODE,
        VAR_HARVESTED_CODE,
        VAR_TRG_ACC_MORT_CODE,
        VAR_FEED_CON_CODE,
        VAR_TOMO_CODE,
        VAR_KOPA_CODE,
      ]),
      this.repopulationDAO.getMany({
        where: {
          farmingCycleId,
        },
      }),
    ]);

    // determine day
    const day = differenceInCalendarDays(
      taskTicket.reportedDate,
      taskTicket.farmingCycle.farmingCycleStartDate,
    );

    // error prevention, assign empty dailyMonitoring
    if (!taskTicket.dailyMonitoring) {
      const now = new Date();

      taskTicket.dailyMonitoring = {
        taskTicketId,
        farmingCycleId,
        erpCode: null,
        day,
        date: format(taskTicket.reportedDate, DATE_SQL_FORMAT),
        reportStatus: DAILY_MONITORING_STATUS_ENUM.EMPTY,
        executedBy: null,
        reviewedBy: null,
        bw: null,
        adg: null,
        ip: null,
        fcr: null,
        feedIntake: null,
        mortality: null,
        feedRemaining: null,
        feedStockoutDate: null,
        populationTotal: null,
        populationHarvested: null,
        populationMortaled: null,
        farmingCycle: null,
        taskTicket: null,
        averageChickenAge: null,
        createdDate: now,
        modifiedDate: now,
      };
    }

    // in case farmingCycleStartDate is changed via FMS
    taskTicket.dailyMonitoring.day = day;

    // determine whether farmingCycle is repopulated or not
    const isFarmingCycleRepopulated: boolean = count > 0;

    // get repopulation conditions if farmingCycle is repopulated
    const {
      isAfterRepopulationPeriod,
      isExactlyOneDayAfterRepopulation,
      totalAdjustedPopulation,
      totalAdjustedPopulationMortaled,
    } = this.repopulationConditions(day, repopulations);

    // determine new status
    if (updateStatusStrategy) {
      if (
        user &&
        taskTicket.dailyMonitoring.reportStatus === DAILY_MONITORING_STATUS_ENUM.EMPTY &&
        isBefore(addDays(taskTicket.reportedDate, DAILY_REPORT_DEADLINE), taskTicket.executedDate)
      ) {
        taskTicket.dailyMonitoring.executedBy = user.id;
        taskTicket.dailyMonitoring.reportStatus = DAILY_MONITORING_STATUS_ENUM.LATE;
      } else if (
        user &&
        taskTicket.alreadyExecute &&
        taskTicket.dailyMonitoring.reportStatus === DAILY_MONITORING_STATUS_ENUM.EMPTY
      ) {
        taskTicket.dailyMonitoring.executedBy = user?.id || null;
        taskTicket.dailyMonitoring.reportStatus = DAILY_MONITORING_STATUS_ENUM.FILLED;
      }
      if (user?.role === USER_TYPE.PPL) {
        taskTicket.dailyMonitoring.reviewedBy = user?.id || null;
        taskTicket.dailyMonitoring.reportStatus = DAILY_MONITORING_STATUS_ENUM.REVIEWED;
      }
    }

    const [
      previousDailyMonitoring,
      totalFeedConsumption,
      nextTaskTicket,
      [prevHarvested],
      smartScaleWeighing,
    ] = await Promise.all([
      this.dao.getOne({
        where: {
          farmingCycleId,
          day: taskTicket.dailyMonitoring.day - 1,
        },
      }),
      this.taskTicketDDAO.getLatestSum(variables.get(VAR_FEED_CON_CODE)!.id, farmingCycleId, {
        reportedUntil: taskTicket.reportedDate,
        reportedUntilFormat: DATETIME_59_SQL_FORMAT,
        taskCode: TASK_LAPORAN_AKHIR_HARI,
      }),
      this.taskTicketDAO.findNextTicket(taskTicket.farmingCycleTaskId, taskTicket.reportedDate),
      this.harvestRealizationDAO.getMany({
        where: {
          farmingCycleId,
          harvestDate: LessThanOrEqual(format(taskTicket.reportedDate, DATE_SQL_FORMAT)),
          status: Raw((alias) => `(${alias} is null OR ${alias} != :deleted)`, {
            deleted: RealizationStatusEnum.DELETED,
          }),
        },
      }),
      this.smartScaleWeighingDAO.getOneByFarmingCycleId(
        taskTicket.farmingCycleId,
        format(taskTicket.reportedDate, DATE_SQL_FORMAT),
      ),
    ]);

    const harvestedChicken = prevHarvested.reduce(
      (prev, item) => ({
        total: prev.total + item.quantity,
        totalAge:
          prev.totalAge +
          differenceInCalendarDays(
            new Date(item.harvestDate),
            taskTicket.farmingCycle.farmingCycleStartDate,
          ) *
            item.quantity,
        totalWeightKG: prev.totalWeightKG + item.tonnage,
      }),
      {
        total: 0,
        totalAge: 0,
        totalWeightKG: 0,
      },
    );

    // map task ticket detail by variable id
    const mapVariableToTaskTicketD = taskTicket.details.reduce((prev, current) => {
      prev.set(current.variableId, current);
      return prev;
    }, new Map<string, TaskTicketD>());

    // set actual bw from task ticket
    const bwTaskTicketD = mapVariableToTaskTicketD.get(variables.get(VAR_ABW_CODE)!.id);
    taskTicket.dailyMonitoring.bw =
      (bwTaskTicketD && parseInt(bwTaskTicketD.dataValue || '0', 10)) || 0;

    // if smart scale is used, replace bw with records from smart scale
    if (smartScaleWeighing && smartScaleWeighing.details.length > 0) {
      // smart scale weighing saves weight in KG
      taskTicket.dailyMonitoring.bw = smartScaleWeighing.avgWeight * 1000;
    }

    /**
     * Calculate ADG (additional daily gain)
     * adg = current_bw - prev_bw
     */
    taskTicket.dailyMonitoring.adg =
      taskTicket.dailyMonitoring.bw - (previousDailyMonitoring?.bw || 0);

    /**
     * Set Population Variable
     * - mortaled
     * - harvested
     * - total (initial population)
     */

    const tomoTaskTicketD = mapVariableToTaskTicketD.get(variables.get(VAR_TOMO_CODE)!.id);

    let populationMortaled: number = 0;
    if (
      isFarmingCycleRepopulated &&
      isAfterRepopulationPeriod &&
      isExactlyOneDayAfterRepopulation
    ) {
      populationMortaled =
        ((tomoTaskTicketD && parseInt(tomoTaskTicketD.dataValue || '0', 10)) || 0) +
        (previousDailyMonitoring?.populationMortaled || 0) -
        totalAdjustedPopulationMortaled;
    } else {
      populationMortaled =
        ((tomoTaskTicketD && parseInt(tomoTaskTicketD.dataValue || '0', 10)) || 0) +
        (previousDailyMonitoring?.populationMortaled || 0);
    }

    taskTicket.dailyMonitoring.populationMortaled = populationMortaled;

    taskTicket.dailyMonitoring.populationHarvested = harvestedChicken.total;

    let initialPopulation: number = 0;
    if (isFarmingCycleRepopulated) {
      initialPopulation = taskTicket.farmingCycle.initialPopulation + totalAdjustedPopulation;
    } else {
      initialPopulation = taskTicket.farmingCycle.initialPopulation;
    }
    taskTicket.dailyMonitoring.populationTotal = initialPopulation;

    /**
     * Calculate Mortality Rate
     * mortality_rate = mortaled_population / initial_population
     */
    taskTicket.dailyMonitoring.mortality =
      (taskTicket.dailyMonitoring.populationMortaled / taskTicket.farmingCycle.initialPopulation) *
      100;

    /**
     * FCR Calculation
     * Formula:
     * fcr = total_feed_consumption_KG / (total_chicken_weight_KG + total_harvested_weight_KG)
     */
    const currentPopulation =
      taskTicket.dailyMonitoring.populationTotal -
      taskTicket.dailyMonitoring.populationHarvested -
      taskTicket.dailyMonitoring.populationMortaled;

    const currentPopulationWeightKG = (taskTicket.dailyMonitoring.bw * currentPopulation) / 1000;

    const totalFeedConsumptionKG = totalFeedConsumption * 50;

    taskTicket.dailyMonitoring.fcr =
      totalFeedConsumptionKG / (currentPopulationWeightKG + harvestedChicken.totalWeightKG) || 0;

    // prevenet NaN and Infinity value
    if (
      Number.isNaN(taskTicket.dailyMonitoring.fcr) ||
      !Number.isFinite(taskTicket.dailyMonitoring.fcr)
    ) {
      taskTicket.dailyMonitoring.fcr = 0;
    }

    /**
     * IP Calculation
     */
    const sigmaCurrentPopulationAge = currentPopulation * taskTicket.dailyMonitoring.day;

    taskTicket.dailyMonitoring.averageChickenAge =
      (harvestedChicken.totalAge + sigmaCurrentPopulationAge) /
      (taskTicket.dailyMonitoring.populationTotal - taskTicket.dailyMonitoring.populationMortaled);

    const survivePopulation =
      taskTicket.dailyMonitoring.populationTotal - taskTicket.dailyMonitoring.populationMortaled;

    const averagePopulationWeight =
      ((currentPopulationWeightKG + harvestedChicken.totalWeightKG) * 1000) / survivePopulation;

    taskTicket.dailyMonitoring.ip =
      (((survivePopulation / taskTicket.dailyMonitoring.populationTotal) *
        averagePopulationWeight) /
        (taskTicket.dailyMonitoring.fcr * taskTicket.dailyMonitoring.averageChickenAge)) *
      10;

    // prevenet NaN and Infinity value
    if (
      Number.isNaN(taskTicket.dailyMonitoring.ip) ||
      !Number.isFinite(taskTicket.dailyMonitoring.ip)
    ) {
      taskTicket.dailyMonitoring.ip = 0;
    }

    /**
     * calculate feed intake
     * fit = feed_quantity_gram / current_population
     */
    const feedConTaskTicketD = mapVariableToTaskTicketD.get(variables.get(VAR_FEED_CON_CODE)!.id);

    taskTicket.dailyMonitoring.feedIntake = currentPopulation
      ? (((feedConTaskTicketD && parseInt(feedConTaskTicketD.dataValue || '0', 10)) || 0) *
          50 *
          1000) /
        currentPopulation
      : 0;

    /**
     * - get total feed remaining
     * - estimate feed stockout date
     */
    const [grossFeedRemaining, feedTrDelivered, feedTargets] = await Promise.all([
      this.farmingCycleFeedStockDDAO.getRemainingFeed(
        farmingCycleId,
        format(taskTicket.reportedDate, DATETIME_59_SQL_FORMAT),
      ),
      this.transferRequestDAO.totalQuantity(farmingCycleId, {
        source: 'gr',
        isDelivered: true,
        deliveredUntil: format(taskTicket.reportedDate, DATETIME_59_SQL_FORMAT),
      }),
      this.targetDaysDDAO.getMany({
        where: {
          day: MoreThan(day),
          target: {
            coopTypeId: taskTicket.farmingCycle.coop.coopTypeId,
            chickTypeId: taskTicket.farmingCycle.chickTypeId,
            variableId: variables.get(VAR_KOPA_CODE)!.id,
          },
        },
        order: {
          day: 'ASC',
        },
        relations: {
          target: true,
        },
        cache: hoursToMilliseconds(3),
      }),
    ]);

    const feedRemaining = grossFeedRemaining - feedTrDelivered;
    taskTicket.dailyMonitoring.feedRemaining = feedRemaining;

    let qtyRemaining = feedRemaining;
    const feedDayRemaining = feedTargets.findIndex((val) => {
      const consumptionEstimationKG = (currentPopulation * val.minValue) / 1000.0; // in KG
      const consumptionEstimationSack = Math.ceil(consumptionEstimationKG / 50.0); // in sack
      qtyRemaining -= consumptionEstimationSack;
      if (qtyRemaining <= 0) return true;
      return false;
    });

    taskTicket.dailyMonitoring.feedStockoutDate = format(
      addDays(
        taskTicket.reportedDate,
        feedDayRemaining === -1 ? feedTargets.length : feedDayRemaining,
      ),
      DATE_SQL_FORMAT,
    );

    await this.dao.createOne(taskTicket.dailyMonitoring, user);

    /**
     * add job to trigger next day calculation
     */
    if (nextTaskTicket) {
      await this.calculateDailyMonitoringQueue.addJob({
        user,
        farmingCycleId: nextTaskTicket.farmingCycleId,
        taskTicketId: nextTaskTicket.id,
        updateStatusStrategy: updateStatusStrategy === 'single' ? undefined : updateStatusStrategy,
      });
    }

    return taskTicket.dailyMonitoring;
  }

  /**
   * initializeEmptyDailyMonitoring iterate last 24 hour taskticket (TD-033)
   * that is not included in dailymonitoring table
   */
  async initializeEmptyDailyMonitoring(opts?: { farmingCycleId?: string }) {
    let [taskTickets, count] = await this.taskTicketDAO.getTaskWithoutDailyMonitoring(50, opts);

    // iterate data until count = 0
    while (count > 0) {
      // eslint-disable-next-line no-await-in-loop
      await this.dailyMonitoringDAO.upsertMany(
        taskTickets.map<DeepPartial<DailyMonitoring>>((tt) => ({
          taskTicketId: tt.id,
          farmingCycleId: tt.farmingCycleId,
          date: format(tt.reportedDate, DATE_SQL_FORMAT),
          day: Math.abs(
            differenceInCalendarDays(tt.farmingCycle.farmingCycleStartDate, tt.reportedDate),
          ),
          reportStatus: DAILY_MONITORING_STATUS_ENUM.EMPTY,
        })),
      );

      taskTickets.forEach((tt) =>
        this.calculateDailyMonitoringQueue.addJob({
          farmingCycleId: tt.farmingCycleId,
          taskTicketId: tt.id,
        }),
      );
      // eslint-disable-next-line no-await-in-loop
      const [nextTaskTickets, nextCount] = await this.taskTicketDAO.getTaskWithoutDailyMonitoring(
        50,
        opts,
      );

      // infinite loop prevention
      if (count === nextCount) return;

      // assign for next iteration
      taskTickets = nextTaskTickets;
      count = nextCount;
    }
  }

  async triggerDailyMonitoringDeadline() {
    /**
     * Deadline Criteria
     * - date difference is >= 3 day
     * - report status is not DONE or LATE
     */
    const [dailyMonitorings] = await this.dailyMonitoringDAO.getMany({
      where: {
        date: LessThanOrEqual(format(addDays(new Date(), -3), DATE_SQL_FORMAT)),
        reportStatus: Not(
          In([DAILY_MONITORING_STATUS_ENUM.DONE, DAILY_MONITORING_STATUS_ENUM.LATE]),
        ),
      },
    });

    // map by status
    const mapDailyMonitoringByStatus = dailyMonitorings.reduce((prev, item) => {
      const val = prev.get(item.reportStatus) || [];

      val.push(item);

      prev.set(item.reportStatus, val);

      return prev;
    }, new Map<string, DailyMonitoring[]>());

    /**
     * Mark report status as LATE if current status is empty
     */
    const latePromises =
      mapDailyMonitoringByStatus.get(DAILY_MONITORING_STATUS_ENUM.EMPTY)?.map((val) =>
        this.dailyMonitoringDAO.updateOne(
          {
            farmingCycleId: val.farmingCycleId,
            taskTicketId: val.taskTicketId,
          },
          {
            reportStatus: DAILY_MONITORING_STATUS_ENUM.LATE,
          },
        ),
      ) || [];
    await Promise.all(latePromises);

    /**
     * Mark report status (FILLED and REVIEWED)
     * as DONE using queue
     */
    mapDailyMonitoringByStatus.get(DAILY_MONITORING_STATUS_ENUM.FILLED)?.forEach((val) => {
      this.finalizeDailyMonitoringQueue.addJob({
        farmingCycleId: val.farmingCycleId,
        taskTicketId: val.taskTicketId,
      });
    });
    mapDailyMonitoringByStatus.get(DAILY_MONITORING_STATUS_ENUM.REVIEWED)?.forEach((val) => {
      this.finalizeDailyMonitoringQueue.addJob({
        farmingCycleId: val.farmingCycleId,
        taskTicketId: val.taskTicketId,
      });
    });
  }

  async finalizeDailyMonitoringStatus(farmingCycleId: string, taskTicketId: string) {
    const [dailyMonitoring, variables] = await Promise.all([
      this.dailyMonitoringDAO.getOneStrict({
        where: {
          farmingCycleId,
          taskTicketId,
        },
        relations: {
          farmingCycle: {
            coop: true,
          },
          taskTicket: {
            details: true,
          },
        },
      }),
      this.variableDAO.getMappedByCode([
        VAR_DEAD_CHICK_CODE,
        VAR_CULLED_CODE,
        VAR_FEED_TYPE_CODE,
        VAR_FEED_CON_CODE,
      ]),
    ]);

    const deadChicken =
      dailyMonitoring.taskTicket?.details.find(
        (val) => val.variableId === variables.get(VAR_DEAD_CHICK_CODE)!.id,
      )?.dataValue || '0';
    const culled =
      dailyMonitoring.taskTicket?.details.find(
        (val) => val.variableId === variables.get(VAR_CULLED_CODE)!.id,
      )?.dataValue || '0';
    const feedType =
      dailyMonitoring.taskTicket?.details.find(
        (val) => val.variableId === variables.get(VAR_FEED_TYPE_CODE)!.id,
      )?.dataValue || '';
    const feedQuantity =
      dailyMonitoring.taskTicket?.details.find(
        (val) => val.variableId === variables.get(VAR_FEED_CON_CODE)!.id,
      )?.dataValue || '0';

    const dailyMonitoringPayload: DeepPartial<DailyMonitoring> = {
      reportStatus: DAILY_MONITORING_STATUS_ENUM.DONE,
    };

    // FIXME:  please remove conditional USE_ERP feature flag once flow with ODOO is ready
    if (env.USE_ERP) {
      const result = await this.erpDAO.createDailyMonitoring(
        dailyMonitoring.erpCode || '',
        dailyMonitoring.farmingCycle!.coop.coopCode,
        dailyMonitoring.date,
        parseInt(deadChicken, 10),
        parseInt(culled, 10),
        feedType,
        parseInt(feedQuantity, 10),
        dailyMonitoring.bw || 0,
      );
      Object.assign(dailyMonitoringPayload, { erpCode: result.dailyMonitoringCode });
    }

    // update without transaction
    await this.dailyMonitoringDAO.updateOne(
      {
        farmingCycleId,
        taskTicketId,
      },
      dailyMonitoringPayload,
    );
  }

  async getDailyPerformanceSummary(
    farmingCycleId: string,
  ): Promise<GetDailyPerformanceSummaryResponseItem> {
    const [farmingCycle, dailyMonitoringDay8, variables] = await Promise.all([
      this.farmingCycleDAO.getOneStrict({
        where: {
          id: farmingCycleId,
        },
        relations: {
          farm: {
            owner: true,
            province: true,
            city: true,
            district: true,
            branch: true,
          },
          coop: {
            coopType: true,
            coopMembers: true,
          },
          userPpl: true,
          summary: true,
          farmingCycleMembers: {
            user: true,
          },
          contract: {
            contractType: true,
          },
        },
        order: {
          summary: {
            day: 'DESC',
          },
        },
      }),
      this.dailyMonitoringDAO.getOne({
        where: {
          farmingCycleId,
          day: 8,
        },
      }),
      this.variableDAO.getMappedByCode([VAR_AVG_WEIGHT_DOC_CODE, VAR_UNIFORMITY_CODE]),
    ]);

    const [mitraManager, [feedPO], taskBwDOC, taskUniformity] = await Promise.all([
      this.coopMemberDDAO.getOne({
        where: {
          coopId: farmingCycle.coopId,
          user: {
            userType: USER_TYPE.MM,
          },
        },
        relations: {
          user: true,
        },
      }),
      this.purchaseOrderDAO.getMany({
        where: {
          farmingCycleId,
          isApproved: true,
          type: 'pakan',
        },
        relations: {
          purchaseOrderProducts: true,
        },
      }),
      this.taskTicketDDAO.getOne({
        where: {
          variableId: variables.get(VAR_AVG_WEIGHT_DOC_CODE)!.id,
          dataValue: Not(IsNull()),
          taskTicket: {
            farmingCycleId: farmingCycle.id,
          },
        },
      }),
      this.taskTicketDDAO.getOne({
        where: {
          variableId: variables.get(VAR_UNIFORMITY_CODE)!.id,
          dataValue: Not(IsNull()),
          taskTicket: {
            farmingCycleId: farmingCycle.id,
          },
        },
      }),
    ]);

    const dailyMonitorings = await this.getAllDailyMonitorings(farmingCycleId);

    const dailyMonitoringDetail = dailyMonitorings.reduce((prev, dm) => {
      if (!prev.day) {
        return dm;
      }

      if (prev.day < dm.day && dm.ip?.actual) {
        return dm;
      }
      return prev;
    }, {} as DailyPerformanceMonitoringItem);

    const feedInfo = feedPO.reduce(
      (prev, item) => {
        item.purchaseOrderProducts.forEach((val) => {
          if (
            val.categoryCode === 'PAKAN' &&
            (val.subcategoryCode === 'PRESTARTER' ||
              val.subcategoryCode === 'STARTER' ||
              val.subcategoryCode === 'FINISHER')
          ) {
            prev[val.subcategoryCode].push(val.productName.split('@')[0].trim());
          }
        });

        return prev;
      },
      {
        PRESTARTER: [] as string[],
        STARTER: [] as string[],
        FINISHER: [] as string[],
      },
    );

    const defaultPerformance = {
      actual: null,
      standard: null,
    };
    const dailyPerformance = farmingCycle.summary.reduce<DailyPerformanceD | undefined>(
      (prev, item) => {
        const closeDate =
          (farmingCycle.closedDate && new Date(farmingCycle.closedDate)) || undefined;
        const itemDate = addDays(farmingCycle.farmingCycleStartDate, item.day);

        if (isAfter(itemDate, closeDate)) return prev;

        if (!prev) return item;

        const prevDate = addDays(farmingCycle.farmingCycleStartDate, prev.day);

        if (closeDate && !isAfter(itemDate, closeDate) && isAfter(itemDate, prevDate)) {
          return item;
        }

        return prev;
      },
      undefined,
    );

    const weeklyIssues = {
      diseases: [] as string[],
      farmInput: [] as string[],
      forceMajeure: [] as string[],
      infrastructure: [] as string[],
      management: [] as string[],
      others: [] as string[],
    };
    for (let i = 0; i < farmingCycle.summary.length && i < 7; i += 1) {
      if (farmingCycle.summary[i].diseaseIssues) {
        weeklyIssues.diseases.push(...farmingCycle.summary[i].diseaseIssues!.split(','));
      }
      if (farmingCycle.summary[i].farmInputIssues) {
        weeklyIssues.farmInput.push(...farmingCycle.summary[i].farmInputIssues!.split(','));
      }
      if (farmingCycle.summary[i].forceMajeureIssues) {
        weeklyIssues.forceMajeure.push(...farmingCycle.summary[i].forceMajeureIssues!.split(','));
      }
      if (farmingCycle.summary[i].infrastructureIssues) {
        weeklyIssues.infrastructure.push(
          ...farmingCycle.summary[i].infrastructureIssues!.split(','),
        );
      }
      if (farmingCycle.summary[i].managementIssues) {
        weeklyIssues.management.push(...farmingCycle.summary[i].managementIssues!.split(','));
      }
      if (farmingCycle.summary[i].otherIssues) {
        weeklyIssues.others.push(farmingCycle.summary[i].otherIssues!);
      }
    }

    const recordingTime =
      (farmingCycle.actualDocIn && farmingCycle.actualDocIn.getHours() >= 12
        ? addDays(farmingCycle.actualDocIn, 1)
        : farmingCycle.actualDocIn) || null;

    return {
      farm: {
        owner: farmingCycle.farm.owner.fullName,
        coop: {
          name: farmingCycle.coop.coopName,
          type: farmingCycle.coop.coopType.coopTypeName,
          mm: mitraManager?.user || null,
          ppl: farmingCycle.farmingCycleMembers
            .filter((val) => val.user.userType.toUpperCase() === USER_TYPE.PPL.toUpperCase())
            .map((val) => val.user),
          contractType:
            farmingCycle.contract?.contractType?.contractName || farmingCycle.contractId,
          branch: {
            name: farmingCycle.farm.branch?.name || null,
            province: {
              name: farmingCycle.farm.province.provinceName,
            },
            city: {
              name: farmingCycle.farm.city.cityName,
            },
            district: {
              name: farmingCycle.farm.district.districtName,
            },
          },
        },
      },
      doc: {
        arrivalTime:
          (farmingCycle.actualDocIn && format(farmingCycle.actualDocIn, DATETIME_SQL_FORMAT)) ||
          null,
        hatchery: farmingCycle.hatchery,
        supplier: farmingCycle.chickSupplier,
        recordingTime: recordingTime && format(recordingTime, DATE_SQL_FORMAT),
        bw:
          farmingCycle.docInBW ||
          (taskBwDOC?.dataValue && parseInt(taskBwDOC.dataValue, 10)) ||
          null,
        uniformity:
          farmingCycle.docInUniformity ||
          (taskUniformity?.dataValue && parseInt(taskUniformity.dataValue, 10)) ||
          null,
        summary: (dailyPerformance && dailyPerformance.summary) || null,
      },
      feed: {
        prestarter: feedInfo.PRESTARTER.filter((val, idx, self) => self.indexOf(val) === idx).join(
          ', ',
        ),
        starter: feedInfo.STARTER.filter((val, idx, self) => self.indexOf(val) === idx).join(', '),
        finisher: feedInfo.FINISHER.filter((val, idx, self) => self.indexOf(val) === idx).join(
          ', ',
        ),
      },
      issues: {
        date:
          (dailyPerformance &&
            dailyPerformance.day !== null &&
            format(
              addDays(farmingCycle.farmingCycleStartDate, dailyPerformance.day),
              DATE_SQL_FORMAT,
            )) ||
          format(new Date(), DATE_SQL_FORMAT),
        diseases: weeklyIssues.diseases.filter((val, idx, self) => idx === self.indexOf(val)),
        farmInput: weeklyIssues.farmInput.filter((val, idx, self) => idx === self.indexOf(val)),
        forceMajeure: weeklyIssues.forceMajeure.filter(
          (val, idx, self) => idx === self.indexOf(val),
        ),
        infrastructure: weeklyIssues.infrastructure.filter(
          (val, idx, self) => idx === self.indexOf(val),
        ),
        management: weeklyIssues.management.filter((val, idx, self) => idx === self.indexOf(val)),
        others: weeklyIssues.others.filter((val, idx, self) => idx === self.indexOf(val)),
      },
      performance: {
        age: differenceInCalendarDays(
          (farmingCycle.closedDate && new Date(farmingCycle.closedDate)) || new Date(),
          new Date(farmingCycle.farmingCycleStartDate),
        ),
        bw: (dailyMonitoringDetail && dailyMonitoringDetail.bw) || defaultPerformance,
        fcr: (dailyMonitoringDetail && dailyMonitoringDetail.fcr) || defaultPerformance,
        ip: (dailyMonitoringDetail && dailyMonitoringDetail.ip) || defaultPerformance,
        mortality:
          (dailyMonitoringDetail && dailyMonitoringDetail.mortalityCummulative) ||
          defaultPerformance,
        population: {
          current:
            (dailyMonitoringDetail &&
              dailyMonitoringDetail.population &&
              dailyMonitoringDetail.population.remaining) ||
            null,
          initial: farmingCycle.initialPopulation,
        },
        bwDayEight:
          ((farmingCycle.docInBW || taskBwDOC?.dataValue) &&
            (dailyMonitoringDay8?.bw || 0) /
              (farmingCycle.docInBW || parseInt(taskBwDOC!.dataValue || '0', 10))) ||
          null,
      },
    };
  }

  async getCurrentPerformance(
    farmingCycleId: string,
    user: RequestUser,
  ): Promise<GetFarmingCyclePerformanceResponse> {
    const [farmingCycle, latestMonitoring] = await Promise.all([
      this.farmingCycleDAO.getOneStrict({
        where: {
          id: farmingCycleId,
        },
        relations: {
          coop: true,
        },
      }),
      this.dailyMonitoringDAO.getOne({
        where: {
          farmingCycleId,
        },
        order: {
          day: 'DESC',
        },
      }),
    ]);

    const dailyMonitoring =
      (latestMonitoring?.taskTicketId &&
        (await this.getDailyMonitoringDetail(
          farmingCycleId,
          latestMonitoring?.taskTicketId,
          user,
        ))) ||
      null;

    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);
    const additionalDate = now.getHours() >= 17 ? addDays(now, 1) : now;

    const additionalFeedTrDelivered =
      (now.getHours() < 17 &&
        (await this.transferRequestDAO.totalQuantity(farmingCycleId, {
          isDelivered: true,
          deliveredAt: format(now, DATE_SQL_FORMAT),
          source: 'gr',
        }))) ||
      0;

    const additionalFeedGr =
      (now.getHours() < 17 &&
        (await this.farmingCycleFeedStockDDAO.totalAddition(
          farmingCycleId,
          format(additionalDate, DATE_SQL_FORMAT),
          {
            fromDate: format(additionalDate, DATE_SQL_FORMAT),
          },
        ))) ||
      0;

    const [additionalHarvests] = (now.getHours() < 17 &&
      (await this.harvestRealizationDAO.getMany({
        where: {
          farmingCycleId,
          harvestDate: format(now, DATE_SQL_FORMAT),
        },
      }))) || [[], 0];

    const countAdditionalHarvest = additionalHarvests.reduce(
      (prev, item) => prev + item.quantity,
      0,
    );

    const day = Math.abs(differenceInCalendarDays(farmingCycle.farmingCycleStartDate, now));

    return {
      code: 200,
      data: {
        coopName: farmingCycle.coop.coopName,
        day,
        period: farmingCycle.coop.totalPeriod,
        currentTemperature: null,
        chickInDate: farmingCycle.chickInDate,
        averageChickenAge: dailyMonitoring?.averageChickenAge || null,
        performance: {
          bw: {
            actual: dailyMonitoring?.bw.actual || 0,
            standard: dailyMonitoring?.bw.standard || 0,
          },
          ip: {
            actual: dailyMonitoring?.ip.actual || 0,
            standard: dailyMonitoring?.ip.standard || 0,
          },
          fcr: {
            actual: dailyMonitoring?.fcr.actual || 0,
            standard: dailyMonitoring?.fcr.standard || 0,
          },
          mortality: {
            actual: dailyMonitoring?.mortality.actual || 0,
            standard: dailyMonitoring?.mortality.standard || 0,
          },
        },
        population: {
          mortality: dailyMonitoring?.population.mortality || 0,
          harvested: (dailyMonitoring?.population.harvested || 0) + countAdditionalHarvest,
          total: farmingCycle.initialPopulation,
        },
        feed:
          (dailyMonitoring?.feed && {
            remaining:
              Number(dailyMonitoring.feed.remaining) +
              Number(additionalFeedGr) -
              Number(additionalFeedTrDelivered),
            stockoutDate: dailyMonitoring.feed.stockoutDate,
          }) ||
          null,
      },
    };
  }

  async manualTriggerDailyMonitoringCalculation(
    farmingCycleId: string,
    taskTicketId?: string,
    user?: RequestUser,
    updateStatusStrategy?: 'single' | 'multiple',
  ) {
    let targetTaskTicket: string | undefined;

    if (taskTicketId) {
      targetTaskTicket = taskTicketId;
    }
    if (!targetTaskTicket) {
      const backupTaskTicket = await this.dailyMonitoringDAO.getOne({
        where: {
          farmingCycleId,
        },
        order: {
          day: 'ASC',
        },
      });

      targetTaskTicket = backupTaskTicket?.taskTicketId;
    }
    if (!targetTaskTicket) {
      return;
    }

    await this.calculateDailyMonitoringQueue.addJob({
      user,
      farmingCycleId,
      taskTicketId: targetTaskTicket,
      updateStatusStrategy,
    });
  }

  // eslint-disable-next-line class-methods-use-this
  private repopulationConditions(
    currentDay: number,
    repopulations: Repopulation[],
  ): RepopulationConditions {
    let totalAdjustedPopulation: number = 0;
    let totalAdjustedPopulationMortaled: number = 0;
    let isAfterRepopulationPeriod: boolean = true;
    let isExactlyOneDayAfterRepopulation: boolean = false;

    repopulations.forEach((repopulation) => {
      if (currentDay <= repopulation.repopulateDay) {
        isAfterRepopulationPeriod = false;
        totalAdjustedPopulation += Number(repopulation.approvedAmount);
      }

      if (currentDay === repopulation.repopulateDay + 1) {
        isExactlyOneDayAfterRepopulation = true;
        totalAdjustedPopulationMortaled += Number(repopulation.approvedAmount);
      }
    });

    return {
      isAfterRepopulationPeriod,
      isExactlyOneDayAfterRepopulation,
      totalAdjustedPopulation,
      totalAdjustedPopulationMortaled,
    };
  }
}
