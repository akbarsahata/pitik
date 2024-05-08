import { format } from 'date-fns';
import { Inject, Service } from 'fastify-decorators';
import { In } from 'typeorm';
import { DailyMonitoringDAO } from '../dao/dailyMonitoring.dao';
import { ErpDAO } from '../dao/erp.dao';
import { FarmingCycleDAO } from '../dao/farmingCycle.dao';
import { HarvestDealDAO } from '../dao/harvestDeal.dao';
import { HarvestRequestDAO } from '../dao/harvestRequest.dao';
import { UserDAO } from '../dao/user.dao';
import { HarvestDealStatusEnum } from '../datasources/entity/pgsql/HarvestDeal.entity';
import {
  CreateHarvestDealBody,
  GetHarvestDealDetailParams,
  GetHarvestDealListQuery,
  HarvestDealItem,
  HarvestDealList,
} from '../dto/harvestDeal.dto';
import { HarvestDealCreatedQueue } from '../jobs/queues/harvest-deal-created.queue';
import {
  DATE_SQL_FORMAT,
  HARVEST_DEAL_DEFAULT_REASON,
  HARVEST_DEAL_STATUS_TEXT_MAP,
} from '../libs/constants';
import {
  ERR_BAD_REQUEST,
  ERR_HARVEST_DEAL_CANT_BE_CANCELLED,
  ERR_HARVEST_DEAL_QUANTITY,
} from '../libs/constants/errors';
import { RequestUser } from '../libs/types/index.d';

@Service()
export class HarvestDealService {
  @Inject(DailyMonitoringDAO)
  private dailyMonitoringDAO: DailyMonitoringDAO;

  @Inject(HarvestDealDAO)
  private dao: HarvestDealDAO;

  @Inject(HarvestRequestDAO)
  private harvestRequestDAO: HarvestRequestDAO;

  @Inject(FarmingCycleDAO)
  private farmingCycleDAO: FarmingCycleDAO;

  @Inject(HarvestDealCreatedQueue)
  private harvestDealCreatedQueue: HarvestDealCreatedQueue;

  @Inject(UserDAO)
  private userDAO: UserDAO;

  @Inject(ErpDAO)
  private erpDAO: ErpDAO;

  async getHarvestDealList(query: GetHarvestDealListQuery): Promise<HarvestDealList> {
    const [harvestDeals] = await this.dao.getMany({
      where: {
        farmingCycleId: query.farmingCycleId,
        status: query.status
          ? (query.status as HarvestDealStatusEnum)
          : In([
              HarvestDealStatusEnum.AVAILABLE,
              HarvestDealStatusEnum.CANCELLED,
              HarvestDealStatusEnum.REJECTED,
            ]),
      },
      order: {
        createdDate: 'DESC',
      },
      relations: {
        harvestRequest: true,
      },
    });

    return harvestDeals.map<HarvestDealItem>((hd) => ({
      ...hd,
      deliveryOrder: hd.erpCode,
      requestDate: hd.harvestRequest.datePlanned,
      statusText: HARVEST_DEAL_STATUS_TEXT_MAP[`${hd.status}`],
    }));
  }

  async getHarvestDealDetail(params: GetHarvestDealDetailParams): Promise<HarvestDealItem> {
    const harvestDeal = await this.dao.getOneStrict({
      where: {
        id: params.harvestDealId,
      },
      relations: {
        harvestRequest: true,
        harvestRealizations: true,
      },
    });

    return {
      ...harvestDeal,
      harvestRealizationId: harvestDeal.harvestRealizations[0]?.id || '',
      deliveryOrder: harvestDeal.erpCode,
      requestDate: harvestDeal.harvestRequest.datePlanned,
      statusText: HARVEST_DEAL_STATUS_TEXT_MAP[`${harvestDeal.status}`],
    };
  }

  async createHarvestDeal(
    data: CreateHarvestDealBody,
    user: RequestUser,
  ): Promise<HarvestDealItem> {
    const harvestRequest = await this.harvestRequestDAO.getOne({
      where: {
        erpCode: data.harvestRequestCode,
      },
    });

    if (!harvestRequest) throw ERR_BAD_REQUEST('invalid harvest request');

    const farmingCycle = await this.farmingCycleDAO.getOneStrict({
      where: {
        id: harvestRequest.farmingCycleId,
      },
    });

    const curPopulation = await this.dailyMonitoringDAO.getRemainingPopulation(farmingCycle.id);

    if (data.quantity > curPopulation + 0.02 * farmingCycle.initialPopulation) {
      throw ERR_HARVEST_DEAL_QUANTITY(
        `${curPopulation + 0.02 * farmingCycle.initialPopulation} ekor`,
      );
    }

    const existingHarvestDeal = await this.dao.getOne({
      where: {
        erpCode: data.deliveryOrder,
      },
      relations: {
        harvestRequest: true,
      },
      order: {
        createdDate: 'DESC',
      },
    });

    if (existingHarvestDeal) {
      const updatedHarvestDeal = await this.dao.updateOne(
        {
          id: existingHarvestDeal.id,
        },
        {
          erpCode: data.deliveryOrder,
          datePlanned: data.datePlanned,
          bakulName: data.bakulName,
          minWeight: data.minWeight,
          maxWeight: data.maxWeight,
          quantity: data.quantity,
          status:
            data.status === false
              ? HarvestDealStatusEnum.REJECTED
              : HarvestDealStatusEnum.AVAILABLE,
          truckLicensePlate: data.nop,
          reason: data.reason || undefined,
        },
        user,
      );

      return {
        ...updatedHarvestDeal,
        deliveryOrder: existingHarvestDeal.erpCode,
        requestDate: existingHarvestDeal.harvestRequest.datePlanned,
      };
    }

    const harvestDeal = await this.dao.createOne(
      {
        harvestRequestId: harvestRequest.id,
        farmingCycleId: harvestRequest.farmingCycleId,
        erpCode: data.deliveryOrder,
        datePlanned: data.datePlanned,
        bakulName: data.bakulName,
        minWeight: data.minWeight,
        maxWeight: data.maxWeight,
        quantity: data.quantity,
        status:
          data.status === false ? HarvestDealStatusEnum.REJECTED : HarvestDealStatusEnum.AVAILABLE,
        truckLicensePlate: data.nop,
        reason: data.reason || HARVEST_DEAL_DEFAULT_REASON,
      },
      user,
    );

    this.harvestDealCreatedQueue.addJob(harvestDeal);

    return {
      ...harvestDeal,
      deliveryOrder: harvestDeal.erpCode,
      requestDate: harvestRequest.datePlanned,
    };
  }

  async cancelHarvestDeal(harvestDealId: string, user: RequestUser): Promise<HarvestDealItem> {
    const [harvestDeal, requester] = await Promise.all([
      this.dao.getOneStrict({
        where: {
          id: harvestDealId,
        },
        relations: {
          harvestRequest: true,
        },
      }),
      this.userDAO.getOneStrict({
        where: {
          id: user.id,
          status: true,
        },
      }),
    ]);

    const allowedStatusForCancel = [HarvestDealStatusEnum.AVAILABLE, HarvestDealStatusEnum.DRAFT];

    if (!allowedStatusForCancel.includes(harvestDeal.status)) {
      throw ERR_HARVEST_DEAL_CANT_BE_CANCELLED(`: Status deal adalah ${harvestDeal.status}`);
    }

    await this.erpDAO.cancelHarvestDeal({
      date: format(harvestDeal.modifiedDate, DATE_SQL_FORMAT),
      deliveryOrder: harvestDeal.erpCode,
      reason: 'Cancelled via PPL Apps',
      cancelBy: requester.fullName,
    });

    await this.dao.updateOne(
      {
        id: harvestDealId,
      },
      {
        status: HarvestDealStatusEnum.CANCELLED,
      },
      user,
    );

    const result = await this.getHarvestDealDetail({ harvestDealId });

    return result;
  }
}
