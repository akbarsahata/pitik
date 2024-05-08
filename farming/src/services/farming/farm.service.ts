import { differenceInCalendarDays } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { Inject, Service } from 'fastify-decorators';
import { FindOptionsWhere, ILike, In, IsNull, Not, QueryRunner } from 'typeorm';
import { FarmDAO } from '../../dao/farm.dao';
import { FarmingCycleDAO } from '../../dao/farmingCycle.dao';
import { FarmingCycleMemberDDAO } from '../../dao/farmingCycleMemberD.dao';
import { Farm } from '../../datasources/entity/pgsql/Farm.entity';
import { FarmingCycle } from '../../datasources/entity/pgsql/FarmingCycle.entity';
import {
  ActiveFarmingCycleItem,
  CreateFarmBody,
  GetFarmsQuery,
  UpdateFarmBody,
} from '../../dto/farm.dto';
import {
  DEFAULT_TIME_ZONE,
  FC_CYCLE_STATUS,
  FC_FARMING_STATUS,
  USER_TYPE,
} from '../../libs/constants';
import { ERR_FARM_CODE_EXIST, ERR_FARM_NOT_FOUND } from '../../libs/constants/errors';
import { Transactional } from '../../libs/decorators/transactional';
import { RequestUser } from '../../libs/types/index.d';
import { isRoleAllowed } from '../../libs/utils/helpers';

@Service()
export class FarmService {
  @Inject(FarmDAO)
  private farmDAO: FarmDAO;

  @Inject(FarmingCycleDAO)
  private farmingCycleDAO: FarmingCycleDAO;

  @Inject(FarmingCycleMemberDDAO)
  private farmingCycleMemberDDAO: FarmingCycleMemberDDAO;

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

    const newFarm = await this.farmDAO.createOne(input, user);

    return newFarm;
  }

  async getFarms(filter: GetFarmsQuery): Promise<[Farm[], number]> {
    const limit = filter.$limit && filter.$limit > 0 ? filter.$limit : 10;
    const skip = !filter.$page || filter.$page < 1 ? 0 : (filter.$page - 1) * limit;
    return this.farmDAO.getAll({
      where: {
        userOwnerId: filter.userOwnerId,
        farmCode: filter.farmCode,
        farmName: filter.farmName ? ILike(`%${filter.farmName}%`) : undefined,
        provinceId: filter.provinceId,
        cityId: filter.cityId,
        districtId: filter.districtId,
        status: filter.status,
        branchId: filter.branchId,
        category: filter.category,
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

  @Transactional()
  async updateV2(
    id: string,
    input: UpdateFarmBody,
    user: RequestUser,
    queryRunner: QueryRunner,
  ): Promise<Farm> {
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

    const updatedFarm = await this.farmDAO.updateOneWithTx({ id }, input, user, queryRunner);

    return updatedFarm;
  }
}
