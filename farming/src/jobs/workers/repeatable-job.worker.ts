import { Job, Worker } from 'bullmq';
import { Initializer, Inject, Service } from 'fastify-decorators';
import env from '../../config/env';
import { SlackDAO } from '../../dao/external/slack.dao';
import { PostgreSQLConnection } from '../../datasources/connection/postgresql.connection';
import { RedisConnection } from '../../datasources/connection/redis.connection';
import {
  JOB_GENERATE_ALERT_JOB,
  JOB_GENERATE_LATE_TASK_REMINDER_JOB,
  JOB_GENERATE_TASK_TICKET_JOB,
  JOB_SET_FARMINGCYCLE_INPROGRESS,
  JOB_SET_HARVEST_REALIZATION_FINAL,
  JOB_TRIGGER_DAILY_MONITORING_DEADLINE,
  JOB_TRIGGER_DAILY_MONITORING_INITIALIZATION,
  JOB_TRIGGER_DAILY_REPORT_REMINDER,
  JOB_TRIGGER_IOT_DEVICE_ALERT,
  JOB_TRIGGER_IOT_DEVICE_OFFLINE,
  QUEUE_REPEATABLE_JOB,
} from '../../libs/constants/queue';
import { sleep } from '../../libs/utils/helpers';
import { Logger } from '../../libs/utils/logger';
import { AlertService } from '../../services/alert.service';
import { DailyMonitoringService } from '../../services/dailyMonitoring.service';
import { DeviceSensorsService } from '../../services/devicesSensors.service';
import { FarmingCycleService } from '../../services/farmingCycle.service';
import { HarvestRealizationService } from '../../services/harvestRealization.service';
import { IotDeviceTrackerService } from '../../services/iotDeviceTracker.service';
import { TaskService } from '../../services/task.service';
import { BaseWorker } from './base.worker';

@Service()
export class RepeatableJobWorker extends BaseWorker {
  @Inject(PostgreSQLConnection)
  private pSql!: PostgreSQLConnection;

  @Inject(DailyMonitoringService)
  private dailyMonitoringService!: DailyMonitoringService;

  @Inject(TaskService)
  private taskService!: TaskService;

  @Inject(AlertService)
  private alertService!: AlertService;

  @Inject(FarmingCycleService)
  private farmingCycleService!: FarmingCycleService;

  @Inject(IotDeviceTrackerService)
  private iotDeviceTrackerService!: IotDeviceTrackerService;

  @Inject(DeviceSensorsService)
  private deviceSensorService!: DeviceSensorsService;

  @Inject(HarvestRealizationService)
  private harvestRealizationService!: HarvestRealizationService;

  @Inject(SlackDAO)
  private slackDAO!: SlackDAO;

  @Inject(Logger)
  private logger!: Logger;

  @Initializer([RedisConnection, PostgreSQLConnection])
  init() {
    this.worker = new Worker(
      QUEUE_REPEATABLE_JOB,
      async (job: Job) => {
        /**
         * delay job execution near initialization time
         * because it will causing some 'metadata not found' error
         */
        if (!this.pSql.connection.isInitialized) {
          await sleep(3000);
        }

        switch (job.name) {
          case JOB_TRIGGER_DAILY_MONITORING_DEADLINE:
            await this.triggerDailyMonitoringDeadline(job);
            break;
          case JOB_TRIGGER_DAILY_MONITORING_INITIALIZATION:
            await this.triggerInitializeDailyMonitoring(job);
            break;
          case JOB_GENERATE_TASK_TICKET_JOB:
            await this.generateTaskTicketJobs(job);
            break;
          case JOB_GENERATE_LATE_TASK_REMINDER_JOB:
            await this.generateLateTaskReminderJobs(job);
            break;
          case JOB_GENERATE_ALERT_JOB:
            await this.generateAlertJobs(job);
            break;
          case JOB_SET_FARMINGCYCLE_INPROGRESS:
            await this.setFarmingCyclesInProgress(job);
            break;
          case JOB_TRIGGER_IOT_DEVICE_OFFLINE:
            await this.triggerIotDeviceOfflineTracker(job);
            break;
          case JOB_TRIGGER_IOT_DEVICE_ALERT:
            // TODO: remove once statsd is ready to be integrated
            if (env.STATSD_IS_ACTIVE) {
              await this.triggerIotDeviceAlert(job);
            }
            break;
          case JOB_SET_HARVEST_REALIZATION_FINAL:
            await this.setHarvestRealizationFinalStatus(job);
            break;
          case JOB_TRIGGER_DAILY_REPORT_REMINDER:
            await this.triggerDailyReportReminder(job);
            break;
          default:
            break;
        }
      },
      { connection: this.redis.connection, concurrency: 11 },
    );

    return this.worker;
  }

  private async triggerDailyMonitoringDeadline(job: Job) {
    try {
      await this.dailyMonitoringService.triggerDailyMonitoringDeadline();
    } catch (error) {
      await this.slackDAO.alertFailedJobs(
        this.workerName,
        error,
        {
          jobName: JOB_TRIGGER_DAILY_MONITORING_DEADLINE,
        },
        job.id,
      );

      this.logger.error(error);

      throw error;
    }
  }

  private async triggerInitializeDailyMonitoring(job: Job) {
    try {
      await this.dailyMonitoringService.initializeEmptyDailyMonitoring();
    } catch (error) {
      await this.slackDAO.alertFailedJobs(
        this.workerName,
        error,
        {
          jobName: JOB_TRIGGER_DAILY_MONITORING_INITIALIZATION,
        },
        job.id,
      );

      this.logger.error(error);

      throw error;
    }
  }

  private async generateTaskTicketJobs(job: Job) {
    try {
      await this.taskService.generateTaskTicketJobs();
    } catch (error) {
      await this.slackDAO.alertFailedJobs(
        this.workerName,
        error,
        {
          jobName: JOB_GENERATE_TASK_TICKET_JOB,
        },
        job.id,
      );

      this.logger.error(error);

      throw error;
    }
  }

  private async generateLateTaskReminderJobs(job: Job) {
    try {
      await this.taskService.generateLateTaskReminderJobs();
    } catch (error) {
      await this.slackDAO.alertFailedJobs(
        this.workerName,
        error,
        {
          jobName: JOB_GENERATE_LATE_TASK_REMINDER_JOB,
        },
        job.id,
      );

      this.logger.error(error);

      throw error;
    }
  }

  private async generateAlertJobs(job: Job) {
    try {
      await this.alertService.generateAlertJobs();
    } catch (error) {
      await this.slackDAO.alertFailedJobs(
        this.workerName,
        error,
        {
          jobName: JOB_GENERATE_ALERT_JOB,
        },
        job.id,
      );

      this.logger.error(error);

      throw error;
    }
  }

  private async setFarmingCyclesInProgress(job: Job) {
    try {
      await this.farmingCycleService.setFarmingCyclesInProgress();
    } catch (error) {
      await this.slackDAO.alertFailedJobs(
        this.workerName,
        error,
        {
          jobName: JOB_SET_FARMINGCYCLE_INPROGRESS,
        },
        job.id,
      );

      throw error;
    }
  }

  private async triggerIotDeviceOfflineTracker(job: Job) {
    try {
      await this.iotDeviceTrackerService.checkDeviceOffline();
    } catch (error) {
      await this.slackDAO.alertFailedJobs(
        this.workerName,
        error,
        {
          jobName: JOB_TRIGGER_IOT_DEVICE_ALERT,
        },
        job.id,
      );

      throw error;
    }
  }

  private async triggerIotDeviceAlert(job: Job) {
    try {
      await this.deviceSensorService.triggerDeviceSensorAlert();
    } catch (error) {
      await this.slackDAO.alertFailedJobs(
        this.workerName,
        error,
        {
          jobName: JOB_TRIGGER_IOT_DEVICE_OFFLINE,
        },
        job.id,
      );

      throw error;
    }
  }

  private async setHarvestRealizationFinalStatus(job: Job) {
    try {
      await this.harvestRealizationService.setHarvestRealizationStatus();
    } catch (error) {
      await this.slackDAO.alertFailedJobs(
        this.workerName,
        error,
        {
          jobName: JOB_SET_HARVEST_REALIZATION_FINAL,
        },
        job.id,
      );

      throw error;
    }
  }

  // JOB_TRIGGER_DAILY_REPORT_REMINDER
  private async triggerDailyReportReminder(job: Job) {
    try {
      await this.dailyMonitoringService.triggerDailyReportReminder();
    } catch (error) {
      await this.slackDAO.alertFailedJobs(
        this.workerName,
        error,
        {
          jobName: JOB_TRIGGER_DAILY_REPORT_REMINDER,
        },
        job.id,
      );

      throw error;
    }
  }
}
