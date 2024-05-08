import { formatInTimeZone } from 'date-fns-tz';
import { Inject, Service } from 'fastify-decorators';
import { DataVerificationGamificationDAO } from '../dao/dataVerificationGamification.dao';
import { FarmingCycleChickStockDDAO } from '../dao/farmingCycleChickStockD.dao';
import { FarmingCycleGamificationPointDAO } from '../dao/farmingCycleGamificationPoint.dao';
import { FarmingCycleTaskTriggerDDAO } from '../dao/farmingCycleTaskTriggerD.dao';
import { GamificationPointHistoryDAO } from '../dao/gamificationPointHistory.dao';
import { TaskTicketDDAO } from '../dao/taskTicketD.dao';
import { VariableDAO } from '../dao/variable.dao';
import { FarmingCycleGamificationPoint } from '../datasources/entity/pgsql/FarmingCycleGamificationPoint.entity';
import {
  GamificationCoopPointHistoryList,
  GamificationPointHistoryList,
  GamificationPointSummary,
} from '../dto/gamification.dto';
import { DATETIME_SQL_FORMAT, DEFAULT_TIME_ZONE } from '../libs/constants';
import { VAR_ABW_CODE, VAR_FEED_CON_CODE } from '../libs/constants/variableCodes';
import { assignLevelAndTarget, pointLevelling } from '../libs/utils/gamification';

@Service()
export class GamificationService {
  @Inject(FarmingCycleGamificationPointDAO)
  private fcgPointDAO: FarmingCycleGamificationPointDAO;

  @Inject(GamificationPointHistoryDAO)
  private pointHistoryDAO: GamificationPointHistoryDAO;

  @Inject(FarmingCycleTaskTriggerDDAO)
  private farmingCycleTaskTriggerDDao: FarmingCycleTaskTriggerDDAO;

  @Inject(FarmingCycleChickStockDDAO)
  private farmingCycleChickStockDDAO: FarmingCycleChickStockDDAO;

  @Inject(TaskTicketDDAO)
  private taskTicketDDAO: TaskTicketDDAO;

  @Inject(VariableDAO)
  private variableDAO: VariableDAO;

  @Inject(DataVerificationGamificationDAO)
  private dataVerificationDAO: DataVerificationGamificationDAO;

  private MAX_LEVEL = 5;

  async getCurrentPointSummaryByFarmingCycle(
    farmingCycleId: string,
  ): Promise<GamificationPointSummary> {
    const [fcgPoint, ipPrediction] = await Promise.all([
      await this.fcgPointDAO.getOne({
        where: {
          farmingCycleId,
        },
      }),
      this.getIpPrediction(farmingCycleId),
    ]);

    const levelPoints = pointLevelling(fcgPoint.potentialPoints);

    const [currentLevel, currentTargetPoint] = assignLevelAndTarget(
      fcgPoint.currentPoints,
      levelPoints,
    );

    return {
      targetMaxPoint: fcgPoint.potentialPoints,
      currentTargetLevel: (currentLevel + 1) % this.MAX_LEVEL,
      currentTargetPoint,
      currentPoint: fcgPoint.currentPoints,
      currentLevel,
      ipPrediction,
    };
  }

  async getPointHistoryByFarmingCycle(
    farmingCycleId: string,
    date?: string,
  ): Promise<GamificationPointHistoryList> {
    const history = await this.pointHistoryDAO.getFarmingCyclePointHistory(
      farmingCycleId,
      date ? new Date(date) : undefined,
    );

    return history.map((h) => ({
      taskName: h.taskTicket.taskName,
      pointEarned: h.earnedPoints,
    }));
  }

  async getCoopPointHistoryByFarmingCycle(
    farmingCycleId: string,
  ): Promise<GamificationCoopPointHistoryList> {
    const fcgPoints = await this.fcgPointDAO.getManyWithPreviousSameCoop(farmingCycleId);

    const createHistoryItem = async (fcgp: FarmingCycleGamificationPoint) => ({
      farmingCycleCode: fcgp.farmingCycle.farmingCycleCode,
      chickInDate: formatInTimeZone(
        fcgp.farmingCycle.farmingCycleStartDate,
        DEFAULT_TIME_ZONE,
        DATETIME_SQL_FORMAT,
      ),
      totalPoint: fcgp.currentPoints,
      correctnessPercentage: await this.dataVerificationDAO.getCorrectionPercentageByFarmingCycle(
        fcgp.farmingCycleId,
      ),
    });

    const response = await Promise.all(fcgPoints.map((fcgp) => createHistoryItem(fcgp)));

    return response;
  }

  private async getIpPrediction(farmingCycleId: string): Promise<number> {
    const [
      projectedDayNum,
      mortalityToday,
      totalAdditionToDate,
      totalReductionToDate,
      weightVariable,
      feedConsumptionVariable,
    ] = await Promise.all([
      this.farmingCycleTaskTriggerDDao.getFarmingCycleLastDay(farmingCycleId),
      this.farmingCycleChickStockDDAO.getTotalMortalityToday(farmingCycleId),
      this.farmingCycleChickStockDDAO.getTotalAdditionToDate(farmingCycleId),
      this.farmingCycleChickStockDDAO.getTotalReductionToDate(farmingCycleId),
      this.variableDAO.getOneStrict({
        where: {
          variableCode: VAR_ABW_CODE,
        },
      }),
      this.variableDAO.getOneStrict({
        where: {
          variableCode: VAR_FEED_CON_CODE,
        },
      }),
    ]);

    const [feedConsumptionSumToDate, weight] = await Promise.all([
      this.taskTicketDDAO.getLatestSum(feedConsumptionVariable.id, farmingCycleId),
      this.taskTicketDDAO.getLatestValue(weightVariable.id, farmingCycleId),
    ]);

    const currentMortalityPercentage =
      totalAdditionToDate - totalReductionToDate === 0
        ? 0
        : mortalityToday / (totalAdditionToDate - totalReductionToDate);

    const currentFeedConsumption =
      totalAdditionToDate - totalReductionToDate === 0
        ? 0
        : ((feedConsumptionSumToDate * 50) / (totalAdditionToDate - totalReductionToDate)) * 1000;

    const currentFcr = currentFeedConsumption / Number(weight?.dataValue);

    const ipProjection =
      currentFcr === 0 || Number.isNaN(currentFcr)
        ? 0
        : (((100 - currentMortalityPercentage * 100) * (Number(weight?.dataValue) / 1000)) /
            (projectedDayNum * currentFcr)) *
          100;

    return ipProjection;
  }
}
