import { JobsOptions } from 'bullmq';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Inject, Service } from 'fastify-decorators';
import { IsNull, Not } from 'typeorm';
import { DailyMonitoringDAO } from '../../dao/dailyMonitoring.dao';
import { ErpDAO } from '../../dao/erp.dao';
import { SlackDAO } from '../../dao/external/slack.dao';
import { FarmingCycleDAO } from '../../dao/farmingCycle.dao';
import { FarmingCycleMemberDDAO } from '../../dao/farmingCycleMemberD.dao';
import { DEVICE_SENSOR_STATUS } from '../../libs/constants/deviceSensor';
import { QUEUE_FARMING_CYCLE_CLOSED } from '../../libs/constants/queue';
import { targetPage } from '../../libs/constants/targetPage';
import { FarmingCycleClosedJobData } from '../../libs/interfaces/job-data';
import { constructAdditionalNotificationCoop } from '../../libs/utils/helpers';
import { Logger } from '../../libs/utils/logger';
import { ClosingService } from '../../services/closing.service';
import { PushNotificationQueue } from '../queues/push-notification.queue';
import { SetIotDeviceStatusQueue } from '../queues/set-iot-device-status.queue';
import { BaseWorker } from './base.worker';

@Service()
export class FarmingCycleClosedWorker extends BaseWorker<FarmingCycleClosedJobData> {
  @Inject(DailyMonitoringDAO)
  private dailyMonitoringDAO!: DailyMonitoringDAO;

  @Inject(FarmingCycleMemberDDAO)
  private fcMemberDDAO!: FarmingCycleMemberDDAO;

  @Inject(PushNotificationQueue)
  private pushNotificationQueue!: PushNotificationQueue;

  @Inject(SetIotDeviceStatusQueue)
  private setDevicesStatusQueue!: SetIotDeviceStatusQueue;

  @Inject(ErpDAO)
  private erpDAO!: ErpDAO;

  @Inject(FarmingCycleDAO)
  private farmingCycleDAO: FarmingCycleDAO;

  @Inject(ClosingService)
  private closingService: ClosingService;

  @Inject(SlackDAO)
  private slackDAO!: SlackDAO;

  @Inject(Logger)
  private logger!: Logger;

  protected workerName = QUEUE_FARMING_CYCLE_CLOSED;

  protected async handle(
    data: FarmingCycleClosedJobData,
    attemptsMade: number,
    opts: JobsOptions,
    jobId?: string,
  ) {
    try {
      const [closingDetail, closedFarmingCycle, [farmingCycleMembers], latestDailyMonitoring] =
        await Promise.all([
          this.closingService.getDetailClosing(data.id),
          this.farmingCycleDAO.getOneStrict({
            where: {
              id: data.id,
            },
            relations: {
              coop: true,
              farm: {
                city: true,
                district: true,
              },
            },
          }),
          this.fcMemberDDAO.getMany({
            where: {
              farmingCycleId: data.id,
            },
          }),
          this.dailyMonitoringDAO.getOne({
            where: {
              farmingCycleId: data.id,
              bw: Not(IsNull()),
            },
            order: {
              day: 'DESC',
            },
          }),
        ]);

      await this.erpDAO.closeFarmingCycle(closingDetail);

      await this.setDevicesStatusQueue.addJob({
        coopId: closedFarmingCycle.coopId,
        deviceTypes: ['SMART_CONTROLLER'],
        status: DEVICE_SENSOR_STATUS.INACTIVE,
      });

      const title = 'Siklus produksi kandang $coopName telah ditutup pada tanggal $date'
        .replace('$coopName', closedFarmingCycle.coop.coopName)
        .replace(
          '$date',
          format(new Date(closedFarmingCycle.closedDate), 'd MMM', {
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

      await this.pushNotificationQueue.sendNotificationToApp('ppl', {
        appTarget: 'ppl',
        content: {
          id: `farming-cycle-closed:${closedFarmingCycle.id}`,
          headline: title,
          subHeadline: title,
          body,
          type: 'android',
          target: targetPage.android.ppl.notificationPage,
          additionalParameters: {
            farmingCycleId: closedFarmingCycle.id,
            coopId: closedFarmingCycle.coop.id,
            coop: constructAdditionalNotificationCoop(closedFarmingCycle),
          },
        },
        notification: {
          subjectId: 'FarmingCycle',
          notificationType: 'farming-cycle-closed',
          headline: title,
          subHeadline: body,
          referenceId: `farming-cycle-id: ${closedFarmingCycle.id}`,
          icon: '',
          iconPath: '',
          target: targetPage.android.ppl.notificationPage,
          additionalParameters: {
            farmingCycleId: closedFarmingCycle.id,
            coopId: closedFarmingCycle.coop.id,
            coop: constructAdditionalNotificationCoop(closedFarmingCycle),
          },
        },
        userReceivers: farmingCycleMembers.map((member) => member.userId),
      });
    } catch (error) {
      this.logger.error(error);

      if (attemptsMade === opts.attempts) {
        await this.slackDAO.alertFailedJobs(this.workerName, error, data, jobId);
      }

      throw error;
    }
  }
}
