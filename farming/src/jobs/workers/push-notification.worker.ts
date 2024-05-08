/* eslint-disable function-paren-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable camelcase */
import { JobsOptions } from 'bullmq';
import { Inject, Service } from 'fastify-decorators';
import { In } from 'typeorm';
import DeviceDAO from '../../dao/device.dao';
import { SlackDAO } from '../../dao/external/slack.dao';
import NotificationDAO from '../../dao/notification.dao';
import { QUEUE_PUSH_NOTIFICATION } from '../../libs/constants/queue';
import { PushNotificationJobData } from '../../libs/interfaces/job-data';
import { FCMAppTargetEnum, GoogleFCMFactory } from '../../libs/utils/googleFCMFactory';
import { Logger } from '../../libs/utils/logger';
import { BaseWorker } from './base.worker';

@Service()
export class PushNotificationWorker extends BaseWorker<PushNotificationJobData> {
  @Inject(DeviceDAO)
  private deviceDAO!: DeviceDAO;

  @Inject(NotificationDAO)
  private notificationDAO!: NotificationDAO;

  @Inject(SlackDAO)
  private slackDAO!: SlackDAO;

  @Inject(Logger)
  private logger: Logger;

  @Inject(GoogleFCMFactory)
  private googleFCMFactory!: GoogleFCMFactory;

  protected workerName = QUEUE_PUSH_NOTIFICATION;

  protected concurrency = 10;

  protected async handle(
    data: PushNotificationJobData,
    attemptsMade: number,
    opts: JobsOptions,
    jobId?: string,
  ) {
    try {
      const userDevices = await this.deviceDAO.getMany({
        where: {
          userId: In(data.userReceivers),
        },
      });

      const userTokenMap = userDevices
        .map((ud) => ud.token)
        .reduce(
          (map: { [key: string]: boolean }, token) => ({
            ...map,
            [token]: true,
          }),
          {},
        );

      const userTokens = Object.keys(userTokenMap);

      if (userTokens.length === 0) {
        return;
      }

      if (data.appTarget === 'internal') {
        await this.googleFCMFactory
          .createByAppTarget(FCMAppTargetEnum.INTERNAL)
          .sendMessages(data, Object.keys(userTokenMap));
      } else if (data.appTarget === 'ppl') {
        await this.googleFCMFactory
          .createByAppTarget(FCMAppTargetEnum.PPL)
          .sendMessages(data, Object.keys(userTokenMap));
      }

      this.notificationDAO.createMany(
        data.userReceivers.map((userId) => ({
          ...data.notification,
          appTarget: data.appTarget,
          userId,
        })),
      );
    } catch (error) {
      this.logger.error(error);

      if (attemptsMade === opts.attempts) {
        await this.slackDAO.alertFailedJobs(this.workerName, error, data, jobId);
      }

      throw error;
    }
  }
}
