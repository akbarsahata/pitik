import { Service } from 'fastify-decorators';
import { QUEUE_TRANSFER_REQUEST_APPROVED } from '../../libs/constants/queue';
import { TransferRequestApprovedJobData } from '../../libs/interfaces/job-data';
import { BaseQueue } from './base.queue';

@Service()
export class TransferRequestApprovedQueue extends BaseQueue<TransferRequestApprovedJobData> {
  protected queueName = QUEUE_TRANSFER_REQUEST_APPROVED;
}
