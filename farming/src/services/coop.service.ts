/* eslint-disable indent */
/* eslint-disable no-await-in-loop */
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { daysToWeeks, differenceInCalendarDays } from 'date-fns';
import { Inject, Service } from 'fastify-decorators';
import { DeepPartial, Equal, FindOptionsWhere, ILike, In, IsNull, Not, QueryRunner } from 'typeorm';
import env from '../config/env';
import { ContractDAO } from '../dao/contract.dao';
import { ContractTypeDAO } from '../dao/contractType.dao';
import { CoopDAO } from '../dao/coop.dao';
import { CoopImageDAO } from '../dao/coopImage.dao';
import { CoopMemberDDAO } from '../dao/coopMemberD.dao';
import { DailyMonitoringDAO } from '../dao/dailyMonitoring.dao';
import { FarmDAO } from '../dao/farm.dao';
import { FarmingCycleDAO } from '../dao/farmingCycle.dao';
import { FarmingCycleMemberDDAO } from '../dao/farmingCycleMemberD.dao';
import { PurchaseOrderDAO } from '../dao/purchaseOrder.dao';
import { TargetDaysDDAO } from '../dao/targetDaysD.dao';
import { TaskTicketDDAO } from '../dao/taskTicketD.dao';
import { VariableDAO } from '../dao/variable.dao';
import { RedisConnection } from '../datasources/connection/redis.connection';
import { Coop } from '../datasources/entity/pgsql/Coop.entity';
import { CoopImage } from '../datasources/entity/pgsql/CoopImage.entity';
import { CoopMemberD } from '../datasources/entity/pgsql/CoopMemberD.entity';
import { FarmChickCategory } from '../datasources/entity/pgsql/Farm.entity';
import { PurchaseOrder } from '../datasources/entity/pgsql/PurchaseOrder.entity';
import { TargetDaysD } from '../datasources/entity/pgsql/TargetDaysD.entity';
import {
  ActiveCoopItem,
  AvailableCoopItem,
  CoopItemOutput,
  CoopPerformanceItem,
  CreateCoopBody,
  GetActiveCoopQuery,
  GetAvailableCoopQuery,
  GetCoopsQuery,
  GetIdleCoopQuery,
  IdleCoopItem,
  UpdateCoopBody,
  UserItem,
} from '../dto/coop.dto';
import { CoopUpsertQueue } from '../jobs/queues/coop-upsert.queue';
import {
  CONTRACT_TYPE,
  COOP_CACHE_TTL,
  DAILY_MONITORING_STATUS_ENUM,
  DEFAULT_CHICK_TYPE_ID,
  FC_FARMING_STATUS,
  ROLE_RANK_CONTEXT,
  USER_TYPE,
} from '../libs/constants';
import {
  ERR_CONTRACT_TYPE_IN_BRANCH_NOT_FOUND,
  ERR_COOP_CODE_EXIST,
  ERR_COOP_DEACTIVATION_FAILED,
  ERR_FARM_DEACTIVATION_FAILED,
} from '../libs/constants/errors';
import {
  VAR_ABW_CODE,
  VAR_FEED_CON_CODE,
  VAR_HARVEST_TONASE_CODE,
  VAR_TRG_IP_CODE,
} from '../libs/constants/variableCodes';
import { Transactional } from '../libs/decorators/transactional';
import { RequestUser } from '../libs/types/index.d';
import { AWSS3 } from '../libs/utils/awsS3';
import { uomConverter } from '../libs/utils/helpers';
import { mapActivityStatusBasedRoleRank } from '../libs/utils/mappers';
import { UserService as UserCoreService } from './usermanagement/userCore.service';

interface IdleCoopStatus {
  number: 0 | 1 | 2 | 3 | 4;
  text: 'Perlu Pengajuan' | 'Diajukan' | 'Disetujui' | 'Ditolak' | 'Diproses' | '';
}

@Service()
export class CoopService {
  @Inject(CoopDAO)
  private dao: CoopDAO;

  @Inject(FarmDAO)
  private farmDao: FarmDAO;

  @Inject(CoopMemberDDAO)
  private coopMemberDAO: CoopMemberDDAO;

  @Inject(CoopImageDAO)
  private coopImageDAO: CoopImageDAO;

  @Inject(CoopUpsertQueue)
  private queue: CoopUpsertQueue;

  @Inject(AWSS3)
  private s3: AWSS3;

  @Inject(VariableDAO)
  private variableDAO: VariableDAO;

  @Inject(TargetDaysDDAO)
  private targetDaysDDAO: TargetDaysDDAO;

  @Inject(TaskTicketDDAO)
  private taskTicketDDAO: TaskTicketDDAO;

  @Inject(RedisConnection)
  private redisConnection: RedisConnection;

  @Inject(FarmingCycleDAO)
  private farmingCycleDAO: FarmingCycleDAO;

  @Inject(FarmingCycleMemberDDAO)
  private farmingCycleMemberDDAO: FarmingCycleMemberDDAO;

  @Inject(DailyMonitoringDAO)
  private dailyMonitoringDAO: DailyMonitoringDAO;

  @Inject(PurchaseOrderDAO)
  private poDAO: PurchaseOrderDAO;

  @Inject(ContractDAO)
  private contractDAO: ContractDAO;

  @Inject(ContractTypeDAO)
  private contractTypeDAO: ContractTypeDAO;

  @Inject(UserCoreService)
  private userCoreService: UserCoreService;

  async get(filter: GetCoopsQuery): Promise<[Coop[], number]> {
    const limit = filter.$limit && filter.$limit > 0 ? filter.$limit : 10;
    const skip = !filter.$page || filter.$page < 1 ? 0 : (filter.$page - 1) * limit;

    const coops = await this.dao.getMany({
      take: (filter.$limit !== 0 && limit) || undefined,
      skip,
      order: {
        createdDate: 'DESC',
      },
      where: {
        farmId: filter.farmId,
        coopName: (filter.coopName && ILike(`%${filter.coopName}%`)) || undefined,
        coopTypeId: filter.coopTypeId,
        status: filter.status,
        coopCode: (filter.coopCode && ILike(`%${filter.coopCode}%`)) || undefined,
        farm:
          ((filter.farmName || filter.ownerId || filter.branchId || filter.farmCategory) && {
            farmName: (filter.farmName && ILike(`%${filter.farmName}%`)) || undefined,
            category: filter.farmCategory,
            userOwnerId: filter.ownerId || undefined,
            branchId: filter.branchId || undefined,
          }) ||
          undefined,
        contract: {
          refContractTypeId: filter.contractTypeId || undefined,
        },
        activeFarmingCycle: filter.farmingCycleStatus
          ? {
              farmingStatus: FC_FARMING_STATUS[filter.farmingCycleStatus],
            }
          : undefined,
      },
      select: {
        id: true,
        farm: {
          id: true,
          farmCode: true,
          farmName: true,
          userOwnerId: true,
          category: true,
          owner: {
            id: true,
            userCode: true,
            fullName: true,
          },
          branch: {
            id: true,
            name: true,
          },
        },
        coopTypeId: true,
        coopType: {
          id: true,
          coopTypeCode: true,
          coopTypeName: true,
        },
        coopMembers: {
          id: true,
          userId: true,
          isLeader: true,
          user: {
            id: true,
            userCode: true,
            fullName: true,
          },
        },
        chickTypeId: true,
        chickType: {
          id: true,
          chickTypeName: true,
          chickTypeCode: true,
        },
        coopImages: true,
        status: true,
        farmId: true,
        coopCode: true,
        coopName: true,
        numFan: true,
        capacityFan: true,
        height: true,
        length: true,
        chickInDate: true,
        width: true,
        maxCapacity: true,
        otherInletType: true,
        otherHeaterType: true,
        otherControllerType: true,
        remarks: true,
        timezone: true,
        createdBy: true,
        createdDate: true,
        modifiedBy: true,
        modifiedDate: true,
        userSupervisorId: true,
        contractId: true,
        contract: {
          refContractTypeId: true,
          contractType: {
            id: true,
            contractName: true,
          },
        },
      },
      relations: {
        farm: {
          owner: true,
          branch: true,
        },
        coopType: true,
        coopMembers: {
          user: true,
        },
        coopImages: true,
        chickType: true,
        userCreator: true,
        userModifier: true,
        contract: {
          branch: true,
          contractType: true,
        },
      },
      relationLoadStrategy: 'join',
    });

    return coops;
  }

  async getById(id: string): Promise<CoopItemOutput> {
    const coop = await this.dao.getOneStrict({
      where: {
        id,
      },
      select: {
        id: true,
        farm: {
          id: true,
          farmCode: true,
          farmName: true,
          userOwnerId: true,
          category: true,
          owner: {
            id: true,
            userCode: true,
            fullName: true,
          },
        },
        coopTypeId: true,
        coopType: {
          id: true,
          coopTypeCode: true,
          coopTypeName: true,
        },
        coopMembers: {
          id: true,
          userId: true,
          isLeader: true,
          user: {
            id: true,
            userCode: true,
            fullName: true,
            userType: true,
          },
        },
        coopImages: true,
        chickType: {
          id: true,
          chickTypeName: true,
          chickTypeCode: true,
        },
        status: true,
        farmId: true,
        coopCode: true,
        coopName: true,
        numFan: true,
        capacityFan: true,
        height: true,
        length: true,
        chickInDate: true,
        width: true,
        maxCapacity: true,
        otherInletType: true,
        otherHeaterType: true,
        otherControllerType: true,
        remarks: true,
        timezone: true,
        createdBy: true,
        createdDate: true,
        modifiedBy: true,
        modifiedDate: true,
        userSupervisorId: true,
        contractId: true,
        contract: {
          refContractTypeId: true,
          contractType: {
            id: true,
            contractName: true,
          },
          branch: {
            id: true,
            name: true,
          },
        },
      },
      relations: {
        farm: {
          owner: true,
        },
        coopType: true,
        coopMembers: {
          user: true,
        },
        coopImages: true,
        chickType: true,
        contract: {
          branch: true,
          contractType: true,
        },
      },
    });

    const { itSupport, iotEngineer } = await this.getITSupportAndSupervisor(coop.coopMembers || []);

    const result: CoopItemOutput = {
      ...coop,
      chickType: coop.chickType ? coop.chickType : null,
      createdDate: coop.createdDate.toISOString(),
      modifiedDate: coop.modifiedDate.toISOString(),
      leader: coop.coopMembers?.find((member) => member.isLeader)?.user,
      workers: coop.coopMembers
        ?.filter((member) => !member.isLeader && member.user.userType === USER_TYPE.AK)
        .map((member) => member.user),
      itSupport,
      iotEngineer,
      coopType: coop.coopType,
      controllerType:
        (coop.controllerType && {
          name: coop.controllerType.name,
          status: coop.controllerType.isActive ? 'Y' : 'N',
        }) ||
        undefined,
      heaterType:
        (coop.heaterType && {
          name: coop.heaterType.name,
          status: coop.heaterType.isActive ? 'Y' : 'N',
        }) ||
        undefined,
      contractTypeId: coop.contract?.refContractTypeId || '',
      contractName: coop.contract?.contractType?.contractName || '',
      branchId: coop.contract?.branch?.id || '',
      branchName: coop.contract?.branch?.name || '',
    };

    if (coop.userSupervisorId) {
      const [userSupervisorDetail] = await this.userCoreService.getMany({
        cmsIds: coop.userSupervisorId,
        $limit: 1,
      });

      result.userSupervisorRoleId = userSupervisorDetail[0].roleId;
    }

    return result;
  }

  async create(input: CreateCoopBody, user: RequestUser): Promise<CoopItemOutput> {
    const queryRunner = await this.dao.startTransaction();

    try {
      const existingCoop = await this.dao.getOne({
        where: {
          coopCode: input.coopCode,
        },
      });
      if (existingCoop) {
        throw ERR_COOP_CODE_EXIST();
      }

      const transactionHooks: Function[] = [];
      if (input.leaderId) {
        transactionHooks.push(this.coopMemberDAO.wrapUpsertHook(input.leaderId, true, user.id));
      }

      if (input.workerIds) {
        input.workerIds.forEach((workerId) => {
          transactionHooks.push(this.coopMemberDAO.wrapUpsertHook(workerId, false, user.id));
        });
      }

      if (input.itSupportId) {
        transactionHooks.push(this.coopMemberDAO.wrapUpsertHook(input.itSupportId, false, user.id));
      }

      if (input.iotEngineerId) {
        transactionHooks.push(
          this.coopMemberDAO.wrapUpsertHook(input.iotEngineerId, false, user.id),
        );
      }

      if (input.userSupervisorId) {
        transactionHooks.push(
          this.coopMemberDAO.wrapUpsertHook(input.userSupervisorId, false, user.id, {
            isInternal: true,
          }),
        );

        const [members] = await this.userCoreService.getUserSupervisor({
          context: ROLE_RANK_CONTEXT.internal,
          cms_id: input.userSupervisorId,
        });

        if (members.length > 0) {
          members.forEach((member) => {
            transactionHooks.push(
              this.coopMemberDAO.wrapUpsertHook(member.idCms as string, false, user.id, {
                isInternal: true,
              }),
            );
          });
        }
      }

      if (input.images) {
        input.images.forEach((image, idx) => {
          transactionHooks.push(
            this.coopImageDAO.wrapUpsertHook(image.filename, idx + 1, image.id),
          );
        });
      }

      if (input.contractTypeId) {
        const farm = await this.farmDao.getOneById(input.farmId);
        const contract = await this.contractDAO.getOneStrict({
          where: {
            branchId: farm.branchId || undefined,
            refContractTypeId: input.contractTypeId,
            customize: false,
          },
          order: {
            createdDate: 'DESC',
          },
        });
        Object.assign(input, { contractId: contract.id });
      }

      if (!input.chickTypeId) {
        Object.assign(input, { chickTypeId: DEFAULT_CHICK_TYPE_ID });
      }

      const coop = await this.dao.createOneWithTx(input, user, queryRunner, transactionHooks);

      await this.dao.commitTransaction(queryRunner);

      await this.queue.addJob(coop);

      return this.getById(coop.id);
    } catch (error) {
      await this.dao.rollbackTransaction(queryRunner);

      throw error;
    }
  }

  async update(id: string, input: UpdateCoopBody, user: RequestUser): Promise<Coop> {
    const queryRunner = await this.dao.startTransaction();

    try {
      const transactionHooks: Function[] = [];
      // remove existing member
      transactionHooks.push(this.coopMemberDAO.wrapDeleteHook());

      if (input.leaderId) {
        transactionHooks.push(this.coopMemberDAO.wrapUpsertHook(input.leaderId, true, user.id));
      }
      if (input.workerIds) {
        input.workerIds.forEach((workerId) => {
          transactionHooks.push(this.coopMemberDAO.wrapUpsertHook(workerId, false, user.id));
        });
      }

      if (input.itSupportId) {
        transactionHooks.push(this.coopMemberDAO.wrapUpsertHook(input.itSupportId, false, user.id));
      }

      if (input.iotEngineerId) {
        transactionHooks.push(
          this.coopMemberDAO.wrapUpsertHook(input.iotEngineerId, false, user.id),
        );
      }

      if (input.userSupervisorId) {
        transactionHooks.push(
          this.coopMemberDAO.wrapUpsertHook(input.userSupervisorId, false, user.id, {
            isInternal: true,
          }),
        );
        const [members] = await this.userCoreService.getUserSupervisor({
          context: ROLE_RANK_CONTEXT.internal,
          cms_id: input.userSupervisorId,
        });

        if (members.length > 0) {
          members.forEach((member) => {
            transactionHooks.push(
              this.coopMemberDAO.wrapUpsertHook(member.idCms as string, false, user.id, {
                isInternal: true,
              }),
            );
          });
        }
      }
      if (input.images) {
        await this.coopImageDAO.removeByCoopIdWithTx(id, queryRunner);
        input.images.forEach((image, idx) => {
          transactionHooks.push(
            this.coopImageDAO.wrapUpsertHook(image.filename, idx + 1, image.id),
          );
        });
      }

      if (input.contractTypeId) {
        const currentCoop = await this.dao.getOneStrict({
          where: {
            id,
          },
          relations: {
            contract: true,
            farm: true,
          },
        });

        const currentCoopBranchId = currentCoop.farm.branchId;
        const contractOwnFarm = await this.contractTypeDAO.getOneStrict({
          where: {
            contractName: CONTRACT_TYPE.OWN_FARM,
          },
        });

        if (input.contractTypeId === contractOwnFarm.id) {
          const contract = await this.contractDAO.getOne({
            where: {
              refContractTypeId: input.contractTypeId,
            },
            order: {
              createdDate: 'DESC',
            },
          });

          Object.assign(input, { contractId: contract?.id as string });
        } else if (
          input.contractTypeId !== currentCoop.contract?.refContractTypeId &&
          currentCoopBranchId
        ) {
          const contract = await this.contractDAO.getOne({
            where: {
              branchId: currentCoopBranchId,
              refContractTypeId: input.contractTypeId,
            },
            order: {
              createdDate: 'DESC',
            },
          });

          if (!contract) {
            throw ERR_CONTRACT_TYPE_IN_BRANCH_NOT_FOUND();
          }

          Object.assign(input, { contractId: contract?.id as string });
        }
      }

      if (!input.status) {
        const currentCoop = await this.dao.getOneStrict({
          where: {
            id,
          },
          relations: {
            activeFarmingCycle: true,
          },
        });

        if (currentCoop.activeFarmingCycleId) {
          throw ERR_COOP_DEACTIVATION_FAILED(`
            ${currentCoop.activeFarmingCycle.farmingCycleCode}
          `);
        }
      }

      await this.dao.updateOneWithTx(
        { id },
        {
          farmId: input.farmId,
          coopCode: input.coopCode,
          coopName: input.coopName,
          coopTypeId: input.coopTypeId,
          chickTypeId: input.chickTypeId,
          numFan: input.numFan,
          capacityFan: input.capacityFan,
          height: input.height,
          length: input.length,
          width: input.width,
          maxCapacity: input.maxCapacity,
          chickInDate: input.chickInDate,
          remarks: input.remarks,
          status: input.status,
          userSupervisorId: input.userSupervisorId,
          otherControllerType: input.otherControllerType,
          otherHeaterType: input.otherHeaterType,
          otherInletType: input.otherInletType,
          contractId: input.contractId,
        },
        user,
        queryRunner,
        transactionHooks,
      );

      const updated = await this.dao.getOneStrict(
        {
          where: {
            id,
          },
          relations: {
            coopMembers: true,
            activeFarmingCycle: {
              farmingCycleMembers: true,
            },
          },
        },
        queryRunner,
      );

      // update farming cycle members
      if (updated.activeFarmingCycle?.farmingCycleMembers.length) {
        const { farmingCycleMembers } = updated.activeFarmingCycle;

        const newMembers = updated.coopMembers?.filter(
          (coopMember) =>
            !farmingCycleMembers.some((fcMember) => fcMember.userId === coopMember.userId),
        );

        if (newMembers) {
          await this.farmingCycleMemberDDAO.createManyWithTx(
            newMembers.map((member) => ({
              farmingCycleId: updated.activeFarmingCycle.id,
              isInternal: member.isInternal,
              isLeader: member.isLeader,
              userId: member.userId,
            })),
            user,
            queryRunner,
          );
        }
      }

      await this.dao.commitTransaction(queryRunner);

      await this.queue.addJob(updated);

      const coop = await this.dao.getOne({
        where: {
          id,
        },
        relations: {
          chickType: true,
          coopType: true,
          coopImages: true,
        },
      });

      return coop as Coop;
    } catch (error) {
      await this.dao.rollbackTransaction(queryRunner);

      throw error;
    }
  }

  async getIdle(filter: GetIdleCoopQuery, user: RequestUser): Promise<IdleCoopItem[]> {
    const cacheKey = `coops:idle:user_id:${user.id}`;
    const cache = await this.redisConnection.connection.get(cacheKey);
    if (
      cache &&
      (filter.ignoreCache === undefined ||
        (filter.ignoreCache !== undefined && filter.ignoreCache !== true))
    ) {
      const results = JSON.parse(cache) as IdleCoopItem[];
      return results;
    }

    const [coopMembers] = await this.coopMemberDAO.getMany({
      where: {
        userId: user.id,
        isInternal: true,
      },
      select: {
        coopId: true,
      },
    });

    const coopIds = coopMembers.map((cm) => cm.coopId);

    const [coops] = await this.dao.getMany({
      where: {
        id: In(coopIds),
        coopName: filter.name ? ILike(`%${filter.name}%`) : undefined,
        farm: {
          category: filter.farmCategory ? Equal(filter.farmCategory) : undefined,
        },
        status: true,
        activeFarmingCycleId: IsNull(),
      },
      select: {
        id: true,
        coopName: true,
        totalPeriod: true,
        farm: {
          districtId: true,
          cityId: true,
          district: {
            districtName: true,
          },
          city: {
            cityName: true,
          },
          category: true,
        },
        contract: {
          id: true,
          contractType: {
            contractName: true,
          },
          branch: {
            id: true,
            name: true,
          },
        },
        chickInRequestId: true,
        purchaseRequestOvkId: true,
        purchaseRequestSapronakId: true,
        purchaseRequestSapronak: {
          farmingCycleId: true,
        },
      },
      relations: {
        farm: {
          district: true,
          city: true,
        },
        contract: {
          branch: true,
          contractType: true,
        },
        chickInRequest: {
          purchaseRequests: {
            purchaseOrders: true,
          },
        },
        purchaseRequestOvk: true,
        purchaseRequestSapronak: true,
      },
      order: {
        lastClosedDate: 'ASC',
        chickInRequest: {
          chickInDate: 'DESC',
          isApproved: 'ASC',
        },
      },
      relationLoadStrategy: 'join',
    });

    const results = coops.map<IdleCoopItem>((coop) => {
      const status = mapActivityStatusBasedRoleRank(
        user,
        this.setIdleCoopStatus(coop),
        'DOC_IN_REQUEST',
      );

      const contract =
        coop.contract && coop.contract.contractType
          ? { id: coop.contract.id, type: coop.contract.contractType.contractName }
          : null;

      const branch =
        coop.contract && coop.contract.branch
          ? { id: coop.contract.branch.id, name: coop.contract.branch.name }
          : null;

      const idleCoopItem: IdleCoopItem = {
        id: coop.id,
        coopName: coop.coopName,
        coopDistrict: coop.farm.district?.districtName,
        coopCity: coop.farm.city.cityName,
        period: coop.totalPeriod,
        closedDate: coop.lastClosedDate || undefined,
        status: status.number,
        statusText: status.text,
        chickInRequestId: coop.chickInRequestId || '',
        purchaseRequestOvkId: coop.purchaseRequestOvkId || '',
        chickInRequest: {
          id: coop.chickInRequestId || '',
          isApproved: coop.chickInRequest?.isApproved || false,
        },
        purchaseRequestOvk: {
          id: coop.purchaseRequestOvkId || '',
          isApproved: coop.purchaseRequestOvk?.isApproved || false,
          farmingCycleId: coop.purchaseRequestOvk?.isApproved
            ? coop.purchaseRequestOvk?.farmingCycleId
            : '',
        },
        isOwnFarm: contract && branch ? contract.type === CONTRACT_TYPE.OWN_FARM : false,
        branch,
        farmingCycleId: coop.purchaseRequestSapronak?.farmingCycleId || '',
        farmCategory: coop.farm.category || FarmChickCategory.BROILER,
      };

      return idleCoopItem;
    });

    if (results.length > 0) {
      await this.redisConnection.connection.set(
        cacheKey,
        JSON.stringify(results),
        'EX',
        COOP_CACHE_TTL,
      );
    }

    return results;
  }

  async getActive(filter: GetActiveCoopQuery, user: RequestUser): Promise<ActiveCoopItem[]> {
    const cacheKey = `coops:active:user_id:${user.id}`;
    const cache = await this.redisConnection.connection.get(cacheKey);
    if (
      cache &&
      (filter.ignoreCache === undefined ||
        (filter.ignoreCache !== undefined && filter.ignoreCache !== true))
    ) {
      const results = JSON.parse(cache) as ActiveCoopItem[];
      return results;
    }

    const [coopMembers] = await this.coopMemberDAO.getMany({
      where: {
        userId: user.id,
        isInternal: true,
      },
      select: {
        coopId: true,
      },
    });

    const memberCoopIds = coopMembers.map((cm) => cm.coopId);

    const [variables, [coops]] = await Promise.all([
      this.variableDAO.getMappedByCode([VAR_ABW_CODE, VAR_TRG_IP_CODE, VAR_FEED_CON_CODE]),
      this.dao.getMany({
        where: {
          id: In(memberCoopIds),
          coopName: filter.name ? ILike(`%${filter.name}%`) : undefined,
          farm: {
            category: filter.farmCategory ? Equal(filter.farmCategory) : undefined,
          },
          status: true,
          activeFarmingCycleId: Not(IsNull()),
        },
        select: {
          id: true,
          farmId: true,
          coopName: true,
          totalPeriod: true,
          activeFarmingCycleId: true,
          coopTypeId: true,
          chickTypeId: true,
          farm: {
            districtId: true,
            cityId: true,
            district: {
              districtName: true,
            },
            city: {
              cityName: true,
            },
            category: true,
          },
          activeFarmingCycle: {
            id: true,
            chickTypeId: true,
            farmingCycleStartDate: true,
            dailyMonitoring: {
              reportStatus: true,
            },
            pulletInWeeks: true,
          },
          contract: {
            id: true,
            contractType: {
              contractName: true,
            },
            branch: {
              id: true,
              name: true,
            },
          },
        },
        relations: {
          farm: {
            district: true,
            city: true,
          },
          activeFarmingCycle: {
            dailyMonitoring: true,
          },
          contract: {
            branch: true,
            contractType: true,
          },
        },
        order: {
          chickInDate: 'ASC',
        },
        relationLoadStrategy: 'join',
      }),
    ]);

    // fetch data from dailymonitoring table
    const activeFarmingCycleIds = coops
      .map<string | null | undefined>((coop) => coop.activeFarmingCycleId)
      .filter((val) => val) as string[];

    const mapFcIdToCoop = coops.reduce((prep, item) => {
      if (item.activeFarmingCycleId) prep.set(item.activeFarmingCycleId, item);
      return prep;
    }, new Map<string, Coop>());

    const mappedDailyMonitoring = await this.dailyMonitoringDAO.getLatestMappedByFarmingCycleId(
      activeFarmingCycleIds,
    );

    const mapCoopToPerformance = new Map<string, CoopPerformanceItem>();

    const targetDaysFilter: FindOptionsWhere<TargetDaysD>[] = [];
    mappedDailyMonitoring.forEach((val, key) => {
      targetDaysFilter.push(
        {
          day: val.day,
          target: {
            coopTypeId: mapFcIdToCoop.get(key)!.coopTypeId,
            chickTypeId: mapFcIdToCoop.get(key)!.activeFarmingCycle.chickTypeId,
            variableId: variables.get(VAR_ABW_CODE)!.id,
          },
        },
        {
          day: val.day,
          target: {
            coopTypeId: mapFcIdToCoop.get(key)!.coopTypeId,
            chickTypeId: mapFcIdToCoop.get(key)!.activeFarmingCycle.chickTypeId,
            variableId: variables.get(VAR_TRG_IP_CODE)!.id,
          },
        },
        {
          day: val.day,
          target: {
            coopTypeId: mapFcIdToCoop.get(key)!.coopTypeId,
            chickTypeId: mapFcIdToCoop.get(key)!.activeFarmingCycle.chickTypeId,
            variableId: variables.get(VAR_FEED_CON_CODE)!.id,
          },
        },
      );
    });

    const customMapKey = (td: DeepPartial<TargetDaysD>) =>
      `${td.target!.coopTypeId}_${td.target!.chickTypeId}_${td.target!.variableId}_${td.day}`;
    const targetDays = await this.targetDaysDDAO.getMappedByKey(targetDaysFilter, customMapKey);

    mappedDailyMonitoring.forEach((val, key) => {
      mapCoopToPerformance.set(mapFcIdToCoop.get(key)!.id, {
        bw: {
          actual: val.bw || 0,
          standard:
            targetDays.get(
              customMapKey({
                day: val.day,
                target: {
                  coopTypeId: mapFcIdToCoop.get(key)!.coopTypeId,
                  chickTypeId: mapFcIdToCoop.get(key)!.activeFarmingCycle.chickTypeId,
                  variableId: variables.get(VAR_ABW_CODE)!.id,
                },
              }),
            )?.minValue || 0,
        },
        ip: {
          actual: val.ip || 0,
          standard:
            targetDays.get(
              customMapKey({
                day: val.day,
                target: {
                  coopTypeId: mapFcIdToCoop.get(key)!.coopTypeId,
                  chickTypeId: mapFcIdToCoop.get(key)!.activeFarmingCycle.chickTypeId,
                  variableId: variables.get(VAR_TRG_IP_CODE)!.id,
                },
              }),
            )?.minValue || 0,
        },
        feedIntake: {
          actual: val.feedIntake || 0,
          standard:
            targetDays.get(
              customMapKey({
                day: val.day,
                target: {
                  coopTypeId: mapFcIdToCoop.get(key)!.coopTypeId,
                  chickTypeId: mapFcIdToCoop.get(key)!.activeFarmingCycle.chickTypeId,
                  variableId: variables.get(VAR_FEED_CON_CODE)!.id,
                },
              }),
            )?.minValue || 0,
        },
      });
    });

    const [purchaseOrderDOCs] = await this.poDAO.getMany({
      where: {
        farmingCycleId: In(activeFarmingCycleIds),
        isDoc: true,
      },
    });

    const mapFcIdToPO = purchaseOrderDOCs.reduce((prep, item) => {
      if (item.farmingCycleId) prep.set(item.farmingCycleId, item);
      return prep;
    }, new Map<string, PurchaseOrder>());

    const rawList = coops.map<ActiveCoopItem>((coop) => {
      const performance = mapCoopToPerformance.get(coop.id);

      const contract =
        coop.contract && coop.contract.contractType
          ? { id: coop.contract.id, type: coop.contract.contractType.contractName }
          : null;

      const branch =
        coop.contract && coop.contract.branch
          ? { id: coop.contract.branch.id, name: coop.contract.branch.name }
          : null;

      const currentDate = new Date();
      const coopStartDate = coop.activeFarmingCycle.farmingCycleStartDate
        ? coop.activeFarmingCycle.farmingCycleStartDate
        : new Date(mapFcIdToPO.get(coop.activeFarmingCycleId!)!.datePlanned);
      let currentCoopDay: number =
        coop.farm.category === FarmChickCategory.LAYER
          ? (coop.activeFarmingCycle.pulletInWeeks || 0) * 7
          : 0;
      if (currentDate > coopStartDate) {
        currentCoopDay += differenceInCalendarDays(currentDate, coopStartDate);
      }

      const activeCoopItem: ActiveCoopItem = {
        id: coop.id,
        farmId: coop.farmId,
        coopName: coop.coopName,
        coopDistrict: coop.farm.district?.districtName,
        coopCity: coop.farm.city.cityName,
        isNew:
          coop.activeFarmingCycle.farmingStatus === FC_FARMING_STATUS.NEW ||
          coop.activeFarmingCycle.farmingCycleStartDate
            ? coop.activeFarmingCycle.farmingCycleStartDate.getTime() > new Date().getTime()
            : true,
        period: coop.totalPeriod,
        day: currentCoopDay,
        farmingCycleId: coop.activeFarmingCycle.id,
        startDate: coopStartDate.toISOString(),
        bw: performance?.bw,
        ip: performance?.ip,
        isActionNeeded:
          coop.activeFarmingCycle?.dailyMonitoring?.some(
            (d) =>
              d.reportStatus === DAILY_MONITORING_STATUS_ENUM.EMPTY ||
              d.reportStatus === DAILY_MONITORING_STATUS_ENUM.FILLED,
          ) || false,
        isOwnFarm: contract && branch ? contract.type === CONTRACT_TYPE.OWN_FARM : false,
        contract,
        branch,
        farmCategory: coop.farm.category || FarmChickCategory.BROILER,
        feedIntake: performance?.feedIntake,
        week: daysToWeeks(currentCoopDay),
      };

      return activeCoopItem;
    });

    const list1: ActiveCoopItem[] = [];
    const list2: ActiveCoopItem[] = [];
    rawList.forEach((item) => {
      if (item.isNew) {
        list1.push(item);
      } else {
        list2.push(item);
      }
    });

    // list1 is already sorted by chickInDate ASC in database call
    // list2 sort by (actual bw - target bw) ASC
    list2.sort((a, b) => {
      if (!a.bw) return -1;
      if (!b.bw) return 1;
      return a.bw.actual - a.bw.standard - (b.bw.actual - b.bw.standard);
    });

    const results = [...list1, ...list2];
    if (results.length > 0) {
      await this.redisConnection.connection.set(
        cacheKey,
        JSON.stringify(results),
        'EX',
        COOP_CACHE_TTL,
      );
    }
    return results;
  }

  async getAvailable(filter: GetAvailableCoopQuery): Promise<[AvailableCoopItem[], number]> {
    const [availableCoops, count] = await this.dao.getAvailableCoop(filter);

    const results: AvailableCoopItem[] = availableCoops.map((coop) => {
      const productionTeam =
        coop.coopMembers
          ?.filter((member) => member.isInternal)
          .map((member) => ({
            id: member.user.id,
            fullName: member.user.fullName,
            userType: member.user.userType,
          })) || [];

      return {
        id: coop.id,
        coopCode: coop.coopCode,
        farmCategory: coop.farm.category,
        coopName: coop.coopName,
        initialPopulation: coop.maxCapacity,
        ownerId: coop.farm.userOwnerId,
        productionTeam,
        branch: coop.farm.branch || null,
        contract: coop.contract || null,
        contractType: coop.contract?.contractType?.contractName || null,
      };
    });

    return [results, count];
  }

  async calculateActualIP(farmingCycleId: string): Promise<number> {
    const [farmingCycle, weightVariable, harvestTonaseVariable, feedConsumptionVar] =
      await Promise.all([
        this.farmingCycleDAO.getOneStrict({
          where: {
            id: farmingCycleId,
          },
          select: {
            chickStocks: true,
          },
          relations: {
            chickStocks: true,
          },
          order: {
            chickStocks: {
              transactionDate: 'ASC',
            },
          },
          relationLoadStrategy: 'join',
        }),
        this.variableDAO.getOneStrict({
          where: {
            variableCode: VAR_ABW_CODE,
          },
        }),
        this.variableDAO.getOneStrict({
          where: {
            variableCode: VAR_HARVEST_TONASE_CODE,
          },
        }),
        this.variableDAO.getOneStrict({
          where: {
            variableCode: VAR_FEED_CON_CODE,
          },
        }),
      ]);
    const { initialPopulation } = farmingCycle;
    let currentPopulation = 0;
    let cummulativeHarvestedPopulation = 0;
    let cummulativeHarvestedAge = 0;
    farmingCycle.chickStocks.forEach((chickStock) => {
      if (chickStock.operator === '+') {
        currentPopulation += chickStock.qty;
      } else {
        currentPopulation -= chickStock.qty;
      }

      if (chickStock.operator === '-' && chickStock.notes === 'harvested') {
        cummulativeHarvestedPopulation += chickStock.qty;

        const day = differenceInCalendarDays(
          new Date(farmingCycle.chickInDate),
          new Date(chickStock.transactionDate),
        );
        cummulativeHarvestedAge += day * chickStock.qty;
      }
    });
    const cummulativePopulation = currentPopulation + cummulativeHarvestedPopulation;
    const [latestWeightTaskTicket, cummulativeHarvestedWeightKG, cummulativeFeedConsumptionSack] =
      await Promise.all([
        this.taskTicketDDAO.getLatestValue(weightVariable.id, farmingCycle.id),
        this.taskTicketDDAO.getTodaySum(harvestTonaseVariable.id, farmingCycle.id),
        this.taskTicketDDAO.getTodaySum(feedConsumptionVar.id, farmingCycle.id),
      ]);
    const latestAverageWeightGram = latestWeightTaskTicket?.dataValue
      ? parseFloat(latestWeightTaskTicket?.dataValue)
      : 0;
    const totalChickWeightKG = uomConverter(
      latestAverageWeightGram * currentPopulation,
      'gram',
      'kilogram',
    );
    const averageBWGram =
      cummulativePopulation > 0
        ? uomConverter(totalChickWeightKG + cummulativeHarvestedWeightKG, 'kilogram', 'gram') /
          cummulativePopulation
        : 0;

    const actualFCR =
      totalChickWeightKG + cummulativeHarvestedWeightKG !== 0
        ? uomConverter(cummulativeFeedConsumptionSack, 'karung', 'kilogram') /
          (totalChickWeightKG + cummulativeHarvestedWeightKG)
        : 0;

    const averageAge =
      cummulativePopulation > 0
        ? (cummulativeHarvestedAge +
            differenceInCalendarDays(new Date(farmingCycle.chickInDate), new Date()) *
              currentPopulation) /
          cummulativePopulation
        : 0;

    const actualIP =
      actualFCR > 0 && initialPopulation > 0 && averageAge > 0
        ? (((cummulativePopulation / initialPopulation) * averageBWGram) /
            (actualFCR * averageAge)) *
          10
        : 0;

    return actualIP;
  }

  async deleteImage(id: string, requestUser: RequestUser) {
    await this.coopImageDAO.removeByIdWithTx(id, requestUser, undefined, [
      (coopImage: CoopImage) => this.deleteImageFromS3(coopImage.filename),
    ]);
  }

  async deleteImageFromS3(url: string) {
    /**
     * generate key from given url. example below
     * url: https://pitik-cms-staging.s3.ap-southeast-1.amazonaws.com/coops/images/coops-1659960362935.png;
     * key: /coops/images/coops-1659960362935.png
     */
    const splitted = url.split('/coops/');
    if (splitted.length < 2) {
      throw new Error('url pattern not recognized');
    }
    const key = `coops/${splitted[1]}`;

    const command = new DeleteObjectCommand({
      Bucket: env.AWS_BUCKET,
      Key: key,
    });

    const result = await this.s3.client.send(command);

    if (!result.$metadata.httpStatusCode || result.$metadata.httpStatusCode >= 400) {
      throw new Error('failed to delete image from S3');
    }
  }

  // eslint-disable-next-line class-methods-use-this
  private setIdleCoopStatus(coop: Coop): IdleCoopStatus {
    if (coop.chickInRequest?.purchaseRequests.length) {
      const [prDOC] = coop.chickInRequest.purchaseRequests.filter((pr) => pr.type === 'doc');

      const [poDOC] = prDOC.purchaseOrders;

      if (poDOC?.isApproved === false) {
        return { number: 3, text: 'Ditolak' };
      }

      if (poDOC?.isApproved === null) {
        return { number: 4, text: 'Diproses' };
      }
    }

    if (coop.chickInRequest && coop.chickInRequest.isApproved) {
      return { number: 2, text: 'Disetujui' };
    }

    if (coop.chickInRequest && coop.chickInRequest.approvedBy === null) {
      return { number: 1, text: 'Diajukan' };
    }

    if (!coop.chickInRequest) {
      return { number: 0, text: 'Perlu Pengajuan' };
    }

    return { number: 0, text: '' };
  }

  @Transactional()
  async updateCoopStatusByFarmId(
    farmId: string,
    status: boolean | undefined,
    user: RequestUser,
    queryRunner: QueryRunner,
  ): Promise<void> {
    const [coops] = await this.dao.getMany({
      select: {
        id: true,
        activeFarmingCycle: {
          farmingCycleCode: true,
        },
        activeFarmingCycleId: true,
        coopName: true,
      },
      relations: {
        activeFarmingCycle: true,
      },
      where: {
        farmId,
        status: true,
      },
    });

    let isFarmNotAllowedToBeDeactivated: boolean = false;
    const coopWithActiveFarmingCycles: string[] = [];
    coops.forEach((coop) => {
      if (coop.activeFarmingCycleId) {
        isFarmNotAllowedToBeDeactivated = true;

        coopWithActiveFarmingCycles.push(
          `${coop.coopName}: ${coop.activeFarmingCycle.farmingCycleCode}`,
        );
      }
    });

    if (isFarmNotAllowedToBeDeactivated) {
      throw ERR_FARM_DEACTIVATION_FAILED(coopWithActiveFarmingCycles.toString());
    }

    await this.dao.updateManyWithTx({ farmId }, { status }, user, queryRunner);
  }

  // eslint-disable-next-line class-methods-use-this
  async getITSupportAndSupervisor(members: CoopMemberD[]): Promise<{
    itSupport: UserItem | null;
    iotEngineer: UserItem | null;
  }> {
    const coopMemberIds = members?.map((member) => member.userId);

    const [userManagementData] = await this.userCoreService.search({ cmsIds: coopMemberIds });

    const itSupport = userManagementData.find((user) =>
      user.roles?.find((role) => role.name === USER_TYPE.IS),
    );
    const iotEngineer = userManagementData.find(
      (user) =>
        user.roles?.find((role) => role.name === USER_TYPE.SA) ||
        user.roles?.find((role) => role.name === USER_TYPE.IO) ||
        user.roles?.find((role) => role.name === USER_TYPE.AI),
    );

    return {
      itSupport: itSupport
        ? {
            id: itSupport?.cmsId || '',
            userCode:
              members?.find((member) => member.user.id === itSupport.cmsId)?.user.userCode || '',
            fullName: itSupport.fullName || '',
          }
        : null,
      iotEngineer: iotEngineer
        ? {
            id: iotEngineer.cmsId || '',
            userCode:
              members?.find((member) => member.user.id === iotEngineer.cmsId)?.user.userCode || '',
            fullName: iotEngineer.fullName || '',
          }
        : null,
    };
  }
}
