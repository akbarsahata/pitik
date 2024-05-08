import { captureException } from '@sentry/node';
import { Inject, Service } from 'fastify-decorators';
import { QUEUE_TRANSFER_REQUEST_CANCEL } from '../../libs/constants/queue';
import { TransferRequestDAO } from '../../dao/transferRequest.dao';
import { PushNotificationQueue } from '../queues/push-notification.queue';
import { BaseWorker } from './base.worker';
import { TransferRequestCancelPayload } from '../queues/transfer-request-cancel.queue';
import { USER_TYPE } from '../../libs/constants';
import { isRoleAllowed } from '../../libs/utils/helpers';

@Service()
export class TransferRequestCancelWorker extends BaseWorker<TransferRequestCancelPayload> {
  @Inject(TransferRequestDAO)
  private transferRequestDAO: TransferRequestDAO;

  @Inject(PushNotificationQueue)
  private pushNotificationQueue: PushNotificationQueue;

  protected workerName = QUEUE_TRANSFER_REQUEST_CANCEL;

  protected async handle(data: TransferRequestCancelPayload) {
    try {
      const tr = await this.transferRequestDAO.getOneStrict({
        where: {
          id: data.transferRequestId,
        },
        relations: {
          cancellationRequester: true,
          coopSource: {
            coopMembers: {
              user: true,
            },
          },
          coopTarget: {
            coopMembers: {
              user: true,
            },
          },
        },
      });

      const receivers = tr.coopSource.coopMembers || [];
      if (data.isApproved) {
        receivers.push(...(tr.coopTarget.coopMembers || []));
      }
      const receiverIds = receivers.reduce((prev, item) => {
        if (
          isRoleAllowed(item.user.userType, [
            USER_TYPE.BU,
            USER_TYPE.PPL,
            USER_TYPE.MM,
            USER_TYPE.AM,
          ])
        ) {
          prev.push(item.userId);
        }
        return prev;
      }, [] as string[]);

      const uniqueReceiverIds = receiverIds.filter((val, idx, arr) => arr.indexOf(val) === idx);

      await this.pushNotificationQueue.addJob({
        userReceivers: uniqueReceiverIds,
        content: {
          id: `transfer-request-cancel:${data.transferRequestId}`,
          headline: 'Transfer Pakan Dibatalkan',
          subHeadline: 'Transfer Pakan Dibatalkan',
          body: `Dari kandang ${tr.coopSource.coopName} ke kandang ${tr.coopTarget.coopName} dengan total pakan ${tr.quantity} karung`,
          type: 'android',
        },
        notification: {
          subjectId: 'TransferRequest',
          notificationType: 'transfer-request-cancel',
          headline: 'Transfer Pakan Dibatalkan',
          subHeadline: `Dari kandang ${tr.coopSource.coopName} ke kandang ${tr.coopTarget.coopName} dengan total pakan ${tr.quantity} karung`,
          referenceId: `transfer-request-id: ${data.transferRequestId}`,
          icon: '',
          iconPath: '',
        },
      });
    } catch (error) {
      captureException(error);

      throw error;
    }
  }
}
