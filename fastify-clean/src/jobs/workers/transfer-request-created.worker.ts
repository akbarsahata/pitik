import { captureException } from '@sentry/node';
import { Inject, Service } from 'fastify-decorators';
import { QUEUE_TRANSFER_REQUEST_CREATED } from '../../libs/constants/queue';
import { TransferRequest } from '../../datasources/entity/pgsql/TransferRequest.entity';
import { TransferRequestDAO } from '../../dao/transferRequest.dao';
import { CoopMemberDDAO } from '../../dao/coopMemberD.dao';
import { PushNotificationQueue } from '../queues/push-notification.queue';
import { BaseWorker } from './base.worker';
import { Logger } from '../../libs/utils/logger';

@Service()
export class TransferRequestCreatedWorker extends BaseWorker<TransferRequest> {
  @Inject(TransferRequestDAO)
  private transferRequestDAO: TransferRequestDAO;

  @Inject(CoopMemberDDAO)
  private coopMemberDDAO: CoopMemberDDAO;

  @Inject(PushNotificationQueue)
  private pushNotificationQueue: PushNotificationQueue;

  @Inject(Logger)
  private logger: Logger;

  protected workerName = QUEUE_TRANSFER_REQUEST_CREATED;

  protected async handle(data: TransferRequest) {
    try {
      const transferReq = await this.transferRequestDAO.getOne({
        where: {
          id: data.id,
        },
        select: {
          id: true,
          coopSourceId: true,
          coopTargetId: true,
          coopSource: {
            coopName: true,
          },
          coopTarget: {
            coopName: true,
          },
        },
        relations: {
          coopSource: true,
          coopTarget: true,
        },
      });

      if (!transferReq) return;

      const [coopSourceMembers, countSourceMembers] = await this.coopMemberDDAO.getMany({
        where: {
          coopId: transferReq.coopSourceId,
          isInternal: true,
        },
      });

      if (!coopSourceMembers && countSourceMembers === 0) return;

      const notificationReceiverMap: { [key: string]: boolean } = {};

      coopSourceMembers.forEach((coopSourceMember) => {
        notificationReceiverMap[coopSourceMember.userId] = true;
      });

      let userReceivers = Object.keys(notificationReceiverMap);

      await this.pushNotificationQueue.addJob({
        userReceivers,
        content: {
          headline: `Request Transfer di Kandang ${transferReq.coopSource.coopName}`,
          subHeadline: 'Terus pantau status transfer-nya ya',
          body: 'Ada permintaan transfer dari rekanmu coba cek ya',
          type: 'transfer-request',
        },
        notification: {
          subjectId: 'Transfer',
          notificationType: 'request-transfer',
          headline: 'Hey ada permintaan transfer dari rekanmu',
          subHeadline: 'Terus pantau status transfer-nya ya',
          referenceId: `transfer-id: ${data.id}`,
          icon: '',
          iconPath: '',
        },
      });

      const [coopTargetMembers, countTargetMembers] = await this.coopMemberDDAO.getMany({
        where: {
          coopId: transferReq.coopTargetId,
          isInternal: true,
        },
      });

      if (!coopTargetMembers && countTargetMembers === 0) return;

      const notificationTargetReceiverMap: { [key: string]: boolean } = {};
      coopTargetMembers.forEach((coopTargetMember) => {
        notificationTargetReceiverMap[coopTargetMember.userId] = true;
      });

      userReceivers = Object.keys(notificationTargetReceiverMap);

      await this.pushNotificationQueue.addJob({
        userReceivers,
        content: {
          headline: `Request Transfer di Kandang ${transferReq.coopTarget.coopName}`,
          subHeadline: 'Terus pantau status transfer-nya ya',
          body: 'Ada permintaan transfer dari rekanmu coba cek ya',
          type: 'transfer-request',
        },
        notification: {
          subjectId: 'Transfer',
          notificationType: 'request-transfer',
          headline: 'Hey ada permintaan transfer dari rekanmu',
          subHeadline: 'Terus pantau status transfer-nya ya',
          referenceId: `transfer-id: ${data.id}`,
          icon: '',
          iconPath: '',
        },
      });
    } catch (error) {
      this.logger.error(error);

      captureException(error);

      throw error;
    }
  }
}
