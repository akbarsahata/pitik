import { Service } from 'fastify-decorators';
import { QUEUE_TRANSFER_REQUEST_REJECTED_CANCELLED } from '../../libs/constants/queue';
import { BaseQueue } from './base.queue';

export type TransferRequestCancelPayload = {
  transferRequestId: string;
  isApproved: boolean;
};

@Service()
export class TransferRequestRejectedCancelledQueue extends BaseQueue<TransferRequestCancelPayload> {
  protected queueName = QUEUE_TRANSFER_REQUEST_REJECTED_CANCELLED;
}
