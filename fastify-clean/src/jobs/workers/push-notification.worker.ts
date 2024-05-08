/* eslint-disable function-paren-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable camelcase */
import { Service, Inject } from 'fastify-decorators';
import { In } from 'typeorm';
import fetch from 'node-fetch';
import { captureException } from '@sentry/node';
import env from '../../config/env';
import DeviceDAO from '../../dao/device.dao';
import { PushNotificationJob } from '../../dto/push-notification.dto';
import { QUEUE_PUSH_NOTIFICATION } from '../../libs/constants/queue';
import NotificationDAO from '../../dao/notification.dao';
import { Notification } from '../../datasources/entity/pgsql/Notification.entity';
import { BaseWorker } from './base.worker';
import { Logger } from '../../libs/utils/logger';

export interface FCMPayload {
  registration_ids: string[];
  priority: string;
  data: {
    request: {
      headline: string;
      sub_headline: string;
      type: string;
      id?: string;
      target?: string;
      additionalParameters?: object;
    };
  };
  notification: {
    title: string;
    body: string;
  };
  content_available: boolean;
  direct_boot_ok: boolean;
}

@Service()
export class PushNotificationWorker extends BaseWorker<PushNotificationJob> {
  @Inject(DeviceDAO)
  private deviceDAO!: DeviceDAO;

  @Inject(NotificationDAO)
  private notificationDAO!: NotificationDAO;

  @Inject(Logger)
  private logger: Logger;

  protected workerName = QUEUE_PUSH_NOTIFICATION;

  protected concurrency = 10;

  protected async handle(data: PushNotificationJob) {
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

      const payload = PushNotificationWorker.buildPayload(data, Object.keys(userTokenMap));

      await PushNotificationWorker.notify(payload);

      await Promise.all<Notification>(
        data.userReceivers.map((userId) =>
          this.notificationDAO.createOne({
            ...data.notification,
            userId,
          }),
        ),
      );
    } catch (error) {
      this.logger.error(error);

      captureException(error);

      throw error;
    }
  }

  private static buildPayload(
    { content }: PushNotificationJob,
    deviceTokens: string[],
  ): FCMPayload {
    return {
      registration_ids: deviceTokens,
      priority: content.priority || 'high',
      data: {
        request: {
          headline: content.headline,
          sub_headline: content.body,
          type: content.type || 'android',
          id: content.id,
          target: content.target,
          additionalParameters: content.additionalParameters,
        },
      },
      notification: {
        title: content.headline,
        body: content.body,
      },
      content_available: true,
      direct_boot_ok: true,
    };
  }

  private static async notify(payload: FCMPayload) {
    return fetch(env.FIREBASE_URL, {
      method: 'post',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `key=${env.FIREBASE_SERVER_KEY}`,
      },
    });
  }
}
