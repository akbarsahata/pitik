import { Service } from 'fastify-decorators';
import { QUEUE_TRANSFER_REQUEST_CREATED } from '../../libs/constants/queue';
import { TransferRequestCreatedJobData } from '../../libs/interfaces/job-data';
import { BaseQueue } from './base.queue';

@Service()
export class TransferRequestCreatedQueue extends BaseQueue<TransferRequestCreatedJobData> {
  protected queueName = QUEUE_TRANSFER_REQUEST_CREATED;
}
