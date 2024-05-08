import { addMonths } from 'date-fns';
import { Inject, Service } from 'fastify-decorators';
import { ILike, MoreThan } from 'typeorm';
import { FarmingCycleDAO } from '../dao/farmingCycle.dao';
import { HarvestDealDAO } from '../dao/harvestDeal.dao';
import { HarvestRealizationDAO } from '../dao/harvestRealization.dao';
import { RealizationStatusEnum } from '../datasources/entity/pgsql/HarvestRealization.entity';
import {
  FarmingCycleHarvestItem,
  GetFarmingCycleHarvestsQuery,
  GetHarvestDealQuery,
  GetHarvestRealizationQuery,
  HarvestDealItem,
  HarvestRealizationItem,
  UserTypeEnum,
} from '../dto/harvest.dto';
import { FC_FARMING_STATUS, USER_TYPE } from '../libs/constants';
import { RequestUser } from '../libs/types/index.d';
import { isRoleAllowed, mapToFarmingStatusEnum } from '../libs/utils/helpers';

@Service()
export class HarvestService {
  @Inject(FarmingCycleDAO)
  private farmingCycleDAO: FarmingCycleDAO;

  @Inject(HarvestDealDAO)
  private harvestDealDAO: HarvestDealDAO;

  @Inject(HarvestRealizationDAO)
  private harvestRealizationDAO: HarvestRealizationDAO;

  async getFarmingCycleHarvests(opts: {
    filter: GetFarmingCycleHarvestsQuery;
    user: RequestUser;
  }): Promise<[FarmingCycleHarvestItem[], number]> {
    const [farmingCycles, count] = await this.farmingCycleDAO.getMany({
      where: {
        id: opts.filter.farmingCycleId,
        farmingCycleCode: opts.filter.farmingCycleCode,
        farmId: opts.filter.farmId,
        coopId: opts.filter.coopId,
        farm:
          ((opts.filter.branchId || opts.filter.ownerId) && {
            branchId: opts.filter.branchId,
            userOwnerId: opts.filter.ownerId,
          }) ||
          undefined,
        farmingStatus: opts.filter.status && FC_FARMING_STATUS[opts.filter.status],
        farmingCycleStartDate: MoreThan(addMonths(new Date(), -12)),
      },
      relations: {
        farm: {
          owner: true,
          branch: true,
        },
        coop: {
          coopMembers: {
            user: true,
          },
        },
        harvestRealizations: true,
        dailyMonitoring: true,
      },
      take: opts.filter.$limit,
      skip: opts.filter.$limit && opts.filter.$page && opts.filter.$limit * (opts.filter.$page - 1),
      order: {
        createdDate: 'DESC',
      },
    });

    const results: FarmingCycleHarvestItem[] = farmingCycles.map((fc) => {
      const members = [
        {
          id: fc.farm.owner.id,
          name: fc.farm.owner.fullName,
          userType: fc.farm.owner.userType as UserTypeEnum,
        },
      ];

      if (fc.coop.coopMembers) {
        members.push(
          ...fc.coop.coopMembers
            .filter((member) => isRoleAllowed(member.user.userType, [USER_TYPE.PPL]))
            .map((member) => ({
              id: member.user.id,
              name: member.user.fullName,
              userType: member.user.userType as UserTypeEnum,
            })),
        );
      }

      const realiztionWithoutDeleted = fc.harvestRealizations.filter(
        (hr) => hr.status !== RealizationStatusEnum.DELETED,
      );

      const mortaledChickInDailyMonitoring = fc.dailyMonitoring?.reduce(
        (maxDayObj, obj) => (obj.day > maxDayObj.day ? obj : maxDayObj),
        fc.dailyMonitoring[0],
      );

      return {
        id: fc.id,
        farmingCycleCode: fc.farmingCycleCode,
        initialPopulation: fc.initialPopulation,
        populationMortaled: mortaledChickInDailyMonitoring?.populationMortaled || 0,
        status: mapToFarmingStatusEnum(fc.farmingStatus),
        coop: {
          id: fc.coop.id,
          name: fc.coop.coopName,
        },
        farm: {
          id: fc.farm.id,
          name: fc.farm.farmName,
          branch: fc.farm.branch,
        },
        members,
        harvest: {
          count: realiztionWithoutDeleted.length,
          latestHarvestDate:
            (realiztionWithoutDeleted.length && realiztionWithoutDeleted[0].harvestDate) ||
            undefined,
          total: {
            quantity: fc.harvestRealizations.reduce(
              (prev, item) =>
                (item.status !== RealizationStatusEnum.DELETED ? item.quantity : 0) + prev,
              0,
            ),
            tonnage: fc.harvestRealizations.reduce(
              (prev, item) =>
                (item.status !== RealizationStatusEnum.DELETED ? item.tonnage : 0) + prev,
              0,
            ),
          },
        },
      };
    });

    return [results, count];
  }

  async getHarvestRealizations(opts: {
    farmingCycleId: string;
    filter: GetHarvestRealizationQuery;
  }): Promise<[HarvestRealizationItem[], number]> {
    const [realizations, count] = await this.harvestRealizationDAO.getMany({
      where: {
        farmingCycleId: opts.farmingCycleId,
      },
      relations: {
        harvestDeal: true,
        harvestRealizationRecords: true,
      },
      order: {
        harvestDate: 'DESC',
        createdDate: 'DESC',
      },
    });

    const results: HarvestRealizationItem[] = realizations.map((realization) => ({
      id: realization.id,
      bakulName: realization.harvestDeal.bakulName,
      date: realization.harvestDate,
      deliveryOrder: realization.harvestDeal.erpCode,
      status: realization.status || RealizationStatusEnum.DRAFT,
      total: {
        quantity: realization.quantity,
        tonnage: realization.tonnage,
      },
      weighingNumber:
        realization.weighingNumber ||
        (realization.harvestRealizationRecords.length
          ? realization.harvestRealizationRecords[0].weighingNumber
          : ''),
    }));

    return [results, count];
  }

  async getHarvestDeals(opts: {
    farmingCycleId: string;
    filter: GetHarvestDealQuery;
  }): Promise<[HarvestDealItem[], number]> {
    const [deals, count] = await this.harvestDealDAO.getMany({
      where: {
        farmingCycleId: opts.farmingCycleId,
        erpCode: opts.filter.deliveryOrder,
        bakulName: (opts.filter.bakulName && ILike(`%${opts.filter.bakulName}%`)) || undefined,
        datePlanned: opts.filter.date,
        harvestRealizations: {
          weighingNumber: opts.filter.weighingNumber,
        },
      },
      relations: {
        harvestRealizations: {
          harvestRealizationRecords: true,
        },
      },
      order: {
        datePlanned: 'DESC',
        createdDate: 'DESC',
      },
    });

    const results: HarvestDealItem[] = deals.map((deal) => ({
      id: deal.id,
      date: deal.datePlanned,
      bakulName: deal.bakulName,
      deliveryOrder: deal.erpCode,
      weighingNumber: deal.harvestRealizations.length
        ? deal.harvestRealizations[0].weighingNumber
        : '',
      status: deal.status,
      total: {
        quantity: deal.harvestRealizations[0]?.quantity || 0,
        tonnage: deal.harvestRealizations[0]?.tonnage || 0,
      },
      harvestRealizationId: deal.harvestRealizations[0]?.id || null,
      reason: deal.reason,
    }));

    return [results, count];
  }
}
