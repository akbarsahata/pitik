import { JobsOptions } from 'bullmq';
import { randomUUID } from 'crypto';
import { utcToZonedTime } from 'date-fns-tz';
import { Inject, Service } from 'fastify-decorators';
import { In, Not } from 'typeorm';
import env from '../../config/env';
import { SlackDAO } from '../../dao/external/slack.dao';
import { TelegramDAO } from '../../dao/external/telegram.dao';
import { IotDeviceDAO } from '../../dao/IotDevice.dao';
import { IotTicketingDAO } from '../../dao/iotTicketing.dao';
import { IotTicketingHistoryDAO } from '../../dao/iotTicketingHistory.dao';
import { DEFAULT_TIME_ZONE, TICKETING_STATUS, USER_SYSTEM_CRON } from '../../libs/constants';
import { DEVICE_ALERT_TELEGRAM_MESSAGE_TYPE } from '../../libs/constants/deviceSensor';
import { QUEUE_IOT_TICKETING_STAGE_UPSERT } from '../../libs/constants/queue';
import { IotTicketingStageUpsertJobData } from '../../libs/interfaces/job-data';
import { Logger } from '../../libs/utils/logger';
import { BaseWorker } from './base.worker';

@Service()
export class IotTicketingStageUpsertWorker extends BaseWorker<IotTicketingStageUpsertJobData> {
  @Inject(IotTicketingDAO)
  private dao!: IotTicketingDAO;

  @Inject(IotTicketingHistoryDAO)
  private iotTicketingHistoryDAO!: IotTicketingHistoryDAO;

  @Inject(IotDeviceDAO)
  private iotDeviceDAO!: IotDeviceDAO;

  @Inject(SlackDAO)
  private slackDAO!: SlackDAO;

  @Inject(TelegramDAO)
  private telegramDAO!: TelegramDAO;

  @Inject(Logger)
  private logger: Logger;

  protected workerName = QUEUE_IOT_TICKETING_STAGE_UPSERT;

  protected async handle(
    data: IotTicketingStageUpsertJobData,
    attemptsMade: number,
    opts: JobsOptions,
    jobId?: string,
  ) {
    const queryRunner = await this.dao.startTransaction();

    try {
      const deviceIds: string[] = data.devices.map((device) => device.id as string);

      const [iotTickets, iotTicketsCount] = await this.dao.getMany({
        where: {
          refDeviceId: In(deviceIds),
          status: Not(In([TICKETING_STATUS.RESOLVED, TICKETING_STATUS.OTHERS])),
        },
      });

      const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

      // Case Tracked Offline:
      // - Create IoT Ticketing Record & Create IoT Ticket Open History
      if (data.type === 'offline') {
        const deviceIdsStillHaveActiveTickets: string[] = iotTickets.map((t) => t.refDeviceId);

        const deviceIdsForNewIotTickets = deviceIds.filter(
          (v) => !deviceIdsStillHaveActiveTickets.includes(v),
        );

        const newTicketsPaylaod = deviceIdsForNewIotTickets.map((deviceId) => ({
          id: randomUUID(),
          status: TICKETING_STATUS.OPEN,
          refDeviceId: deviceId,
          createdOn: now,
          notes: 'N/A',
        }));

        await this.dao.createManyWithTx(
          newTicketsPaylaod,
          { id: USER_SYSTEM_CRON.id, role: USER_SYSTEM_CRON.role },
          queryRunner,
        );

        await this.iotTicketingHistoryDAO.createManyWithTx(
          newTicketsPaylaod.map((newTicket) => ({
            actionStatus: newTicket.status,
            notes: newTicket.notes,
            timeAction: now,
            refTicketingId: newTicket.id,
          })),
          { id: USER_SYSTEM_CRON.id, role: USER_SYSTEM_CRON.role },
          queryRunner,
        );

        await this.dao.commitTransaction(queryRunner);

        const [devices, devicesCount] = await this.iotDeviceDAO.getMany({
          where: {
            id: In(deviceIdsForNewIotTickets),
          },
          relations: {
            coop: {
              farm: {
                branch: true,
              },
            },
            room: {
              roomType: true,
              building: {
                buildingType: true,
              },
            },
          },
        });

        // TODO: (iot-ticketing): remove feature flags once the feature is stable
        if (devicesCount > 0 && env.FEATURE_FLAG_IOT_TICKETING_STAGE_TELEGRAM_INTEGRATION) {
          await this.telegramDAO.sendTelegramAlertIotTicketingStage(
            devices.map((device) => ({
              ...device,
              lastOnlineTime:
                data.devices.find((elm) => elm.id === device.id)?.lastOnlineTime || now,
            })),
            DEVICE_ALERT_TELEGRAM_MESSAGE_TYPE.IOT_TICKETING_STAGE_DEVICE_OFFLINE_MESSAGE,
          );
        }
      }

      // Case Backup Online:
      // - Update IoT Ticketing Record Status to Resolved & Create Resolved History
      if (iotTicketsCount > 0 && data.type === 'online') {
        await this.dao.updateManyWithTx(
          {
            refDeviceId: In(deviceIds),
            status: Not(TICKETING_STATUS.RESOLVED),
          },
          {
            status: TICKETING_STATUS.RESOLVED,
          },
          { id: USER_SYSTEM_CRON.id, role: USER_SYSTEM_CRON.role },
          queryRunner,
        );

        await this.iotTicketingHistoryDAO.createManyWithTx(
          iotTickets.map((ticket) => ({
            actionStatus: TICKETING_STATUS.RESOLVED,
            notes: 'AUTO RESOLVED BY SYSTEM',
            timeAction: now,
            refTicketingId: ticket.id,
          })),
          { id: USER_SYSTEM_CRON.id, role: USER_SYSTEM_CRON.role },
          queryRunner,
        );

        await this.dao.commitTransaction(queryRunner);
      }
    } catch (error) {
      await this.dao.rollbackTransaction(queryRunner);

      this.logger.error(error);

      if (attemptsMade === opts.attempts) {
        await this.slackDAO.alertFailedJobs(this.workerName, error, data, jobId);
      }

      throw error;
    }
  }
}
