import { Service } from 'fastify-decorators';
import { CreateNotificationBody } from '../../dto/internalNotification.dto';
import { QUEUE_NOTIFICATION_SERVICE } from '../../libs/constants/queue';
import { BaseQueue } from './base.queue';

@Service()
export class NotificationServiceQueue extends BaseQueue<CreateNotificationBody> {
  protected queueName = QUEUE_NOTIFICATION_SERVICE;
}
