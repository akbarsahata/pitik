import { Service } from 'fastify-decorators';
import { Notification } from 'pg';
import { QUEUE_AUDIT_TRAIL } from '../../libs/constants/queue';
import { BaseQueue } from './base.queue';

@Service()
export class AuditTrailQueue extends BaseQueue<Notification> {
  protected queueName = QUEUE_AUDIT_TRAIL;
}
