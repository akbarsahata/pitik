import { Service } from 'fastify-decorators';
import { FarmingCycleMemberD } from '../../datasources/entity/pgsql/FarmingCycleMemberD.entity';
import { QUEUE_USER_ASSIGNED_TO_FC } from '../../libs/constants/queue';
import { BaseQueue } from './base.queue';

@Service()
export class UserAssignedToFcQueue extends BaseQueue<Partial<FarmingCycleMemberD>> {
  protected queueName = QUEUE_USER_ASSIGNED_TO_FC;
}
