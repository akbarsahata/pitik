import { Service } from 'fastify-decorators';
import { User } from '../../datasources/entity/pgsql/User.entity';
import { QUEUE_USER_OWNER_UPSERT } from '../../libs/constants/queue';
import { BaseQueue } from './base.queue';

@Service()
export class UserOwnerUpsertQueue extends BaseQueue<User> {
  protected queueName = QUEUE_USER_OWNER_UPSERT;
}
