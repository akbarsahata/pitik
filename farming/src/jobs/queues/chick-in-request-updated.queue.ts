import { Service } from 'fastify-decorators';
import { ChickInRequest } from '../../datasources/entity/pgsql/ChickInRequest.entity';
import { QUEUE_CHICKIN_REQUEST_UPDATED } from '../../libs/constants/queue';
import { BaseQueue } from './base.queue';

@Service()
export class ChickInRequestUpdatedQueue extends BaseQueue<ChickInRequest> {
  protected queueName = QUEUE_CHICKIN_REQUEST_UPDATED;
}
