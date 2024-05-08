import { Service } from 'fastify-decorators';
import { PushNotificationJob } from '../../dto/push-notification.dto';
import { QUEUE_PUSH_NOTIFICATION } from '../../libs/constants/queue';
import { BaseQueue } from './base.queue';

@Service()
export class PushNotificationQueue extends BaseQueue<PushNotificationJob> {
  protected queueName = QUEUE_PUSH_NOTIFICATION;
}
