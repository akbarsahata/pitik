import { Service } from 'fastify-decorators';
import { QUEUE_CHICKIN_REQUEST_APPROVED } from '../../libs/constants/queue';
import { ChickInRequestApprovedJobData } from '../../libs/interfaces/job-data';
import { BaseQueue } from './base.queue';

@Service()
export class ChickInRequestApprovedQueue extends BaseQueue<ChickInRequestApprovedJobData> {
  protected queueName = QUEUE_CHICKIN_REQUEST_APPROVED;
}
