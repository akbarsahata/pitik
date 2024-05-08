import { Service } from 'fastify-decorators';
import {
  InternalNotificationAdditionalParameters,
  TaskNotificationAdditionalParameters,
} from '../../dto/notification.dto';
import { QUEUE_PUSH_NOTIFICATION } from '../../libs/constants/queue';
import { BaseQueue } from './base.queue';

export type NotificationAppTarget = 'ppl' | 'internal' | 'external';

export type PushNotification<T> = {
  appTarget: NotificationAppTarget;
  userReceivers: string[];
  content: {
    priority?: string;
    id?: string;
    type: string;
    headline: string;
    subHeadline: string;
    body: string;
    target: string;
    additionalParameters: T;
  };
  notification: {
    subjectId: string;
    notificationType: string;
    headline: string;
    subHeadline: string;
    icon?: string;
    iconPath?: string;
    referenceId?: string;
    target: string;
    additionalParameters: T;
  };
};

type PushNotificationWithAdditionalParamenters<T extends NotificationAppTarget> = T extends 'ppl'
  ? PushNotification<TaskNotificationAdditionalParameters>
  : T extends 'internal'
  ? PushNotification<InternalNotificationAdditionalParameters>
  : T extends 'external'
  ? PushNotification<any>
  : PushNotification<any>;

@Service()
export class PushNotificationQueue extends BaseQueue<PushNotification<any>> {
  protected queueName = QUEUE_PUSH_NOTIFICATION;

  async sendNotificationToApp<T extends NotificationAppTarget>(
    appTarget: T,
    notificationData: PushNotificationWithAdditionalParamenters<T>,
    opts?: any,
  ) {
    await this.addJob({ ...notificationData, appTarget }, opts);
  }
}
