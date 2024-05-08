import { differenceInCalendarDays } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { Inject, Service } from 'fastify-decorators';
import { FindOptionsWhere, In, IsNull, Like, Not } from 'typeorm';
import { ContractDAO } from '../dao/contract.dao';
import { CoopDAO } from '../dao/coop.dao';
import { FarmDAO } from '../dao/farm.dao';
import { FarmingCycleDAO } from '../dao/farmingCycle.dao';
import { FarmingCycleMemberDDAO } from '../dao/farmingCycleMemberD.dao';
import { Farm } from '../datasources/entity/pgsql/Farm.entity';
import { FarmingCycle } from '../datasources/entity/pgsql/FarmingCycle.entity';
import {
  ActiveFarmingCycleItem,
  CreateFarmBody,
  GetFarmsQuery,
  UpdateFarmBody,
} from '../dto/farm.dto';
import { FarmUpdatedQueue } from '../jobs/queues/farm-updated.queue';
import {
  DEFAULT_TIME_ZONE,
  FC_CYCLE_STATUS,
  FC_FARMING_STATUS,
  USER_TYPE,
} from '../libs/constants';
import { ERR_FARM_CODE_EXIST, ERR_FARM_NOT_FOUND } from '../libs/constants/errors';
import { RequestUser } from '../libs/types/index.d';
import { isRoleAllowed } from '../libs/utils/helpers';

@Service()
export class FarmService {
  @Inject(FarmDAO)
  private farmDAO: FarmDAO;

  @Inject(CoopDAO)
  private coopDAO: CoopDAO;

  @Inject(FarmingCycleDAO)
  private farmingCycleDAO: FarmingCycleDAO;

  @Inject(FarmingCycleMemberDDAO)
  private farmingCycleMemberDDAO: FarmingCycleMemberDDAO;

  @Inject(ContractDAO)
  private contractDAO: ContractDAO;

  @Inject(FarmUpdatedQueue)
  private queue: FarmUpdatedQueue;

  async getActiveFarmingCycle(user: RequestUser): Promise<ActiveFarmingCycleItem[]> {
    let farmingCycles: FarmingCycle[] = [];

    if (isRoleAllowed(user.role, [USER_TYPE.OWN])) {
      farmingCycles = await this.farmingCycleDAO.getAll({
        where: {
          farmingStatus: In([FC_FARMING_STATUS.NEW, FC_FARMING_STATUS.IN_PROGRESS]),
          cycleStatus: FC_CYCLE_STATUS.ACTIVE,
          farm: {
            userOwnerId: user.id,
            status: true,
          },
          coop: {
            status: true,
            activeFarmingCycleId: Not(IsNull()),
          },
        },
        relations: {
          coop: true,
          farm: true,
        },
      });
    } else {
      const [farmingCycleMembers] = await this.farmingCycleMemberDDAO.getMany({
        where: {
          userId: user.id,
          farmingCycle: {
            farmingStatus: In([FC_FARMING_STATUS.NEW, FC_FARMING_STATUS.IN_PROGRESS]),
            cycleStatus: FC_CYCLE_STATUS.ACTIVE,
            coop: {
              status: true,
              activeFarmingCycleId: Not(IsNull()),
            },
          },
        },
        relations: {
          farmingCycle: {
            coop: true,
            farm: true,
          },
        },
      });

      farmingCycles = farmingCycleMembers.map((member) => ({
        ...member.farmingCycle,
      }));
    }

    const activeFarmingCycles: ActiveFarmingCycleItem[] = farmingCycles.map((farmingCycle) => {
      const day = differenceInCalendarDays(
        utcToZonedTime(new Date(), DEFAULT_TIME_ZONE),
        farmingCycle.farmingCycleStartDate,
      );

      return {
        ...farmingCycle,
        ...farmingCycle.coop,
        ...farmingCycle.farm,
        day: !Number.isNaN(day) ? day : null,
        farmingCycleId: farmingCycle.id,
      };
    });

    return activeFarmingCycles;
  }

  async create(input: CreateFarmBody, user: RequestUser): Promise<Farm> {
    // check if Farm Code already exist
    const existingFarm = await this.farmDAO.getOne({
      where: {
        farmCode: input.farmCode,
      },
    });
    if (existingFarm) {
      throw ERR_FARM_CODE_EXIST();
    }

    return this.farmDAO.createOne(input, user);
  }

  async getFarms(filter: GetFarmsQuery): Promise<[Farm[], number]> {
    const limit = filter.$limit && filter.$limit > 0 ? filter.$limit : 10;
    const skip = !filter.$page || filter.$page < 1 ? 0 : (filter.$page - 1) * limit;
    return this.farmDAO.getAll({
      where: {
        userOwnerId: filter.userOwnerId,
        farmCode: filter.farmCode,
        farmName: filter.farmName ? Like(`%${filter.farmName}%`) : undefined,
        provinceId: filter.provinceId,
        cityId: filter.cityId,
        districtId: filter.districtId,
        status: filter.status,
        branchId: filter.branchId,
      },
      relations: {
        branch: true,
        city: true,
        district: true,
        province: true,
        owner: true,
        userModifier: true,
      },
      select: {
        branch: {
          name: true,
          code: true,
        },
        city: {
          cityName: true,
        },
        district: {
          districtName: true,
        },
        province: {
          provinceName: true,
        },
        owner: {
          fullName: true,
        },
      },
      take: (filter.$limit !== 0 && limit) || undefined,
      skip,
      order: {
        createdDate: 'DESC',
      },
    });
  }

  async getFarmById(id: string): Promise<Farm> {
    const farm = await this.farmDAO.getOne({
      where: {
        id,
      },
      relations: {
        branch: true,
        city: true,
        district: true,
        province: true,
        owner: true,
      },
      select: {
        branch: {
          id: true,
          name: true,
          code: true,
        },
        city: {
          cityName: true,
        },
        district: {
          districtName: true,
        },
        province: {
          provinceName: true,
        },
        owner: {
          fullName: true,
        },
      },
    });

    if (!farm) {
      throw ERR_FARM_NOT_FOUND();
    }

    return farm;
  }

  async update(id: string, input: UpdateFarmBody, user: RequestUser): Promise<Farm> {
    const conflictConditions: FindOptionsWhere<Farm>[] = [];
    if (input.farmCode) {
      conflictConditions.push({
        id: Not(id),
        farmCode: input.farmCode,
      });
    }

    const [conflictIdentifier] = await Promise.all([
      this.farmDAO.getOne({
        where: conflictConditions,
      }),
    ]);

    if (conflictIdentifier) {
      throw ERR_FARM_CODE_EXIST();
    }

    const existingFarm = await this.farmDAO.getOneById(id);
    if (existingFarm.branchId !== input.branchId) {
      return this.updateFarmRelations(id, input, existingFarm, user);
    }

    const updatedFarm = await this.farmDAO.updateOne({ id }, input, user);

    await this.queue.addJob(updatedFarm);

    return updatedFarm;
  }

  async updateFarmRelations(
    id: string,
    input: UpdateFarmBody,
    farmData: Farm,
    user: RequestUser,
  ): Promise<Farm> {
    const queryRunner = await this.farmDAO.startTransaction();

    try {
      const [[coops, coopsCount], [farmingCycles, farmingCyclesCount]] = await Promise.all([
        this.coopDAO.getMany({
          where: {
            farmId: id,
            farm: {
              branchId: farmData.branchId,
            },
          },
          relations: {
            contract: true,
            farm: true,
          },
        }),
        this.farmingCycleDAO.getMany({
          where: {
            farmId: id,
            farm: {
              branchId: farmData.branchId,
            },
          },
          relations: {
            contract: true,
            farm: true,
          },
        }),
      ]);

      const listOfContractTypeIds: string[] = [];
      if (coopsCount > 0) {
        coops.forEach((coop) => {
          if (coop.contract?.refContractTypeId) {
            listOfContractTypeIds.push(coop.contract.refContractTypeId);
          }
        });
      }
      const uniqueContractTypeIds: string[] = [...new Set(listOfContractTypeIds)];

      const [contracts, contractsCount] = await this.contractDAO.getMany({
        where: {
          refContractTypeId:
            uniqueContractTypeIds.length > 0 ? In(uniqueContractTypeIds) : undefined,
          branchId: input.branchId,
        },
      });

      if (contractsCount > 0) {
        coops.forEach(async (coop) => {
          const newContractId = contracts.find(
            (contract) =>
              contract.branchId === input.branchId &&
              contract.refContractTypeId === coop.contract.refContractTypeId,
          );

          if (newContractId) {
            await this.coopDAO.updateOneWithTx(
              { id: coop.id, farmId: id },
              { contractId: newContractId?.id },
              user,
              queryRunner,
            );
          }
        });
      }

      if (farmingCyclesCount > 0) {
        farmingCycles.forEach(async (farmingCycle) => {
          const newContractId = contracts.find(
            (contract) =>
              contract.branchId === input.branchId &&
              farmingCycle.contract &&
              contract.refContractTypeId === farmingCycle.contract.refContractTypeId,
          );

          if (newContractId) {
            await this.farmingCycleDAO.updateOneWithTx(
              { id: farmingCycle.id, farmId: id },
              { contractId: newContractId?.id },
              user,
              queryRunner,
            );
          }
        });
      }

      const updatedFarm = await this.farmDAO.updateOneWithTx({ id }, input, user, queryRunner);

      await this.farmDAO.commitTransaction(queryRunner);

      await this.queue.addJob(updatedFarm);

      return updatedFarm;
    } catch (error) {
      this.farmDAO.rollbackTransaction(queryRunner);

      throw error;
    }
  }
}
