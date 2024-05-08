/* eslint-disable class-methods-use-this */
import { JobsOptions } from 'bullmq';
import { differenceInDays } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { Inject, Service } from 'fastify-decorators';
import { FindOptionsWhere, In } from 'typeorm';
import { DailyMonitoringDAO } from '../../dao/dailyMonitoring.dao';
import DeviceDAO from '../../dao/device.dao';
import { SlackDAO } from '../../dao/external/slack.dao';
import { SmartCameraJobDAO } from '../../dao/smartCameraJob.dao';
import { TargetDaysDDAO } from '../../dao/targetDaysD.dao';
import { VariableDAO } from '../../dao/variable.dao';
import { TargetDaysD } from '../../datasources/entity/pgsql/TargetDaysD.entity';
import { CreateNotificationBody, CrowdednessFcmPayload } from '../../dto/internalNotification.dto';
import { NotificationBody } from '../../dto/notification.dto';
import { DEFAULT_TIME_ZONE } from '../../libs/constants';
import {
  CROWDEDNESS_DETECTION,
  NOTIFICATION_TEMPLATE_NAME,
} from '../../libs/constants/notification';
import { QUEUE_NOTIFICATION_SERVICE } from '../../libs/constants/queue';
import { VAR_ABW_CODE, VAR_TRG_IP_CODE } from '../../libs/constants/variableCodes';
import { Logger } from '../../libs/utils/logger';
import { PushNotificationQueue } from '../queues/push-notification.queue';
import { BaseWorker } from './base.worker';

@Service()
export class NotificationServiceWorker extends BaseWorker<CreateNotificationBody> {
  @Inject(SmartCameraJobDAO)
  private smartCameraJobDAO: SmartCameraJobDAO;

  @Inject(DailyMonitoringDAO)
  private dailyMonitoringDAO: DailyMonitoringDAO;

  @Inject(DeviceDAO)
  private deviceDAO: DeviceDAO;

  @Inject(SlackDAO)
  private slackDAO: SlackDAO;

  @Inject(Logger)
  private logger: Logger;

  @Inject(PushNotificationQueue)
  private pushNotificationQueue: PushNotificationQueue;

  @Inject(TargetDaysDDAO)
  private targetDaysDDAO: TargetDaysDDAO;

  @Inject(VariableDAO)
  private variableDAO: VariableDAO;

  protected workerName = QUEUE_NOTIFICATION_SERVICE;

  protected async handle(
    data: CreateNotificationBody,
    attemptsMade: number,
    opts: JobsOptions,
    jobId?: string,
  ) {
    try {
      switch (data.templateName) {
        case NOTIFICATION_TEMPLATE_NAME.crowdednessFCM:
          await this.crowdednessFCM(data.payload as CrowdednessFcmPayload);
          break;
        default:
          break;
      }
    } catch (error) {
      this.logger.error(error);

      if (attemptsMade === opts.attempts) {
        await this.slackDAO.alertFailedJobs(this.workerName, error, data, jobId);
      }

      throw error;
    }
  }

  private async crowdednessFCM(data: CrowdednessFcmPayload) {
    const job = await this.smartCameraJobDAO.getOneStrict({
      where: {
        id: data.jobId,
      },
      relations: {
        sensor: {
          room: {
            coop: {
              coopMembers: true,
              activeFarmingCycle: true,
              farm: {
                city: true,
                district: true,
              },
            },
            building: true,
          },
        },
      },
    });

    if (!job.sensor?.room?.coop?.activeFarmingCycle) {
      return;
    }

    const { coop } = job.sensor.room;
    const { farm } = job.sensor.room.coop;
    const { activeFarmingCycle } = job.sensor.room.coop;
    const notificationDay = differenceInDays(
      utcToZonedTime(job.createdAt, DEFAULT_TIME_ZONE),
      activeFarmingCycle.farmingCycleStartDate,
    );

    // notificationDay less than 0 mean the job is created for previous farming cycle
    // ignore this kind of notification
    if (notificationDay < 0) return;

    const farmingCycleDay = differenceInDays(
      utcToZonedTime(new Date(), DEFAULT_TIME_ZONE),
      activeFarmingCycle.farmingCycleStartDate,
    );
    const dailyMonitoring = await this.dailyMonitoringDAO.getLatestMappedByFarmingCycleId([
      activeFarmingCycle.id,
    ]);

    const variables = await this.variableDAO.getMappedByCode([VAR_ABW_CODE, VAR_TRG_IP_CODE]);
    const targetDaysFilter: FindOptionsWhere<TargetDaysD>[] = [];
    targetDaysFilter.push(
      {
        day: farmingCycleDay,
        target: {
          coopTypeId: coop.coopTypeId,
          chickTypeId: activeFarmingCycle.chickTypeId,
          variableId: variables.get(VAR_ABW_CODE)!.id,
        },
      },
      {
        day: farmingCycleDay,
        target: {
          coopTypeId: coop.coopTypeId,
          chickTypeId: activeFarmingCycle.chickTypeId,
          variableId: variables.get(VAR_TRG_IP_CODE)!.id,
        },
      },
    );
    const targetDays = await this.targetDaysDDAO.getMappedByVariableAndDay(targetDaysFilter);
    const coopMemberIds = job.sensor.room?.coop?.coopMembers?.map((member) => member.userId) || [];

    const devices = await this.deviceDAO.getMany({
      where: {
        userId: In(coopMemberIds),
      },
    });

    if (!devices.length) {
      return;
    }

    const coopName = job.sensor?.room?.coop?.coopName || 'default';
    const buildingName = job.sensor?.room?.building?.name || 'default';
    const roomType = job.sensor?.room?.roomType?.name || 'default';
    const subHeadline = CROWDEDNESS_DETECTION.SUB_HEADLINE.replace('{coopName}', coopName)
      .replace('{buildingName}', buildingName)
      .replace('{roomType}', roomType);

    await this.createNotification(coopMemberIds, {
      headline: CROWDEDNESS_DETECTION.HEADLINE,
      subHeadline,
      notificationType: CROWDEDNESS_DETECTION.NOTIFICATION_TYPE,
      subjectId: CROWDEDNESS_DETECTION.SUBJECT_ID,
      referenceId: `${data.jobId}`,
      target: 'id.pitik.mobile.camtech.ui.activity.SmartCameraCrowdednessListActivity',
      additionalParameters: {
        day: notificationDay,
        coop: {
          id: coop.id,
          coopName: coop.coopName,
          farmId: coop.farmId,
          startDate: activeFarmingCycle.farmingCycleStartDate.toISOString(),
          day: farmingCycleDay,
          coopCity: farm.city.cityName,
          coopDistrict: farm.district.districtName,
          farmingCycleId: coop.activeFarmingCycleId!,
          isActionNeeded: false,
          isNew: false,
          period: coop.totalPeriod,
          bw: {
            actual: dailyMonitoring.get(activeFarmingCycle.id)?.bw || 0,
            standard:
              targetDays.get(`${variables.get(VAR_ABW_CODE)!.id}-${farmingCycleDay}`)?.minValue ||
              0,
          },
          ip: {
            actual: dailyMonitoring.get(activeFarmingCycle.id)?.ip || 0,
            standard:
              targetDays.get(`${variables.get(VAR_TRG_IP_CODE)!.id}-${farmingCycleDay}`)
                ?.minValue || 0,
          },
        },
      },
    });
  }

  private async createNotification(userIds: string[], data: NotificationBody) {
    await this.pushNotificationQueue.sendNotificationToApp('ppl', {
      appTarget: 'ppl',
      userReceivers: userIds,
      content: {
        headline: data.headline,
        subHeadline: data.subHeadline,
        body: data.subHeadline,
        type: data.notificationType,
        target: data.target,
        additionalParameters: data.additionalParameters,
      },
      notification: data,
    });
  }
}
