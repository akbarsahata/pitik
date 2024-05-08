import { Service } from 'fastify-decorators';
import { User } from '../../datasources/entity/pgsql/User.entity';
import { QUEUE_USER_OWNER_UPDATED } from '../../libs/constants/queue';
import { BaseQueue } from './base.queue';

@Service()
export class UserOwnerUpdatedQueue extends BaseQueue<User> {
  protected queueName = QUEUE_USER_OWNER_UPDATED;
}
