import { captureException } from '@sentry/node';
import { Job, Worker } from 'bullmq';
import { hoursToMilliseconds } from 'date-fns';
import { Initializer, Inject, Service } from 'fastify-decorators';
import { PostgreSQLConnection } from '../../datasources/connection/postgresql.connection';
import { RedisConnection } from '../../datasources/connection/redis.connection';
import {
  JOB_CLEAN_COMPLETED_JOBS,
  JOB_GENERATE_ALERT_JOB,
  JOB_GENERATE_LATE_TASK_REMINDER_JOB,
  JOB_GENERATE_TASK_TICKET_JOB,
  JOB_SET_FARMINGCYCLE_INPROGRESS,
  JOB_TRIGGER_DAILY_MONITORING_DEADLINE,
  JOB_TRIGGER_DAILY_MONITORING_INITIALIZATION,
  JOB_TRIGGER_IOT_DEVICE_ALERT,
  JOB_TRIGGER_IOT_DEVICE_OFFLINE,
  QUEUE_REPEATABLE_JOB,
} from '../../libs/constants/queue';
import { Logger } from '../../libs/utils/logger';
import { AlertService } from '../../services/alert.service';
import { DailyMonitoringService } from '../../services/dailyMonitoring.service';
import { DeviceSensorsService } from '../../services/devicesSensors.service';
import { FarmingCycleService } from '../../services/farmingCycle.service';
import { IotDeviceTrackerService } from '../../services/iotDeviceTracker.service';
import { TaskService } from '../../services/task.service';
import { CalculateDailyMonitoringQueue } from '../queues/calculate-daily-monitoring.queue';
import { FinalizeDailyMonitoringQueue } from '../queues/finalize-daily-monitoring.queue';
import { GenerateAlertQueue } from '../queues/generate-alert.queue';
import { GenerateLateTaskReminderQueue } from '../queues/generate-late-task-reminder.queue';
import { GenerateTaskTicketQueue } from '../queues/generate-task-ticket.queue';
import { PushNotificationQueue } from '../queues/push-notification.queue';
import { RepeatableJobQueue } from '../queues/repeatable-job.queue';
import { TaskTicketDetailUpdatedQueue } from '../queues/task-ticket-detail-updated.queue';
import { BaseWorker } from './base.worker';

@Service()
export class RepeatableJobWorker extends BaseWorker {
  @Inject(PostgreSQLConnection)
  private pSql!: PostgreSQLConnection;

  @Inject(CalculateDailyMonitoringQueue)
  private calculateDailyMonitoringQueue!: CalculateDailyMonitoringQueue;

  @Inject(FinalizeDailyMonitoringQueue)
  private finalizeDailyMonitoringQueue!: FinalizeDailyMonitoringQueue;

  @Inject(DailyMonitoringService)
  private dailyMonitoringService!: DailyMonitoringService;

  @Inject(TaskService)
  private taskService!: TaskService;

  @Inject(AlertService)
  private alertService!: AlertService;

  @Inject(FarmingCycleService)
  private farmingCycleService!: FarmingCycleService;

  @Inject(DeviceSensorsService)
  private deviceSensorService!: DeviceSensorsService;

  @Inject(IotDeviceTrackerService)
  private iotDeviceTrackerService!: IotDeviceTrackerService;

  @Inject(PushNotificationQueue)
  private pushNotificationQueue!: PushNotificationQueue;

  @Inject(GenerateTaskTicketQueue)
  private generateTaskTicketQueue!: GenerateTaskTicketQueue;

  @Inject(GenerateLateTaskReminderQueue)
  private generateLateTaskReminderQueue!: GenerateLateTaskReminderQueue;

  @Inject(GenerateAlertQueue)
  private generateAlertQueue!: GenerateAlertQueue;

  @Inject(RepeatableJobQueue)
  private repeatableJobQueue!: RepeatableJobQueue;

  @Inject(TaskTicketDetailUpdatedQueue)
  private taskTicketDetailUpdatedQueue!: TaskTicketDetailUpdatedQueue;

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
        while (!this.pSql.connection.isInitialized) {
          (() => null)();
        }

        switch (job.name) {
          case JOB_TRIGGER_DAILY_MONITORING_DEADLINE:
            await this.triggerDailyMonitoringDeadline();
            break;
          case JOB_TRIGGER_DAILY_MONITORING_INITIALIZATION:
            await this.triggerInitializeDailyMonitoring();
            break;
          case JOB_CLEAN_COMPLETED_JOBS:
            await this.cleanCompletedJobs();
            break;
          case JOB_GENERATE_TASK_TICKET_JOB:
            await this.generateTaskTicketJobs();
            break;
          case JOB_GENERATE_LATE_TASK_REMINDER_JOB:
            await this.generateLateTaskReminderJobs();
            break;
          case JOB_GENERATE_ALERT_JOB:
            await this.generateAlertJobs();
            break;
          case JOB_SET_FARMINGCYCLE_INPROGRESS:
            await this.setFarmingCyclesInProgress();
            break;
          case JOB_TRIGGER_IOT_DEVICE_ALERT:
            await this.triggerIotDeviceAlert();
            break;
          case JOB_TRIGGER_IOT_DEVICE_OFFLINE:
            await this.triggerIotDeviceOfflineTracker();
            break;
          default:
            break;
        }
      },
      { connection: this.redis.connection, concurrency: 9 },
    );

    return this.worker;
  }

  private async triggerDailyMonitoringDeadline() {
    try {
      await this.dailyMonitoringService.triggerDailyMonitoringDeadline();
    } catch (error) {
      captureException(error);

      this.logger.error(error);

      throw error;
    }
  }

  private async triggerInitializeDailyMonitoring() {
    try {
      await this.dailyMonitoringService.initializeEmptyDailyMonitoring();
    } catch (error) {
      captureException(error);

      this.logger.error(error);

      throw error;
    }
  }

  async cleanCompletedJobs() {
    try {
      await Promise.all([
        this.pushNotificationQueue.clean(hoursToMilliseconds(2)),
        this.generateTaskTicketQueue.clean(hoursToMilliseconds(2)),
        this.generateLateTaskReminderQueue.clean(hoursToMilliseconds(2)),
        this.generateAlertQueue.clean(hoursToMilliseconds(2)),
        this.repeatableJobQueue.clean(hoursToMilliseconds(24)),
        this.taskTicketDetailUpdatedQueue.clean(hoursToMilliseconds(1)),
        this.calculateDailyMonitoringQueue.clean(hoursToMilliseconds(1)),
        this.finalizeDailyMonitoringQueue.clean(hoursToMilliseconds(24)),
      ]);
    } catch (error) {
      captureException(error);

      this.logger.error(error);

      throw error;
    }
  }

  async generateTaskTicketJobs() {
    try {
      await this.taskService.generateTaskTicketJobs();
    } catch (error) {
      captureException(error);

      this.logger.error(error);

      throw error;
    }
  }

  async generateLateTaskReminderJobs() {
    try {
      await this.taskService.generateLateTaskReminderJobs();
    } catch (error) {
      captureException(error);

      this.logger.error(error);

      throw error;
    }
  }

  async generateAlertJobs() {
    try {
      await this.alertService.generateAlertJobs();
    } catch (error) {
      captureException(error);

      this.logger.error(error);

      throw error;
    }
  }

  private async setFarmingCyclesInProgress() {
    try {
      await this.farmingCycleService.setFarmingCyclesInProgress();
    } catch (error) {
      captureException(error);

      throw error;
    }
  }

  private async triggerIotDeviceAlert() {
    try {
      await this.deviceSensorService.triggerDeviceSensorAlert();
    } catch (error) {
      captureException(error);

      throw error;
    }
  }

  private async triggerIotDeviceOfflineTracker() {
    try {
      await this.iotDeviceTrackerService.checkDeviceOffline();
    } catch (error) {
      captureException(error);

      throw error;
    }
  }
}
