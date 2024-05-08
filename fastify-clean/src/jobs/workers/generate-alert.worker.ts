import { captureException } from '@sentry/node';
import { differenceInCalendarDays, format, startOfDay } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { Inject, Service } from 'fastify-decorators';
import { AlertTriggeredDAO } from '../../dao/alertTriggered.dao';
import { DailyMonitoringDAO } from '../../dao/dailyMonitoring.dao';
import { FarmingCycleAlertTriggerDDAO } from '../../dao/farmingCycleAlertTriggerD.dao';
import { FarmingCycleMemberDDAO } from '../../dao/farmingCycleMemberD.dao';
import { FarmingCycleTaskTriggerDDAO } from '../../dao/farmingCycleTaskTriggerD.dao';
import { TargetDAO } from '../../dao/target.dao';
import { TargetDaysDDAO } from '../../dao/targetDaysD.dao';
import { TaskTicketDAO } from '../../dao/taskTicket.dao';
import { FarmingCycleAlertTriggerD } from '../../datasources/entity/pgsql/FarmingCycleAlertTriggerD.entity';
import { Target } from '../../datasources/entity/pgsql/Target.entity';
import { AlertJob } from '../../dto/farmingCycle.dto';
import { DEFAULT_TIME_ZONE } from '../../libs/constants';
import { QUEUE_GENERATE_ALERT } from '../../libs/constants/queue';
import {
  VAR_ABW_CODE,
  VAR_DEAD_CHICK_CODE,
  VAR_FEED_CON_CODE,
  VAR_NH3_CODE,
  VAR_RH_CODE,
  VAR_TEMP_CODE,
  VAR_TMBLK_PENUH_CODE,
} from '../../libs/constants/variableCodes';
import { Logger } from '../../libs/utils/logger';
import { SensorService } from '../../services/sensor.service';
import { PushNotificationQueue } from '../queues/push-notification.queue';
import { BaseWorker } from './base.worker';

const SENSOR_DATA = [VAR_RH_CODE, VAR_TEMP_CODE, VAR_NH3_CODE];

const DAILY_MONITORING_DATA = [VAR_DEAD_CHICK_CODE, VAR_FEED_CON_CODE, VAR_ABW_CODE];

const TICKET_DATA = [VAR_TMBLK_PENUH_CODE];

const SENSOR_DATA_MAP = {
  [VAR_RH_CODE]: 0,
  [VAR_TEMP_CODE]: 1,
  [VAR_NH3_CODE]: 2,
};

const DAILY_MONITORING_DATA_MAP = {
  [VAR_DEAD_CHICK_CODE]: 0,
  [VAR_FEED_CON_CODE]: 1,
  [VAR_ABW_CODE]: 2,
};

const TICKET_DATA_MAP = {
  [VAR_TMBLK_PENUH_CODE]: 0,
};

type SensorVariables = keyof typeof SENSOR_DATA_MAP;

type DailyMonitoringVariables = keyof typeof DAILY_MONITORING_DATA_MAP;

type TicketDataVariables = keyof typeof TICKET_DATA_MAP;

@Service()
export class GenerateAlertWorker extends BaseWorker<AlertJob> {
  @Inject(FarmingCycleAlertTriggerDDAO)
  private fcAlertTriggerDDAO!: FarmingCycleAlertTriggerDDAO;

  @Inject(FarmingCycleTaskTriggerDDAO)
  private farmingCycleTaskTriggerDDAO!: FarmingCycleTaskTriggerDDAO;

  @Inject(DailyMonitoringDAO)
  private dailyMonitoringDAO!: DailyMonitoringDAO;

  @Inject(TargetDAO)
  private targetDAO!: TargetDAO;

  @Inject(TargetDaysDDAO)
  private targetDaysDDAO!: TargetDaysDDAO;

  @Inject(FarmingCycleMemberDDAO)
  private fcMemberDDAO!: FarmingCycleMemberDDAO;

  @Inject(AlertTriggeredDAO)
  private alertTriggeredDAO!: AlertTriggeredDAO;

  @Inject(TaskTicketDAO)
  private taskTicketDAO!: TaskTicketDAO;

  @Inject(SensorService)
  private sensorService!: SensorService;

  @Inject(PushNotificationQueue)
  private pushNotificationQueue!: PushNotificationQueue;

  @Inject(Logger)
  private logger!: Logger;

  protected workerName = QUEUE_GENERATE_ALERT;

  protected async handle(data: AlertJob): Promise<void> {
    try {
      const localDate = startOfDay(utcToZonedTime(new Date(), DEFAULT_TIME_ZONE));
      const startDate = new Date(data.farmingCycleStartDate);
      const day = differenceInCalendarDays(localDate, startDate);

      const projectedDayNum = await this.farmingCycleTaskTriggerDDAO.getFarmingCycleLastDay(
        data.farmingCycleId,
      );

      if (day > projectedDayNum) return;

      const [fcTriggers] = await this.fcAlertTriggerDDAO.getMany({
        where: {
          farmingCycleAlertId: data.farmingCycleAlertId,
        },
        relations: {
          variable: true,
        },
      });

      if (!fcTriggers.length) return;

      fcTriggers.reduce(async (prev, trigger) => {
        try {
          await prev;

          const target = await this.targetDAO.getOne({
            where: {
              coopTypeId: data.coopTypeId,
              chickTypeId: data.chickTypeId,
              variableId: trigger.variableId,
            },
          });

          if (!target) return;

          let shouldCreateAlert = false;

          const isComparedToSensorData = SENSOR_DATA.some(
            (code) => code === trigger.variable.variableCode,
          );

          const isComparedToDailyMonitoring = DAILY_MONITORING_DATA.some(
            (code) => code === trigger.variable.variableCode,
          );

          const isComparedToTicketData = TICKET_DATA.some(
            (code) => code === trigger.variable.variableCode,
          );

          if (isComparedToSensorData) {
            shouldCreateAlert = await this.compareToSensorData(
              trigger.variable.variableCode as SensorVariables,
              data.farmingCycleId,
            );
          } else if (isComparedToDailyMonitoring) {
            shouldCreateAlert = await this.compareToDailyMonitoring(
              trigger.variable.variableCode as DailyMonitoringVariables,
              day,
              data.farmingCycleId,
              target,
              trigger,
            );
          } else if (isComparedToTicketData) {
            shouldCreateAlert = await this.compareToTicketData(
              trigger.variable.variableCode as TicketDataVariables,
              day,
              data.farmingCycleId,
              target,
              trigger,
            );
          }

          if (!shouldCreateAlert) return;

          let alertTriggered = await this.alertTriggeredDAO.getOne({
            where: {
              farmingCycleId: data.farmingCycleId,
              farmingCycleAlertId: data.farmingCycleAlertId,
            },
          });

          if (alertTriggered) return;

          alertTriggered = await this.alertTriggeredDAO.createAlertTriggered({
            farmingCycleId: data.farmingCycleId,
            farmingCycleAlertId: data.farmingCycleAlertId,
          });

          await this.publishNotification({
            alertTriggeredId: alertTriggered.id,
            alertTitle: data.alertName,
            farmingCycleId: data.farmingCycleId,
            farmOwnerId: data.farmOwnerId,
            coopId: data.coopTypeId,
            coopName: data.coopName,
            day,
          });
        } catch (error) {
          captureException(error);

          this.logger.error(error);
        }
      }, Promise.resolve());
    } catch (error) {
      captureException(error);

      this.logger.error(error);

      throw error;
    }
  }

  private async compareToSensorData(
    variableCode: SensorVariables,
    farmingCycleId: string,
  ): Promise<boolean> {
    const data = await this.sensorService.getCoopSensorLatestCondition({ farmingCycleId });

    if (!data) return false;

    switch (variableCode) {
      case VAR_TEMP_CODE:
        if (data.temperature && data.temperature.status === 'bad') return true;
        break;
      case VAR_RH_CODE:
        if (data.relativeHumidity && data.relativeHumidity.status === 'bad') return true;
        break;
      case VAR_NH3_CODE:
        if (data.ammonia && data.ammonia.status === 'bad') return true;
        break;
      default:
        return false;
    }

    return false;
  }

  private async compareToDailyMonitoring(
    variableCode: DailyMonitoringVariables,
    day: number,
    farmingCycleId: string,
    target: Target,
    trigger: FarmingCycleAlertTriggerD,
  ): Promise<boolean> {
    const data = await this.dailyMonitoringDAO.getOne({
      where: {
        farmingCycleId,
        day,
      },
    });

    if (!data) return false;

    const targetToday = await this.targetDaysDDAO.getOne({
      where: {
        targetId: target.id,
        day,
      },
    });

    if (!targetToday) return false;

    let dataToCompare = 0;

    switch (variableCode) {
      case VAR_DEAD_CHICK_CODE:
        if (data.mortality === null) return false;
        dataToCompare = data.mortality;
        break;
      case VAR_FEED_CON_CODE:
        if (data.feedIntake === null) return false;
        dataToCompare =
          (data.feedIntake || 0) * (data.populationTotal || 0) -
          ((data.populationHarvested || 0) + (data.populationMortaled || 0)) / (50 * 1000);
        break;
      case VAR_ABW_CODE:
        if (data.bw === null) return false;
        dataToCompare = data.bw;
        break;
      default:
        return false;
    }

    let shouldCreateAlert = false;

    if (trigger.measurementCondition === 'above') {
      shouldCreateAlert = dataToCompare > targetToday.maxValue;
    }

    if (trigger.measurementCondition === 'below') {
      shouldCreateAlert = dataToCompare < targetToday.minValue;
    }

    return shouldCreateAlert;
  }

  private async compareToTicketData(
    variableCode: TicketDataVariables,
    day: number,
    farmingCycleId: string,
    target: Target,
    trigger: FarmingCycleAlertTriggerD,
  ): Promise<boolean> {
    const data = await this.taskTicketDAO.getOne({
      where: {
        farmingCycleId,
        reportedDate: utcToZonedTime(new Date(), DEFAULT_TIME_ZONE),
        details: {
          variable: {
            variableCode,
          },
        },
      },
      relations: {
        details: {
          variable: true,
        },
      },
      order: {
        createdDate: 'DESC',
      },
    });

    if (!data) return false;

    const targetToday = await this.targetDaysDDAO.getOne({
      where: {
        targetId: target.id,
        day,
      },
    });

    if (!targetToday) return false;

    let dataToCompare = 0;

    switch (variableCode) {
      case VAR_TMBLK_PENUH_CODE:
        if (!data.details.length) return false;
        // eslint-disable-next-line no-restricted-globals
        dataToCompare = isNaN(parseFloat(data.details[0]?.dataValue || '0'))
          ? 0
          : parseFloat(data.details[0]?.dataValue || '0');
        break;
      default:
        return false;
    }

    let shouldCreateAlert = false;

    if (trigger.measurementCondition === 'above') {
      shouldCreateAlert = dataToCompare > targetToday.maxValue;
    }

    if (trigger.measurementCondition === 'below') {
      shouldCreateAlert = dataToCompare < targetToday.minValue;
    }

    return shouldCreateAlert;
  }

  private async publishNotification(data: {
    alertTriggeredId: string;
    farmingCycleId: string;
    farmOwnerId: string;
    coopName: string;
    coopId: string;
    day: number;
    alertTitle: string;
  }) {
    const [fcWorkers] = await this.fcMemberDDAO.getMany({
      where: {
        farmingCycleId: data.farmingCycleId,
        isInternal: false,
      },
      select: {
        userId: true,
      },
    });

    await this.pushNotificationQueue.addJob({
      userReceivers: [data.farmOwnerId, ...fcWorkers.map((fcm) => fcm.userId)],
      content: {
        id: data.alertTriggeredId,
        headline: `${data.coopName} (Hari ${data.day})`,
        subHeadline: data.alertTitle,
        body: `PERHATIAN: ${data.alertTitle}`,
        type: 'alert-triggered',
        additionalParameters: {
          type: 'alertTriggered',
          alertId: data.alertTriggeredId,
          alertDate: format(utcToZonedTime(new Date(), DEFAULT_TIME_ZONE), 'yyyy-MM-dd'),
          coopId: data.coopId,
        },
      },
      notification: {
        subjectId: 'System',
        notificationType: 'alert-triggered',
        headline: `${data.coopName} (Hari ${data.day})`,
        subHeadline: `PERHATIAN: ${data.alertTitle}`,
        referenceId: `alert-triggered-id: ${data.alertTriggeredId}`,
        icon: '',
        iconPath: '',
        additionalParameters: {
          type: 'alert',
          alertId: data.alertTriggeredId,
          alertDate: format(utcToZonedTime(new Date(), DEFAULT_TIME_ZONE), 'yyyy-MM-dd'),
          coopId: data.coopId,
        },
      },
    });
  }
}
