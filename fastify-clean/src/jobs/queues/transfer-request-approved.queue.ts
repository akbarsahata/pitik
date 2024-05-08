import { Service } from 'fastify-decorators';
import { TransferRequest } from '../../datasources/entity/pgsql/TransferRequest.entity';
import { QUEUE_TRANSFER_REQUEST_APPROVED } from '../../libs/constants/queue';
import { BaseQueue } from './base.queue';

@Service()
export class TransferRequestApprovedQueue extends BaseQueue<TransferRequest> {
  protected queueName = QUEUE_TRANSFER_REQUEST_APPROVED;
}
