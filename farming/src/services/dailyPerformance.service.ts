import { format } from 'date-fns-tz';
import { Inject, Service } from 'fastify-decorators';
import { DeepPartial, In, IsNull, Not, QueryRunner } from 'typeorm';
import { CoopMemberDDAO } from '../dao/coopMemberD.dao';
import { DailyMonitoringDAO } from '../dao/dailyMonitoring.dao';
import { DailyPerformanceDDAO } from '../dao/dailyPerformanceD.dao';
import { FarmingCycleDAO } from '../dao/farmingCycle.dao';
import { TaskTicketDAO } from '../dao/taskTicket.dao';
import { VariableDAO } from '../dao/variable.dao';
import { CoopMemberD } from '../datasources/entity/pgsql/CoopMemberD.entity';
import { DailyMonitoring } from '../datasources/entity/pgsql/DailyMonitoring.entity';
import { DailyPerformanceD } from '../datasources/entity/pgsql/DailyPerformanceD.entity';
import { FarmingCycle } from '../datasources/entity/pgsql/FarmingCycle.entity';
import { TaskTicket } from '../datasources/entity/pgsql/TaskTicket.entity';
import { User } from '../datasources/entity/pgsql/User.entity';
import {
  GetDailyPerformanceDetailItem,
  GetDailyPerformanceQuery,
  SaveDailyPerformanceDetailItem,
  SaveDailyPerformanceIssuesAndSummary,
} from '../dto/dailyPerformance.dto';
import { DailyPerformanceMonitoringItem } from '../dto/farmingCycle.dto';
import { DATE_SQL_FORMAT, USER_TYPE } from '../libs/constants';
import {
  VAR_ABW_CODE,
  VAR_AVG_WEIGHT_DOC_CODE,
  VAR_CULLED_CODE,
  VAR_DEAD_CHICK_CODE,
  VAR_FEED_CON_CODE,
  VAR_MOHA_CODE,
  VAR_YELLOW_CARD,
} from '../libs/constants/variableCodes';
import { Transactional } from '../libs/decorators/transactional';
import { RequestUser } from '../libs/types/index.d';
import { uomConverter } from '../libs/utils/helpers';

@Service()
export class DailyPerformanceService {
  @Inject(FarmingCycleDAO)
  private farmingCycleDAO: FarmingCycleDAO;

  @Inject(DailyPerformanceDDAO)
  private dailyPerformanceDDAO: DailyPerformanceDDAO;

  @Inject(DailyMonitoringDAO)
  private dailyMonitoringDAO: DailyMonitoringDAO;

  @Inject(CoopMemberDDAO)
  private coopMemberDDAO: CoopMemberDDAO;

  @Inject(TaskTicketDAO)
  private taskTicketDAO: TaskTicketDAO;

  @Inject(VariableDAO)
  private variableDAO: VariableDAO;

  async getMany(filter: GetDailyPerformanceQuery): Promise<[FarmingCycle[], number]> {
    const [farmingCycles, count] = await this.farmingCycleDAO.getDailyPerformanceWithSummary(
      filter,
    );

    // fetch PPL
    const keyFormat = (coopMember: CoopMemberD) => coopMember.coopId;
    const mappedPplMember = await this.coopMemberDDAO.getMappedManyByKey(
      {
        where: {
          coopId: In(farmingCycles.map((fc) => fc.coopId)),
          isLeader: false,
          user: {
            userType: USER_TYPE.PPL,
          },
        },
        relations: {
          user: true,
        },
      },
      keyFormat,
    );

    const dailyPerformances = await this.dailyPerformanceDDAO.getLatestDistict(
      farmingCycles.map((fc) => fc.id),
    );

    return [
      farmingCycles.map((item) => {
        const pplMembers = mappedPplMember.get(item.coopId);
        let userPpl: User | undefined = new User();
        if (pplMembers && pplMembers.length > 0) {
          userPpl = pplMembers[0].user;
        } else {
          userPpl = undefined;
        }

        return {
          ...item,
          userPpl: userPpl || item.userPpl || {},
          summary: (dailyPerformances.get(item.id) && [dailyPerformances.get(item.id)!]) || [],
        };
      }),
      count,
    ];
  }

  /**
   * bulkSave bulk save data into table t_dailyperformance_d and issues
   * @param farmingCycleId
   * @param items input items
   * @author adam firdaus
   */
  async bulkSave(
    user: RequestUser,
    farmingCycleId: string,
    items: SaveDailyPerformanceDetailItem[],
  ): Promise<DailyPerformanceD[]> {
    const keyFormatter = (item: DeepPartial<DailyMonitoring>) =>
      `${item.farmingCycleId}-${item.taskTicketId}`;
    const mappedDailyMonitoring = await this.dailyMonitoringDAO.getMappedByKey(
      {
        where: {
          taskTicketId: In(items.map<string>((item) => item.taskTicketId)),
        },
      },
      keyFormatter,
    );
    const existingDailyPerformances = await this.dailyPerformanceDDAO.getMappedByDay({
      where: {
        farmingCycleId,
      },
    });

    const dailyPerformances = await this.dailyPerformanceDDAO.upsertMany(
      user,
      items.map<DeepPartial<DailyPerformanceD>>((item) => {
        const dailyMonitoring = mappedDailyMonitoring.get(
          keyFormatter({
            farmingCycleId,
            taskTicketId: item.taskTicketId,
          }),
        );

        const day = Number(dailyMonitoring?.day);

        return {
          id: item.dailyPerformanceId || existingDailyPerformances.get(day)?.id || undefined,
          farmingCycleId,
          day,
          summary: item.summary || undefined,
          infrastructureIssues:
            item.issues.infrastructure.length > 0 ? item.issues.infrastructure.join(',') : null,
          managementIssues:
            item.issues.management.length > 0 ? item.issues.management.join(',') : null,
          farmInputIssues:
            item.issues.farmInput.length > 0 ? item.issues.farmInput.join(',') : null,
          diseaseIssues: item.issues.diseases.length > 0 ? item.issues.diseases.join(',') : null,
          forceMajeureIssues:
            item.issues.forceMajeure.length > 0 ? item.issues.forceMajeure.join(',') : null,
          otherIssues: item.issues.others || undefined,
          treatment: item.treatment.length > 0 ? item.treatment.join(',') : null,
        };
      }),
    );

    return dailyPerformances;
  }

  /**
   * save save issues and summary into table t_dailyperformance_d and issues
   * @param taskTicketId
   * @param items input items
   * @author adam firdaus
   */
  async saveIssuesAndSummary(
    user: RequestUser,
    farmingCycleId: string,
    taskTicketId: string,
    item: SaveDailyPerformanceIssuesAndSummary,
  ): Promise<DailyPerformanceD> {
    const dailyMonitoring = await this.dailyMonitoringDAO.getOneStrict({
      where: {
        taskTicketId,
      },
    });

    const day = Number(dailyMonitoring.day);

    const existingDailyPerformance = await this.dailyPerformanceDDAO.getOne({
      where: {
        farmingCycleId,
        day,
      },
    });

    const dailyPerformances = await this.dailyPerformanceDDAO.upsertMany(user, [
      {
        id: existingDailyPerformance?.id || undefined,
        farmingCycleId,
        day,
        summary: item.summary || undefined,
        infrastructureIssues:
          item.issues && item.issues.infrastructure.length > 0
            ? item.issues.infrastructure.join(',')
            : null,
        managementIssues:
          item.issues && item.issues.management.length > 0
            ? item.issues.management.join(',')
            : null,
        farmInputIssues:
          item.issues && item.issues.farmInput.length > 0 ? item.issues.farmInput.join(',') : null,
        diseaseIssues:
          item.issues && item.issues.diseases.length > 0 ? item.issues.diseases.join(',') : null,
        forceMajeureIssues:
          item.issues && item.issues.forceMajeure.length > 0
            ? item.issues.forceMajeure.join(',')
            : null,
        treatment: item.treatment && item.treatment.length > 0 ? item.treatment.join(',') : null,
        otherIssues: item.issues?.others,
      },
    ]);

    return dailyPerformances[0];
  }

  /**
   * save save issues and summary into table t_dailyperformance_d and issues
   * @param taskTicketId
   * @param items input items
   * @author adam firdaus
   */
  @Transactional()
  async saveIssuesAndSummaryV2(
    user: RequestUser,
    dailyMonitoring: DailyMonitoring,
    item: Partial<SaveDailyPerformanceIssuesAndSummary>,
    queryRunner: QueryRunner,
  ): Promise<DailyPerformanceD> {
    const day = Number(dailyMonitoring.day);

    const existingDailyPerformance = await this.dailyPerformanceDDAO.getOne({
      where: {
        farmingCycleId: dailyMonitoring.farmingCycleId,
        day,
      },
    });

    const dailyPerformances = await this.dailyPerformanceDDAO.upsertMany(
      user,
      [
        {
          id: existingDailyPerformance?.id || undefined,
          farmingCycleId: dailyMonitoring.farmingCycleId,
          day,
          summary: item.summary || undefined,
          infrastructureIssues:
            item.issues && item.issues.infrastructure.length > 0
              ? item.issues.infrastructure.join(',')
              : null,
          managementIssues:
            item.issues && item.issues.management.length > 0
              ? item.issues.management.join(',')
              : null,
          farmInputIssues:
            item.issues && item.issues.farmInput.length > 0
              ? item.issues.farmInput.join(',')
              : null,
          diseaseIssues:
            item.issues && item.issues.diseases.length > 0 ? item.issues.diseases.join(',') : null,
          forceMajeureIssues:
            item.issues && item.issues.forceMajeure.length > 0
              ? item.issues.forceMajeure.join(',')
              : null,
          otherIssues: item.issues?.others,
          treatment: item.treatment && item.treatment.length > 0 ? item.treatment.join(',') : null,
        },
      ],
      queryRunner,
    );

    return dailyPerformances[0];
  }

  /**
   * getDailyPerformanceDetails return array of daily performance detail item
   * @param farmingCycleId
   * @returns Promise<GetDailyPerformanceDetailItem[]>
   * @author adam firdaus
   */
  async getDailyPerformanceDetails(
    dailyMonitorings: DailyPerformanceMonitoringItem[],
    farmingCycleId: string,
  ): Promise<GetDailyPerformanceDetailItem[]> {
    if (dailyMonitorings.length === 0) return [];

    const taskTicketIds = dailyMonitorings.reduce<string[]>((prev, item) => {
      if (item.taskTicketId) {
        prev.push(item.taskTicketId);
      }
      return prev;
    }, [] as string[]);

    const [variables, [taskTickets], mappedDailyPerformance] = await Promise.all([
      this.variableDAO.getMappedByCode([
        VAR_ABW_CODE,
        VAR_AVG_WEIGHT_DOC_CODE,
        VAR_CULLED_CODE,
        VAR_DEAD_CHICK_CODE,
        VAR_FEED_CON_CODE,
        VAR_MOHA_CODE,
        VAR_YELLOW_CARD,
      ]),
      (taskTicketIds.length &&
        this.taskTicketDAO.getMany({
          where: {
            id: In(taskTicketIds),
          },
          relations: {
            details: {
              photos: true,
            },
            feedStocks: true,
            ovkStocks: true,
          },
        })) || [undefined],
      this.dailyPerformanceDDAO.getMappedByDay({
        where: {
          farmingCycleId,
        },
      }),
    ]);

    const mappedTaskTickets = new Map<string, TaskTicket>();

    if (taskTickets) {
      taskTickets.forEach((item) => {
        mappedTaskTickets.set(format(item.reportedDate, DATE_SQL_FORMAT), item);
      });
    }

    const [bwDOC] = await Promise.all([
      this.taskTicketDAO.getOne({
        where: {
          farmingCycleId,
          details: {
            variableId: variables.get(VAR_AVG_WEIGHT_DOC_CODE)!.id,
            dataValue: Not(IsNull()),
          },
        },
        relations: {
          details: {
            variable: true,
          },
        },
      }),
    ]);

    const bwDOCValue =
      (bwDOC &&
        bwDOC.details.length > 0 &&
        bwDOC.details[0].dataValue &&
        parseFloat(bwDOC.details[0].dataValue)) ||
      0;

    const sortedDailyMonitorings = dailyMonitorings.sort((a, b) => a.day - b.day);

    const details: GetDailyPerformanceDetailItem[] = [];

    let firstTargetBw = 0;

    for (let i = 0; i < sortedDailyMonitorings.length; i += 1) {
      const item = sortedDailyMonitorings[i];
      const prevItem = i > 0 ? sortedDailyMonitorings[i - 1] : null;

      if (item.day === 1) {
        firstTargetBw = item.bw.standard || 0;
      }

      const growth = {
        actual: (bwDOCValue && item.bw.actual && item.bw.actual / bwDOCValue) || 0,
        standard: firstTargetBw && item.bw.standard ? item.bw.standard / firstTargetBw : 0,
      };

      const dead =
        item.mortalities?.reduce((prev, item) => prev + item.quantity, 0) ||
        parseInt(
          mappedTaskTickets
            .get(item.date)
            ?.details.find((val) => val.variableId === variables.get(VAR_DEAD_CHICK_CODE)!.id)
            ?.dataValue || '',
          10,
        );

      const culled =
        item.cull ||
        parseInt(
          mappedTaskTickets
            .get(item.date)
            ?.details.find((val) => val.variableId === variables.get(VAR_CULLED_CODE)!.id)
            ?.dataValue || '',
          10,
        );

      const feed =
        item.feed.consumption ||
        parseFloat(
          mappedTaskTickets
            .get(item.date)
            ?.details.find((val) => val.variableId === variables.get(VAR_FEED_CON_CODE)!.id)
            ?.dataValue || '',
        );

      const bw =
        item.bw.actual ||
        parseInt(
          mappedTaskTickets
            .get(item.date)
            ?.details.find((val) => val.variableId === variables.get(VAR_ABW_CODE)!.id)
            ?.dataValue || '',
          10,
        );

      const yellowCardImages =
        (item.recordingImage && [
          {
            id: '',
            imageUrl: item.recordingImage,
          },
        ]) ||
        mappedTaskTickets
          .get(item.date)
          ?.details.find((val) => val.variableId === variables.get(VAR_YELLOW_CARD)!.id)?.photos ||
        null;

      const feedConsumption = {
        actual: !Number.isNaN(feed) ? feed : null,
        standard:
          item.feedIntake.standard && item.population.remaining
            ? Math.round(
                uomConverter(
                  item.feedIntake.standard * item.population.remaining,
                  'gram',
                  'karung',
                ),
              )
            : null,
      };

      const feedConsumptionDetails = (
        item.feedStocks ||
        mappedTaskTickets.get(item.date)?.feedStocks ||
        []
      )
        .map((fs) => {
          const [subcategoryCode = '', subcategoryName = '', productCode = '', productName = ''] = (
            fs.productDetail || ''
          ).split(':');

          const notesSplit = fs.notes?.split('fc_feedstock_summary_id:') || [];
          const feedStockSummaryId = notesSplit.length > 1 ? notesSplit[1] : undefined;
          return {
            farmingCycleFeedStockId: fs.id,
            subcategoryCode,
            subcategoryName,
            productCode,
            productName,
            quantity: fs.qty,
            feedStockSummaryId,
            uom: 'karung',
          };
        })
        .filter(
          (val) =>
            val.subcategoryCode !== '' &&
            val.subcategoryName !== '' &&
            val.productCode !== '' &&
            val.productName !== '',
        );

      const ovkConsumptionDetails = (
        item.ovkStocks ||
        mappedTaskTickets.get(item.date)?.ovkStocks ||
        []
      )
        .map((ovkStock) => {
          const notesSplit = ovkStock.notes?.split('fc_ovkstock_summary_id:') || [];
          const ovkStockSummaryId = notesSplit.length > 1 ? notesSplit[1] : undefined;

          return {
            farmingCycleOvkStockId: ovkStock.id,
            subcategoryCode: ovkStock.subcategoryCode,
            subcategoryName: ovkStock.subcategoryName,
            productCode: ovkStock.productCode,
            productName: ovkStock.productName,
            quantity: ovkStock.quantity,
            uom: ovkStock.uom || '',
            ovkSummaryId: ovkStockSummaryId,
          };
        })
        .filter(
          (val) =>
            val.subcategoryCode !== '' &&
            val.subcategoryName !== '' &&
            val.productCode !== '' &&
            val.productName !== '',
        );

      const dailyHarvest =
        item.population.harvested && typeof prevItem?.population.harvested === 'number'
          ? item.population.harvested - prevItem.population.harvested
          : 0;

      details.push({
        taskTicketId: item.taskTicketId,
        dailyPerformanceId: mappedDailyPerformance.get(item.day)?.id || null,
        date: item.date,
        day: item.day,
        status: item.reportStatus,
        yellowCardImages:
          yellowCardImages?.map((val) => ({
            id: val.id,
            url: val.imageUrl,
          })) || null,
        feed: !Number.isNaN(feed) ? feed : null,
        dead: !Number.isNaN(dead) ? dead : null,
        culled: !Number.isNaN(culled) ? culled : null,
        summary: mappedDailyPerformance.get(item.day)?.summary || null,
        bw: {
          actual: !Number.isNaN(bw) ? bw : null,
          standard: item.bw.standard,
        },
        bwPrediction: {
          actual: item.bwPrediction?.actual || 0,
          status: item.bwPrediction?.status,
        },
        adg: item.adg,
        growth,
        mortality: item.mortality,
        mortalityCummulative: item.mortalityCummulative,
        population: {
          ...item.population,
          dead: item.population.mortality,
          dailyHarvest,
        },
        feedIntake: item.feedIntake,
        feedConsumption,
        feedConsumptionDetails,
        ovkConsumptionDetails,
        fcr: item.fcr,
        ip: item.ip,
        issues: {
          infrastructure:
            mappedDailyPerformance.get(item.day)?.infrastructureIssues?.split(',') || [],
          diseases: mappedDailyPerformance.get(item.day)?.diseaseIssues?.split(',') || [],
          farmInput: mappedDailyPerformance.get(item.day)?.farmInputIssues?.split(',') || [],
          forceMajeure: mappedDailyPerformance.get(item.day)?.forceMajeureIssues?.split(',') || [],
          management: mappedDailyPerformance.get(item.day)?.managementIssues?.split(',') || [],
          others: mappedDailyPerformance.get(item.day)?.otherIssues || null,
        },
        treatment: mappedDailyPerformance.get(item.day)?.treatment?.split(',') || [],
        hdp: item.hdp,
        eggWeight: item.eggWeight,
        eggMass: item.eggMass,
      });
    }

    return details;
  }
}
