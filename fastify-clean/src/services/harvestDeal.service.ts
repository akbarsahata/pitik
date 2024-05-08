import { Inject, Service } from 'fastify-decorators';
import { DailyMonitoringDAO } from '../dao/dailyMonitoring.dao';
import { FarmingCycleDAO } from '../dao/farmingCycle.dao';
import { HarvestDealDAO } from '../dao/harvestDeal.dao';
import { HarvestRequestDAO } from '../dao/harvestRequest.dao';
import {
  CreateHarvestDealBody,
  GetHarvestDealDetailParams,
  GetHarvestDealListQuery,
  HarvestDealItem,
  HarvestDealList,
} from '../dto/harvestDeal.dto';
import { HarvestDealCreatedQueue } from '../jobs/queues/harvest-deal-created.queue';
import { ERR_BAD_REQUEST, ERR_HARVEST_DEAL_QUANTITY } from '../libs/constants/errors';
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

  async getHarvestDealList(params: GetHarvestDealListQuery): Promise<HarvestDealList> {
    const [harvestDeals] = await this.dao.getMany({
      where: {
        farmingCycleId: params.farmingCycleId,
        status: true,
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
    }));
  }

  async getHarvestDealDetail(params: GetHarvestDealDetailParams): Promise<HarvestDealItem> {
    const harvestDeal = await this.dao.getOneStrict({
      where: {
        id: params.harvestDealId,
      },
      relations: {
        harvestRequest: true,
      },
    });

    return {
      ...harvestDeal,
      deliveryOrder: harvestDeal.erpCode,
      requestDate: harvestDeal.harvestRequest.datePlanned,
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
          status: data.status,
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
        status: data.status,
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
}
