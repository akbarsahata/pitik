/* eslint-disable class-methods-use-this */
import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { Inject, Service } from 'fastify-decorators';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { DailyMonitoring } from '../datasources/entity/pgsql/DailyMonitoring.entity';
import { DailyMonitoringRevisionStatusEnum } from '../datasources/entity/pgsql/DailyMonitoringRevision.entity';
import { FarmChickCategory } from '../datasources/entity/pgsql/Farm.entity';
import { TaskTicket } from '../datasources/entity/pgsql/TaskTicket.entity';
import {
  GetDailyReportResponseItem,
  RequestDailyMonitoringRevisionBody,
  SubmitDailyReportBody,
  SubmitDailyReportResponseItem,
} from '../dto/farmingCycle.dto';
import { TaskSourceEnum } from '../dto/task.dto';
import { CalculateDailyMonitoringQueue } from '../jobs/queues/calculate-daily-monitoring.queue';
import { DailyMonitoringUpsertOdooQueue } from '../jobs/queues/daily-monitoring-upsert-odoo.queue';
import { DailyReportRevisionRequestedQueue } from '../jobs/queues/daily-report-revision-requested.queue';
import {
  TaskTicketDetailUpdatedJobData,
  TaskTicketDetailUpdatedQueue,
} from '../jobs/queues/task-ticket-detail-updated.queue';
import {
  DAILY_MONITORING_STATUS_ENUM,
  DATE_SQL_FORMAT,
  DEFAULT_TIME_ZONE,
  USER_TYPE,
} from '../libs/constants';
import {
  ERR_DAILY_MONITORING_MORTALITY_NOT_MATCH,
  ERR_DAILY_MONITORING_REVISION_ALREADY_EXISTS,
  ERR_DAILY_MONITORING_REVISION_REQUEST_NOT_ALLOWED,
  ERR_SUBMIT_DAILY_REPORT_NOT_ALLOWED,
} from '../libs/constants/errors';
import { RequestUser } from '../libs/types/index.d';
import { DailyMonitoringService } from '../services/dailyMonitoring.service';
import { DailyPerformanceService } from '../services/dailyPerformance.service';
import { FarmingCycleService } from '../services/farmingCycle.service';
import { HarvestEggService } from '../services/layer/harvestEgg.service';
import { SensorService } from '../services/sensor.service';

@Service()
export class FarmingCycleUsecase {
  @Inject(CalculateDailyMonitoringQueue)
  private calculateDailyMonitoringQueue!: CalculateDailyMonitoringQueue;

  @Inject(PostgreSQLConnection)
  private database!: PostgreSQLConnection;

  @Inject(DailyMonitoringUpsertOdooQueue)
  private dailyMonitoringUpsertOdooQueue!: DailyMonitoringUpsertOdooQueue;

  @Inject(DailyPerformanceService)
  private dailyPerformanceService!: DailyPerformanceService;

  @Inject(FarmingCycleService)
  private farmingCycleService: FarmingCycleService;

  @Inject(HarvestEggService)
  private harvestEggService!: HarvestEggService;

  @Inject(SensorService)
  private sensorService!: SensorService;

  @Inject(TaskTicketDetailUpdatedQueue)
  private taskTicketDetailUpdatedQueue!: TaskTicketDetailUpdatedQueue;

  @Inject(DailyMonitoringService)
  private dailyMonitoringService!: DailyMonitoringService;

  @Inject(DailyReportRevisionRequestedQueue)
  private dailyReportRevisionRequestedQueue!: DailyReportRevisionRequestedQueue;

  async submitDailyReport(
    user: RequestUser,
    farmingCycleId: string,
    identifier: string,
    body: SubmitDailyReportBody,
  ): Promise<SubmitDailyReportResponseItem> {
    const queryRunner = await this.database.startTransaction();

    try {
      // validate mortality qty
      const sumMortality = body.mortalityList?.reduce((acc, cur) => acc + cur.quantity, 0) || 0;
      if (
        body.mortalityList &&
        body.mortalityList.length > 0 &&
        body.mortality &&
        sumMortality !== body.mortality
      ) {
        throw ERR_DAILY_MONITORING_MORTALITY_NOT_MATCH();
      }

      // determine if the identifier using taskTicketId or date using parse date
      const isDateIdentifier = /^\d{4}-\d{2}-\d{2}$/g.test(identifier);

      const farmingCycle = await this.farmingCycleService.getFarmingCycleById(farmingCycleId);

      let taskTicket: TaskTicket | undefined;
      let taskTicketId: string | undefined;
      let date: string | undefined;
      let taskTicketUpdatedJobs: TaskTicketDetailUpdatedJobData[] = [];

      if (isDateIdentifier) {
        date = identifier;

        if (!(await this.isSubmitDailyReportAllowed(farmingCycleId, date, user))) {
          throw ERR_SUBMIT_DAILY_REPORT_NOT_ALLOWED();
        }

        taskTicket = await this.farmingCycleService.dailyTaskTicket(farmingCycleId, date);
        if (taskTicket) taskTicketId = taskTicket.id;
      } else {
        taskTicketId = identifier;
      }

      if (taskTicketId) {
        // update & validate task ticket
        taskTicket = await this.farmingCycleService.saveDailyReportTaskTicket(
          user,
          taskTicketId,
          body,
          queryRunner,
        );

        // save daily report into task ticket detail
        taskTicketUpdatedJobs = await this.farmingCycleService.saveDailyReportTaskTicketDetails(
          user,
          taskTicket.id,
          {
            bw: body.averageWeight || 0,
            culled: body.culling,
            dead: body.mortality || sumMortality,
            feed: body.feedQuantity,
            feedType: body.feedTypeCode,
            feedAdditionalInfo: body.feedAdditionalInfo,
            yellowCardImages: body.images || null,
            feedConsumptions: body.feedConsumptions,
            ovkConsumptions: body.ovkConsumptions,
            taskTicketId: taskTicket.id,
          },
          queryRunner,
        );
      } else {
        // revert existing feed consumption
        await this.farmingCycleService.revertFeedConsumptionsV2(
          date!,
          farmingCycleId,
          user,
          queryRunner,
        );

        // revert existing ovk consumption
        await this.farmingCycleService.revertOvkConsumptionsV2(
          date!,
          farmingCycleId,
          user,
          queryRunner,
        );

        const mockTaskTicket = {
          id: '',
          farmingCycleId,
          reportedDate: new Date(date!),
          ticketSource: TaskSourceEnum.TASK,
        };

        // feed consumption job
        taskTicketUpdatedJobs.push({
          taskTicket: mockTaskTicket,
          taskTicketD: {
            id: '',
            variableId: 'cc7328a5-0efc-11ec-aa85-c1f17165',
            dataValue: `${
              (body.feedConsumptions || [])?.reduce((acc, cur) => acc + cur.quantity, 0) || 0
            }`,
          },
          feedConsumptions: body.feedConsumptions,
          ovkConsumptions: undefined,
          user,
          farmingCycleId,
        });

        // ovk consumption job
        taskTicketUpdatedJobs.push({
          taskTicket: mockTaskTicket,
          taskTicketD: {
            id: '',
            variableId: '9783234f524c7fe8582b60dd6678f999',
            dataValue: `${
              (body.ovkConsumptions || [])?.reduce((acc, cur) => acc + cur.quantity, 0) || 0
            }`,
          },
          feedConsumptions: undefined,
          ovkConsumptions: body.ovkConsumptions,
          user,
          farmingCycleId,
        });
      }

      // save data into daily monitoring table
      const dailyMonitoring = await this.farmingCycleService.saveDailyReportDailyMonitoring(
        user,
        farmingCycleId,
        date || format(taskTicket?.reportedDate!, DATE_SQL_FORMAT),
        taskTicketId,
        body,
        queryRunner,
      );

      if (farmingCycle.farm.category === FarmChickCategory.LAYER) {
        await this.harvestEggService.upsertHarvestEgg(
          user,
          farmingCycleId,
          date || format(taskTicket?.reportedDate!, DATE_SQL_FORMAT),
          body.isAbnormal || false,
          body.eggDisposal || 0,
          body.harvestedEgg || [],
          queryRunner,
        );
      }

      const dailyPerformance = await this.dailyPerformanceService.saveIssuesAndSummaryV2(
        user,
        dailyMonitoring,
        {
          summary: body.summary,
          issues: body.issues,
          treatment: body.treatment,
        },
        queryRunner,
      );

      // commit all transaction
      await this.database.commitTransaction(queryRunner);

      // execute all job
      const reportedDate = format(
        (date && new Date(date)) || taskTicket?.reportedDate!,
        DATE_SQL_FORMAT,
      );

      await Promise.all(
        taskTicketUpdatedJobs.map((job) => this.taskTicketDetailUpdatedQueue.addJob(job)),
      );

      await this.calculateDailyMonitoringQueue.addJob({
        user,
        farmingCycleId,
        farmingCycleCode: farmingCycle.farmingCycleCode,
        taskTicketId: taskTicket?.id || undefined,
        updateStatusStrategy: 'single',
        date: reportedDate,
      });

      if (taskTicket) {
        await this.dailyMonitoringUpsertOdooQueue.addJob({
          body: {
            isAdjustment: false,
            mortality: body.mortality || sumMortality || 0,
            culling: body.culling || 0,
            bw: body.averageWeight || 0,
          },
          taskTicketId: taskTicket!.id,
          feedConsumption: body.feedConsumptions,
        });
      }

      const dailyMonitoringRevision = await this.dailyMonitoringService.getDailyMonitoringRevision(
        farmingCycleId,
        date || format(taskTicket?.reportedDate!, DATE_SQL_FORMAT),
      );
      if (
        dailyMonitoringRevision &&
        dailyMonitoringRevision.status === DailyMonitoringRevisionStatusEnum.REVISED
      ) {
        await this.dailyReportRevisionRequestedQueue.addJob({
          dailyMonitoringRevisionId: dailyMonitoringRevision.id,
        });
      }

      // get response format, bw target, mortality rate target, feed stock out date
      const data = await this.farmingCycleService.submitDailyReportResponseV2(
        dailyMonitoring,
        body.feedConsumptions || [],
      );

      // get sensor data
      const { temperature, relativeHumidity, heatStressIndex } =
        await this.sensorService.getCoopSensorLatestCondition(
          {
            farmingCycleId,
          },
          date || format(taskTicket?.reportedDate!, DATE_SQL_FORMAT),
        );

      data.temperature = (temperature && `${temperature.value} ${temperature.uom}`) || undefined;
      data.humidity =
        (relativeHumidity && `${relativeHumidity.value} ${relativeHumidity.uom}`) || undefined;
      data.heatStress = (heatStressIndex && `${heatStressIndex.value}`) || undefined;
      data.issues = {
        infrastructure:
          dailyPerformance.infrastructureIssues && dailyPerformance.infrastructureIssues.length > 0
            ? dailyPerformance.infrastructureIssues.split(',')
            : [],
        management:
          dailyPerformance.managementIssues && dailyPerformance.managementIssues.length > 0
            ? dailyPerformance.managementIssues.split(',')
            : [],
        farmInput:
          dailyPerformance.farmInputIssues && dailyPerformance.farmInputIssues.length > 0
            ? dailyPerformance.farmInputIssues.split(',')
            : [],
        diseases:
          dailyPerformance.diseaseIssues && dailyPerformance.diseaseIssues.length > 0
            ? dailyPerformance.diseaseIssues.split(',')
            : [],
        forceMajeure:
          dailyPerformance.forceMajeureIssues && dailyPerformance.forceMajeureIssues.length > 0
            ? dailyPerformance.forceMajeureIssues.split(',')
            : [],
        others: dailyPerformance.otherIssues || null,
      };
      data.summary = dailyPerformance.summary;

      return data;
    } catch (error) {
      await this.database.rollbackTransaction(queryRunner);

      throw error;
    }
  }

  async requestDailyMonitoringRevision(
    user: RequestUser,
    farmingCycleId: string,
    dailyMonitoringDateString: string,
    body: RequestDailyMonitoringRevisionBody,
  ): Promise<void> {
    let dailyMonitoringId: string;
    let snapshotData: GetDailyReportResponseItem | null = null;
    const queryRunner = await this.database.startTransaction();

    try {
      // get daily monitoring by farming cycle id and daily monitoring date
      const dailyMonitoring = await this.dailyMonitoringService.getDailyMonitoringWithRevisions(
        farmingCycleId,
        dailyMonitoringDateString,
      );

      // if exists, update the daily monitoring status to REVISION
      if (dailyMonitoring) {
        this.validateRequestDailyReportRevision(dailyMonitoring);
        dailyMonitoringId = dailyMonitoring.id;
        await this.dailyMonitoringService.updateDailyMonitoringToRevision(
          dailyMonitoring.id,
          user,
          queryRunner,
        );
      }
      // if doesn't exists, create new daily monitoring with status REVISION
      else {
        const days = await this.farmingCycleService.getActiveFarmingCycleDays(
          farmingCycleId,
          utcToZonedTime(new Date(dailyMonitoringDateString), DEFAULT_TIME_ZONE),
        );
        const newDailyMonitoring =
          await this.dailyMonitoringService.initiateDailyMonitoringAsRevision(
            farmingCycleId,
            days,
            dailyMonitoringDateString,
            user,
            queryRunner,
          );
        dailyMonitoringId = newDailyMonitoring.id;
        snapshotData = await this.farmingCycleService.getDailyReport(
          farmingCycleId,
          dailyMonitoringDateString,
        );
      }

      // submit new daily monitoring request with FK to daily monitoring
      await this.dailyMonitoringService.submitDailyMonitoringRevisionRequest(
        dailyMonitoringId,
        snapshotData,
        body,
        user,
        queryRunner,
      );
      await this.database.commitTransaction(queryRunner);
    } catch (error) {
      await this.database.rollbackTransaction(queryRunner);
      throw error;
    }
  }

  private validateRequestDailyReportRevision(dailyMonitoring: DailyMonitoring) {
    // validate if daily monitoring revision has been requested
    if (dailyMonitoring.revisions && dailyMonitoring.revisions.length > 0) {
      throw ERR_DAILY_MONITORING_REVISION_ALREADY_EXISTS();
    }

    // validate daily monitoring should be final
    const allowedStatus = [DAILY_MONITORING_STATUS_ENUM.DONE, DAILY_MONITORING_STATUS_ENUM.LATE];
    if (!allowedStatus.includes(dailyMonitoring.reportStatus as DAILY_MONITORING_STATUS_ENUM)) {
      throw ERR_DAILY_MONITORING_REVISION_REQUEST_NOT_ALLOWED();
    }
  }

  private async isSubmitDailyReportAllowed(
    farmingCycleId: string,
    date: string,
    user: RequestUser,
  ): Promise<boolean> {
    const dailyMonitoring = await this.dailyMonitoringService.getDailyMonitoringWithRevisions(
      farmingCycleId,
      date,
    );

    const bypassedRoles = [USER_TYPE.ADM, USER_TYPE.SUPER, USER_TYPE.PA];
    if (user.roles?.some((role) => bypassedRoles.includes(role.name))) {
      return true;
    }

    const dailyMonitoringStatus = dailyMonitoring?.reportStatus || null;
    const revisionStatus = dailyMonitoring?.revisions?.[0]?.status || null;
    if (
      dailyMonitoringStatus === DAILY_MONITORING_STATUS_ENUM.REVISION &&
      revisionStatus === DailyMonitoringRevisionStatusEnum.REVISED
    ) {
      return false;
    }

    return true;
  }
}
