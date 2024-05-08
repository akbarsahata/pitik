import { Service } from 'fastify-decorators';
import { User } from '../../datasources/entity/pgsql/User.entity';
import { QUEUE_SELF_REGISTRATION } from '../../libs/constants/queue';
import { BaseQueue } from './base.queue';

@Service()
export class SelfRegistrationQueue extends BaseQueue<User> {
  protected queueName = QUEUE_SELF_REGISTRATION;
}
