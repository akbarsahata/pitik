import { randomUUID } from 'crypto';
import {
  addDays,
  differenceInCalendarDays,
  format,
  hoursToMilliseconds,
  isAfter,
  isBefore,
  isEqual,
} from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { Inject, Service } from 'fastify-decorators';
import {
  And,
  DeepPartial,
  FindOptionsWhere,
  In,
  IsNull,
  LessThan,
  LessThanOrEqual,
  Like,
  MoreThan,
  MoreThanOrEqual,
  Not,
  QueryRunner,
  Raw,
} from 'typeorm';
import { AiBwImgPredictionDAO } from '../dao/aiBwImgPrediction.dao';
import { DailyMonitoringDAO } from '../dao/dailyMonitoring.dao';
import { DailyMonitoringRevisionDAO } from '../dao/dailyMonitoringRevision.dao';
import { FarmingCycleDAO } from '../dao/farmingCycle.dao';
import { FarmingCycleFeedStockAdjustmentDAO } from '../dao/farmingCycleFeedStockAdjustment.dao';
import { FarmingCycleFeedStockDDAO } from '../dao/farmingCycleFeedStockD.dao';
import { FarmingCycleFeedStockSummaryDAO } from '../dao/farmingCycleFeedStockSummary.dao';
import { FarmingCycleOvkStockLogDAO } from '../dao/farmingCycleOvkStockLog.dao';
import { HarvestRealizationDAO } from '../dao/harvestRealization.dao';
import { HarvestEggDAO } from '../dao/layer/harvestEgg.dao';
import { PurchaseOrderDAO } from '../dao/purchaseOrder.dao';
import { RepopulationDAO } from '../dao/repopulation.dao';
import { SmartScaleWeighingDAO } from '../dao/smartScaleWeighing.dao';
import { TargetDAO } from '../dao/target.dao';
import { TargetDaysDDAO } from '../dao/targetDaysD.dao';
import { TaskTicketDAO } from '../dao/taskTicket.dao';
import { TaskTicketDDAO } from '../dao/taskTicketD.dao';
import { TransferRequestDAO } from '../dao/transferRequest.dao';
import { UserManagementDAO } from '../dao/userManagement.dao';
import { VariableDAO } from '../dao/variable.dao';
import { DailyMonitoring } from '../datasources/entity/pgsql/DailyMonitoring.entity';
import {
  DailyMonitoringRevision,
  DailyMonitoringRevisionStatusEnum,
} from '../datasources/entity/pgsql/DailyMonitoringRevision.entity';
import { DailyPerformanceD } from '../datasources/entity/pgsql/DailyPerformanceD.entity';
import { FarmChickCategory } from '../datasources/entity/pgsql/Farm.entity';
import { RealizationStatusEnum } from '../datasources/entity/pgsql/HarvestRealization.entity';
import { Repopulation } from '../datasources/entity/pgsql/Repopulation.entity';
import { TargetDaysD } from '../datasources/entity/pgsql/TargetDaysD.entity';
import { TaskTicketD } from '../datasources/entity/pgsql/TaskTicketD.entity';
import { User } from '../datasources/entity/pgsql/User.entity';
import { GetDailyPerformanceSummaryResponseItem } from '../dto/dailyPerformance.dto';
import {
  DailyMonitoringVariableKey,
  dailyMonitoringVariableKeyToCode,
  dailyMonitoringVariableKeyToStandardValue,
  DailyMonitoringVariableResponse,
  DailyPerformanceMonitoringItem,
  GetDailyMonitoringDateResponse,
  GetFarmingCyclePerformanceResponse,
  RequestDailyMonitoringRevisionBody,
} from '../dto/farmingCycle.dto';
import { CalculateDailyMonitoringQueue } from '../jobs/queues/calculate-daily-monitoring.queue';
import { DailyMonitoringUpsertOdooQueue } from '../jobs/queues/daily-monitoring-upsert-odoo.queue';
import { FinalizeDailyMonitoringQueue } from '../jobs/queues/finalize-daily-monitoring.queue';
import { GenerateDailyReportReminderQueue } from '../jobs/queues/generate-daily-report-reminder.queue';
import {
  CONTRACT_TYPE,
  DAILY_MONITORING_STATUS,
  DAILY_MONITORING_STATUS_ENUM,
  DAILY_REPORT_DEADLINE,
  DATETIME_17_SQL_FORMAT,
  DATETIME_59_SQL_FORMAT,
  DATETIME_SQL_FORMAT,
  DATE_SQL_FORMAT,
  DEFAULT_TIME_ZONE,
  FEED_STOCK_NOTES,
  USER_TYPE,
} from '../libs/constants';
import {
  TASK_DATA_INSTRUCTION_REFERENCE,
  TASK_LAPORAN_AKHIR_HARI,
} from '../libs/constants/taskCodes';
import {
  VAR_ABW_CODE,
  VAR_AVG_WEIGHT_DOC_CODE,
  VAR_CULLED_CODE,
  VAR_DEAD_CHICK_CODE,
  VAR_EGG_MASS_CODE,
  VAR_EGG_WEIGHT_CODE,
  VAR_FCR_TARGET_CODE,
  VAR_FEED_CON_CODE,
  VAR_FEED_TYPE_CODE,
  VAR_HARVESTED_CODE,
  VAR_HARVEST_TONASE_CODE,
  VAR_HDP_CODE,
  VAR_KOPA_CODE,
  VAR_MOHA_CODE,
  VAR_TOMO_CODE,
  VAR_TRG_ACC_MORT_CODE,
  VAR_TRG_IP_CODE,
  VAR_UNIFORMITY_CODE,
} from '../libs/constants/variableCodes';
import { Transactional } from '../libs/decorators/transactional';
import { RequestUser } from '../libs/types/index.d';
import { isRoleAllowed, uomConverter } from '../libs/utils/helpers';

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

  @Inject(PurchaseOrderDAO)
  private purchaseOrderDAO!: PurchaseOrderDAO;

  @Inject(RepopulationDAO)
  private repopulationDAO!: RepopulationDAO;

  @Inject(TransferRequestDAO)
  private transferRequestDAO!: TransferRequestDAO;

  @Inject(HarvestEggDAO)
  private harvestEggDAO!: HarvestEggDAO;

  @Inject(HarvestRealizationDAO)
  private harvestRealizationDAO!: HarvestRealizationDAO;

  @Inject(SmartScaleWeighingDAO)
  private smartScaleWeighingDAO!: SmartScaleWeighingDAO;

  @Inject(FarmingCycleFeedStockAdjustmentDAO)
  private farmingCycleFeedStockAdjustmentDAO!: FarmingCycleFeedStockAdjustmentDAO;

  @Inject(DailyMonitoringUpsertOdooQueue)
  private dailyMonitoringUpsertOdooQueue!: DailyMonitoringUpsertOdooQueue;

  @Inject(GenerateDailyReportReminderQueue)
  private generateDailyReportReminderQueue!: GenerateDailyReportReminderQueue;

  @Inject(FarmingCycleFeedStockSummaryDAO)
  private farmingCycleFeedStockSummaryDAO!: FarmingCycleFeedStockSummaryDAO;

  @Inject(FarmingCycleOvkStockLogDAO)
  private farmingCycleOvkStogLogDAO!: FarmingCycleOvkStockLogDAO;

  @Inject(UserManagementDAO)
  private userManagementDAO!: UserManagementDAO;

  @Inject(AiBwImgPredictionDAO)
  private aiBwImgPredictionDAO!: AiBwImgPredictionDAO;

  @Inject(DailyMonitoringRevisionDAO)
  private dailyMonitoringRevisionDAO!: DailyMonitoringRevisionDAO;

  async getAllDailyMonitorings(
    farmingCycleId: string,
    opts?: {
      taskTicketId?: string;
      user?: RequestUser;
      date?: string;
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

    const [variables, [dailyMonitorings], [bwPredictionData]] = await Promise.all([
      this.variableDAO.getMappedByCode([
        VAR_ABW_CODE,
        VAR_CULLED_CODE,
        VAR_DEAD_CHICK_CODE,
        VAR_FCR_TARGET_CODE,
        VAR_KOPA_CODE,
        VAR_MOHA_CODE,
        VAR_TRG_ACC_MORT_CODE,
        VAR_TRG_IP_CODE,
        VAR_HDP_CODE,
        VAR_EGG_WEIGHT_CODE,
        VAR_EGG_MASS_CODE,
      ]),
      this.dailyMonitoringDAO.getMany({
        where: {
          farmingCycleId,
          taskTicketId: opts?.taskTicketId,
          date:
            opts?.date ||
            (farmingCycle.closedDate
              ? LessThanOrEqual(format(new Date(farmingCycle.closedDate), DATE_SQL_FORMAT))
              : undefined),
        },
        relations: {
          executor: true,
          taskTicket: {
            details: true,
          },
          mortalities: true,
        },
        order: {
          day: 'ASC',
        },
      }),
      this.aiBwImgPredictionDAO.getMany({
        where: {
          farmingCycleId,
        },
        order: {
          createdAt: 'DESC',
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
          {
            day: item.day,
            target: {
              coopTypeId: farmingCycle.coop.coopTypeId,
              chickTypeId: farmingCycle.chickTypeId,
              variableId: variables.get(VAR_EGG_MASS_CODE)!.id,
            },
          },
          {
            day: item.day,
            target: {
              coopTypeId: farmingCycle.coop.coopTypeId,
              chickTypeId: farmingCycle.chickTypeId,
              variableId: variables.get(VAR_HDP_CODE)!.id,
            },
          },
          {
            day: item.day,
            target: {
              coopTypeId: farmingCycle.coop.coopTypeId,
              chickTypeId: farmingCycle.chickTypeId,
              variableId: variables.get(VAR_EGG_WEIGHT_CODE)!.id,
            },
          },
        );

        return prev;
      },
      [],
    );

    const [[feedStocks], [ovkStocks]] = await Promise.all([
      this.farmingCycleFeedStockDDAO.getMany({
        where: {
          farmingCycleId,
          notes: Like(`feed_stock_minus - fc_feedstock_summary_id:%`),
        },
      }),
      this.farmingCycleOvkStogLogDAO.getMany({
        where: {
          farmingCycleId,
          notes: Like(`ovk_stock_minus - fc_ovkstock_summary_id:%`),
        },
      }),
    ]);

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
        dailyMonitoring?.executor?.userType &&
        isRoleAllowed(dailyMonitoring.executor.userType, [USER_TYPE.PPL]) &&
        reportStatus === DAILY_MONITORING_STATUS[DAILY_MONITORING_STATUS_ENUM.REVIEWED]
      ) {
        reportStatus = DAILY_MONITORING_STATUS[DAILY_MONITORING_STATUS_ENUM.FILLED];
      }

      const dead =
        dailyMonitoring.mortalities.reduce((prev, item) => prev + item.quantity, 0) ||
        parseInt(
          dailyMonitoring.taskTicket?.details.find(
            (val) => val.variableId === variables.get(VAR_DEAD_CHICK_CODE)!.id,
          )?.dataValue || '0',
          10,
        );

      const culled =
        dailyMonitoring.cull ||
        parseInt(
          dailyMonitoring.taskTicket?.details.find(
            (val) => val.variableId === variables.get(VAR_CULLED_CODE)!.id,
          )?.dataValue || '0',
          10,
        );

      const currentFeedConsumptions = feedStocks.filter(
        (item) => item.consumedDate === dailyMonitoring.date,
      );
      const feedConsumptions =
        currentFeedConsumptions.reduce((prev, item) => prev + item.qty, 0) ||
        parseInt(
          dailyMonitoring.taskTicket?.details.find(
            (val) => val.dataInstruction === TASK_DATA_INSTRUCTION_REFERENCE.TASK_FEED_CONSUMPTION,
          )?.dataValue || '0',
          10,
        );

      const currentOvkConsumptions = ovkStocks.filter(
        (item) => item.consumedDate === dailyMonitoring.date,
      );
      const ovkConsumptions =
        currentOvkConsumptions.reduce((prev, item) => prev + item.quantity, 0) ||
        parseInt(
          dailyMonitoring.taskTicket?.details.find(
            (val) => val.dataInstruction === TASK_DATA_INSTRUCTION_REFERENCE.TASK_OVK_CONSUMPTION,
          )?.dataValue || '0',
          10,
        );

      const bwPrediction = bwPredictionData.find(
        (elm) => elm.day.toString() === dailyMonitoring.day.toString(),
      );

      return {
        ...dailyMonitoring,
        feedStocks: currentFeedConsumptions,
        ovkStocks: currentOvkConsumptions,
        hdp: {
          actual: dailyMonitoring.hdp,
          standard:
            mappedTargetDays.get(`${variables.get(VAR_HDP_CODE)!.id}-${dailyMonitoring.day}`)
              ?.maxValue || null,
        },
        eggWeight: {
          actual: dailyMonitoring.eggWeight,
          standard:
            mappedTargetDays.get(`${variables.get(VAR_EGG_WEIGHT_CODE)!.id}-${dailyMonitoring.day}`)
              ?.maxValue || null,
        },
        eggMass: {
          actual: dailyMonitoring.eggMass,
          standard:
            mappedTargetDays.get(`${variables.get(VAR_EGG_MASS_CODE)!.id}-${dailyMonitoring.day}`)
              ?.maxValue || null,
        },
        averageChickenAge: dailyMonitoring.averageChickenAge,
        date: dailyMonitoring.date,
        reportStatus,
        bw: {
          actual: dailyMonitoring.bw,
          standard: bwTarget?.minValue || null,
        },
        bwPrediction: {
          actual: bwPrediction?.abwPrediction || 0,
          status:
            (bwPrediction?.abwActual !== 0 &&
              bwPrediction?.abwPrediction !== 0 &&
              bwPrediction?.abwActual === bwPrediction?.abwPrediction) ||
            false,
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
          consumption: feedConsumptions,
          remaining: dailyMonitoring.feedRemaining,
          stockoutDate: dailyMonitoring.feedStockoutDate || null,
        },
        ovk: {
          consumption: ovkConsumptions,
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
          culled,
          dead,
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
      throw new Error('daily monitoring tidak ditemukan');
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
    date: string,
    taskTicketId: string | null,
    user?: RequestUser,
    updateStatusStrategy?: 'single' | 'multiple',
  ): Promise<DailyMonitoring> {
    const farmingCycle = await this.farmingCycleDAO.getOneStrict({
      where: {
        id: farmingCycleId,
      },
      relations: {
        farm: true,
        coop: true,
      },
    });

    const [taskTicket, variables, [repopulations, count]] = await Promise.all([
      (taskTicketId &&
        this.taskTicketDAO.getOne({
          where: [
            {
              farmingCycleId,
              id: taskTicketId,
            },
            {
              farmingCycleId,
              reportedDate: new Date(format(new Date(date), DATETIME_17_SQL_FORMAT)),
            },
          ],
          relations: {
            dailyMonitoring: true,
            farmingCycle: {
              coop: true,
            },
            details: true,
          },
        })) ||
        null,
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

    let dailyMonitoring = await this.dailyMonitoringDAO.getOne({
      where: {
        farmingCycleId,
        date,
      },
      relations: {
        revisions: true,
        mortalities: true,
      },
    });

    // determine day
    let day =
      (taskTicket?.reportedDate &&
        differenceInCalendarDays(taskTicket.reportedDate, farmingCycle.farmingCycleStartDate)) ||
      differenceInCalendarDays(
        new Date(format(new Date(date), DATETIME_17_SQL_FORMAT)),
        farmingCycle.farmingCycleStartDate,
      );

    if (farmingCycle.farm.category === FarmChickCategory.LAYER) {
      day += (farmingCycle.pulletInWeeks || 18) * 7; // default pullet in is 18 weeks
    }

    // error prevention, assign empty dailyMonitoring
    const now = new Date();
    if (!dailyMonitoring) {
      dailyMonitoring = {
        taskTicketId: taskTicket?.id || null,
        farmingCycleId,
        erpCode: null,
        day,
        date,
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
        id: randomUUID(),
        cull: null,
        hdp: null,
        mortalityImage: null,
        recordingImage: null,
        remarks: null,
        createdBy: user?.id || null,
        modifiedBy: user?.id || null,
        executedDate: now,
        eggMass: null,
        eggWeight: null,
        mortalities: [],
      };
    }

    // in case farmingCycleStartDate is changed via FMS
    dailyMonitoring.day = day;

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
        dailyMonitoring.reportStatus === DAILY_MONITORING_STATUS_ENUM.EMPTY &&
        isBefore(addDays(new Date(date), DAILY_REPORT_DEADLINE), now)
      ) {
        dailyMonitoring.executedBy = user.id;
        dailyMonitoring.reportStatus = DAILY_MONITORING_STATUS_ENUM.LATE;
      } else if (
        user &&
        dailyMonitoring.executedDate &&
        dailyMonitoring.reportStatus === DAILY_MONITORING_STATUS_ENUM.EMPTY
      ) {
        dailyMonitoring.executedBy = user?.id || null;
        dailyMonitoring.reportStatus = DAILY_MONITORING_STATUS_ENUM.FILLED;
      }
      if (user?.role === USER_TYPE.PPL) {
        dailyMonitoring.reviewedBy = user?.id || null;
        dailyMonitoring.reportStatus = DAILY_MONITORING_STATUS_ENUM.REVIEWED;
      }
      if (dailyMonitoring.revisions?.length) {
        dailyMonitoring.reportStatus = DAILY_MONITORING_STATUS_ENUM.REVISION;
      }
    }

    const reportedDate = format(new Date(dailyMonitoring.date), DATE_SQL_FORMAT);
    const closeDate = farmingCycle.closedDate;
    const isFarmingClosed = (closeDate && isEqual(closeDate, new Date(reportedDate))) || false;

    const [
      previousDailyMonitoring,
      totalFeedConsumptionSack,
      [prevHarvested],
      smartScaleWeighing,
      totalFeedAdjustment,
      harvestedEgg,
    ] = await Promise.all([
      this.dao.getOne({
        where: {
          farmingCycleId,
          day: dailyMonitoring.day - 1,
        },
      }),
      this.taskTicketDDAO.getLatestSum(variables.get(VAR_FEED_CON_CODE)!.id, farmingCycleId, {
        reportedUntil: new Date(dailyMonitoring.date),
        reportedUntilFormat: DATETIME_59_SQL_FORMAT,
        taskCode: TASK_LAPORAN_AKHIR_HARI,
      }),
      this.harvestRealizationDAO.getMany({
        where: {
          farmingCycleId,
          harvestDate: LessThanOrEqual(reportedDate),
          status: Raw((alias) => `(${alias} is null OR ${alias} != :deleted)`, {
            deleted: RealizationStatusEnum.DELETED,
          }),
        },
      }),
      this.smartScaleWeighingDAO.getOneByFarmingCycleId(farmingCycleId, reportedDate),
      this.farmingCycleFeedStockAdjustmentDAO.getTotalAdjustmentQuantityByFarmingCycle(
        farmingCycleId,
        new Date(dailyMonitoring.date),
        DATETIME_59_SQL_FORMAT,
      ),
      this.harvestEggDAO.getOne({
        where: {
          farmingCycleId,
          date: new Date(format(new Date(reportedDate), DATE_SQL_FORMAT)),
        },
      }),
    ]);

    const harvestedChicken = prevHarvested.reduce(
      (prev, item) => ({
        total: prev.total + item.quantity,
        totalAge:
          prev.totalAge +
          differenceInCalendarDays(new Date(item.harvestDate), farmingCycle.farmingCycleStartDate) *
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
    const mapVariableToTaskTicketD = new Map<string, TaskTicketD>();
    if (taskTicket) {
      taskTicket.details.forEach((item) => {
        mapVariableToTaskTicketD.set(item.variableId, item);
      });
    }

    // set actual bw from task ticket if task ticket exist
    const bwTaskTicketD = mapVariableToTaskTicketD.get(variables.get(VAR_ABW_CODE)!.id);
    dailyMonitoring.bw =
      (bwTaskTicketD && parseInt(bwTaskTicketD.dataValue || '0', 10)) || dailyMonitoring.bw;

    // if smart scale is used, replace bw with records from smart scale
    if (smartScaleWeighing && smartScaleWeighing.details.length > 0) {
      // smart scale weighing saves weight in KG
      dailyMonitoring.bw = smartScaleWeighing.avgWeight * 1000;
    }

    /**
     * Calculate ADG (additional daily gain)
     * adg = current_bw - prev_bw
     */
    dailyMonitoring.adg = (dailyMonitoring.bw || 0) - (previousDailyMonitoring?.bw || 0);

    /**
     * Set Population Variable
     * - mortaled
     * - harvested
     * - total (initial population)
     */

    const tomoTaskTicketD = mapVariableToTaskTicketD.get(variables.get(VAR_TOMO_CODE)!.id);

    const deadChicken =
      (tomoTaskTicketD && parseInt(tomoTaskTicketD.dataValue || '0', 10)) ||
      (dailyMonitoring.cull || 0) +
        dailyMonitoring.mortalities.reduce((prev, item) => prev + item.quantity, 0) ||
      0;

    let populationMortaled: number = 0;
    if (
      isFarmingCycleRepopulated &&
      isAfterRepopulationPeriod &&
      isExactlyOneDayAfterRepopulation
    ) {
      populationMortaled =
        deadChicken +
        (previousDailyMonitoring?.populationMortaled || 0) -
        totalAdjustedPopulationMortaled;
    } else {
      populationMortaled = deadChicken + (previousDailyMonitoring?.populationMortaled || 0);
    }

    dailyMonitoring.populationMortaled = populationMortaled;

    dailyMonitoring.populationHarvested = harvestedChicken.total;

    let initialPopulation: number = 0;
    if (isFarmingCycleRepopulated) {
      initialPopulation = farmingCycle.initialPopulation + totalAdjustedPopulation;
    } else {
      initialPopulation = farmingCycle.initialPopulation;
    }
    dailyMonitoring.populationTotal = initialPopulation;

    /**
     * Calculate Mortality Rate
     * mortality_rate = mortaled_population / initial_population
     */
    dailyMonitoring.mortality =
      (dailyMonitoring.populationMortaled / dailyMonitoring.populationTotal) * 100;

    /**
     * FCR Calculation
     * Formula:
     * fcr = total_feed_consumption_KG / (total_chicken_weight_KG + total_harvested_weight_KG)
     */
    const currentPopulation =
      dailyMonitoring.populationTotal -
      dailyMonitoring.populationHarvested -
      dailyMonitoring.populationMortaled;

    const currentPopulationWeightKG = uomConverter(
      (dailyMonitoring.bw || 0) * currentPopulation,
      'gram',
      'kilogram',
    );

    let totalFeedConsumption = { totalQty: totalFeedConsumptionSack, uom: 'karung' };
    if (!totalFeedConsumptionSack) {
      totalFeedConsumption = await this.farmingCycleFeedStockDDAO.totalConsumption(farmingCycleId, {
        untilDate: format(new Date(dailyMonitoring.date), DATETIME_SQL_FORMAT),
        notes: {
          operator: '=',
          value: FEED_STOCK_NOTES.MINUS,
        },
      });
    }

    const totalFeedConsumptionKG = uomConverter(
      totalFeedConsumption.totalQty,
      totalFeedConsumption.uom,
      'kilogram',
    );
    const totalFeedAdjustmentKG = uomConverter(
      totalFeedAdjustment.totalQty,
      totalFeedAdjustment.uom,
      'kilogram',
    );

    dailyMonitoring.fcr =
      (totalFeedConsumptionKG - totalFeedAdjustmentKG) /
        (currentPopulationWeightKG + harvestedChicken.totalWeightKG) || 0;

    // prevenet NaN and Infinity value
    if (Number.isNaN(dailyMonitoring.fcr) || !Number.isFinite(dailyMonitoring.fcr)) {
      dailyMonitoring.fcr = 0;
    }

    /**
     * IP Calculation
     */
    const sigmaCurrentPopulationAge = currentPopulation * dailyMonitoring.day;

    dailyMonitoring.averageChickenAge =
      (harvestedChicken.totalAge + sigmaCurrentPopulationAge) /
      (dailyMonitoring.populationTotal - dailyMonitoring.populationMortaled);

    const survivePopulation = dailyMonitoring.populationTotal - dailyMonitoring.populationMortaled;

    const averagePopulationWeight =
      ((currentPopulationWeightKG + harvestedChicken.totalWeightKG) * 1000) / survivePopulation;

    dailyMonitoring.ip =
      (((survivePopulation / dailyMonitoring.populationTotal) * averagePopulationWeight) /
        (dailyMonitoring.fcr * dailyMonitoring.averageChickenAge)) *
      10;

    // prevenet NaN and Infinity value
    if (Number.isNaN(dailyMonitoring.ip) || !Number.isFinite(dailyMonitoring.ip)) {
      dailyMonitoring.ip = 0;
    }

    /**
     * calculate feed intake
     * fit = feed_quantity_gram / current_population
     */
    const feedConTaskTicketD = mapVariableToTaskTicketD.get(variables.get(VAR_FEED_CON_CODE)!.id);

    // feedIntake in gram per chicken
    dailyMonitoring.feedIntake = currentPopulation
      ? uomConverter(
          (feedConTaskTicketD && parseInt(feedConTaskTicketD.dataValue || '0', 10)) || 0,
          'karung',
          'gram',
        ) / currentPopulation
      : 0;

    /**
     * - get total feed remaining
     * - estimate feed stockout date
     */
    const [grossFeedRemaining, feedTrDelivered, feedTargets] = await Promise.all([
      this.farmingCycleFeedStockDDAO.getRemainingFeed(
        farmingCycleId,
        format(new Date(date), DATETIME_59_SQL_FORMAT),
      ),
      this.transferRequestDAO.totalQuantity(farmingCycleId, {
        source: 'gr',
        isDelivered: true,
        deliveredUntil: format(new Date(date), DATETIME_59_SQL_FORMAT),
      }),
      this.targetDaysDDAO.getMany({
        where: {
          day: MoreThan(day),
          target: {
            coopTypeId: farmingCycle.coop.coopTypeId,
            chickTypeId: farmingCycle.chickTypeId,
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

    const feedRemaining =
      uomConverter(grossFeedRemaining.totalQty, grossFeedRemaining.uom, 'karung') - feedTrDelivered;
    dailyMonitoring.feedRemaining = feedRemaining;

    let qtyRemaining = feedRemaining;
    const feedDayRemaining = feedTargets.findIndex((val) => {
      // from gram to sack
      const consumptionEstimationSack = uomConverter(
        currentPopulation * val.minValue,
        'gram',
        'karung',
      );
      qtyRemaining -= consumptionEstimationSack;
      if (qtyRemaining <= 0) return true;
      return false;
    });

    dailyMonitoring.feedStockoutDate = format(
      addDays(new Date(date), feedDayRemaining === -1 ? feedTargets.length : feedDayRemaining),
      DATE_SQL_FORMAT,
    );

    // layer performance calculation
    dailyMonitoring.eggWeight =
      (harvestedEgg?.totalQuantity &&
        ((harvestedEgg?.totalWeight || 0) * 1000) / harvestedEgg.totalQuantity) ||
      0;
    dailyMonitoring.hdp = (100 * (harvestedEgg?.totalQuantity || 0)) / currentPopulation;
    dailyMonitoring.eggMass = (dailyMonitoring.eggWeight * dailyMonitoring.hdp) / 100;

    // remove this if broiler farm not necessarily using task ticket
    if (
      (farmingCycle.farm.category === FarmChickCategory.BROILER && taskTicket) ||
      farmingCycle.farm.category === FarmChickCategory.LAYER
    ) {
      await this.dao.createOne(dailyMonitoring, user);
    }

    /**
     * add job to trigger next day calculation
     */
    const isLessThanToday =
      new Date(dailyMonitoring.date).getTime() < new Date(format(now, DATE_SQL_FORMAT)).getTime();
    if (!isFarmingClosed && isLessThanToday) {
      await this.calculateDailyMonitoringQueue.addJob({
        user,
        farmingCycleId,
        farmingCycleCode: farmingCycle.farmingCycleCode,
        updateStatusStrategy: updateStatusStrategy === 'single' ? undefined : updateStatusStrategy,
        date: format(addDays(new Date(date), 1), DATE_SQL_FORMAT),
      });
    }

    return dailyMonitoring;
  }

  /**
   * initializeEmptyDailyMonitoring iterate last 24 hour taskticket (TD-033)
   * that is not included in dailymonitoring table
   */
  async initializeEmptyDailyMonitoring(opts?: { farmingCycleId?: string }) {
    let [taskTickets, count] = await this.taskTicketDAO.getTaskWithoutDailyMonitoring(50, opts);

    // iterate data until count = 0
    while (count > 0) {
      const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

      // eslint-disable-next-line no-await-in-loop
      await this.dailyMonitoringDAO.upsertPlaceholders(
        taskTickets.map<DeepPartial<DailyMonitoring>>((tt) => ({
          taskTicketId: tt.id,
          farmingCycleId: tt.farmingCycleId,
          date: format(tt.reportedDate, DATE_SQL_FORMAT),
          day: Math.abs(
            differenceInCalendarDays(tt.farmingCycle.farmingCycleStartDate, tt.reportedDate),
          ),
          reportStatus: DAILY_MONITORING_STATUS_ENUM.EMPTY,
          createdDate: now,
          modifiedDate: now,
        })),
      );

      taskTickets.forEach((tt) =>
        this.calculateDailyMonitoringQueue.addJob({
          farmingCycleId: tt.farmingCycleId,
          farmingCycleCode: tt.farmingCycle.farmingCycleCode,
          taskTicketId: tt.id,
          date: format(tt.reportedDate, DATE_SQL_FORMAT),
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
            date: val.date,
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
        date: val.date,
      });
    });
    mapDailyMonitoringByStatus.get(DAILY_MONITORING_STATUS_ENUM.REVIEWED)?.forEach((val) => {
      this.finalizeDailyMonitoringQueue.addJob({
        farmingCycleId: val.farmingCycleId,
        date: val.date,
      });
    });
  }

  async triggerDailyReportReminder() {
    /**
     * Task criteria
     * - date difference is >= 2 day and < 3 day
     * - report status is EMPTY
     */
    const now = new Date();

    const [dailyMonitorings] = await this.dailyMonitoringDAO.getMany({
      where: {
        date: And(
          MoreThanOrEqual(format(addDays(now, -3), DATE_SQL_FORMAT)),
          LessThanOrEqual(format(addDays(now, -2), DATE_SQL_FORMAT)),
        ),
        reportStatus: DAILY_MONITORING_STATUS_ENUM.EMPTY,
        taskTicketId: Not(IsNull()),
      },
    });

    dailyMonitorings.reduce(async (prev, val) => {
      await prev;

      await this.generateDailyReportReminderQueue.addJob({
        taskTicketId: val.taskTicketId!,
      });
    }, Promise.resolve());
  }

  async finalizeDailyMonitoringStatus(farmingCycleId: string, date: string) {
    const [dailyMonitoring, variables] = await Promise.all([
      this.dailyMonitoringDAO.getOneStrict({
        where: {
          farmingCycleId,
          taskTicketId: date,
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

    const dailyMonitoringPayload: DeepPartial<DailyMonitoring> = {
      reportStatus: DAILY_MONITORING_STATUS_ENUM.DONE,
    };

    await this.dailyMonitoringUpsertOdooQueue.addJob({
      body: {
        isAdjustment: true,
        mortality: parseInt(deadChicken, 10),
        culling: parseInt(culled, 10),
        bw: dailyMonitoring.bw || 0,
      },
      taskTicketId: date,
    });

    // update without transaction
    await this.dailyMonitoringDAO.updateOne(
      {
        farmingCycleId,
        taskTicketId: date,
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

    const mapUserById = farmingCycle.farmingCycleMembers.reduce((prev, val) => {
      prev.set(val.userId, val.user);
      return prev;
    }, new Map<string, User>());

    const users = await this.userManagementDAO.getUsersByCmsIds(
      farmingCycle.farmingCycleMembers?.map((val) => val.userId) || [],
    );

    const [[feedPO], [feedDetails], [ovkDetails], taskBwDOC, taskUniformity] = await Promise.all([
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
      this.farmingCycleFeedStockDDAO.getMany({
        where: {
          farmingCycleId,
        },
      }),
      this.farmingCycleOvkStogLogDAO.getMany({
        where: {
          farmingCycleId,
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

    const feedUsageDetails = {
      feedIn: 0,
      feedUsed: 0,
      feedTransfer: 0,
    };

    feedDetails.forEach((item) => {
      if (item.operator === '-' && item.notes.includes('tr_id')) {
        feedUsageDetails.feedTransfer += item.qty;
      } else if (item.operator === '-') {
        feedUsageDetails.feedUsed += item.qty;
      } else {
        feedUsageDetails.feedIn += item.qty;
      }
    });

    const ovkUsageDetails = {
      ovkIn: 0,
      ovkUsed: 0,
      ovkTransfer: 0,
    };

    ovkDetails.forEach((item) => {
      if (item.operator === '-' && item.notes.includes('tr_id')) {
        ovkUsageDetails.ovkTransfer += item.quantity;
      } else if (item.operator === '-') {
        ovkUsageDetails.ovkUsed += item.quantity;
      } else {
        ovkUsageDetails.ovkIn += item.quantity;
      }
    });

    // check own farm or not
    if (
      farmingCycle.contract &&
      farmingCycle.contract.contractType.contractName !== CONTRACT_TYPE.OWN_FARM
    ) {
      ovkUsageDetails.ovkUsed = ovkUsageDetails.ovkIn;
      ovkUsageDetails.ovkTransfer = 0;
    } else if (!farmingCycle.contract && farmingCycle.contractId !== CONTRACT_TYPE.OWN_FARM) {
      ovkUsageDetails.ovkUsed = ovkUsageDetails.ovkIn;
      ovkUsageDetails.ovkTransfer = 0;
    }

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

    const mitraManager = users
      .filter((user) => user.roles?.some((role) => role.name === USER_TYPE.MM))
      .map((user) => ({
        id: user.cmsId,
        fullName: user.fullName,
        userCode: mapUserById.get(user.cmsId || '')?.userCode,
      }));

    return {
      farmingCycleCode: farmingCycle.farmingCycleCode,
      contract: farmingCycle.contract || null,
      farm: {
        owner: farmingCycle.farm.owner.fullName,
        coop: {
          name: farmingCycle.coop.coopName,
          type: farmingCycle.coop.coopType.coopTypeName,
          mm: mitraManager.length ? mitraManager[0] : null,
          ppl: users
            .filter((user) => user.roles?.some((role) => role.name === USER_TYPE.PPL))
            .map((user) => ({
              id: user.cmsId,
              fullName: user.fullName,
              userCode: mapUserById.get(user.cmsId || '')?.userCode,
            })),
          itSupport: users
            .filter((user) => user.roles?.some((role) => role.name === USER_TYPE.IS))
            .map((user) => ({
              id: user.cmsId,
              fullName: user.fullName,
              userCode: mapUserById.get(user.cmsId || '')?.userCode,
            })),
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
      ovk: {
        ...ovkUsageDetails,
        ovkRemaining: ovkUsageDetails.ovkIn - ovkUsageDetails.ovkTransfer - ovkUsageDetails.ovkUsed,
      },
      feed: {
        ...feedUsageDetails,
        feedRemaining:
          feedUsageDetails.feedIn - feedUsageDetails.feedTransfer - feedUsageDetails.feedUsed,
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
        eggWeight: (dailyMonitoringDetail && dailyMonitoringDetail.eggWeight) || defaultPerformance,
        eggMass: (dailyMonitoringDetail && dailyMonitoringDetail.eggMass) || defaultPerformance,
        hdp: (dailyMonitoringDetail && dailyMonitoringDetail.hdp) || defaultPerformance,
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
          dead: dailyMonitoringDetail && dailyMonitoringDetail.population.dead,
        },
        bwDayEight:
          ((farmingCycle.docInBW || taskBwDOC?.dataValue) &&
            (dailyMonitoringDay8?.bw || 0) /
              (farmingCycle.docInBW || parseInt(taskBwDOC!.dataValue || '0', 10))) ||
          null,
      },
    };
  }

  async getCurrentPerformance(farmingCycleId: string): Promise<GetFarmingCyclePerformanceResponse> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const [farmingCycle, latestMonitoring, feedSummary] = await Promise.all([
      this.farmingCycleDAO.getOneStrict({
        where: {
          id: farmingCycleId,
        },
        relations: {
          coop: true,
          farm: true,
        },
      }),
      this.dailyMonitoringDAO.getOne({
        where: {
          farmingCycleId,
          date:
            now.getHours() < 17
              ? LessThan(format(now, DATE_SQL_FORMAT))
              : LessThanOrEqual(format(now, DATE_SQL_FORMAT)),
        },
        order: {
          day: 'DESC',
        },
      }),
      this.farmingCycleFeedStockSummaryDAO.getTotalSummary(farmingCycleId),
    ]);

    const dailyMonitorings = await this.getAllDailyMonitorings(farmingCycleId, {
      date: latestMonitoring?.date,
    });

    // sort desc and get the first item
    const dailyMonitoring = dailyMonitorings.sort((a, b) => b.day - a.day)[0];

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

    const day =
      farmingCycle.farm.category === FarmChickCategory.BROILER
        ? Math.abs(differenceInCalendarDays(farmingCycle.farmingCycleStartDate, now))
        : (farmingCycle.pulletInWeeks || 0) * 7 +
          Math.abs(differenceInCalendarDays(farmingCycle.farmingCycleStartDate, now));
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
          hdp: {
            actual: dailyMonitoring?.hdp.actual || 0,
            standard: dailyMonitoring?.hdp.standard || 0,
          },
          eggMass: {
            actual: dailyMonitoring?.eggMass.actual || 0,
            standard: dailyMonitoring?.eggMass.standard || 0,
          },
          eggWeight: {
            actual: dailyMonitoring?.eggWeight.actual || 0,
            standard: dailyMonitoring?.eggWeight.standard || 0,
          },
          feedIntake: {
            actual: dailyMonitoring?.feedIntake.actual || 0,
            standard: dailyMonitoring?.feedIntake.standard || 0,
          },
        },
        population: {
          mortality: dailyMonitoring?.population.mortality || 0,
          harvested: (dailyMonitoring?.population.harvested || 0) + countAdditionalHarvest,
          total: farmingCycle.initialPopulation,
        },
        feed:
          (dailyMonitoring?.feed && {
            remaining: feedSummary.remainingQuantity - feedSummary.bookedQuantity,
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
    const farmingCycle = await this.farmingCycleDAO.getOneStrict({
      where: {
        id: farmingCycleId,
      },
    });

    let taskTicket = await this.dailyMonitoringDAO.getOne({
      where: {
        taskTicketId,
      },
    });

    if (!taskTicket) {
      taskTicket = await this.dailyMonitoringDAO.getOne({
        where: {
          farmingCycleId,
        },
        order: {
          day: 'ASC',
        },
      });
    }

    if (!taskTicket) {
      return;
    }

    await this.calculateDailyMonitoringQueue.addJob({
      user,
      farmingCycleId,
      farmingCycleCode: farmingCycle.farmingCycleCode,
      taskTicketId: taskTicket.id,
      updateStatusStrategy,
      date: taskTicket?.date,
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

  async getDailyMonitoringWithRevisions(
    farmingCycleId: string,
    dateString: string,
  ): Promise<DailyMonitoring | null> {
    const result = await this.dailyMonitoringDAO.getOne({
      where: {
        farmingCycleId,
        date: dateString,
      },
      relations: {
        revisions: true,
      },
    });
    return result;
  }

  @Transactional()
  async initiateDailyMonitoringAsRevision(
    farmingCycleId: string,
    days: number,
    dailyMonitoringDateString: string,
    user: RequestUser,
    queryRunner: QueryRunner,
  ): Promise<DailyMonitoring> {
    const dailyMonitoring = await this.dailyMonitoringDAO.createOneWithTx(
      {
        farmingCycleId,
        day: days,
        date: dailyMonitoringDateString,
        reportStatus: DAILY_MONITORING_STATUS_ENUM.REVISION,
      },
      user,
      queryRunner,
    );
    return dailyMonitoring;
  }

  @Transactional()
  async updateDailyMonitoringToRevision(
    dailyMonitoringId: string,
    user: RequestUser,
    queryRunner: QueryRunner,
  ): Promise<DailyMonitoring> {
    const dailyMonitoring = await this.dailyMonitoringDAO.updateOneWithTx(
      {
        id: dailyMonitoringId,
      },
      {
        reportStatus: DAILY_MONITORING_STATUS_ENUM.REVISION,
      },
      user,
      queryRunner,
    );
    return dailyMonitoring;
  }

  @Transactional()
  async submitDailyMonitoringRevisionRequest(
    dailyMonitoringId: string,
    snapshotData: object | null,
    body: RequestDailyMonitoringRevisionBody,
    user: RequestUser,
    queryRunner: QueryRunner,
  ) {
    await this.dailyMonitoringRevisionDAO.createOneWithTx(
      {
        dailyMonitoringId,
        reason: body.reason,
        changes: body.changes,
        status: DailyMonitoringRevisionStatusEnum.REQUESTED,
        snapshotData,
      },
      user,
      queryRunner,
    );
  }

  async getDailyMonitoringRevision(
    farmingCycleId: string,
    dateString: string,
  ): Promise<DailyMonitoringRevision | null> {
    const result = await this.dailyMonitoringRevisionDAO.getOne({
      where: {
        dailyMonitoring: {
          farmingCycleId,
          date: dateString,
        },
      },
      relations: {
        dailyMonitoring: true,
      },
    });
    return result;
  }
}
