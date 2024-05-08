import { differenceInDays, format, isAfter, isBefore } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';
import { Inject, Service } from 'fastify-decorators';
import { DeepPartial } from 'typeorm';
import { DailyMonitoringDAO } from '../dao/dailyMonitoring.dao';
import { FarmingCycleDAO } from '../dao/farmingCycle.dao';
import { FarmingCycleChickStockDDAO } from '../dao/farmingCycleChickStockD.dao';
import { RepopulationDAO } from '../dao/repopulation.dao';
import { FarmingCycleChickStockD } from '../datasources/entity/pgsql/FarmingCycleChickStockD.entity';
import { Repopulation } from '../datasources/entity/pgsql/Repopulation.entity';
import {
  CreateRepopulationBody,
  GetRepopulationsQuery,
  RepopulationFarmingCycle,
  RepopulationItem,
} from '../dto/repopulation.dto';
import { CalculateDailyMonitoringQueue } from '../jobs/queues/calculate-daily-monitoring.queue';
import { RepopulationCreatedQueue } from '../jobs/queues/repopulation-created.queue';
import { DATE_SQL_FORMAT, DEFAULT_TIME_ZONE, FC_FARMING_STATUS } from '../libs/constants';
import {
  ERR_FARM_CYCLE_REPOPULATE_APPROVED_AMOUNT,
  ERR_FARM_CYCLE_REPOPULATE_INVALID_DATE,
} from '../libs/constants/errors';
import { RequestUser } from '../libs/types/index.d';

@Service()
export class RepopulationService {
  @Inject(RepopulationDAO)
  private dao!: RepopulationDAO;

  @Inject(FarmingCycleDAO)
  private farmingCycleDAO!: FarmingCycleDAO;

  @Inject(FarmingCycleChickStockDDAO)
  private farmingCycleChickStockDDAO!: FarmingCycleChickStockDDAO;

  @Inject(DailyMonitoringDAO)
  private dailyMonitoringDAO!: DailyMonitoringDAO;

  @Inject(RepopulationCreatedQueue)
  private repopulationCreatedQueue!: RepopulationCreatedQueue;

  @Inject(CalculateDailyMonitoringQueue)
  private calculateDailyMonitoringQueue!: CalculateDailyMonitoringQueue;

  async get(filter: GetRepopulationsQuery): Promise<[Repopulation[], number]> {
    const limit = (filter.$limit && filter.$limit > 0 && filter.$limit) || undefined;
    const skip =
      limit && filter.$page !== undefined && filter.$page > 0 ? (filter.$page - 1) * limit : 0;

    return this.dao.getMany({
      skip,
      take: limit,
    });
  }

  async getById(id: string): Promise<Repopulation> {
    return this.dao.getOneStrict({
      where: {
        id,
      },
    });
  }

  async getByFarmingCycleId(farmingCycleId: string): Promise<[RepopulationFarmingCycle[], number]> {
    const farmingCycle = await this.farmingCycleDAO.getOneStrict({ where: { id: farmingCycleId } });

    const [repopulations, count] = await this.dao.getMany({
      where: { farmingCycleId },
      take: 50,
      order: {
        repopulateDate: 'ASC',
      },
    });

    if (count === 0) return [[], 0];

    const originalPopulation: number = this.calculateOriginalPopulations(
      farmingCycle.initialPopulation,
      repopulations,
    );

    let initialPopulationHistorical: number = originalPopulation;

    const repopulateFarmingCycle: RepopulationFarmingCycle[] = [];

    repopulations.forEach((elm) => {
      const adjustedPopulation = initialPopulationHistorical - Number(elm.approvedAmount);

      repopulateFarmingCycle.push({
        id: elm.id,
        approvedAmount: elm.approvedAmount,
        repopulateDate: format(new Date(elm.repopulateDate), DATE_SQL_FORMAT),
        repopulateDay: elm.repopulateDay,
        repopulateReason: elm.repopulateReason,
        newFarmingCycleStartDate: format(new Date(elm.repopulateDate), DATE_SQL_FORMAT),
        newInitialPopulation: adjustedPopulation,
        initialPopulation: originalPopulation,
      });

      initialPopulationHistorical = adjustedPopulation;
    });

    return [repopulateFarmingCycle, count];
  }

  async create(
    farmingCycleId: string,
    data: CreateRepopulationBody,
    user: RequestUser,
  ): Promise<RepopulationItem> {
    const queryRunner = await this.dao.startTransaction();

    try {
      const farmingCycle = await this.farmingCycleDAO.getOneStrict({
        where: {
          id: farmingCycleId,
          farmingStatus: FC_FARMING_STATUS.IN_PROGRESS,
        },
      });

      const repopulateDate = new Date(data.repopulateDate);
      this.validateRepopulateDate(repopulateDate, farmingCycle.farmingCycleStartDate);

      const dataMonitoring = await this.dailyMonitoringDAO.getOneStrict({
        where: {
          farmingCycleId,
        },
        order: {
          date: 'DESC',
        },
      });

      const populationMortaled = dataMonitoring?.populationMortaled || 0;
      if (data.approvedAmount > populationMortaled) {
        throw ERR_FARM_CYCLE_REPOPULATE_APPROVED_AMOUNT(`: ${populationMortaled}`);
      }

      const payload: DeepPartial<Repopulation> = {
        ...data,
        repopulateDate,
        repopulateDay: Math.abs(
          differenceInDays(farmingCycle.farmingCycleStartDate, repopulateDate),
        ),
        farmingCycleId: farmingCycle.id,
      };

      const repopulationData = await this.dao.createOneWithTx(payload, user, queryRunner);

      await this.farmingCycleDAO.updateOneWithTx(
        { id: farmingCycleId },
        { initialPopulation: farmingCycle.initialPopulation - data.approvedAmount },
        user,
        queryRunner,
      );

      const farmingCycleChickStockDPayload: DeepPartial<FarmingCycleChickStockD> = {
        farmingCycleId: farmingCycle.id,
        userId: user.id,
        transactionDate: farmingCycle.farmingCycleStartDate,
        operator: '+',
        qty: farmingCycle.initialPopulation - data.approvedAmount,
        notes: 'Initial Population',
      };

      await this.farmingCycleChickStockDDAO.upsertOneWithTx(
        { farmingCycleId, notes: 'Initial Population' },
        farmingCycleChickStockDPayload,
        user,
        queryRunner,
      );

      await this.dao.commitTransaction(queryRunner);

      await this.repopulationCreatedQueue.addJob({
        ...repopulationData,
        farmingCycle,
        farmingCycleCode: farmingCycle.farmingCycleCode,
      });

      const defaultTaskTicket = await this.dailyMonitoringDAO.getOne({
        where: {
          farmingCycleId,
        },
        order: {
          day: 'ASC',
        },
      });

      if (defaultTaskTicket) {
        await this.calculateDailyMonitoringQueue.addJob({
          farmingCycleId,
          farmingCycleCode: farmingCycle.farmingCycleCode,
          taskTicketId: defaultTaskTicket.taskTicketId || undefined,
          date: defaultTaskTicket.date,
        });
      }

      return {
        id: repopulationData.id,
        approvedAmount: repopulationData.approvedAmount,
        repopulateDate: repopulationData.repopulateDate.toISOString(),
        repopulateDay: repopulationData.repopulateDay,
        repopulateReason: repopulationData.repopulateReason,
      };
    } catch (error) {
      await this.dao.rollbackTransaction(queryRunner);

      throw error;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  private validateRepopulateDate(repopulateDate: Date, farmingCycleStartDate: Date): void {
    if (
      isAfter(
        zonedTimeToUtc(repopulateDate, DEFAULT_TIME_ZONE),
        zonedTimeToUtc(new Date(), DEFAULT_TIME_ZONE),
      )
    ) {
      throw ERR_FARM_CYCLE_REPOPULATE_INVALID_DATE();
    }

    if (
      isBefore(
        zonedTimeToUtc(repopulateDate, DEFAULT_TIME_ZONE),
        zonedTimeToUtc(farmingCycleStartDate, DEFAULT_TIME_ZONE),
      )
    ) {
      throw ERR_FARM_CYCLE_REPOPULATE_INVALID_DATE();
    }
  }

  // eslint-disable-next-line class-methods-use-this
  calculateOriginalPopulations(currentPopulation: number, repopulations: Repopulation[]): number {
    let originalPopulation = currentPopulation;

    if (repopulations.length === 0) {
      return originalPopulation;
    }

    repopulations.forEach((elm) => {
      originalPopulation += Number(elm.approvedAmount);
    });

    return originalPopulation;
  }
}
