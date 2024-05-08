/* eslint-disable no-param-reassign */
import { Inject, Service } from 'fastify-decorators';
import { DeepPartial, IsNull } from 'typeorm';
import { DailyMonitoringDAO } from '../dao/dailyMonitoring.dao';
import { FarmingCycleDAO } from '../dao/farmingCycle.dao';
import { HarvestRequestDAO } from '../dao/harvestRequest.dao';
import { HarvestRequest } from '../datasources/entity/pgsql/HarvestRequest.entity';
import {
  ApproveRejectHarvestRequestBody,
  ApproveRejectHarvestRequestParams,
  ApproveRejectHarvestRequestResponseItem,
  HarvestRequestDetailParams,
  HarvestRequestInput,
  HarvestRequestItem,
  HarvestRequestList,
  HarvestRequestQueryString,
  HarvestRequestUpdate,
} from '../dto/harvestRequest.dto';
import { HarvestRequestApprovedQueue } from '../jobs/queues/harvest-request-approved.queue';
import { HarvestRequestEditedQueue } from '../jobs/queues/harvest-request-edited.queue';
import { HarvestRequestRejectedQueue } from '../jobs/queues/harvest-request-rejected.queue';
import { HarvestRequestSubmittedQueue } from '../jobs/queues/harvest-request-submitted.queue';
import {
  ERR_HARVEST_REQUEST_ALREADY_APPROVED,
  ERR_HARVEST_REQUEST_ALREADY_REJECTED,
  ERR_HARVEST_REQUEST_MALFORMED,
  ERR_HARVEST_REQUEST_QUANTITY,
} from '../libs/constants/errors';
import { RequestUser } from '../libs/types/index.d';
import { mapActivityStatusBasedRoleRank } from '../libs/utils/mappers';

interface HarvestRequestStatus {
  number: 0 | 1 | 2;
  text: 'Diajukan' | 'Diproses' | 'Ditolak';
}

@Service()
export class HarvestRequestService {
  @Inject(DailyMonitoringDAO)
  private dailyMonitoringDAO: DailyMonitoringDAO;

  @Inject(HarvestRequestDAO)
  private dao: HarvestRequestDAO;

  @Inject(FarmingCycleDAO)
  private farmingCycleDAO: FarmingCycleDAO;

  @Inject(HarvestRequestSubmittedQueue)
  private harvestRequestSubmittedQueue: HarvestRequestSubmittedQueue;

  @Inject(HarvestRequestEditedQueue)
  private harvestRequestEditedQueue: HarvestRequestEditedQueue;

  @Inject(HarvestRequestApprovedQueue)
  private harvestRequestApprovedQueue: HarvestRequestApprovedQueue;

  @Inject(HarvestRequestRejectedQueue)
  private harvestRequestRejectedQueue: HarvestRequestRejectedQueue;

  async create(input: HarvestRequestInput, user: RequestUser): Promise<HarvestRequestList> {
    const queryRunner = await this.dao.startTransaction();

    try {
      const sumQuantity = input.harvestRequests.reduce<any>(
        (total, harvestRequest) => harvestRequest.quantity + total,
        0,
      );

      const farmingCycle = await this.farmingCycleDAO.getOneStrict({
        where: {
          id: input.harvestRequests[0].farmingCycleId,
        },
      });

      const curPopulation = await this.dailyMonitoringDAO.getRemainingPopulation(farmingCycle.id);

      if (sumQuantity > curPopulation + 0.02 * farmingCycle.initialPopulation) {
        throw ERR_HARVEST_REQUEST_QUANTITY(
          `${curPopulation + 0.02 * farmingCycle.initialPopulation} ekor`,
        );
      }

      const harvestRequests = await this.dao.createManyWithTx(
        input.harvestRequests.map<DeepPartial<HarvestRequest>>((harvestRequest) => ({
          farmingCycleId: harvestRequest.farmingCycleId,
          reason: harvestRequest.reason,
          minWeight: harvestRequest.minWeight,
          maxWeight: harvestRequest.maxWeight,
          quantity: harvestRequest.quantity,
          datePlanned: input.datePlanned,
        })),
        user,
        queryRunner,
      );

      await this.dao.commitTransaction(queryRunner);

      return harvestRequests.map((hr) => {
        const status = mapActivityStatusBasedRoleRank(
          user,
          this.harvestRequestStatus(hr),
          'HARVEST_REQUEST',
        );

        this.harvestRequestSubmittedQueue.addJob(hr);

        return {
          ...hr,
          status: status.number,
          statusText: status.text,
        };
      });
    } catch (error) {
      await this.dao.rollbackTransaction(queryRunner);

      throw error;
    }
  }

  async update(
    params: HarvestRequestDetailParams,
    input: HarvestRequestUpdate,
    user: RequestUser,
  ): Promise<HarvestRequestItem> {
    const queryRunner = await this.dao.startTransaction();

    try {
      const harvestRequest = await this.dao.getOneStrict({
        where: {
          id: params.harvestRequestId,
        },
      });

      const farmingCycle = await this.farmingCycleDAO.getOneStrict({
        where: {
          id: harvestRequest.farmingCycleId,
        },
      });

      const curPopulation = await this.dailyMonitoringDAO.getRemainingPopulation(farmingCycle.id);

      if (input.quantity > curPopulation + 0.02 * farmingCycle.initialPopulation) {
        throw ERR_HARVEST_REQUEST_QUANTITY(
          `${curPopulation + 0.02 * farmingCycle.initialPopulation} ekor`,
        );
      }

      const updatedHarvestRequest = await this.dao.updateOneWithTx(
        {
          id: harvestRequest.id,
        },
        {
          reason: input.reason,
          minWeight: input.minWeight,
          maxWeight: input.maxWeight,
          quantity: input.quantity,
          datePlanned: input.datePlanned,
        },
        user,
        queryRunner,
      );

      await this.dao.commitTransaction(queryRunner);

      const status = mapActivityStatusBasedRoleRank(
        user,
        this.harvestRequestStatus(updatedHarvestRequest),
        'HARVEST_REQUEST',
      );

      await this.harvestRequestEditedQueue.addJob(updatedHarvestRequest);

      return {
        ...updatedHarvestRequest,
        status: status.number,
        statusText: status.text,
      };
    } catch (error) {
      await this.dao.rollbackTransaction(queryRunner);

      throw error;
    }
  }

  async getHarvestRequestList(
    filter: HarvestRequestQueryString,
    user: RequestUser,
  ): Promise<HarvestRequestList> {
    const [harvestRequests] = await this.dao.getMany({
      where: {
        farmingCycleId: filter.farmingCycleId,
        isApproved: filter.isApproved || undefined,
        harvestDeals: {
          id: IsNull(),
        },
      },
      order: {
        createdDate: 'DESC',
      },
      relations: {
        harvestDeals: true,
      },
    });

    return harvestRequests.map((hr) => {
      const status = mapActivityStatusBasedRoleRank(
        user,
        this.harvestRequestStatus(hr),
        'HARVEST_REQUEST',
      );

      return {
        ...hr,
        status: status.number,
        statusText: status.text,
      };
    });
  }

  async getHarvestRequestDetail(
    params: HarvestRequestDetailParams,
    user: RequestUser,
  ): Promise<HarvestRequestItem> {
    const harvestRequest = await this.dao.getOneStrict({
      where: {
        id: params.harvestRequestId,
      },
      relations: {
        farmingCycle: {
          coop: true,
          farm: {
            branch: true,
          },
        },
        harvestDeals: true,
      },
    });

    let quantityLeftOver: number = 0;
    const hasDeal: boolean = harvestRequest.harvestDeals.length > 0;
    if (hasDeal) {
      const realizedQuantity = harvestRequest.harvestDeals.reduce(
        (acc, curr) => Number(acc) + Number(curr.quantity),
        0,
      );
      quantityLeftOver = Number(harvestRequest.quantity) - realizedQuantity;
    }

    const status = mapActivityStatusBasedRoleRank(
      user,
      this.harvestRequestStatus(harvestRequest),
      'HARVEST_REQUEST',
    );

    return {
      ...harvestRequest,
      status: status.number,
      statusText: status.text,
      addressName: harvestRequest.farmingCycle.farm.addressName || '',
      coopName: harvestRequest.farmingCycle.coop.coopName || '',
      quantityLeftOver,
      branchName: harvestRequest.farmingCycle.farm.branch?.name || '',
      branchCode: harvestRequest.farmingCycle.farm.branch?.code || '',
    };
  }

  async approveHarvestRequest(
    params: ApproveRejectHarvestRequestParams,
    input: ApproveRejectHarvestRequestBody,
    user: RequestUser,
  ): Promise<ApproveRejectHarvestRequestResponseItem> {
    const queryRunner = await this.dao.startTransaction();

    const approvedHR = await this.dao.getOneStrict({
      where: {
        id: params.harvestRequestId,
      },
      relations: {
        farmingCycle: true,
      },
    });

    const { farmingCycle } = approvedHR;

    if (approvedHR.approvedBy) {
      if (approvedHR.isApproved) {
        throw ERR_HARVEST_REQUEST_ALREADY_APPROVED();
      } else {
        throw ERR_HARVEST_REQUEST_ALREADY_REJECTED();
      }
    }

    try {
      const updatedHR = await this.dao.updateOneWithTx(
        {
          id: params.harvestRequestId,
        },
        {
          isApproved: true,
          approvedBy: user.id,
          approvalRemarks: input.approvalRemarks,
        },
        user,
        queryRunner,
      );

      await this.dao.commitTransaction(queryRunner);

      await this.harvestRequestApprovedQueue.addJob({
        ...updatedHR,
        farmingCycleCode: farmingCycle.farmingCycleCode,
      });

      return updatedHR;
    } catch (error) {
      await this.dao.rollbackTransaction(queryRunner);

      throw error;
    }
  }

  async rejectHarvestRequest(
    params: ApproveRejectHarvestRequestParams,
    input: ApproveRejectHarvestRequestBody,
    user: RequestUser,
  ): Promise<ApproveRejectHarvestRequestResponseItem> {
    const queryRunner = await this.dao.startTransaction();

    const existingHR = await this.dao.getOneStrict({
      where: {
        id: params.harvestRequestId,
      },
    });

    if (existingHR.approvedBy) {
      if (existingHR.isApproved) {
        throw ERR_HARVEST_REQUEST_ALREADY_APPROVED();
      } else {
        throw ERR_HARVEST_REQUEST_ALREADY_REJECTED();
      }
    }

    try {
      const rejectedHR = await this.dao.updateOneWithTx(
        {
          id: params.harvestRequestId,
        },
        {
          isApproved: false,
          approvedBy: user.id,
          approvalRemarks: input.approvalRemarks,
        },
        user,
        queryRunner,
      );

      await this.dao.commitTransaction(queryRunner);

      await this.harvestRequestRejectedQueue.addJob(rejectedHR);

      return rejectedHR;
    } catch (error) {
      await this.dao.rollbackTransaction(queryRunner);

      throw error;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  private harvestRequestStatus(hr: HarvestRequest): HarvestRequestStatus {
    if (!hr.isApproved && !hr.approvedBy) {
      return { number: 0, text: 'Diajukan' };
    }

    if (hr.isApproved) {
      return { number: 1, text: 'Diproses' };
    }

    if (!hr.isApproved && hr.approvedBy) {
      return { number: 2, text: 'Ditolak' };
    }

    throw ERR_HARVEST_REQUEST_MALFORMED(hr.id);
  }
}
