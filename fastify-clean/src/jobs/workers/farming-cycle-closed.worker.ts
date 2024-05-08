import { captureException } from '@sentry/node';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Inject, Service } from 'fastify-decorators';
import { IsNull, Not } from 'typeorm';
import { DailyMonitoringDAO } from '../../dao/dailyMonitoring.dao';
import { FarmingCycleDAO } from '../../dao/farmingCycle.dao';
import { FarmingCycleMemberDDAO } from '../../dao/farmingCycleMemberD.dao';
import { DEVICE_SENSOR_STATUS } from '../../libs/constants/deviceSensor';
import { QUEUE_FARMING_CYCLE_CLOSED } from '../../libs/constants/queue';
import { PushNotificationQueue } from '../queues/push-notification.queue';
import { SetIotDeviceStatusQueue } from '../queues/set-iot-device-status.queue';
import { BaseWorker } from './base.worker';

@Service()
export class FarmingCycleClosedWorker extends BaseWorker<string> {
  @Inject(DailyMonitoringDAO)
  private dailyMonitoringDAO!: DailyMonitoringDAO;

  @Inject(FarmingCycleDAO)
  private farmingCycleDAO!: FarmingCycleDAO;

  @Inject(FarmingCycleMemberDDAO)
  private fcMemberDDAO!: FarmingCycleMemberDDAO;

  @Inject(PushNotificationQueue)
  private pushNotificationQueue!: PushNotificationQueue;

  @Inject(SetIotDeviceStatusQueue)
  private setDevicesStatusQueue!: SetIotDeviceStatusQueue;

  protected workerName = QUEUE_FARMING_CYCLE_CLOSED;

  protected async handle(farmingCycleId: string) {
    try {
      const [farmingCycle, [members], latestDailyMonitoring] = await Promise.all([
        this.farmingCycleDAO.getOneStrict({
          where: {
            id: farmingCycleId,
          },
          relations: {
            coop: true,
          },
        }),
        this.fcMemberDDAO.getMany({
          where: {
            farmingCycleId,
          },
        }),
        this.dailyMonitoringDAO.getOne({
          where: {
            farmingCycleId,
            bw: Not(IsNull()),
          },
          order: {
            day: 'DESC',
          },
        }),
      ]);

      const title = 'Siklus produksi kandang $coopName telah ditutup pada tanggal $date'
        .replace('$coopName', farmingCycle.coop.coopName)
        .replace(
          '$date',
          format(new Date(farmingCycle.closedDate), 'd MMM', {
            locale: id,
          }),
        );

      const body =
        'IP: $IP\nFCR: $FCR\nDeplesi: $dep%\nBW rata-rata: $bw gr\nUmur rata-rata: $aveAge hari'
          .replace(
            '$IP',
            `${(latestDailyMonitoring?.ip && Number(latestDailyMonitoring.ip).toFixed(0)) || '-'}`,
          )
          .replace(
            '$FCR',
            `${
              (latestDailyMonitoring?.fcr && Number(latestDailyMonitoring.fcr).toFixed(0)) || '-'
            }`,
          )
          .replace(
            '$dep',
            `${
              (latestDailyMonitoring?.mortality &&
                Number(latestDailyMonitoring.mortality).toFixed(2)) ||
              '-'
            }`,
          )
          .replace(
            '$bw',
            `${(latestDailyMonitoring?.bw && Number(latestDailyMonitoring.bw).toFixed(0)) || '-'}`,
          )
          .replace(
            '$aveAge',
            `${
              (latestDailyMonitoring?.averageChickenAge &&
                Number(latestDailyMonitoring.averageChickenAge).toFixed(1)) ||
              '-'
            }`,
          );

      await this.pushNotificationQueue.addJob({
        content: {
          id: `farming-cycle-closed:${farmingCycle.id}`,
          headline: title,
          subHeadline: title,
          body,
          type: 'android',
        },
        notification: {
          subjectId: 'FarmingCycle',
          notificationType: 'farming-cycle-closed',
          headline: title,
          subHeadline: body,
          referenceId: `farming-cycle-id: ${farmingCycle.id}`,
          icon: '',
          iconPath: '',
        },
        userReceivers: members.map((member) => member.userId),
      });

      await this.setDevicesStatusQueue.addJob({
        coopId: farmingCycle.coopId,
        deviceTypes: ['SMART_CONTROLLER'],
        status: DEVICE_SENSOR_STATUS.INACTIVE,
      });
    } catch (error) {
      captureException(error);

      throw error;
    }
  }
}
