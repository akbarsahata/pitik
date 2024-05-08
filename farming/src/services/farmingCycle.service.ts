import {
  addDays,
  differenceInCalendarDays,
  differenceInDays,
  endOfDay,
  format,
  getHours,
  isAfter,
  isBefore,
  isToday,
  isValid,
  minutesToMilliseconds,
  parse,
  setHours,
  subDays,
} from 'date-fns';
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';
import { Inject, Service } from 'fastify-decorators';
import {
  DeepPartial,
  EntityNotFoundError,
  FindOptionsWhere,
  ILike,
  In,
  IsNull,
  LessThanOrEqual,
  Like,
  QueryRunner,
  Raw,
} from 'typeorm';
import { ChickInRequestDAO } from '../dao/chickInRequest.dao';
import { CoopDAO } from '../dao/coop.dao';
import { CoopMemberDDAO } from '../dao/coopMemberD.dao';
import { DailyMonitoringDAO } from '../dao/dailyMonitoring.dao';
import { DailyMonitoringMortalityDAO } from '../dao/dailyMonitoringMortality.dao';
import { DailyPerformanceDDAO } from '../dao/dailyPerformanceD.dao';
import { FarmingCycleDAO } from '../dao/farmingCycle.dao';
import { FarmingCycleChickStockDDAO } from '../dao/farmingCycleChickStockD.dao';
import { FarmingCycleFeedStockAdjustmentDAO } from '../dao/farmingCycleFeedStockAdjustment.dao';
import { FarmingCycleFeedStockDDAO } from '../dao/farmingCycleFeedStockD.dao';
import { FarmingCycleFeedStockSummaryDAO } from '../dao/farmingCycleFeedStockSummary.dao';
import { FarmingCycleMemberDDAO } from '../dao/farmingCycleMemberD.dao';
import { FarmingCycleOvkStockLogDAO } from '../dao/farmingCycleOvkStockLog.dao';
import { FarmingCycleOvkStockSummaryDAO } from '../dao/farmingCycleOvkStockSummary.dao';
import { GoodsReceiptDAO } from '../dao/goodsReceipt.dao';
import { HarvestRealizationDAO } from '../dao/harvestRealization.dao';
import { HarvestEggDAO } from '../dao/layer/harvestEgg.dao';
import { PurchaseOrderDAO } from '../dao/purchaseOrder.dao';
import { RepopulationDAO } from '../dao/repopulation.dao';
import { TargetDAO } from '../dao/target.dao';
import { TargetDaysDDAO } from '../dao/targetDaysD.dao';
import { TaskTicketDAO } from '../dao/taskTicket.dao';
import { TaskTicketDDAO } from '../dao/taskTicketD.dao';
import { TaskTicketPhotoDDAO } from '../dao/taskTicketPhotoD.dao';
import { UserDAO } from '../dao/user.dao';
import { VariableDAO } from '../dao/variable.dao';
import { ErpDailyMonitoringUpsertPayload } from '../datasources/entity/erp/ERPProduct';
import { DailyMonitoring } from '../datasources/entity/pgsql/DailyMonitoring.entity';
import { FarmChickCategory } from '../datasources/entity/pgsql/Farm.entity';
import { FarmingCycle } from '../datasources/entity/pgsql/FarmingCycle.entity';
import { FarmingCycleChickStockD } from '../datasources/entity/pgsql/FarmingCycleChickStockD.entity';
import { FarmingCycleMemberD } from '../datasources/entity/pgsql/FarmingCycleMemberD.entity';
import { GoodsReceiptPhoto } from '../datasources/entity/pgsql/GoodsReceiptPhoto.entity';
import { RealizationStatusEnum } from '../datasources/entity/pgsql/HarvestRealization.entity';
import { PurchaseOrder } from '../datasources/entity/pgsql/PurchaseOrder.entity';
import { Repopulation } from '../datasources/entity/pgsql/Repopulation.entity';
import { TargetDaysD } from '../datasources/entity/pgsql/TargetDaysD.entity';
import { TaskTicket } from '../datasources/entity/pgsql/TaskTicket.entity';
import { TaskTicketD } from '../datasources/entity/pgsql/TaskTicketD.entity';
import { TaskTicketPhotoD } from '../datasources/entity/pgsql/TaskTicketPhotoD.entity';
import {
  AssignOperatorsToFarmingCycleBody,
  CreateFarmingCycleBody,
  CreateFarmingCycleItemResponse,
  DailyReportItem,
  DailyReportsResponseItem,
  FarmingCycleItem,
  FarmingCycleItemMember,
  FarmingCycleItemMemberGroup,
  FarmingCycleOperatorList,
  FarmingInfoItem,
  GetDailyReportResponseItem,
  GetFarmingCycleResponse,
  GetFarmingCyclesQuery,
  OperatorTypeEnum,
  SubmitDailyReportBody,
  SubmitDailyReportResponseItem,
  UpdateDOCinBody,
  UpdateDOCinParams,
  UpdateDOCinResponseItem,
  UpdateFarmingCycleBody,
  UpdateFarmingCycleItemResponse,
  UserItem,
} from '../dto/farmingCycle.dto';
import { TaskMedia } from '../dto/task.dto';
import { CalculateDailyMonitoringQueue } from '../jobs/queues/calculate-daily-monitoring.queue';
import { DailyMonitoringUpsertOdooQueue } from '../jobs/queues/daily-monitoring-upsert-odoo.queue';
import { FarmingCycleClosedQueue } from '../jobs/queues/farming-cycle-closed.queue';
import { FarmingCycleCreatedFmsQueue } from '../jobs/queues/farming-cycle-created-fms.queue';
import { FarmingCycleDOCinQueue } from '../jobs/queues/farming-cycle-doc-in.queue';
import { FarmingCycleUpdatedQueue } from '../jobs/queues/farming-cycle-updated.queue';
import { GenerateTaskTicketQueue } from '../jobs/queues/generate-task-ticket.queue';
import { InitializeDailyMonitoringQueue } from '../jobs/queues/initialize-daily-monitoring.queue';
import { SetIotDeviceStatusQueue } from '../jobs/queues/set-iot-device-status.queue';
import {
  TaskTicketDetailUpdatedJobData,
  TaskTicketDetailUpdatedQueue,
} from '../jobs/queues/task-ticket-detail-updated.queue';
import { UserAssignedToFcQueue } from '../jobs/queues/user-assigned-to-fc.queue';
import {
  DAILY_MONITORING_STATUS,
  DAILY_MONITORING_STATUS_ENUM,
  DAILY_REPORT_DEADLINE,
  DATETIME_17_SQL_FORMAT,
  DATETIME_59_SQL_FORMAT,
  DATETIME_SQL_FORMAT,
  DATE_SQL_FORMAT,
  DEFAULT_TIME_ZONE,
  FC_CYCLE_STATUS,
  FC_FARMING_STATUS,
  GOOD_RECEIPT_PHOTO_TYPE,
  TICKET_STATUS,
  TIME_HH_MM_SS,
  USER_TYPE,
  USER_TYPE_INTERNAL_GROUP,
} from '../libs/constants';
import { DEVICE_SENSOR_STATUS } from '../libs/constants/deviceSensor';
import {
  ERR_BAD_REQUEST,
  ERR_CHICK_IN_REQ_ALREADY_CONFIRMED,
  ERR_CHICK_IN_REQ_INVALID_RECEIVED_DOC,
  ERR_DAILY_REPORT_ABW_OUT_OF_RANGE,
  ERR_DAILY_REPORT_ALREADY_DONE_LATE,
  ERR_DAILY_REPORT_FEED_CONSUMPTION_EXCEEDED,
  ERR_DAILY_REPORT_OVK_CONSUMPTION_EXCEEDED,
  ERR_FARM_CYCLE_INVALID_START_DATE,
  ERR_FARM_CYCLE_INVALID_TRUCK_TIME,
  ERR_INITIAL_POPULATION_INVALID,
  ERR_PULLET_IN_REQ_INVALID_RECEIVED_DOC,
  ERR_PURCHASE_ORDER_STILL_PROCESSED,
  ERR_USER_NOT_FOUND,
} from '../libs/constants/errors';
import { TASK_LAPORAN_AKHIR_HARI, TASK_NAMES } from '../libs/constants/taskCodes';
import {
  VAR_ABW_CODE,
  VAR_CULLED_CODE,
  VAR_DEAD_CHICK_CODE,
  VAR_FCR_TARGET_CODE,
  VAR_FEED_CON_CODE,
  VAR_FEED_TYPE_CODE,
  VAR_HARVESTED_CODE,
  VAR_OVK_CON_CODE,
  VAR_TOMO_CODE,
  VAR_TRG_ACC_MORT_CODE,
  VAR_YELLOW_CARD,
} from '../libs/constants/variableCodes';
import { Transactional } from '../libs/decorators/transactional';
import { RequestUser } from '../libs/types/index.d';
import { CoopCacheUtil } from '../libs/utils/coopCache';
import { isRoleAllowed, randomHexString, uomConverter } from '../libs/utils/helpers';

@Service()
export class FarmingCycleService {
  @Inject(FarmingCycleDAO)
  private dao!: FarmingCycleDAO;

  @Inject(FarmingCycleMemberDDAO)
  private fcMemberDAO!: FarmingCycleMemberDDAO;

  @Inject(UserDAO)
  private userDAO!: UserDAO;

  @Inject(UserAssignedToFcQueue)
  private userAssignedToFcQueue: UserAssignedToFcQueue;

  @Inject(VariableDAO)
  private variableDAO!: VariableDAO;

  @Inject(TaskTicketDDAO)
  private taskTicketDDAO!: TaskTicketDDAO;

  @Inject(TaskTicketDAO)
  private taskTicketDAO!: TaskTicketDAO;

  @Inject(TaskTicketPhotoDDAO)
  private taskTicketPhotoDDAO!: TaskTicketPhotoDDAO;

  @Inject(DailyMonitoringDAO)
  private dailyMonitoringDAO: DailyMonitoringDAO;

  @Inject(DailyMonitoringMortalityDAO)
  private dailyMonitoringMortalityDAO: DailyMonitoringMortalityDAO;

  @Inject(DailyPerformanceDDAO)
  private dailyPerformanceDDAO: DailyPerformanceDDAO;

  @Inject(TargetDAO)
  private targetDAO: TargetDAO;

  @Inject(TargetDaysDDAO)
  private targetDaysDDAO: TargetDaysDDAO;

  @Inject(FarmingCycleChickStockDDAO)
  private farmingCycleChickStockDDAO: FarmingCycleChickStockDDAO;

  @Inject(FarmingCycleFeedStockDDAO)
  private farmingCycleFeedStockDDAO: FarmingCycleFeedStockDDAO;

  @Inject(FarmingCycleFeedStockAdjustmentDAO)
  private farmingCycleFeedStockAdjustmentDAO: FarmingCycleFeedStockAdjustmentDAO;

  @Inject(FarmingCycleOvkStockLogDAO)
  private farmingCycleOvkStockLogDAO: FarmingCycleOvkStockLogDAO;

  @Inject(CoopDAO)
  private coopDAO!: CoopDAO;

  @Inject(PurchaseOrderDAO)
  private purchaseOrderDAO: PurchaseOrderDAO;

  @Inject(GoodsReceiptDAO)
  private goodsReceiptDAO: GoodsReceiptDAO;

  @Inject(ChickInRequestDAO)
  private chickInRequestDAO!: ChickInRequestDAO;

  @Inject(CoopMemberDDAO)
  private coopMemberDAO!: CoopMemberDDAO;

  @Inject(FarmingCycleFeedStockSummaryDAO)
  private farmingCycleFeedStockSummaryDAO: FarmingCycleFeedStockSummaryDAO;

  @Inject(FarmingCycleOvkStockSummaryDAO)
  private farmingCycleOvkStockSummaryDAO: FarmingCycleOvkStockSummaryDAO;

  @Inject(HarvestRealizationDAO)
  private harvestRealizationDAO: HarvestRealizationDAO;

  @Inject(RepopulationDAO)
  private repopulationDAO!: RepopulationDAO;

  @Inject(HarvestEggDAO)
  private harvestEggDAO: HarvestEggDAO;

  @Inject(FarmingCycleCreatedFmsQueue)
  private fcCreatedNewQueue!: FarmingCycleCreatedFmsQueue;

  @Inject(FarmingCycleDOCinQueue)
  private fcDOCinQueue!: FarmingCycleDOCinQueue;

  @Inject(CalculateDailyMonitoringQueue)
  private calculateDailyMonitoringQueue: CalculateDailyMonitoringQueue;

  @Inject(InitializeDailyMonitoringQueue)
  private initializeDailyMonitoringQueue: InitializeDailyMonitoringQueue;

  @Inject(TaskTicketDetailUpdatedQueue)
  private taskTicketDetailUpdatedQueue!: TaskTicketDetailUpdatedQueue;

  @Inject(GenerateTaskTicketQueue)
  private generateTaskTicketQueue!: GenerateTaskTicketQueue;

  @Inject(CoopCacheUtil)
  private coopCacheUtil: CoopCacheUtil;

  @Inject(SetIotDeviceStatusQueue)
  private setIotDeviceStatusQueue: SetIotDeviceStatusQueue;

  @Inject(FarmingCycleUpdatedQueue)
  private fcUpdatedQueue: FarmingCycleUpdatedQueue;

  @Inject(DailyMonitoringUpsertOdooQueue)
  private dailyMonitoringUpsertOdooQueue: DailyMonitoringUpsertOdooQueue;

  @Inject(FarmingCycleClosedQueue)
  private farmingCycleClosedQueue!: FarmingCycleClosedQueue;

  async createFarmingCycle(
    input: CreateFarmingCycleBody,
    user: RequestUser,
  ): Promise<CreateFarmingCycleItemResponse> {
    const queryRunner = await this.dao.startTransaction();

    if (input.initialPopulation < 1) {
      throw ERR_INITIAL_POPULATION_INVALID();
    }

    try {
      const coop = await this.coopDAO.getOneStrict({
        relations: {
          farm: true,
          activeFarmingCycle: true,
          coopMembers: {
            user: true,
          },
        },
        where: {
          id: input.coopId,
        },
        relationLoadStrategy: 'join',
      });

      if (coop.activeFarmingCycleId) {
        throw ERR_BAD_REQUEST(
          `Coop already has active farming cycle: ${coop.activeFarmingCycle.farmingCycleCode}`,
        );
      }

      const farmingCycleId: string = randomHexString();
      let isFarmingCycleStarted: boolean = false;

      const payload: Partial<FarmingCycle> = {
        id: farmingCycleId,
        farmId: coop.farmId,
        coopId: input.coopId,
        farmingCycleStartDate: new Date(input.farmingCycleStartDate),
        initialPopulation: input.initialPopulation,
        chickTypeId: input.chickTypeId,
        chickSupplier: input.chickSupplier,
        hatchery: input.hatchery,
        cycleStatus: FC_CYCLE_STATUS.ACTIVE,
        farmingStatus: FC_FARMING_STATUS.NEW,
        remarks: input.remarks,
        contractId: input.contract,
        docInBW: input.docInBW,
        docInUniformity: input.docInUniformity,
        pulletInWeeks: input.pulletInWeeks,
      };

      const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);
      const startDate = utcToZonedTime(new Date(input.farmingCycleStartDate), DEFAULT_TIME_ZONE);
      if (
        coop.farm.category !== FarmChickCategory.LAYER &&
        (isToday(startDate) || isBefore(startDate, now))
      ) {
        payload.farmingStatus = FC_FARMING_STATUS.IN_PROGRESS;
        isFarmingCycleStarted = true;
      }

      const farmingCycle = await this.dao.createOneWithTx(payload, user, queryRunner, [], true);

      let farmingCycleMembers: Partial<FarmingCycleMemberD>[] = [];

      if (input.leaderId) {
        const leaderAsMemberPayload: Partial<FarmingCycleMemberD> = {
          farmingCycleId,
          userId: input.leaderId,
          isLeader: true,
          isInternal: false,
        };

        farmingCycleMembers.push(leaderAsMemberPayload);
      }

      if (input.workerIds) {
        input.workerIds.forEach((workerId) => {
          const workerAsMemberPayload: Partial<FarmingCycleMemberD> = {
            farmingCycleId,
            userId: workerId,
            isLeader: false,
            isInternal: false,
          };

          farmingCycleMembers.push(workerAsMemberPayload);
        });
      }

      if (input.productionTeamIds) {
        input.productionTeamIds.forEach((productionMember) => {
          const productionTeamAsMemberPayload: Partial<FarmingCycleMemberD> = {
            farmingCycleId,
            userId: productionMember,
            isLeader: false,
            isInternal: true,
          };

          farmingCycleMembers.push(productionTeamAsMemberPayload);
        });
      }

      if (input.pplIds) {
        input.pplIds.forEach((ppl) => {
          const pplMemberPayload: Partial<FarmingCycleMemberD> = {
            farmingCycleId,
            userId: ppl,
            isLeader: false,
            isInternal: true,
          };

          farmingCycleMembers.push(pplMemberPayload);
        });
      }

      const [coopMembers] = await this.coopMemberDAO.getMany({
        where: {
          coopId: input.coopId,
        },
        relations: {
          user: true,
        },
      });

      coopMembers.forEach((coopMember) => {
        const coopMemberPayload: Partial<FarmingCycleMemberD> = {
          farmingCycleId,
          userId: coopMember.user.id,
          isLeader: coopMember.user.userType === USER_TYPE.KK,
          isInternal: USER_TYPE_INTERNAL_GROUP.includes(coopMember.user.userType),
        };

        farmingCycleMembers.push(coopMemberPayload);
      });

      const farmingCycleMemberMap: { [key: string]: Partial<FarmingCycleMemberD> } = {};

      farmingCycleMembers.forEach((fcMember) => {
        farmingCycleMemberMap[fcMember.userId as string] = fcMember;
      });

      farmingCycleMembers = Object.values(farmingCycleMemberMap);

      await this.fcMemberDAO.createManyWithTx(farmingCycleMembers, user, queryRunner);

      // Assign farmingCycleId into coop as activeFarmingCycleId
      if (isFarmingCycleStarted || coop.farm.category === FarmChickCategory.LAYER) {
        await this.coopDAO.updateOneWithTx(
          { id: coop.id },
          { activeFarmingCycleId: farmingCycleId },
          user,
          queryRunner,
        );

        await this.coopCacheUtil.invalidateCoopCache(coop.id, 'both');
      }

      await this.dao.commitTransaction(queryRunner);

      await this.fcCreatedNewQueue.addJob(farmingCycle);

      return {
        id: farmingCycle.id,
        farmId: farmingCycle.farmId,
        coopId: farmingCycle.coopId,
        initialPopulation: farmingCycle.initialPopulation,
        cycleStatus: farmingCycle.cycleStatus,
        farmingCycleStartDate: farmingCycle.farmingCycleStartDate.toISOString(),
        chickTypeId: farmingCycle.chickTypeId,
        chickSupplier: farmingCycle.chickSupplier,
        hatchery: farmingCycle.hatchery,
        farmingStatus: farmingCycle.farmingStatus,
        remarks: farmingCycle.remarks,
        contract: farmingCycle.contractId || '',
        docInBW: farmingCycle.docInBW,
        docInUniformity: farmingCycle.docInUniformity,
        pulletInWeeks: farmingCycle.pulletInWeeks || undefined,
      };
    } catch (error) {
      await this.dao.rollbackTransaction(queryRunner);

      throw error;
    }
  }

  async getFarmingCycles(
    filter: GetFarmingCyclesQuery,
  ): Promise<[GetFarmingCycleResponse[], number]> {
    const limit = filter.$limit && filter.$limit > 0 ? filter.$limit : 10;
    const skip = !filter.$page || filter.$page < 1 ? 0 : (filter.$page - 1) * limit;

    const [farmingCycles, count] = await this.dao.getMany({
      where: {
        farmingCycleCode: filter.farmingCycleCode,
        farmingStatus: filter.farmingStatus,
        chickType: {
          id: filter.chickTypeId,
          chickTypeName: filter.chickTypeName,
        },
        coop: {
          id: filter.coopId,
          coopName: filter.coopName,
          coopTypeId: filter.coopTypeId,
          contract: {
            refContractTypeId: filter.contractTypeId,
          },
        },
        farm: {
          userOwnerId: filter.ownerId,
          category: filter.farmCategory,
          branch: {
            id: filter.branchId,
          },
        },
        farmId: filter.farmId,
        contract: {
          contractType: {
            contractName: filter.contract ? ILike(`%${filter.contract}%`) : undefined,
          },
        },
      },
      take: (filter.$limit !== 0 && limit) || undefined,
      skip,
      order: {
        createdDate: 'DESC',
      },
      select: {
        chickType: {
          id: true,
          chickTypeName: true,
        },
        farm: {
          id: true,
          farmName: true,
          userOwnerId: true,
          category: true,
          branch: {
            id: true,
            name: true,
          },
        },
        coop: {
          id: true,
          coopName: true,
          coopTypeId: true,
          coopType: {
            coopTypeName: true,
            coopTypeCode: true,
          },
          contractId: true,
          contract: {
            branchId: true,
            refContractTypeId: true,
            branch: {
              id: true,
              name: true,
            },
            contractType: {
              id: true,
              contractName: true,
            },
          },
        },
        farmingCycleMembers: true,
        contract: {
          id: true,
          contractType: {
            id: true,
            contractName: true,
          },
        },
      },
      relations: {
        chickType: true,
        farm: {
          owner: true,
          branch: true,
        },
        coop: {
          coopType: true,
        },
        farmingCycleMembers: {
          user: true,
        },
        repopulations: true,
        userModifier: true,
        contract: {
          contractType: true,
        },
      },
      relationLoadStrategy: 'join',
    });

    return [
      farmingCycles.map<GetFarmingCycleResponse>((farmingCycle) => ({
        farmingCycleId: farmingCycle.id,
        farmingCycleCode: farmingCycle.farmingCycleCode,
        farmingStatus: farmingCycle.farmingStatus,
        coopName: farmingCycle.coop.coopName,
        coopTypeName: farmingCycle.coop.coopType.coopTypeName,
        initialPopulation: farmingCycle.initialPopulation,
        productionTeam:
          farmingCycle.farmingCycleMembers
            ?.filter((member) => member.isInternal === true)
            .map((selectedMember) => selectedMember.user?.fullName) || [],
        coopOperatorTeam:
          farmingCycle.farmingCycleMembers
            ?.filter((member) => member.isInternal === false)
            .map((selectedMember) => selectedMember.user?.fullName) || [],
        farmingCycleStartDate: farmingCycle.farmingCycleStartDate
          ? format(new Date(farmingCycle.farmingCycleStartDate), DATE_SQL_FORMAT)
          : '',
        closedDate: farmingCycle.closedDate
          ? format(new Date(farmingCycle.closedDate), DATE_SQL_FORMAT)
          : '',
        ownerName: farmingCycle.farm.owner.fullName,
        isRepopulated: farmingCycle.repopulations.length > 0,
        branchId: farmingCycle.farm.branch?.id || '',
        branchName: farmingCycle.farm.branch?.name || '',
        contract: farmingCycle.contractId || farmingCycle.coop.contractId || '',
        contractName:
          farmingCycle.contract?.contractType?.contractName ||
          farmingCycle.coop.contract?.contractType?.contractName ||
          '',
        contractTypeId:
          farmingCycle.contract?.refContractTypeId ||
          farmingCycle.coop.contract?.refContractTypeId ||
          '',
        farmCategory: farmingCycle.farm.category,
        modifiedBy: farmingCycle.userModifier?.fullName || farmingCycle.modifiedBy,
        modifiedDate: farmingCycle.modifiedDate?.toISOString(),
      })),
      count,
    ];
  }

  async updateFarmingCycle(
    farmingCycleId: string,
    input: UpdateFarmingCycleBody,
    user: RequestUser,
  ): Promise<Partial<UpdateFarmingCycleItemResponse>> {
    const queryRunner = await this.dao.startTransaction();

    try {
      if (input.farmingStatus === FC_FARMING_STATUS.CLOSED && !input.closedDate) {
        throw ERR_BAD_REQUEST();
      }

      const farmingCycle = await this.dao.getOneStrict({
        where: {
          id: farmingCycleId,
        },
        relations: {
          farm: true,
        },
      });

      if (input.farmingStatus === FC_FARMING_STATUS.CLOSED && input.closedDate) {
        const startDate = zonedTimeToUtc(
          new Date(farmingCycle.farmingCycleStartDate),
          DEFAULT_TIME_ZONE,
        );

        const closedDate = zonedTimeToUtc(new Date(input.closedDate), DEFAULT_TIME_ZONE);

        if (isBefore(closedDate, startDate)) {
          throw ERR_BAD_REQUEST();
        }
      }

      await this.fcMemberDAO.deleteWithTx(farmingCycleId, queryRunner);

      let farmingCycleMembers: Partial<FarmingCycleMemberD>[] = [];

      if (input.leaderId) {
        const leaderAsMemberPayload: Partial<FarmingCycleMemberD> = {
          farmingCycleId,
          userId: input.leaderId,
          isLeader: true,
          isInternal: false,
        };

        farmingCycleMembers.push(leaderAsMemberPayload);
      }

      if (input.workerIds) {
        input.workerIds.forEach((workerId) => {
          const workerAsMemberPayload: Partial<FarmingCycleMemberD> = {
            farmingCycleId,
            userId: workerId,
            isLeader: false,
            isInternal: false,
          };

          farmingCycleMembers.push(workerAsMemberPayload);
        });
      }

      if (input.productionTeamIds) {
        input.productionTeamIds.forEach((productionMember) => {
          const productionTeamAsMemberPayload: Partial<FarmingCycleMemberD> = {
            farmingCycleId,
            userId: productionMember,
            isLeader: false,
            isInternal: true,
          };

          farmingCycleMembers.push(productionTeamAsMemberPayload);
        });
      }

      if (input.pplIds) {
        input.pplIds.forEach((ppl) => {
          const pplMemberPayload: Partial<FarmingCycleMemberD> = {
            farmingCycleId,
            userId: ppl,
            isLeader: false,
            isInternal: true,
          };

          farmingCycleMembers.push(pplMemberPayload);
        });
      }

      const [coopMembers] = await this.coopMemberDAO.getMany({
        where: {
          coopId: input.coopId,
        },
        relations: {
          user: true,
        },
      });

      coopMembers.forEach((coopMember) => {
        const coopMemberPayload: Partial<FarmingCycleMemberD> = {
          farmingCycleId,
          userId: coopMember.user.id,
          isLeader: coopMember.user.userType === USER_TYPE.KK,
          isInternal: USER_TYPE_INTERNAL_GROUP.includes(coopMember.user.userType),
        };

        farmingCycleMembers.push(coopMemberPayload);
      });

      const farmingCycleMemberMap: { [key: string]: Partial<FarmingCycleMemberD> } = {};

      farmingCycleMembers.forEach((fcMember) => {
        farmingCycleMemberMap[fcMember.userId as string] = fcMember;
      });

      farmingCycleMembers = Object.values(farmingCycleMemberMap);

      await this.fcMemberDAO.createManyWithTx(farmingCycleMembers, user, queryRunner);

      const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);
      const startDate = utcToZonedTime(new Date(input.farmingCycleStartDate), DEFAULT_TIME_ZONE);

      let isFarmingCycleReStarted = false;
      let isCoopActiveFarmingCycleReleased = false;

      const payload: Partial<FarmingCycle> = {
        coopId: input.coopId,
        farmingCycleStartDate: new Date(input.farmingCycleStartDate),
        initialPopulation: input.initialPopulation,
        chickTypeId: input.chickTypeId,
        chickSupplier: input.chickSupplier,
        hatchery: input.hatchery,
        remarks: input.remarks,
        contractId: input.contract,
        farmingStatus: input.farmingStatus,
        closedDate: input.closedDate ? new Date(input.closedDate) : undefined,
        docInBW: input.docInBW,
        docInUniformity: input.docInUniformity,
        pulletInWeeks: input.pulletInWeeks,
      };

      // FarmingCycleStartDate & ClosedDate Checker for auto-set status
      if (isAfter(startDate, now)) {
        payload.farmingStatus = FC_FARMING_STATUS.NEW;
        isCoopActiveFarmingCycleReleased = true;
      }

      const unapprovedChickInRequest = await this.chickInRequestDAO.getOne({
        where: {
          farmingCycleId: farmingCycle.id,
          isApproved: false,
          approvedBy: IsNull(),
        },
      });

      if (
        farmingCycle.farm.category !== FarmChickCategory.LAYER &&
        !unapprovedChickInRequest &&
        (isToday(startDate) || isBefore(startDate, now))
      ) {
        payload.farmingStatus = FC_FARMING_STATUS.IN_PROGRESS;
        isFarmingCycleReStarted = true;
      }

      if (
        input.closedDate &&
        (isToday(utcToZonedTime(new Date(input.closedDate), DEFAULT_TIME_ZONE)) ||
          isBefore(utcToZonedTime(new Date(input.closedDate), DEFAULT_TIME_ZONE), now))
      ) {
        payload.farmingStatus = FC_FARMING_STATUS.CLOSED;
        isCoopActiveFarmingCycleReleased = true;
      }

      const payloadChickStock: Partial<FarmingCycleChickStockD> = {
        farmingCycleId,
        userId: user.id,
        transactionDate: new Date(input.farmingCycleStartDate),
        operator: '+',
        qty: input.initialPopulation,
        notes: 'Initial Population',
      };

      await this.farmingCycleChickStockDDAO.upsertOneWithTx(
        { farmingCycleId, notes: 'Initial Population' },
        payloadChickStock,
        user,
        queryRunner,
      );

      // Assign farmingCycleId into coop as activeFarmingCycleId
      if (
        farmingCycle.farm.category === FarmChickCategory.LAYER ||
        (isFarmingCycleReStarted && !isCoopActiveFarmingCycleReleased)
      ) {
        await this.coopDAO.updateOneWithTx(
          { id: input.coopId },
          { activeFarmingCycleId: farmingCycleId },
          user,
          queryRunner,
        );

        await this.coopCacheUtil.invalidateCoopCache(input.coopId, 'both');
      }

      // Release farmingCycleId in coop.activeFarmingCycleId if closed date is set
      if (isCoopActiveFarmingCycleReleased) {
        await this.coopDAO.closeFarmingCycleWithTx(input.coopId, queryRunner);
      }

      await this.dao.updateOneWithTx({ id: farmingCycleId }, payload, user, queryRunner);

      await this.dao.commitTransaction(queryRunner);

      const farmingCycleUpdated = await this.dao.getOneStrict({
        where: {
          id: farmingCycleId,
        },
      });

      if (farmingCycleUpdated.farmingStatus === FC_FARMING_STATUS.IN_PROGRESS) {
        // retrigger task ticket generation
        const jobs = await this.dao.getTaskTicketJobs(farmingCycleId);

        await Promise.all(
          jobs.map<Promise<any>>(async (job) => this.generateTaskTicketQueue.addJob(job)),
        );

        // retrigger daily monitoring calculation from the beginning
        await this.calculateDailyMonitoringQueue.addJob({
          farmingCycleId,
          farmingCycleCode: farmingCycle.farmingCycleCode,
          date: format(farmingCycle.farmingCycleStartDate, DATE_SQL_FORMAT),
        });

        await this.initializeDailyMonitoringQueue.addJob(
          {
            farmingCycleId,
          },
          {
            delay: minutesToMilliseconds(5),
          },
        );

        await this.setIotDeviceStatusQueue.addJob({
          coopId: farmingCycleUpdated.coopId,
          deviceTypes: ['SMART_CONTROLLER'],
          status: DEVICE_SENSOR_STATUS.ACTIVE,
        });
      }

      if (farmingCycleUpdated.farmingStatus === FC_FARMING_STATUS.CLOSED) {
        await this.setIotDeviceStatusQueue.addJob({
          coopId: farmingCycleUpdated.coopId,
          deviceTypes: ['SMART_CONTROLLER'],
          status: DEVICE_SENSOR_STATUS.INACTIVE,
        });

        await this.farmingCycleClosedQueue.addJob(farmingCycleUpdated);
      }

      await this.fcUpdatedQueue.addJob(farmingCycleUpdated);

      return {
        coopId: farmingCycleUpdated.coopId,
        farmingCycleStartDate: farmingCycleUpdated.farmingCycleStartDate
          ? format(new Date(farmingCycleUpdated.farmingCycleStartDate), DATE_SQL_FORMAT)
          : '',
        farmingStatus: farmingCycleUpdated.farmingStatus,
        initialPopulation: farmingCycleUpdated.initialPopulation,
        chickTypeId: farmingCycleUpdated.chickTypeId,
        chickSupplier: farmingCycleUpdated.chickSupplier,
        hatchery: farmingCycleUpdated.hatchery,
        remarks: farmingCycleUpdated.remarks,
        contract: farmingCycleUpdated.contractId || '',
        closedDate: farmingCycleUpdated.closedDate
          ? format(new Date(farmingCycleUpdated.closedDate), DATE_SQL_FORMAT)
          : '',
        docInBW: farmingCycleUpdated.docInBW || undefined,
        docInUniformity: farmingCycleUpdated.docInUniformity || undefined,
        pulletInWeeks: farmingCycleUpdated.pulletInWeeks || undefined,
      };
    } catch (error) {
      await this.dao.rollbackTransaction(queryRunner);

      throw error;
    }
  }

  async getFarmingCycleOperators(farmingCycleId: string): Promise<FarmingCycleOperatorList> {
    const [fcMembers] = await this.fcMemberDAO.getMany({
      where: {
        farmingCycleId,
      },
      order: {
        isLeader: 'DESC',
      },
      relations: {
        user: true,
      },
    });

    return fcMembers.map((fcm) => ({
      id: fcm.user.id,
      userCode: fcm.user.userCode,
      fullName: fcm.user.fullName,
      phoneNumber: fcm.user.phoneNumber,
      role: fcm.isLeader ? OperatorTypeEnum.KK : OperatorTypeEnum.AK,
    }));
  }

  async getAvailableOperators(
    farmingCycleId: string,
    ownerId: string,
  ): Promise<FarmingCycleOperatorList> {
    const availableOps = await this.userDAO.getUserOperatorNotInFarmingCycle(
      ownerId,
      farmingCycleId,
    );

    return availableOps.map((ao) => ({
      id: ao.id,
      userCode: ao.userCode,
      fullName: ao.fullName,
      phoneNumber: ao.phoneNumber,
      role: ao.userType === 'poultry leader' ? OperatorTypeEnum.KK : OperatorTypeEnum.AK,
    }));
  }

  async addOperatorsToFarmingCycle(
    data: AssignOperatorsToFarmingCycleBody,
    farmingCycleId: string,
    ownerId: string,
  ): Promise<string[]> {
    const [users] = await this.userDAO.getMany({
      where: {
        id: In(data.operatorIds),
        userType: In(['poultry leader', 'poultry worker']),
        status: true,
      },
    });

    if (!users.length) {
      throw ERR_USER_NOT_FOUND('- active poultry workers only');
    }

    const operators = await this.fcMemberDAO.assignUsersToFarmingCycle(
      users,
      farmingCycleId,
      ownerId,
    );

    operators.forEach((o) => {
      this.userAssignedToFcQueue.addJob(o);
    });

    return operators.map((o) => o.id);
  }

  async getFarmingCycleById(farmingCycleId: string): Promise<FarmingCycleItem> {
    const farmingCycle = await this.dao.getOneStrict({
      where: {
        id: farmingCycleId,
      },
      relations: {
        farm: {
          branch: true,
        },
        contract: true,
        coop: {
          coopType: true,
          contract: {
            branch: true,
            contractType: true,
          },
        },
        farmingCycleMembers: {
          user: true,
        },
        repopulations: true,
      },
    });

    const memberGroup: FarmingCycleItemMemberGroup = this.groupFarmingCycleMembers(farmingCycle);

    const farmingCycleItem: FarmingCycleItem = {
      ...farmingCycle,
      ...memberGroup,
      contract: farmingCycle.contract || farmingCycle.coop.contract || null,
      contractType:
        farmingCycle.contract?.contractType || farmingCycle.coop.contract?.contractType || null,
      branch: farmingCycle.farm.branch || null,
      farmingCycleStartDate: farmingCycle.farmingCycleStartDate
        ? format(new Date(farmingCycle.farmingCycleStartDate), DATE_SQL_FORMAT)
        : '',
      closedDate: farmingCycle.closedDate
        ? format(new Date(farmingCycle.closedDate), DATE_SQL_FORMAT)
        : '',
      isRepopulated: farmingCycle.repopulations.length > 0,
      pulletInWeeks: farmingCycle.pulletInWeeks,
    };

    return farmingCycleItem;
  }

  public async checkFarmingCycleOwnership(
    farmingCycleId: string,
    userId: string,
  ): Promise<Boolean> {
    try {
      const farmingCycle = await this.dao.getOneStrict({
        where: {
          id: farmingCycleId,
        },
        relations: {
          farm: true,
        },
      });

      if (farmingCycle.userPplId === userId) {
        return true;
      }

      if (farmingCycle.farm.userOwnerId === userId) {
        return true;
      }

      const farmingCycleMember = await this.fcMemberDAO.getOne({
        where: {
          farmingCycleId,
          userId,
        },
      });

      if (farmingCycleMember) {
        return true;
      }

      const coopMember = await this.coopMemberDAO.getOne({
        where: {
          coopId: farmingCycle.coopId,
          userId,
        },
      });

      if (coopMember) {
        return true;
      }

      return false;
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        return false;
      }

      throw error;
    }
  }

  async getFarmingCycleSummary(farmingCycleId: string): Promise<FarmingInfoItem> {
    // get all varibales id
    const variables = await this.variableDAO.getMappedByCode([
      VAR_TOMO_CODE,
      VAR_CULLED_CODE,
      VAR_HARVESTED_CODE,
      VAR_DEAD_CHICK_CODE,
    ]);

    // gather all data
    const [farmingCycle, culled, deadChick, latestDailyMonitoring] = await Promise.all([
      this.dao.getOneStrict({
        where: {
          id: farmingCycleId,
        },
        select: {
          id: true,
          initialPopulation: true,
          farmingCycleStartDate: true,
        },
      }),
      this.taskTicketDDAO.getLatestSum(variables.get(VAR_CULLED_CODE)?.id!, farmingCycleId, {
        taskCode: TASK_LAPORAN_AKHIR_HARI,
      }),
      this.taskTicketDDAO.getLatestSum(variables.get(VAR_DEAD_CHICK_CODE)?.id!, farmingCycleId, {
        taskCode: TASK_LAPORAN_AKHIR_HARI,
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

    // Additional Harvest which hasn't added before 17.00 PM as DailyMonitoring hasn't recorded
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);
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

    return {
      id: farmingCycle.id,
      initialPopulation: farmingCycle.initialPopulation,
      farmingCycleStartDate: farmingCycle.farmingCycleStartDate
        ? format(farmingCycle.farmingCycleStartDate, DATE_SQL_FORMAT)
        : '-',
      mortality: latestDailyMonitoring?.populationMortaled || 0,
      culled,
      harvested: (latestDailyMonitoring?.populationHarvested || 0) + countAdditionalHarvest,
      deadChick,
      day:
        (farmingCycle.farmingCycleStartDate &&
          differenceInDays(
            utcToZonedTime(new Date(), DEFAULT_TIME_ZONE),
            farmingCycle.farmingCycleStartDate,
          )) ||
        null,
      estimatedPopulation:
        (latestDailyMonitoring?.populationTotal || farmingCycle.initialPopulation) -
        (latestDailyMonitoring?.populationMortaled || 0) -
        (latestDailyMonitoring?.populationHarvested || 0 + countAdditionalHarvest),
    };
  }

  async getFarmingCyclePplList(farmingCycleId: string): Promise<UserItem[]> {
    const farmingCycle = await this.dao.getOneStrict({
      where: {
        id: farmingCycleId,
      },
      relations: {
        farmingCycleMembers: {
          user: true,
        },
      },
    });

    return (
      farmingCycle.farmingCycleMembers
        .filter((member) => isRoleAllowed(member.user.userType, [USER_TYPE.PPL]))
        .map((member) => ({
          fullName: member.user.fullName,
          waNumber: member.user.waNumber,
        })) || []
    );
  }

  async getFarmingCycleDailyReports(
    farmingCycleId: string,
    user: RequestUser,
    page: number,
    limit: number,
  ): Promise<DailyReportsResponseItem[]> {
    const farmingCycle = await this.dao.getOneStrict({
      where: {
        id: farmingCycleId,
      },
      relations: {
        farm: true,
      },
    });

    if (farmingCycle.farm.category === FarmChickCategory.LAYER) {
      return this.getFarmingCycleDailyReportLayer(farmingCycle, user, page, limit);
    }

    return this.getFarmingCycleDailyReportBroiler(farmingCycle, user);
  }

  private async getFarmingCycleDailyReportLayer(
    farmingCycle: FarmingCycle,
    user: RequestUser,
    page: number,
    limit: number,
  ): Promise<DailyReportsResponseItem[]> {
    // get date list by farmingcycle start date
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);
    const upperDate = getHours(now) > 17 ? now : subDays(now, 1);
    const lowerDate = addDays(farmingCycle.farmingCycleStartDate, 1);

    const dateList = Array.from({ length: differenceInDays(upperDate, lowerDate) + 1 }, (_, i) =>
      addDays(lowerDate, i),
    ).sort((a, b) => b.getTime() - a.getTime());

    // date by pagination
    const dateByPage = dateList.slice((page - 1) * limit, page * limit);

    const [dailyMonitorings] = await this.dailyMonitoringDAO.getMany({
      where: {
        farmingCycleId: farmingCycle.id,
        date: In(dateByPage.map((date) => format(date, DATE_SQL_FORMAT))),
      },
      relations: {
        executor: true,
      },
    });

    const items = dateByPage.map((date) => {
      const dm = dailyMonitorings.find(
        (d) => format(new Date(d.date), DATE_SQL_FORMAT) === format(date, DATE_SQL_FORMAT),
      );

      const item = {
        taskTicketId: dm?.taskTicketId || '',
        date: format(date, DATE_SQL_FORMAT),
        status: DAILY_MONITORING_STATUS[DAILY_MONITORING_STATUS_ENUM.EMPTY],
      };

      if (dm?.reportStatus) {
        item.status = DAILY_MONITORING_STATUS[dm?.reportStatus as DAILY_MONITORING_STATUS_ENUM];
      } else if (
        item.status === DAILY_MONITORING_STATUS[DAILY_MONITORING_STATUS_ENUM.EMPTY] &&
        isBefore(addDays(date, DAILY_REPORT_DEADLINE), new Date())
      ) {
        item.status = DAILY_MONITORING_STATUS[DAILY_MONITORING_STATUS_ENUM.LATE];
      }

      if (
        item.status === DAILY_MONITORING_STATUS.FILLED &&
        isRoleAllowed(user.role, [USER_TYPE.PPL, USER_TYPE.ADM, USER_TYPE.OWN])
      ) {
        item.status = DAILY_MONITORING_STATUS.NEED_REVIEW;
      }

      if (
        item.status === DAILY_MONITORING_STATUS.REVIEWED &&
        dm?.executor &&
        isRoleAllowed(dm.executor.userType, [USER_TYPE.PPL])
      ) {
        item.status = DAILY_MONITORING_STATUS[DAILY_MONITORING_STATUS_ENUM.FILLED];
      }

      return item;
    });

    return items;
  }

  private async getFarmingCycleDailyReportBroiler(
    farmingCycle: FarmingCycle,
    user: RequestUser,
  ): Promise<DailyReportsResponseItem[]> {
    const [taskTicket] = await this.taskTicketDAO.getMany({
      where: {
        farmingCycleId: farmingCycle.id,
        farmingCycleTask: {
          taskCode: TASK_LAPORAN_AKHIR_HARI,
        },
      },
      relations: {
        dailyMonitoring: true,
        executor: true,
      },
      relationLoadStrategy: 'join',
      order: {
        reportedDate: 'DESC',
      },
    });

    return taskTicket.map<DailyReportsResponseItem>((tt) => {
      const item = {
        taskTicketId: tt.id,
        date: format(tt.reportedDate, DATE_SQL_FORMAT),
        status: DAILY_MONITORING_STATUS[DAILY_MONITORING_STATUS_ENUM.EMPTY],
      };

      if (tt.dailyMonitoring?.reportStatus) {
        item.status =
          DAILY_MONITORING_STATUS[tt.dailyMonitoring?.reportStatus as DAILY_MONITORING_STATUS_ENUM];
      } else if (
        item.status === DAILY_MONITORING_STATUS[DAILY_MONITORING_STATUS_ENUM.EMPTY] &&
        isBefore(addDays(tt.reportedDate, DAILY_REPORT_DEADLINE), new Date())
      ) {
        item.status = DAILY_MONITORING_STATUS[DAILY_MONITORING_STATUS_ENUM.LATE];
      }

      if (
        item.status === DAILY_MONITORING_STATUS.FILLED &&
        isRoleAllowed(user.role, [USER_TYPE.PPL, USER_TYPE.ADM, USER_TYPE.OWN])
      ) {
        item.status = DAILY_MONITORING_STATUS.NEED_REVIEW;
      }

      if (
        item.status === DAILY_MONITORING_STATUS.REVIEWED &&
        tt.executor &&
        isRoleAllowed(tt.executor.userType, [USER_TYPE.PPL])
      ) {
        item.status = DAILY_MONITORING_STATUS[DAILY_MONITORING_STATUS_ENUM.FILLED];
      }

      return item;
    });
  }

  async saveDailyReports(user: RequestUser, items: DailyReportItem[]) {
    const ticketIds: string[] = [];
    const mappedItems = items.reduce<Map<string, DailyReportItem>>((prep, item) => {
      // skip update for empty item
      if (
        !item.bw &&
        !item.culled &&
        !item.dead &&
        !item.feedConsumptions?.length &&
        !item.ovkConsumptions?.length
      ) {
        return prep;
      }

      ticketIds.push(item.taskTicketId);
      prep.set(item.taskTicketId, item);
      return prep;
    }, new Map<string, DailyReportItem>());

    const [mappedTaskTickets, variables, fc] = await Promise.all([
      this.taskTicketDAO.getMapped(
        {
          where: {
            id: In(ticketIds),
          },
          relations: {
            details: true,
          },
        },
        (taskTicket: TaskTicket) => taskTicket.id,
      ),
      this.variableDAO.getMappedByCode([
        VAR_ABW_CODE,
        VAR_TOMO_CODE,
        VAR_DEAD_CHICK_CODE,
        VAR_CULLED_CODE,
        VAR_FEED_CON_CODE,
        VAR_YELLOW_CARD,
        VAR_FEED_TYPE_CODE,
        VAR_OVK_CON_CODE,
      ]),
      this.dao.getOneStrict({
        where: {
          taskTickets: {
            id: ticketIds[0],
          },
        },
        relations: {
          taskTickets: true,
          coop: true,
        },
      }),
    ]);

    const targetDaysFilter = Array.from(mappedTaskTickets.values()).reduce((prev, curr) => {
      const day = differenceInDays(fc.farmingCycleStartDate, curr.reportedDate);

      prev.push({
        day: Math.abs(day),
        target: {
          coopTypeId: fc.coop.coopTypeId,
          chickTypeId: fc.chickTypeId,
          variableId: variables.get(VAR_ABW_CODE)!.id,
        },
      });

      return prev;
    }, [] as FindOptionsWhere<TargetDaysD>[]);

    const mappedTarget = await this.targetDaysDDAO.getMappedByVariableAndDay(targetDaysFilter);

    mappedItems.forEach((val) => {
      const day = differenceInDays(
        fc.farmingCycleStartDate,
        mappedTaskTickets.get(val.taskTicketId)!.reportedDate,
      );

      const targetBw = mappedTarget.get(
        `${variables.get(VAR_ABW_CODE)!.id}-${Math.abs(day)}`,
      )?.minValue;

      // validate bw input
      if (targetBw && val.bw) {
        const abwValidationRange = {
          min: 0.5 * targetBw,
          max: 1.5 * targetBw,
        };

        if (val.bw < abwValidationRange.min || val.bw > abwValidationRange.max) {
          throw ERR_DAILY_REPORT_ABW_OUT_OF_RANGE(
            `(rentang standar hari ke-${day}: ${0.5 * targetBw} - ${1.5 * targetBw} gr)`,
          );
        }
      }
    });
    const executedDate = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);
    const updateTaskTickets: DeepPartial<TaskTicket>[] = [];
    const mappedDetails = {
      keyFunction: (taskTicketId: string, variableId: string) => `${taskTicketId}-${variableId}`,
      data: new Map<string, TaskTicketD>(),
    };

    mappedTaskTickets.forEach((val) => {
      updateTaskTickets.push({
        id: val.id,
        alreadyExecute: true,
        executedBy: val.executedBy || user.id, // prioritize initial value
        executedDate: val.executedDate || executedDate, // prioritize initial value
        ticketStatus: 3,
      });
      val.details.forEach((detail) => {
        mappedDetails.data.set(mappedDetails.keyFunction(val.id, detail.variableId), detail);
      });
    });

    const updateDetails: {
      taskTicketD: DeepPartial<TaskTicketD>;
      feedConsumptions?: { feedStockSummaryId: string; quantity: number }[];
      ovkConsumptions?: { ovkStockSummaryId: string; quantity: number }[];
    }[] = [];
    const upsertTaskPhotos: DeepPartial<TaskTicketPhotoD>[] = [];
    let leastTaskTicket: Partial<TaskTicket> = {};

    mappedTaskTickets.forEach(async (val, key) => {
      if (!leastTaskTicket.reportedDate || val.reportedDate < leastTaskTicket.reportedDate) {
        leastTaskTicket = mappedTaskTickets.get(key)!;
      }
      const inputItem = mappedItems.get(val.id)!;
      const bwDetail = mappedDetails.data.get(
        mappedDetails.keyFunction(val.id, variables.get(VAR_ABW_CODE)!.id),
      );
      if (bwDetail) {
        updateDetails.push({
          taskTicketD: {
            id: bwDetail.id,
            dataValue: (inputItem.bw && `${inputItem.bw}`) || undefined,
            executedDate,
          },
        });
      }

      const deadChickDetail = mappedDetails.data.get(
        mappedDetails.keyFunction(val.id, variables.get(VAR_DEAD_CHICK_CODE)!.id),
      );
      if (deadChickDetail) {
        updateDetails.push({
          taskTicketD: {
            id: deadChickDetail.id,
            dataValue: (inputItem.dead && `${inputItem.dead}`) || undefined,
            executedDate,
          },
        });
      }

      const culledChickDetail = mappedDetails.data.get(
        mappedDetails.keyFunction(val.id, variables.get(VAR_CULLED_CODE)!.id),
      );
      if (culledChickDetail) {
        updateDetails.push({
          taskTicketD: {
            id: culledChickDetail.id,
            dataValue: (inputItem.culled && `${inputItem.culled}`) || undefined,
            executedDate,
          },
        });
      }

      const tomoDetail = mappedDetails.data.get(
        mappedDetails.keyFunction(val.id, variables.get(VAR_TOMO_CODE)!.id),
      );
      if (tomoDetail) {
        updateDetails.push({
          taskTicketD: {
            id: tomoDetail.id,
            dataValue: `${(inputItem.culled || 0) + (inputItem.dead || 0)}`,
            executedDate,
          },
        });
      }

      const feedConDetail = mappedDetails.data.get(
        mappedDetails.keyFunction(val.id, variables.get(VAR_FEED_CON_CODE)!.id),
      );
      if (feedConDetail) {
        let dataValue = (inputItem.feed && `${inputItem.feed}`) || undefined;

        if (inputItem.feedConsumptions) {
          const totalConsumption = inputItem.feedConsumptions.reduce(
            (prev, curr) => prev + Number(curr.quantity),
            0,
          );

          dataValue = String(totalConsumption);
        }

        updateDetails.push({
          taskTicketD: {
            id: feedConDetail.id,
            taskTicketId: feedConDetail.taskTicketId,
            dataValue,
            executedDate,
          },
          feedConsumptions: inputItem.feedConsumptions,
        });
      }

      const feedTypeDetail = mappedDetails.data.get(
        mappedDetails.keyFunction(val.id, variables.get(VAR_FEED_TYPE_CODE)!.id),
      );
      if (feedTypeDetail) {
        const dataValue = inputItem.feedType || undefined;

        updateDetails.push({
          taskTicketD: {
            id: feedTypeDetail.id,
            dataValue,
            feedBrandId: inputItem.feedAdditionalInfo || undefined,
            executedDate,
          },
        });
      }

      const yellowCardDetail = mappedDetails.data.get(
        mappedDetails.keyFunction(val.id, variables.get(VAR_YELLOW_CARD)!.id),
      );
      if (yellowCardDetail) {
        updateDetails.push({
          taskTicketD: {
            id: yellowCardDetail.id,
            executedDate,
          },
        });

        if (inputItem.yellowCardImages) {
          upsertTaskPhotos.push(
            ...inputItem.yellowCardImages.map<DeepPartial<TaskTicketPhotoD>>((img) => ({
              id: img.id,
              imageUrl: img.url,
              taskTicketDetailId: yellowCardDetail.id,
              executedDate,
            })),
          );
        }
      }

      const ovkConDetail = mappedDetails.data.get(
        mappedDetails.keyFunction(val.id, variables.get(VAR_OVK_CON_CODE)!.id),
      );
      if (ovkConDetail) {
        let dataValue = (inputItem.feed && `${inputItem.feed}`) || undefined;

        if (inputItem.ovkConsumptions) {
          const totalConsumption = inputItem.ovkConsumptions.reduce(
            (prev, curr) => prev + Number(curr.quantity),
            0,
          );

          dataValue = String(totalConsumption);
        }
        updateDetails.push({
          taskTicketD: {
            id: ovkConDetail.id,
            taskTicketId: ovkConDetail.taskTicketId,
            dataValue,
            executedDate,
          },
          ovkConsumptions: inputItem.ovkConsumptions,
        });
      }
    });

    const [, updatedDetails] = await Promise.all([
      this.taskTicketDAO.upsertMany(user, updateTaskTickets),
      this.taskTicketDDAO.upsertMany(
        user,
        updateDetails.map((ud) => ud.taskTicketD),
      ),
      this.taskTicketPhotoDDAO.upsertMany(user, upsertTaskPhotos),
    ]);

    updatedDetails.forEach((detail) => {
      const updateDetail = updateDetails.find((update) => update.taskTicketD.id === detail.id);

      const feedConsumptions = updateDetail ? updateDetail.feedConsumptions : undefined;

      const ovkConsumptions = updateDetail ? updateDetail.ovkConsumptions : undefined;

      this.taskTicketDetailUpdatedQueue.addJob({
        taskTicketD: detail,
        taskTicket: detail.taskTicket,
        user,
        feedConsumptions,
        ovkConsumptions,
      });
    });

    if (leastTaskTicket.id && leastTaskTicket.farmingCycleId) {
      const farmingCycle = await this.dao.getOneStrict({
        where: {
          id: leastTaskTicket.farmingCycleId,
        },
      });

      await this.calculateDailyMonitoringQueue.addJob({
        user,
        farmingCycleId: leastTaskTicket.farmingCycleId,
        farmingCycleCode: farmingCycle.farmingCycleCode,
        taskTicketId: leastTaskTicket.id,
        updateStatusStrategy: ticketIds.length === 1 ? 'single' : 'multiple',
        date: format(leastTaskTicket.reportedDate!, DATE_SQL_FORMAT),
      });
    }

    items.forEach(async (item) => {
      const bodyPayload: Partial<ErpDailyMonitoringUpsertPayload> = {
        isAdjustment: false,
        mortality: item.dead || 0,
        culling: item.culled || 0,
        bw: item.bw || 0,
      };

      this.dailyMonitoringUpsertOdooQueue.addJob({
        body: bodyPayload,
        taskTicketId: item.taskTicketId,
        feedConsumption: item.feedConsumptions,
      });
    });
  }

  async dailyTaskTicket(
    farmingCycleId: string,
    date?: string,
    taskTicketId?: string,
  ): Promise<TaskTicket | undefined> {
    const taskTicket = await this.taskTicketDAO.getOne({
      where: {
        farmingCycleId,
        reportedDate:
          (date && new Date(format(new Date(date), DATETIME_17_SQL_FORMAT))) || undefined,
        taskName: TASK_NAMES.ISI_LAPORAN_AKHIR_HARI,
        id: taskTicketId,
      },
    });

    return taskTicket || undefined;
  }

  @Transactional()
  async saveDailyReportTaskTicket(
    user: RequestUser,
    taskTicketId: string,
    body: SubmitDailyReportBody,
    queryRunner: QueryRunner,
  ): Promise<TaskTicket> {
    /**
     * FIXME: currently not able to properly validate edited daily report
     * needs more info from request such as previously submitted and newly submitted detail
     */
    const taskTicket = await this.taskTicketDAO.getOneStrict({
      where: {
        id: taskTicketId,
      },
      relations: {
        dailyMonitoring: true,
        farmingCycle: {
          coop: true,
        },
        feedStocks: true,
        ovkStocks: true,
      },
    });

    if (taskTicket.alreadyExecute && taskTicket.ticketStatus === TICKET_STATUS.EXECUTED) {
      await this.revertFeedConsumptions(taskTicket, user, queryRunner);

      await this.revertOvkConsumptions(taskTicket, user, queryRunner);
    }

    const feedConsumptions = body.feedConsumptions || [];

    const feedStockIds = feedConsumptions.map((fc) => fc.feedStockSummaryId);

    if (feedStockIds.length > 0) {
      const feedStockSummaries = await this.farmingCycleFeedStockSummaryDAO.getManyWithTx(
        {
          where: {
            id: In(feedStockIds),
          },
        },
        queryRunner,
      );

      feedConsumptions.forEach((fc) => {
        const summary = feedStockSummaries.find((fss) => fss.id === fc.feedStockSummaryId);

        if (summary && fc.quantity > summary.remainingQuantity) {
          throw ERR_DAILY_REPORT_FEED_CONSUMPTION_EXCEEDED(
            `${summary.remainingQuantity}`,
            `(${summary.productName})`,
          );
        }
      });
    }

    const ovkConsumptions = body.ovkConsumptions || [];

    const ovkConsumptionIds = ovkConsumptions.map((oc) => oc.ovkStockSummaryId);

    if (ovkConsumptionIds.length > 0) {
      const ovkStockSummaries = await this.farmingCycleOvkStockSummaryDAO.getManyWithTx(
        {
          where: {
            id: In(ovkConsumptionIds),
          },
        },
        queryRunner,
      );

      ovkConsumptions.forEach((oc) => {
        const summary = ovkStockSummaries.find((oss) => oss.id === oc.ovkStockSummaryId);

        if (summary && oc.quantity > summary.remainingQuantity) {
          throw ERR_DAILY_REPORT_OVK_CONSUMPTION_EXCEEDED(
            `${summary.remainingQuantity}`,
            `(${summary.productName})`,
          );
        }
      });
    }

    // update task ticket
    return this.taskTicketDAO.updateOne(
      {
        id: taskTicketId,
      },
      {
        ticketStatus: TICKET_STATUS.EXECUTED,
        executedBy: user.id,
        executedDate: utcToZonedTime(new Date(), DEFAULT_TIME_ZONE),
        alreadyExecute: true,
      },
      user,
      queryRunner,
    );
  }

  @Transactional()
  async saveDailyReportTaskTicketDetails(
    user: RequestUser,
    taskTicketId: string,
    item: DailyReportItem,
    queryRunner: QueryRunner,
  ): Promise<TaskTicketDetailUpdatedJobData[]> {
    const taskTicketUpdatedJob: TaskTicketDetailUpdatedJobData[] = [];

    const [taskTicket, taskTicketDetails, variables] = await Promise.all([
      this.taskTicketDAO.getOneWithTx(
        {
          where: {
            id: taskTicketId,
          },
        },
        queryRunner,
      ),
      this.taskTicketDDAO.getManyWithTx(
        {
          where: {
            taskTicketId,
          },
        },
        queryRunner,
      ),
      this.variableDAO.getMappedByCode([
        VAR_ABW_CODE,
        VAR_CULLED_CODE,
        VAR_DEAD_CHICK_CODE,
        VAR_FEED_CON_CODE,
        VAR_FEED_TYPE_CODE,
        VAR_TOMO_CODE,
        VAR_TRG_ACC_MORT_CODE,
        VAR_YELLOW_CARD,
        VAR_OVK_CON_CODE,
      ]),
    ]);

    const executedDate = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);
    const mappedDetails = taskTicketDetails.reduce((prev, current) => {
      prev.set(current.variableId, current);
      return prev;
    }, new Map<string, TaskTicketD>());

    const updateItems: DeepPartial<TaskTicketD>[] = [];

    const bwDetail = mappedDetails.get(variables.get(VAR_ABW_CODE)!.id);
    if (bwDetail) {
      updateItems.push({
        id: bwDetail.id,
        dataValue: (item.bw && `${item.bw}`) || undefined,
        executedDate,
      });
    }

    const deadChickDetail = mappedDetails.get(variables.get(VAR_DEAD_CHICK_CODE)!.id);
    if (deadChickDetail) {
      updateItems.push({
        id: deadChickDetail.id,
        dataValue: (item.dead && `${item.dead}`) || undefined,
        executedDate,
      });
    }

    const culledChickDetail = mappedDetails.get(variables.get(VAR_CULLED_CODE)!.id);
    if (culledChickDetail) {
      updateItems.push({
        id: culledChickDetail.id,
        dataValue: (item.culled && `${item.culled}`) || undefined,
        executedDate,
      });
    }

    const tomoDetail = mappedDetails.get(variables.get(VAR_TOMO_CODE)!.id);
    if (tomoDetail) {
      updateItems.push({
        id: tomoDetail.id,
        dataValue: `${(item.culled || 0) + (item.dead || 0)}`,
        executedDate,
      });
    }

    const feedConDetail = mappedDetails.get(variables.get(VAR_FEED_CON_CODE)!.id);
    if (feedConDetail) {
      let dataValue = (item.feed && `${item.feed}`) || undefined;

      if (item.feedConsumptions) {
        const totalConsumption = item.feedConsumptions.reduce(
          (prev, curr) => prev + Number(curr.quantity),
          0,
        );

        dataValue = String(totalConsumption);
      }

      updateItems.push({
        id: feedConDetail.id,
        taskTicketId: feedConDetail.taskTicketId,
        dataValue,
        executedDate,
      });

      taskTicketUpdatedJob.push({
        farmingCycleId: taskTicket?.farmingCycleId,
        taskTicket: taskTicket!,
        taskTicketD: feedConDetail,
        feedConsumptions: item.feedConsumptions,
        ovkConsumptions: undefined,
        user,
      });
    }

    const feedTypeDetail = mappedDetails.get(variables.get(VAR_FEED_TYPE_CODE)!.id);
    if (feedTypeDetail) {
      const dataValue = item.feedType || undefined;

      updateItems.push({
        id: feedTypeDetail.id,
        dataValue,
        feedBrandId: item.feedAdditionalInfo || undefined,
        executedDate,
      });
    }

    const yellowCardDetail = mappedDetails.get(variables.get(VAR_YELLOW_CARD)!.id);
    if (yellowCardDetail) {
      updateItems.push({
        id: yellowCardDetail.id,
        executedDate,
      });

      if (item.yellowCardImages) {
        await this.taskTicketPhotoDDAO.upsertMany(
          user,
          item.yellowCardImages.map((img) => ({
            id: img.id,
            imageUrl: img.url,
            taskTicketDetailId: yellowCardDetail.id,
            executedDate,
          })),
          queryRunner,
        );
      }
    }

    const ovkConDetail = mappedDetails.get(variables.get(VAR_OVK_CON_CODE)!.id);
    if (ovkConDetail) {
      let dataValue = (item.feed && `${item.feed}`) || undefined;

      if (item.ovkConsumptions) {
        const totalConsumption = item.ovkConsumptions.reduce(
          (prev, curr) => prev + Number(curr.quantity),
          0,
        );

        dataValue = String(totalConsumption);
      }
      updateItems.push({
        id: ovkConDetail.id,
        taskTicketId: ovkConDetail.taskTicketId,
        dataValue,
        executedDate,
      });

      taskTicketUpdatedJob.push({
        farmingCycleId: taskTicket?.farmingCycleId,
        taskTicket: taskTicket!,
        taskTicketD: ovkConDetail,
        feedConsumptions: undefined,
        ovkConsumptions: item.ovkConsumptions,
        user,
      });
    }

    await this.taskTicketDDAO.upsertMany(user, updateItems, queryRunner);

    return taskTicketUpdatedJob;
  }

  @Transactional()
  async saveDailyReportDailyMonitoring(
    user: RequestUser,
    farmingCycleId: string,
    dateString: string,
    taskTicketId: string | undefined,
    item: SubmitDailyReportBody,
    queryRunner: QueryRunner,
  ): Promise<DailyMonitoring> {
    const [dailyMonitoring, farmingCycle] = await Promise.all([
      this.dailyMonitoringDAO.getOne({
        where: {
          farmingCycleId,
          date: dateString,
        },
      }),
      this.dao.getOneStrict({
        where: {
          id: farmingCycleId,
        },
        relations: {
          farm: true,
        },
      }),
    ]);

    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);
    const date = utcToZonedTime(new Date(dateString), DEFAULT_TIME_ZONE);
    const farmingCycleStartDate = utcToZonedTime(
      new Date(farmingCycle.farmingCycleStartDate),
      DEFAULT_TIME_ZONE,
    );

    const previousDailyMonitoring = await this.dailyMonitoringDAO.getOne({
      where: {
        farmingCycleId,
        date: format(subDays(date, 1), DATE_SQL_FORMAT),
      },
    });

    // LAYER: BW is optional from client, it will use previous day's BW if not provided
    const bw =
      farmingCycle.farm.category === FarmChickCategory.LAYER
        ? item.averageWeight || previousDailyMonitoring?.bw
        : item.averageWeight;

    const updatedDailyMonitoring = await this.dailyMonitoringDAO.upsertOne(
      user,
      {
        ...dailyMonitoring,
        farmingCycleId,
        taskTicketId,
        day: differenceInDays(date, farmingCycleStartDate),
        date: dateString,
        reportStatus:
          differenceInDays(date, now) > 3
            ? DAILY_MONITORING_STATUS_ENUM.LATE
            : DAILY_MONITORING_STATUS_ENUM.FILLED,
        executedBy: user.id,
        bw,
        cull: item.culling || dailyMonitoring?.cull,
        remarks: item.remarks || dailyMonitoring?.remarks,
        recordingImage:
          item.recordingImage || item.images?.[0]?.url || dailyMonitoring?.recordingImage,
        mortalityImage: item.mortalityImage || dailyMonitoring?.mortalityImage,
      },
      {
        qr: queryRunner,
      },
    );

    await this.dailyMonitoringMortalityDAO.softDeleteManyWithTx(
      {
        dailyMonitoringId: updatedDailyMonitoring.id,
      },
      queryRunner,
    );

    await this.dailyMonitoringMortalityDAO.upsertMany(
      user,
      item.mortalityList?.map((ml) => ({
        ...ml,
        dailyMonitoringId: updatedDailyMonitoring.id,
      })) || [],
      {
        qr: queryRunner,
      },
    );

    return updatedDailyMonitoring;
  }

  async submitDailyReportResponseV2(
    dailyMonitoring: DailyMonitoring,
    feedConsumptions: { quantity: number }[],
  ): Promise<SubmitDailyReportResponseItem> {
    const [farmingCycle, variables] = await Promise.all([
      this.dao.getOneStrict({
        where: {
          id: dailyMonitoring.farmingCycleId,
        },
        relations: {
          coop: true,
        },
      }),
      this.variableDAO.getMappedByCode([VAR_ABW_CODE, VAR_TRG_ACC_MORT_CODE]),
    ]);

    // calculate daily monitoring and get target values
    const [weightTarget, mortalityTarget] = await Promise.all([
      this.targetDAO.getOne({
        where: {
          coopTypeId: farmingCycle.coop.coopTypeId,
          chickTypeId: farmingCycle.chickTypeId,
          variableId: variables.get(VAR_ABW_CODE)!.id,
        },
      }),
      this.targetDAO.getOne({
        where: {
          coopTypeId: farmingCycle.coop.coopTypeId,
          chickTypeId: farmingCycle.chickTypeId,
          variableId: variables.get(VAR_TRG_ACC_MORT_CODE)!.id,
        },
      }),
    ]);

    /* prettier-ignore */
    const [weightTargetToday, mortalityTargetToday] = await Promise.all([
      weightTarget
        ? this.targetDaysDDAO.getOne({
          where: {
            targetId: weightTarget.id,
            day: dailyMonitoring!.day,
          },
        })
        : Promise.resolve(null),
      mortalityTarget
        ? this.targetDaysDDAO.getOne({
          where: {
            targetId: mortalityTarget?.id,
            day: dailyMonitoring!.day,
          },
        })
        : Promise.resolve(null),
    ]);
    const totalConsumption = feedConsumptions
      ? feedConsumptions.reduce((prev, curr) => prev + Number(curr.quantity), 0)
      : 0;

    return {
      date: dailyMonitoring!.date,
      day: dailyMonitoring!.day,
      performance: {
        bw: {
          actual: dailyMonitoring!.bw || undefined,
          standard: weightTargetToday?.minValue,
        },
        mortality: {
          actual: dailyMonitoring!.mortality || undefined,
          standard: mortalityTargetToday?.maxValue,
        },
      },
      feed: {
        remaining: dailyMonitoring!.feedRemaining
          ? dailyMonitoring!.feedRemaining - totalConsumption
          : undefined,
        stockoutDate: dailyMonitoring!.feedStockoutDate || undefined,
      },
      heatStress: '',
      humidity: '',
      temperature: '',
    };
  }

  async submitDailyReportResponse(
    farmingCycleId: string,
    taskTicketId: string,
    feedConsumptions?: { quantity: number }[],
  ): Promise<SubmitDailyReportResponseItem> {
    const [taskTicket, variables] = await Promise.all([
      this.taskTicketDAO.getOneStrict({
        where: {
          id: taskTicketId,
        },
        relations: {
          dailyMonitoring: true,
          farmingCycle: {
            coop: true,
          },
        },
      }),
      this.variableDAO.getMappedByCode([VAR_ABW_CODE, VAR_TRG_ACC_MORT_CODE]),
    ]);

    // calculate daily monitoring and get target values
    const [dailyMonitoring, weightTarget, mortalityTarget] = await Promise.all([
      this.dailyMonitoringDAO.getOneStrict({
        where: {
          farmingCycleId,
          taskTicketId,
        },
      }),
      this.targetDAO.getOne({
        where: {
          coopTypeId: taskTicket.farmingCycle.coop.coopTypeId,
          chickTypeId: taskTicket.farmingCycle.chickTypeId,
          variableId: variables.get(VAR_ABW_CODE)!.id,
        },
      }),
      this.targetDAO.getOne({
        where: {
          coopTypeId: taskTicket.farmingCycle.coop.coopTypeId,
          chickTypeId: taskTicket.farmingCycle.chickTypeId,
          variableId: variables.get(VAR_TRG_ACC_MORT_CODE)!.id,
        },
      }),
    ]);

    /* prettier-ignore */
    const [weightTargetToday, mortalityTargetToday] = await Promise.all([
      weightTarget
        ? this.targetDaysDDAO.getOne({
          where: {
            targetId: weightTarget.id,
            day: dailyMonitoring.day,
          },
        })
        : Promise.resolve(null),
      mortalityTarget
        ? this.targetDaysDDAO.getOne({
          where: {
            targetId: mortalityTarget?.id,
            day: dailyMonitoring.day,
          },
        })
        : Promise.resolve(null),
    ]);
    const totalConsumption = feedConsumptions
      ? feedConsumptions.reduce((prev, curr) => prev + Number(curr.quantity), 0)
      : 0;

    return {
      date: dailyMonitoring.date,
      day: dailyMonitoring.day,
      performance: {
        bw: {
          actual: dailyMonitoring.bw || undefined,
          standard: weightTargetToday?.minValue,
        },
        mortality: {
          actual: dailyMonitoring.mortality || undefined,
          standard: mortalityTargetToday?.maxValue,
        },
      },
      feed: {
        remaining: dailyMonitoring.feedRemaining
          ? dailyMonitoring.feedRemaining - totalConsumption
          : undefined,
        stockoutDate: dailyMonitoring.feedStockoutDate || undefined,
      },
      heatStress: '',
      humidity: '',
      temperature: '',
    };
  }

  async getDailyReport(
    farmingCycleId: string,
    identifier: string,
  ): Promise<GetDailyReportResponseItem> {
    const isDate = /^\d{4}-\d{2}-\d{2}$/g.test(identifier);

    const [taskTicket, variables, dailyMonitoring, farmingCycle, harvestedEgg] = await Promise.all([
      this.taskTicketDAO.getOne({
        where: isDate
          ? {
              farmingCycleId,
              reportedDate: new Date(format(new Date(identifier), DATETIME_17_SQL_FORMAT)),
              taskName: TASK_NAMES.ISI_LAPORAN_AKHIR_HARI,
            }
          : {
              farmingCycleId,
              id: identifier,
            },
        relations: {
          details: {
            photos: true,
          },
        },
        order: {
          details: {
            photos: {
              createdDate: 'DESC',
            },
          },
        },
      }),
      this.variableDAO.getMappedByCode([
        VAR_ABW_CODE,
        VAR_CULLED_CODE,
        VAR_DEAD_CHICK_CODE,
        VAR_FEED_CON_CODE,
        VAR_FEED_TYPE_CODE,
        VAR_TOMO_CODE,
        VAR_TRG_ACC_MORT_CODE,
        VAR_YELLOW_CARD,
      ]),
      this.dailyMonitoringDAO.getOne({
        where: isDate
          ? {
              farmingCycleId,
              date: format(new Date(identifier), DATE_SQL_FORMAT),
            }
          : {
              farmingCycleId,
              taskTicketId: identifier,
            },
        relations: {
          mortalities: true,
          revisions: true,
        },
      }),
      this.dao.getOneStrict({
        where: {
          id: farmingCycleId,
        },
      }),
      (isDate &&
        this.harvestEggDAO.getOne({
          where: {
            farmingCycleId,
            date: new Date(identifier),
          },
          relations: {
            productInHarvestEgg: {
              productItem: true,
            },
          },
        })) ||
        Promise.resolve(null),
    ]);

    const [[feedStocks], [ovkStocks]] = await Promise.all([
      this.farmingCycleFeedStockDDAO.getMany({
        where: isDate
          ? {
              farmingCycleId,
              notes: Like(`feed_stock_minus - fc_feedstock_summary_id:%`),
              consumedDate: identifier,
            }
          : {
              taskTicketId: identifier,
            },
      }),
      this.farmingCycleOvkStockLogDAO.getMany({
        where: isDate
          ? {
              farmingCycleId,
              notes: Like(`ovk_stock_minus - fc_ovkstock_summary_id:%`),
              consumedDate: taskTicket?.id
                ? undefined
                : format(new Date(identifier), DATE_SQL_FORMAT),
            }
          : {
              taskTicketId: identifier,
            },
      }),
    ]);

    const feedConsumptions = feedStocks.map((fs) => {
      const [subcategoryCode = '', subcategoryName = '', productCode = '', productName = ''] = (
        fs.productDetail || ''
      ).split(':');

      const [, feedStockSummaryId = ''] = fs.notes.split(':');

      return {
        feedStockSummaryId,
        subcategoryCode,
        subcategoryName,
        productCode,
        productName,
        quantity: fs.qty,
        uom: 'karung',
      };
    });

    const ovkConsumptions = ovkStocks.map((os) => {
      const {
        subcategoryCode = '',
        subcategoryName = '',
        productCode = '',
        productName = '',
        quantity = 0,
        uom = 'Buah',
        notes,
        remarks,
      } = os;

      const [, ovkStockSummaryId = ''] = notes.split(':');

      return {
        ovkStockSummaryId,
        subcategoryCode,
        subcategoryName,
        productCode,
        productName,
        quantity,
        uom,
        remarks,
      };
    });

    const mapVariableToTaskTicketD = taskTicket?.details.reduce((prev, current) => {
      prev.set(current.variableId, current);
      return prev;
    }, new Map<string, TaskTicketD>());

    const bw =
      mapVariableToTaskTicketD?.get(variables.get(VAR_ABW_CODE)!.id)?.dataValue ||
      dailyMonitoring?.bw ||
      '0';
    const culled =
      mapVariableToTaskTicketD?.get(variables.get(VAR_CULLED_CODE)!.id)?.dataValue ||
      dailyMonitoring?.cull ||
      '0';
    const mortality =
      mapVariableToTaskTicketD?.get(variables.get(VAR_DEAD_CHICK_CODE)!.id)?.dataValue ||
      dailyMonitoring?.mortalities.reduce((prev, m) => prev + m.quantity, 0) ||
      '0';
    const feedConsumed =
      mapVariableToTaskTicketD?.get(variables.get(VAR_FEED_CON_CODE)!.id)?.dataValue ||
      feedConsumptions.reduce((prev, fc) => prev + fc.quantity, 0) ||
      '0';
    const feedType =
      mapVariableToTaskTicketD?.get(variables.get(VAR_FEED_TYPE_CODE)!.id)?.dataValue || '';
    const feedAdditionalInfo =
      mapVariableToTaskTicketD?.get(variables.get(VAR_FEED_TYPE_CODE)!.id)?.feedBrandId || '';
    const yellowCardImages =
      mapVariableToTaskTicketD
        ?.get(variables.get(VAR_YELLOW_CARD)!.id)
        ?.photos.map<TaskMedia>((photo) => ({
          id: photo.id,
          url: photo.imageUrl,
        })) || [];
    const images =
      yellowCardImages.length > 0
        ? yellowCardImages
        : [
            {
              id: '',
              url: dailyMonitoring?.recordingImage || '',
            },
            {
              id: '',
              url: dailyMonitoring?.mortalityImage || '',
            },
          ].filter((item) => item.url);

    const day =
      dailyMonitoring?.day ||
      (taskTicket &&
        differenceInDays(
          new Date(taskTicket.reportedDate),
          new Date(farmingCycle.farmingCycleStartDate),
        )) ||
      differenceInDays(new Date(identifier), new Date(farmingCycle.farmingCycleStartDate));

    const dailyPerformance = await this.dailyPerformanceDDAO.getOne({
      where: {
        day,
        farmingCycleId,
      },
    });

    const summary = dailyPerformance?.summary || null;

    const issues = {
      infrastructure: dailyPerformance?.infrastructureIssues?.split(',') || [],
      diseases: dailyPerformance?.diseaseIssues?.split(',') || [],
      farmInput: dailyPerformance?.farmInputIssues?.split(',') || [],
      forceMajeure: dailyPerformance?.forceMajeureIssues?.split(',') || [],
      management: dailyPerformance?.managementIssues?.split(',') || [],
      others: dailyPerformance?.otherIssues || null,
    };

    return {
      revisionStatus: dailyMonitoring?.revisions?.[0]?.status || null,
      averageWeight: parseInt(`${bw}`, 10),
      culling: parseInt(`${culled}`, 10),
      mortality: parseInt(`${mortality}`, 10),
      feedQuantity: parseFloat(`${feedConsumed}`),
      feedTypeCode: feedType,
      feedAdditionalInfo,
      images,
      feedConsumptions,
      ovkConsumptions,
      issues,
      summary,
      treatment: dailyPerformance?.treatment?.split(',') || [],
      recordingImage: dailyMonitoring?.recordingImage,
      mortalityImage: dailyMonitoring?.mortalityImage,
      mortalityList: dailyMonitoring?.mortalities,
      harvestedEgg: harvestedEgg?.productInHarvestEgg,
      isAbnormal: harvestedEgg?.isAbnormal,
      eggDisposal: harvestedEgg?.disposal,
      remarks: dailyMonitoring?.remarks || undefined,
    };
  }

  async dailyReportMarkAsReviewed(user: RequestUser, farmingCycleId: string, taskTicketId: string) {
    const [dailyMonitoring] = await Promise.all([
      this.dailyMonitoringDAO.getOneStrict({
        where: {
          farmingCycleId,
          taskTicketId,
        },
      }),
    ]);

    if (
      dailyMonitoring.reportStatus === DAILY_MONITORING_STATUS_ENUM.LATE ||
      dailyMonitoring.reportStatus === DAILY_MONITORING_STATUS_ENUM.DONE
    ) {
      throw ERR_DAILY_REPORT_ALREADY_DONE_LATE(
        dailyMonitoring.reportStatus === DAILY_MONITORING_STATUS_ENUM.LATE
          ? 'melebihi batas waktu pelaporan'
          : 'telah tervalidasi di sistem',
      );
    }

    dailyMonitoring.reviewedBy = user.id;
    dailyMonitoring.reportStatus = DAILY_MONITORING_STATUS_ENUM.REVIEWED;
    await this.dailyMonitoringDAO.updateOne(
      {
        farmingCycleId,
        taskTicketId,
      },
      dailyMonitoring,
    );
  }

  // eslint-disable-next-line class-methods-use-this
  private groupFarmingCycleMembers(farmingCycle: FarmingCycle): FarmingCycleItemMemberGroup {
    const leaders: FarmingCycleItemMember[] = [];
    farmingCycle.farmingCycleMembers?.forEach((leader) => {
      if (leader.isLeader && leader.isInternal === false && leader.user.status) {
        leaders.push({
          memberId: leader.id,
          userId: leader.userId,
          name: leader.user.fullName,
          userType: leader.user.userType,
        });
      }
    });

    const workers: FarmingCycleItemMember[] = [];
    farmingCycle.farmingCycleMembers?.forEach((worker) => {
      if (
        worker.isLeader === false &&
        worker.isInternal === false &&
        worker.user.userType === USER_TYPE.AK &&
        worker.user.status
      ) {
        workers.push({
          memberId: worker.id,
          userId: worker.userId,
          name: worker.user.fullName,
          userType: worker.user.userType,
        });
      }
    });

    const productionTeam: FarmingCycleItemMember[] = [];
    farmingCycle.farmingCycleMembers?.forEach((member) => {
      if (member.isInternal) {
        productionTeam.push({
          memberId: member.id,
          userId: member.userId,
          name: member.user.fullName,
          userType: member.user.userType,
        });
      }
    });

    const ppls: FarmingCycleItemMember[] = [];
    farmingCycle.farmingCycleMembers?.forEach((ppl) => {
      if (ppl.isLeader === false && ppl.user.userType === USER_TYPE.PPL && ppl.user.status) {
        ppls.push({
          memberId: ppl.id,
          userId: ppl.userId,
          name: ppl.user.fullName,
          userType: ppl.user.userType,
        });
      }
    });

    return { leaders, workers, productionTeam, ppls };
  }

  async updateDOCin(
    params: UpdateDOCinParams,
    data: UpdateDOCinBody,
    user: RequestUser,
  ): Promise<UpdateDOCinResponseItem> {
    const queryRunner = await this.dao.startTransaction();

    try {
      const fc = await this.dao.getOneStrict({
        where: {
          id: params.farmingCycleId,
        },
        relations: {
          farm: true,
        },
      });

      if (fc.farm.category === FarmChickCategory.BROILER && data.initialPopulation < 1000) {
        throw ERR_CHICK_IN_REQ_INVALID_RECEIVED_DOC();
      } else if (fc.farm.category === FarmChickCategory.LAYER && data.initialPopulation < 1) {
        throw ERR_PULLET_IN_REQ_INVALID_RECEIVED_DOC();
      }

      const finishChickIn = new Date(data.finishChickIn);
      const endOfDayToday = endOfDay(utcToZonedTime(new Date(), DEFAULT_TIME_ZONE));

      if (isAfter(finishChickIn, endOfDayToday)) {
        throw ERR_FARM_CYCLE_INVALID_START_DATE();
      }

      let poDoc: PurchaseOrder | undefined;
      // FIXME: currently only broiler has PO. Remove the condition after LAYER has PO too
      if (fc.farm.category === FarmChickCategory.BROILER) {
        poDoc = await this.purchaseOrderDAO.getOneStrict({
          where: {
            erpCode: data.erpCode ? data.erpCode : data.poCode,
          },
        });

        if (poDoc.isApproved === null) {
          throw ERR_PURCHASE_ORDER_STILL_PROCESSED();
        }

        const existingGR = await this.goodsReceiptDAO.getOne({
          where: {
            purchaseOrderId: poDoc.id,
          },
          select: {
            id: true,
          },
        });

        if (existingGR) {
          throw ERR_CHICK_IN_REQ_ALREADY_CONFIRMED();
        }
      }

      const actualDocIn = new Date(data.finishChickIn);
      const actualDocInDate = format(actualDocIn, 'yyyy-MM-dd');
      const prevDayLimit = setHours(new Date(data.finishChickIn), 12);

      let recordStart = setHours(new Date(data.finishChickIn), 0);

      if (isAfter(prevDayLimit, actualDocIn)) {
        recordStart = subDays(recordStart, 1);
      }

      await this.farmingCycleChickStockDDAO.upsertOneWithTx(
        {
          farmingCycleId: params.farmingCycleId,
          notes: 'Initial Population',
          operator: '+',
        },
        {
          farmingCycleId: params.farmingCycleId,
          userId: fc.farm.userOwnerId,
          operator: '+',
          notes: 'Initial Population',
          qty: data.initialPopulation,
          transactionDate: new Date(data.finishChickIn),
        },
        user,
        queryRunner,
      );

      let truckLeaving = parse(data.truckLeaving, DATETIME_SQL_FORMAT, new Date());
      let truckArrival = parse(data.truckArrival, DATETIME_SQL_FORMAT, new Date());

      if (!isValid(truckLeaving) || !isValid(truckArrival)) {
        truckLeaving = parse(
          `${actualDocInDate} ${data.truckLeaving}`,
          DATETIME_SQL_FORMAT,
          new Date(),
        );
        truckArrival = parse(
          `${actualDocInDate} ${data.truckArrival}`,
          DATETIME_SQL_FORMAT,
          new Date(),
        );
      }

      if (isAfter(truckLeaving, truckArrival)) {
        throw ERR_FARM_CYCLE_INVALID_TRUCK_TIME();
      }

      const updatedFC = await this.dao.updateOneWithTx(
        {
          id: params.farmingCycleId,
        },
        {
          farmingCycleStartDate: recordStart,
          cycleStatus: FC_CYCLE_STATUS.ACTIVE,
          farmingStatus: FC_FARMING_STATUS.IN_PROGRESS,
          initialPopulation: data.initialPopulation,
          additionalPopulation: data.additionalPopulation,
          docInBW: data.bw,
          docInUniformity: data.uniformity,
          truckDepartureTime: truckLeaving,
          truckArrivalTime: truckArrival,
          truckFinishChickIn: data.finishChickIn,
          actualDocIn,
          remarks: data.remarks,
          pulletInWeeks: data.pulletInWeeks,
          photos: {
            photos: data.photos.map((photo) => photo.url),
            suratJalanPhotos: data.suratJalanPhotos.map((photo) => photo.url),
            docInFormPhotos: (data.docInFormPhotos || []).map((photo) => photo.url),
            pulletInFormPhotos: (data.pulletInFormPhotos || []).map((photo) => photo.url),
          },
        },
        user,
        queryRunner,
      );

      await this.coopDAO.updateOneWithTx(
        {
          id: updatedFC.coopId,
          activeFarmingCycleId: updatedFC.id,
        },
        {
          chickInDate: actualDocInDate,
        },
        user,
        queryRunner,
      );
      // FIXME: currently only broiler has PO. Remove the condition after LAYER has PO too
      if (fc.farm.category === FarmChickCategory.BROILER && poDoc) {
        await this.goodsReceiptDAO.createOneWithTx(
          {
            purchaseOrderId: poDoc.id,
            receivedDate: actualDocInDate,
            remarks: data.remarks,
          },
          user,
          queryRunner,
        );
      }

      await this.dao.commitTransaction(queryRunner);

      // FIXME: currently only broiler has PO. Remove the condition after LAYER has PO too
      if (fc.farm.category === FarmChickCategory.BROILER) {
        await this.fcDOCinQueue.addJob({
          body: data,
          params,
          user,
        });
      }

      await this.setIotDeviceStatusQueue.addJob({
        coopId: updatedFC.coopId,
        deviceTypes: ['SMART_CONTROLLER'],
        status: DEVICE_SENSOR_STATUS.ACTIVE,
      });

      // retrigger task ticket generation
      const jobs = await this.dao.getTaskTicketJobs(params.farmingCycleId);

      await Promise.all(
        jobs.map<Promise<any>>(async (job) => this.generateTaskTicketQueue.addJob(job)),
      );

      // init daily monitoring rows
      await this.initializeDailyMonitoringQueue.addJob(
        {
          farmingCycleId: params.farmingCycleId,
        },
        {
          delay: minutesToMilliseconds(5),
        },
      );

      return {
        id: updatedFC.id,
        erpCode: data.erpCode ? data.erpCode : data.poCode,
        startDate: format(recordStart, 'yyyy-MM-dd'),
        initialPopulation: updatedFC.initialPopulation,
        additionalPopulation: updatedFC.additionalPopulation,
        bw: updatedFC.docInBW as number,
        uniformity: updatedFC.docInUniformity as number,
        truckLeaving: data.truckLeaving,
        truckArrival: data.truckArrival,
        finishChickIn: data.finishChickIn,
        remarks: updatedFC.remarks,
        hasFinishedDOCin: true,
        photos: (updatedFC.photos?.photos || []).map((photo) => ({ url: photo, id: '' })),
        suratJalanPhotos: (updatedFC.photos?.suratJalanPhotos || []).map((photo) => ({
          url: photo,
        })),
        docInFormPhotos: (updatedFC.photos?.docInFormPhotos || []).map((photo) => ({ url: photo })),
        pulletInFormPhotos: (updatedFC.photos?.pulletInFormPhotos || []).map((photo) => ({
          url: photo,
        })),
        pulletInWeeks: updatedFC.pulletInWeeks || undefined,
      };
    } catch (error) {
      await this.dao.rollbackTransaction(queryRunner);

      throw error;
    }
  }

  async getDOCin(params: UpdateDOCinParams): Promise<UpdateDOCinResponseItem> {
    const fc = await this.dao.getOneStrict({
      where: {
        id: params.farmingCycleId,
      },
      relations: {
        chickType: true,
      },
    });

    const poDOC = await this.purchaseOrderDAO.getOne({
      where: {
        farmingCycleId: params.farmingCycleId,
        isDoc: true,
        isApproved: true,
      },
      select: {
        goodsReceipts: {
          id: true,
          photos: true,
        },
      },
      relations: {
        goodsReceipts: {
          photos: true,
        },
      },
      order: {
        createdDate: 'DESC',
      },
    });

    const goodReceiptPhotos = {
      photos: [] as GoodsReceiptPhoto[],
      suratJalanPhotos: [] as GoodsReceiptPhoto[],
      docInFormPhotos: [] as GoodsReceiptPhoto[],
    };

    if (poDOC && poDOC.goodsReceipts.length > 0) {
      const { photos } = poDOC.goodsReceipts[0];

      for (let i = 0; i < photos.length; i += 1) {
        switch (photos[i].type) {
          case GOOD_RECEIPT_PHOTO_TYPE.SURAT_JALAN:
            goodReceiptPhotos.suratJalanPhotos.push(photos[i]);
            break;
          case GOOD_RECEIPT_PHOTO_TYPE.DOC_IN_FORM:
            goodReceiptPhotos.docInFormPhotos.push(photos[i]);
            break;
          default:
            goodReceiptPhotos.photos.push(photos[i]);
            break;
        }
      }
    }

    return {
      id: fc.id,
      poCode: poDOC?.erpCode || '',
      erpCode: poDOC?.erpCode || '',
      startDate: fc.farmingCycleStartDate ? format(fc.farmingCycleStartDate, DATE_SQL_FORMAT) : '',
      initialPopulation: fc.initialPopulation,
      additionalPopulation: fc.additionalPopulation || 0,
      bw: fc.docInBW || 0,
      uniformity: fc.docInUniformity || 0,
      truckLeaving: fc.truckDepartureTime ? format(fc.truckDepartureTime, TIME_HH_MM_SS) : '',
      truckArrival: fc.truckArrivalTime ? format(fc.truckArrivalTime, TIME_HH_MM_SS) : '',
      finishChickIn: fc.actualDocIn ? format(fc.truckArrivalTime, TIME_HH_MM_SS) : '',
      remarks: fc.remarks,
      hasFinishedDOCin: !!fc.actualDocIn,
      pulletInWeeks: fc.pulletInWeeks || undefined,
      photos:
        goodReceiptPhotos.photos.length > 0
          ? goodReceiptPhotos.photos
          : (fc.photos?.photos || []).map((photo) => ({ url: photo, id: '' })),
      suratJalanPhotos:
        goodReceiptPhotos.suratJalanPhotos.length > 0
          ? goodReceiptPhotos.suratJalanPhotos
          : (fc.photos?.suratJalanPhotos || []).map((photo) => ({ url: photo })),
      docInFormPhotos:
        goodReceiptPhotos.docInFormPhotos.length > 0
          ? goodReceiptPhotos.docInFormPhotos
          : (fc.photos?.docInFormPhotos || []).map((photo) => ({ url: photo })),
      pulletInFormPhotos: (fc.photos?.pulletInFormPhotos || []).map((photo) => ({ url: photo })),
      chickType: fc.chickType,
    };
  }

  async setFarmingCyclesInProgress() {
    const localTime = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const [newFarmingCycles, newFcCount] = await this.dao.getMany({
      where: {
        cycleStatus: FC_CYCLE_STATUS.ACTIVE,
        farmingStatus: FC_FARMING_STATUS.NEW,
        farmingCycleStartDate: LessThanOrEqual(localTime),
      },
    });

    if (!newFcCount) return;

    const farmingCycleIds = newFarmingCycles.map((fc) => fc.id);

    const [chickInRequests, cirCount] = await this.chickInRequestDAO.getMany({
      where: {
        farmingCycleId: In(farmingCycleIds),
        isApproved: false,
        approvedBy: IsNull(),
      },
    });

    const farmingCycleIdsWithRequest = chickInRequests.map((cir) => cir.farmingCycleId);

    /* prettier-ignore */
    const fcToBeUpdated =
      cirCount > 0
        ? farmingCycleIds.filter(
          (fcId) => !farmingCycleIdsWithRequest.some((fcIdReq) => fcIdReq === fcId),
        )
        : farmingCycleIds;

    await this.dao.updateMany(
      {
        id: In(fcToBeUpdated),
      },
      {
        farmingStatus: FC_FARMING_STATUS.IN_PROGRESS,
      },
      {
        id: 'System',
        role: '',
      },
    );
  }

  @Transactional()
  private async revertFeedConsumptions(
    taskTicket: TaskTicket,
    user: RequestUser,
    queryRunner: QueryRunner,
  ): Promise<void> {
    if (!taskTicket.feedStocks?.length) return;

    const prevFeedStockIds: string[] = [];

    const prevFeedSummaryIdQty: [string, number][] = [];

    taskTicket.feedStocks.forEach((fs) => {
      prevFeedStockIds.push(fs.id);

      const matches = fs.notes.match(/feed_stock_minus - fc_feedstock_summary_id:(.*)/);

      if (matches && matches.length === 2) {
        // Extract the substring from the second element of the 'matches' array
        prevFeedSummaryIdQty.push([matches[1].trim(), fs.qty]);
      }
    });

    await prevFeedSummaryIdQty.reduce(async (promise, current) => {
      await promise;

      await this.farmingCycleFeedStockSummaryDAO.incrementRemainingQuantityWithTx(
        {
          id: current[0],
        },
        current[1],
        user,
        queryRunner,
      );
    }, Promise.resolve());

    await this.farmingCycleFeedStockDDAO.deleteManyWithTx(
      {
        id: In(prevFeedStockIds),
      },
      queryRunner,
    );
  }

  @Transactional()
  async revertFeedConsumptionsV2(
    date: string,
    farmingCycleId: string,
    user: RequestUser,
    queryRunner: QueryRunner,
  ): Promise<void> {
    const [feedStocks] = await this.farmingCycleFeedStockDDAO.getMany({
      where: {
        consumedDate: date,
        farmingCycleId,
        notes: Like(`feed_stock_minus - fc_feedstock_summary_id:%`),
      },
    });

    const prevFeedStockIds: string[] = [];

    const prevFeedSummaryIdQty: [string, number][] = [];

    feedStocks.forEach((fs) => {
      prevFeedStockIds.push(fs.id);

      const matches = fs.notes.match(/feed_stock_minus - fc_feedstock_summary_id:(.*)/);

      if (matches && matches.length === 2) {
        // Extract the substring from the second element of the 'matches' array
        prevFeedSummaryIdQty.push([matches[1].trim(), fs.qty]);
      }
    });

    await prevFeedSummaryIdQty.reduce(async (promise, current) => {
      await promise;

      await this.farmingCycleFeedStockSummaryDAO.incrementRemainingQuantityWithTx(
        {
          id: current[0],
        },
        current[1],
        user,
        queryRunner,
      );
    }, Promise.resolve());

    await this.farmingCycleFeedStockDDAO.deleteManyWithTx(
      {
        id: In(prevFeedStockIds),
      },
      queryRunner,
    );
  }

  @Transactional()
  async revertOvkConsumptionsV2(
    date: string,
    farmingCycleId: string,
    user: RequestUser,
    queryRunner: QueryRunner,
  ): Promise<void> {
    const [ovkStocks] = await this.farmingCycleOvkStockLogDAO.getMany({
      where: {
        consumedDate: date,
        farmingCycleId,
        notes: Like(`ovk_stock_minus - fc_ovkstock_summary_id:%`),
      },
    });

    const prevOvkStockIds: string[] = [];

    const prevOvkSumarryIdQty: [string, number][] = [];

    ovkStocks.forEach((os) => {
      prevOvkStockIds.push(os.id);

      const matches = os.notes.match(/ovk_stock_minus - fc_ovkstock_summary_id:(.*)/);

      if (matches && matches.length === 2) {
        // Extract the substring from the second element of the 'matches' array
        prevOvkSumarryIdQty.push([matches[1].trim(), os.quantity]);
      }
    });

    await prevOvkSumarryIdQty.reduce(async (promise, current) => {
      await promise;

      await this.farmingCycleOvkStockSummaryDAO.incrementRemainingQuantityWithTx(
        {
          id: current[0],
        },
        current[1],
        user,
        queryRunner,
      );
    }, Promise.resolve());

    await this.farmingCycleOvkStockLogDAO.deleteManyWithTx(
      {
        id: In(prevOvkStockIds),
      },
      queryRunner,
    );
  }

  @Transactional()
  private async revertOvkConsumptions(
    taskTicket: TaskTicket,
    user: RequestUser,
    queryRunner: QueryRunner,
  ): Promise<void> {
    if (!taskTicket.ovkStocks?.length) return;

    const prevOvkStockIds: string[] = [];

    const prevOvkSumarryIdQty: [string, number][] = [];

    taskTicket.ovkStocks.forEach((os) => {
      prevOvkStockIds.push(os.id);

      const matches = os.notes.match(/ovk_stock_minus - fc_ovkstock_summary_id:(.*)/);

      if (matches && matches.length === 2) {
        // Extract the substring from the second element of the 'matches' array
        prevOvkSumarryIdQty.push([matches[1].trim(), os.quantity]);
      }
    });

    await prevOvkSumarryIdQty.reduce(async (promise, current) => {
      await promise;

      await this.farmingCycleOvkStockSummaryDAO.incrementRemainingQuantityWithTx(
        {
          id: current[0],
        },
        current[1],
        user,
        queryRunner,
      );
    }, Promise.resolve());

    await this.farmingCycleOvkStockLogDAO.deleteManyWithTx(
      {
        id: In(prevOvkStockIds),
      },
      queryRunner,
    );
  }

  async calculateIpClosing(farmingCycleId: string, feed: number | undefined): Promise<any> {
    const farmingCycle = await this.dao.getOneStrict({
      where: {
        farmingCycleCode: farmingCycleId,
      },
    });

    const closedDate = farmingCycle.closedDate || addDays(farmingCycle.farmingCycleStartDate, 60);
    const closedDateString = format(closedDate, DATETIME_SQL_FORMAT);

    const [variables, [repopulations, count], [prevHarvested]] = await Promise.all([
      this.variableDAO.getMappedByCode([VAR_FEED_CON_CODE, VAR_FCR_TARGET_CODE]),
      this.repopulationDAO.getMany({
        where: {
          farmingCycleId: farmingCycle.id,
        },
      }),
      this.harvestRealizationDAO.getMany({
        where: {
          farmingCycleId: farmingCycle.id,
          harvestDate: LessThanOrEqual(closedDateString),
          status: Raw((alias: any) => `(${alias} is null OR ${alias} != :deleted)`, {
            deleted: RealizationStatusEnum.DELETED,
          }),
        },
        order: {
          harvestDate: 'DESC',
        },
      }),
    ]);

    const startDate =
      farmingCycle.actualDocIn ||
      utcToZonedTime(farmingCycle.farmingCycleStartDate, DEFAULT_TIME_ZONE);
    const startHours = startDate.getHours();
    const additionalDay = startHours >= 12 ? 1 : 0;

    const harvestedChicken = prevHarvested.reduce(
      (prev, item) => {
        const currentAge =
          differenceInCalendarDays(new Date(item.harvestDate), startDate) - additionalDay;

        return {
          total: prev.total + item.quantity,
          totalAge: prev.totalAge + currentAge * item.quantity,
          totalWeightKG: prev.totalWeightKG + item.tonnage,
          oldestAge: currentAge > prev.oldestAge ? currentAge : prev.oldestAge,
        };
      },
      {
        total: 0,
        totalAge: 0,
        totalWeightKG: 0,
        oldestAge: 0,
      },
    );

    const day = differenceInCalendarDays(
      farmingCycle.closedDate,
      farmingCycle.farmingCycleStartDate,
    );

    const fcrTarget = await this.targetDAO.getOneStrict({
      where: {
        variableId: variables.get(VAR_FCR_TARGET_CODE)!.id,
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

    // determine whether farmingCycle is repopulated or not
    const isFarmingCycleRepopulated: boolean = count > 0;

    const [totalFeedConsumption, totalFeedAdjustment] = await Promise.all([
      this.taskTicketDDAO.getLatestSum(variables.get(VAR_FEED_CON_CODE)!.id, farmingCycle.id, {
        reportedUntil: farmingCycle.closedDate || addDays(farmingCycle.farmingCycleStartDate, 70),
        reportedUntilFormat: DATETIME_59_SQL_FORMAT,
        taskCode: TASK_LAPORAN_AKHIR_HARI,
      }),
      this.farmingCycleFeedStockAdjustmentDAO.getTotalAdjustmentQuantityByFarmingCycle(
        farmingCycle.id,
        farmingCycle.closedDate,
        DATETIME_59_SQL_FORMAT,
      ),
    ]);

    const { totalAdjustedPopulation } = this.repopulationConditions(day, repopulations);

    let initialPopulation: number = 0;

    if (isFarmingCycleRepopulated) {
      initialPopulation = farmingCycle.initialPopulation + totalAdjustedPopulation;
    } else {
      initialPopulation = farmingCycle.initialPopulation;
    }

    const totalFeedConsumptionKG = uomConverter(totalFeedConsumption, 'karung', 'kilogram');
    const totalFeedAdjustmentKG = uomConverter(
      totalFeedAdjustment.totalQty,
      totalFeedAdjustment.uom,
      'kilogram',
    );
    const feedKG = feed
      ? uomConverter(feed, 'karung', 'kilogram')
      : totalFeedConsumptionKG - totalFeedAdjustmentKG;
    const averageChickenAge = harvestedChicken.totalAge / harvestedChicken.total;
    const depletion = ((initialPopulation - harvestedChicken.total) / initialPopulation) * 100;

    const closingFcr = feedKG / harvestedChicken.totalWeightKG || 0;

    /**
     * IP Calculation
     */

    const averagePopulationWeight =
      (harvestedChicken.totalWeightKG * 1000) / harvestedChicken.total;

    let closingIp =
      (((harvestedChicken.total / initialPopulation) * averagePopulationWeight) /
        (closingFcr * averageChickenAge)) *
      10;

    if (Number.isNaN(closingIp) || !Number.isFinite(closingIp)) {
      closingIp = 0;
    }

    return {
      averageAge: parseFloat(averageChickenAge.toFixed(2)),
      deplesi: parseFloat(depletion.toFixed(2)),
      farmingCycleCode: farmingCycle.farmingCycleCode,
      fcrAct: parseFloat(closingFcr.toFixed(3)),
      fcrStd: parseFloat(fcrStandard.toFixed(3)),
      feed: feed || totalFeedConsumption - totalFeedAdjustment.totalQty,
      finalPopulation: harvestedChicken.total,
      initialPopulation,
      ip: parseFloat(closingIp.toFixed(2)),
      tonnage: parseFloat(harvestedChicken.totalWeightKG.toFixed(2)),
      farmingCycleId: farmingCycle.id,
    };
  }

  // eslint-disable-next-line class-methods-use-this
  private repopulationConditions(currentDay: number, repopulations: Repopulation[]): any {
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

  async getActiveFarmingCycleDays(farmingCycleId: string, currentDate: Date): Promise<number> {
    const farmingCycle = await this.dao.getOneStrict({
      where: {
        id: farmingCycleId,
        cycleStatus: FC_CYCLE_STATUS.ACTIVE,
      },
      select: { farmingCycleStartDate: true, pulletInWeeks: true },
    });

    let currentCoopDay: number = (farmingCycle.pulletInWeeks || 0) * 7;
    if (currentDate > farmingCycle.farmingCycleStartDate) {
      currentCoopDay += differenceInCalendarDays(currentDate, farmingCycle.farmingCycleStartDate);
    }
    return currentCoopDay;
  }
}
