import {
  addDays,
  differenceInDays,
  endOfDay,
  format,
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
import { DeepPartial, EntityNotFoundError, In, IsNull, LessThanOrEqual, Like } from 'typeorm';
import { ChickInRequestDAO } from '../dao/chickInRequest.dao';
import { CoopDAO } from '../dao/coop.dao';
import { CoopMemberDDAO } from '../dao/coopMemberD.dao';
import { DailyMonitoringDAO } from '../dao/dailyMonitoring.dao';
import { FarmingCycleDAO } from '../dao/farmingCycle.dao';
import { FarmingCycleChickStockDDAO } from '../dao/farmingCycleChickStockD.dao';
import { FarmingCycleMemberDDAO } from '../dao/farmingCycleMemberD.dao';
import { GoodsReceiptDAO } from '../dao/goodsReceipt.dao';
import { PurchaseOrderDAO } from '../dao/purchaseOrder.dao';
import { TargetDAO } from '../dao/target.dao';
import { TargetDaysDDAO } from '../dao/targetDaysD.dao';
import { TaskTicketDAO } from '../dao/taskTicket.dao';
import { TaskTicketDDAO } from '../dao/taskTicketD.dao';
import { TaskTicketPhotoDDAO } from '../dao/taskTicketPhotoD.dao';
import { UserDAO } from '../dao/user.dao';
import { VariableDAO } from '../dao/variable.dao';
import { FarmingCycle } from '../datasources/entity/pgsql/FarmingCycle.entity';
import { FarmingCycleChickStockD } from '../datasources/entity/pgsql/FarmingCycleChickStockD.entity';
import { FarmingCycleMemberD } from '../datasources/entity/pgsql/FarmingCycleMemberD.entity';
import { GoodsReceiptPhoto } from '../datasources/entity/pgsql/GoodsReceiptPhoto.entity';
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
  GetDailyReportResponse,
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
import { ContractCreatedQueue } from '../jobs/queues/contract-created.queue';
import { FarmingCycleCreatedFmsQueue } from '../jobs/queues/farming-cycle-created-fms.queue';
import { FarmingCycleDOCinQueue } from '../jobs/queues/farming-cycle-doc-in.queue';
import { GenerateTaskTicketQueue } from '../jobs/queues/generate-task-ticket.queue';
import { InitializeDailyMonitoringQueue } from '../jobs/queues/initialize-daily-monitoring.queue';
import { SetIotDeviceStatusQueue } from '../jobs/queues/set-iot-device-status.queue';
import { TaskTicketDetailUpdatedQueue } from '../jobs/queues/task-ticket-detail-updated.queue';
import { UserAssignedToFcQueue } from '../jobs/queues/user-assigned-to-fc.queue';
import {
  DAILY_MONITORING_STATUS,
  DAILY_MONITORING_STATUS_ENUM,
  DAILY_REPORT_DEADLINE,
  DATETIME_SQL_FORMAT,
  DATE_SQL_FORMAT,
  DATE_TIME_FORMAT,
  DEFAULT_TIME_ZONE,
  FC_CYCLE_STATUS,
  FC_FARMING_STATUS,
  GOOD_RECEIPT_PHOTO_TYPE,
  TIME_HH_MM_SS,
  USER_TYPE,
  USER_TYPE_INTERNAL_GROUP,
} from '../libs/constants';
import { DEVICE_SENSOR_STATUS } from '../libs/constants/deviceSensor';
import {
  ERR_BAD_REQUEST,
  ERR_CHICK_IN_REQ_ALREADY_CONFIRMED,
  ERR_CHICK_IN_REQ_INVALID_RECEIVED_DOC,
  ERR_FARM_CYCLE_INVALID_START_DATE,
  ERR_FARM_CYCLE_INVALID_TRUCK_TIME,
  ERR_INITIAL_POPULATION_INVALID,
  ERR_USER_NOT_FOUND,
} from '../libs/constants/errors';
import { TASK_LAPORAN_AKHIR_HARI } from '../libs/constants/taskCodes';
import {
  VAR_ABW_CODE,
  VAR_CULLED_CODE,
  VAR_DEAD_CHICK_CODE,
  VAR_FEED_CON_CODE,
  VAR_FEED_TYPE_CODE,
  VAR_HARVESTED_CODE,
  VAR_TOMO_CODE,
  VAR_TRG_ACC_MORT_CODE,
  VAR_YELLOW_CARD,
} from '../libs/constants/variableCodes';
import { RequestUser } from '../libs/types/index.d';
import { CoopCacheUtil } from '../libs/utils/coopCache';
import { isRoleAllowed, randomHexString } from '../libs/utils/helpers';

// FIXME: please remove import env once flow with ODOO is ready
import env from '../config/env';

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

  @Inject(TargetDAO)
  private targetDAO: TargetDAO;

  @Inject(TargetDaysDDAO)
  private targetDaysDDAO: TargetDaysDDAO;

  @Inject(FarmingCycleChickStockDDAO)
  private farmingCycleChickStockDDAO: FarmingCycleChickStockDDAO;

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

  @Inject(ContractCreatedQueue)
  private contractCreatedQueue: ContractCreatedQueue;

  @Inject(SetIotDeviceStatusQueue)
  private setIotDeviceStatusQueue: SetIotDeviceStatusQueue;

  async createFarmingCycle(
    input: CreateFarmingCycleBody,
    user: RequestUser,
  ): Promise<CreateFarmingCycleItemResponse> {
    const queryRunner = await this.dao.startTransaction();

    if (input.initialPopulation < 1000) {
      throw ERR_INITIAL_POPULATION_INVALID();
    }

    try {
      const coop = await this.coopDAO.getOneStrict({
        select: {
          id: true,
          maxCapacity: true,
          coopMembers: true,
          farmId: true,
        },
        relations: {
          farm: true,
          coopMembers: {
            user: true,
          },
        },
        where: {
          id: input.coopId,
        },
        relationLoadStrategy: 'join',
      });

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
      };

      const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);
      const startDate = utcToZonedTime(new Date(input.farmingCycleStartDate), DEFAULT_TIME_ZONE);
      if (isToday(startDate) || isBefore(startDate, now)) {
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
      if (isFarmingCycleStarted) {
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

      if (env.USE_ERP_CONTRACT) {
        await this.contractCreatedQueue.addJob({ ...farmingCycle, coop });
      }

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
        contractId: filter.contract ? Like(`%${filter.contract}%`) : undefined,
        farm: {
          userOwnerId: filter.ownerId,
          branch: {
            id: filter.branchId,
          },
        },
        farmId: filter.farmId,
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
      },
      relations: {
        chickType: true,
        farm: {
          owner: true,
          branch: true,
        },
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
        userModifier: true,
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
        contract: farmingCycle.contractId || '',
        contractName: farmingCycle.coop.contract?.contractType?.contractName || '',
        contractTypeId: farmingCycle.coop.contract?.refContractTypeId || '',
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

      if (!unapprovedChickInRequest && (isToday(startDate) || isBefore(startDate, now))) {
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
      if (isFarmingCycleReStarted && !isCoopActiveFarmingCycleReleased) {
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

      const [farmingCycleUpdated, dailyMonitoring] = await Promise.all([
        this.dao.getOneStrict({
          where: {
            id: farmingCycleId,
          },
        }),
        this.dailyMonitoringDAO.getOne({
          where: {
            farmingCycleId,
          },
          order: {
            date: 'ASC',
          },
        }),
      ]);

      if (farmingCycleUpdated.farmingStatus === FC_FARMING_STATUS.IN_PROGRESS) {
        // retrigger task ticket generation
        const jobs = await this.dao.getTaskTicketJobs(farmingCycleId);

        await Promise.all(
          jobs.map<Promise<any>>(async (job) => this.generateTaskTicketQueue.addJob(job)),
        );

        // retrigger daily monitoring calculation from the beginning
        if (dailyMonitoring) {
          await this.calculateDailyMonitoringQueue.addJob({
            farmingCycleId,
            taskTicketId: dailyMonitoring.taskTicketId,
          });
        }

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
      }

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
      contract: farmingCycle.coop.contract || null,
      contractType: farmingCycle.coop.contract?.contractType || null,
      branch: farmingCycle.farm.branch || null,
      farmingCycleStartDate: farmingCycle.farmingCycleStartDate
        ? format(new Date(farmingCycle.farmingCycleStartDate), DATE_SQL_FORMAT)
        : '',
      closedDate: farmingCycle.closedDate
        ? format(new Date(farmingCycle.closedDate), DATE_SQL_FORMAT)
        : '',
      isRepopulated: farmingCycle.repopulations.length > 0,
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

    return {
      id: farmingCycle.id,
      initialPopulation: farmingCycle.initialPopulation,
      farmingCycleStartDate: farmingCycle.farmingCycleStartDate
        ? format(farmingCycle.farmingCycleStartDate, DATE_SQL_FORMAT)
        : '-',
      mortality: latestDailyMonitoring?.populationMortaled || 0,
      culled,
      harvested: latestDailyMonitoring?.populationHarvested || 0,
      deadChick,
      day:
        (farmingCycle.farmingCycleStartDate &&
          differenceInDays(new Date(), farmingCycle.farmingCycleStartDate)) ||
        null,
      estimatedPopulation:
        (latestDailyMonitoring?.populationTotal || farmingCycle.initialPopulation) -
        (latestDailyMonitoring?.populationMortaled || 0) -
        (latestDailyMonitoring?.populationHarvested || 0),
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
  ): Promise<DailyReportsResponseItem[]> {
    const [taskTicket] = await this.taskTicketDAO.getMany({
      where: {
        farmingCycleId,
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
        date: format(tt.reportedDate, DATE_TIME_FORMAT),
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
      if (!item.bw && !item.culled && !item.dead && !item.feed) {
        return prep;
      }

      ticketIds.push(item.taskTicketId);
      prep.set(item.taskTicketId, item);
      return prep;
    }, new Map<string, DailyReportItem>());

    const [mappedTaskTickets, variables] = await Promise.all([
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
      ]),
    ]);

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

    const updateDetails: DeepPartial<TaskTicketD>[] = [];
    const upsertTaskPhotos: DeepPartial<TaskTicketPhotoD>[] = [];
    let leastTaskTicket: Partial<TaskTicket> = {};
    mappedTaskTickets.forEach((val, key) => {
      if (!leastTaskTicket.reportedDate || val.reportedDate < leastTaskTicket.reportedDate) {
        leastTaskTicket = mappedTaskTickets.get(key)!;
      }
      const inputItem = mappedItems.get(val.id)!;
      const bwDetail = mappedDetails.data.get(
        mappedDetails.keyFunction(val.id, variables.get(VAR_ABW_CODE)!.id),
      );
      if (bwDetail) {
        updateDetails.push({
          id: bwDetail.id,
          dataValue: (inputItem.bw && `${inputItem.bw}`) || undefined,
          executedDate,
        });
      }

      const deadChickDetail = mappedDetails.data.get(
        mappedDetails.keyFunction(val.id, variables.get(VAR_DEAD_CHICK_CODE)!.id),
      );
      if (deadChickDetail) {
        updateDetails.push({
          id: deadChickDetail.id,
          dataValue: (inputItem.dead && `${inputItem.dead}`) || undefined,
          executedDate,
        });
      }

      const culledChickDetail = mappedDetails.data.get(
        mappedDetails.keyFunction(val.id, variables.get(VAR_CULLED_CODE)!.id),
      );
      if (culledChickDetail) {
        updateDetails.push({
          id: culledChickDetail.id,
          dataValue: (inputItem.culled && `${inputItem.culled}`) || undefined,
          executedDate,
        });
      }

      const tomoDetail = mappedDetails.data.get(
        mappedDetails.keyFunction(val.id, variables.get(VAR_TOMO_CODE)!.id),
      );
      if (tomoDetail) {
        updateDetails.push({
          id: tomoDetail.id,
          dataValue: `${(inputItem.culled || 0) + (inputItem.dead || 0)}`,
          executedDate,
        });
      }

      const feedConDetail = mappedDetails.data.get(
        mappedDetails.keyFunction(val.id, variables.get(VAR_FEED_CON_CODE)!.id),
      );
      if (feedConDetail) {
        updateDetails.push({
          id: feedConDetail.id,
          dataValue: (inputItem.feed && `${inputItem.feed}`) || undefined,
          executedDate,
        });
      }

      const feedTypeDetail = mappedDetails.data.get(
        mappedDetails.keyFunction(val.id, variables.get(VAR_FEED_TYPE_CODE)!.id),
      );
      if (feedTypeDetail) {
        updateDetails.push({
          id: feedTypeDetail.id,
          dataValue: inputItem.feedType || undefined,
          feedBrandId: inputItem.feedAdditionalInfo || undefined,
          executedDate,
        });
      }

      const yellowCardDetail = mappedDetails.data.get(
        mappedDetails.keyFunction(val.id, variables.get(VAR_YELLOW_CARD)!.id),
      );
      if (yellowCardDetail) {
        updateDetails.push({
          id: yellowCardDetail.id,
          executedDate,
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
    });

    const [, updatedDetails] = await Promise.all([
      this.taskTicketDAO.upsertMany(user, updateTaskTickets),
      this.taskTicketDDAO.upsertMany(user, updateDetails),
      this.taskTicketPhotoDDAO.upsertMany(user, upsertTaskPhotos),
    ]);

    updatedDetails.forEach((detail) => {
      this.taskTicketDetailUpdatedQueue.addJob({
        taskTicketD: detail,
        taskTicket: detail.taskTicket,
        user,
      });
    });

    if (leastTaskTicket.id && leastTaskTicket.farmingCycleId) {
      await this.calculateDailyMonitoringQueue.addJob({
        user,
        farmingCycleId: leastTaskTicket.farmingCycleId,
        taskTicketId: leastTaskTicket.id,
        updateStatusStrategy: ticketIds.length === 1 ? 'single' : 'multiple',
      });
    }
  }

  async submitDailyReport(
    user: RequestUser,
    farmingCycleId: string,
    taskTicketId: string,
    body: SubmitDailyReportBody,
    options?: {
      bypassStatus?: boolean;
    },
  ): Promise<SubmitDailyReportResponseItem> {
    const [taskTicket] = await Promise.all([
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
    ]);

    // validate status, reject if late or done
    if (
      !options?.bypassStatus &&
      taskTicket.dailyMonitoring &&
      (taskTicket.dailyMonitoring.reportStatus === DAILY_MONITORING_STATUS_ENUM.LATE ||
        taskTicket.dailyMonitoring.reportStatus === DAILY_MONITORING_STATUS_ENUM.DONE)
    ) {
      throw new Error(
        `daily report status is ${taskTicket.dailyMonitoring.reportStatus}`.toLowerCase(),
      );
    }

    await this.taskTicketDAO.updateOne(
      {
        id: taskTicketId,
      },
      {
        ticketStatus: 3,
        executedBy: user.id,
        executedDate: utcToZonedTime(new Date(), DEFAULT_TIME_ZONE),
        alreadyExecute: true,
      },
      user,
    );

    await this.saveDailyReports(user, [
      {
        bw: body.averageWeight,
        culled: body.culling,
        dead: body.mortality,
        feed: body.feedQuantity,
        feedType: body.feedTypeCode,
        feedAdditionalInfo: body.feedAdditionalInfo,
        taskTicketId,
        yellowCardImages: body.images,
      },
    ]);

    return this.submitDailyReportResponse(farmingCycleId, taskTicketId);
  }

  async submitDailyReportResponse(
    farmingCycleId: string,
    taskTicketId: string,
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
        remaining: dailyMonitoring.feedRemaining || undefined,
        stockoutDate: dailyMonitoring.feedStockoutDate || undefined,
      },
      heatStress: '',
      humidity: '',
      temperature: '',
    };
  }

  async getDailyReport(
    farmingCycleId: string,
    taskTicketId: string,
  ): Promise<GetDailyReportResponse> {
    const [taskTicket, variables] = await Promise.all([
      this.taskTicketDAO.getOneStrict({
        where: {
          farmingCycleId,
          id: taskTicketId,
        },
        relations: {
          details: {
            photos: true,
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
    ]);

    const mapVariableToTaskTicketD = taskTicket.details.reduce((prev, current) => {
      prev.set(current.variableId, current);
      return prev;
    }, new Map<string, TaskTicketD>());

    const bw = mapVariableToTaskTicketD.get(variables.get(VAR_ABW_CODE)!.id)?.dataValue || '0';
    const culled =
      mapVariableToTaskTicketD.get(variables.get(VAR_CULLED_CODE)!.id)?.dataValue || '0';
    const mortality =
      mapVariableToTaskTicketD.get(variables.get(VAR_DEAD_CHICK_CODE)!.id)?.dataValue || '0';
    const feedConsumed =
      mapVariableToTaskTicketD.get(variables.get(VAR_FEED_CON_CODE)!.id)?.dataValue || '0';
    const feedType =
      mapVariableToTaskTicketD.get(variables.get(VAR_FEED_TYPE_CODE)!.id)?.dataValue || '';
    const feedAdditionalInfo =
      mapVariableToTaskTicketD.get(variables.get(VAR_FEED_TYPE_CODE)!.id)?.feedBrandId || '';
    const images =
      mapVariableToTaskTicketD
        .get(variables.get(VAR_YELLOW_CARD)!.id)
        ?.photos.map<TaskMedia>((photo) => ({
          id: photo.id,
          url: photo.imageUrl,
        })) || [];
    return {
      code: 200,
      data: {
        averageWeight: parseInt(bw, 10),
        culling: parseInt(culled, 10),
        mortality: parseInt(mortality, 10),
        feedQuantity: parseFloat(feedConsumed),
        feedTypeCode: feedType,
        feedAdditionalInfo,
        images,
      },
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
      throw new Error(`daily report status is ${dailyMonitoring.reportStatus}`.toLowerCase());
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
      if (data.initialPopulation < 1000) {
        throw ERR_CHICK_IN_REQ_INVALID_RECEIVED_DOC();
      }

      const finishChickIn = new Date(data.finishChickIn);
      const endOfDayToday = endOfDay(utcToZonedTime(new Date(), DEFAULT_TIME_ZONE));

      if (isAfter(finishChickIn, endOfDayToday)) {
        throw ERR_FARM_CYCLE_INVALID_START_DATE();
      }

      const poDoc = await this.purchaseOrderDAO.getOneStrict({
        where: {
          erpCode: data.poCode,
        },
      });

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

      const actualDocIn = new Date(data.finishChickIn);
      const actualDocInDate = format(actualDocIn, 'yyyy-MM-dd');
      const prevDayLimit = setHours(new Date(data.finishChickIn), 12);

      let recordStart = setHours(new Date(data.finishChickIn), 0);

      if (isAfter(prevDayLimit, actualDocIn)) {
        recordStart = subDays(recordStart, 1);
      }

      await this.farmingCycleChickStockDDAO.updateOneWithTx(
        {
          farmingCycleId: params.farmingCycleId,
          notes: 'Initial Population',
          operator: '+',
        },
        {
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
        },
        user,
        queryRunner,
      );

      await Promise.all([
        this.goodsReceiptDAO.createOneWithTx(
          {
            purchaseOrderId: poDoc.id,
            receivedDate: actualDocInDate,
            remarks: data.remarks,
          },
          user,
          queryRunner,
        ),
        this.coopDAO.updateOneWithTx(
          {
            id: updatedFC.coopId,
            activeFarmingCycleId: updatedFC.id,
          },
          {
            chickInDate: actualDocInDate,
          },
          user,
          queryRunner,
        ),
      ]);

      await this.dao.commitTransaction(queryRunner);

      await this.fcDOCinQueue.addJob({
        body: data,
        params,
        user,
      });

      await this.setIotDeviceStatusQueue.addJob({
        coopId: updatedFC.coopId,
        deviceTypes: ['SMART_CONTROLLER'],
        status: DEVICE_SENSOR_STATUS.ACTIVE,
      });

      return {
        id: updatedFC.id,
        poCode: data.poCode,
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
        photos: [],
        suratJalanPhotos: [],
        docInFormPhotos: [],
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
    });

    const poDOC = await this.purchaseOrderDAO.getOne({
      where: {
        farmingCycleId: params.farmingCycleId,
        isDoc: true,
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
      ...goodReceiptPhotos,
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
}
