import { captureException } from '@sentry/node';
import { Inject, Service } from 'fastify-decorators';
import { QUEUE_CHICKIN_REQUEST_UPDATED } from '../../libs/constants/queue';
import { ChickInRequest } from '../../datasources/entity/pgsql/ChickInRequest.entity';
import { ChickInRequestDAO } from '../../dao/chickInRequest.dao';
import { CoopMemberDDAO } from '../../dao/coopMemberD.dao';
import { PushNotificationQueue } from '../queues/push-notification.queue';
import { BaseWorker } from './base.worker';
import { Logger } from '../../libs/utils/logger';

@Service()
export class ChickInRequestUpdatedWorker extends BaseWorker<ChickInRequest> {
  @Inject(ChickInRequestDAO)
  private cirDAO: ChickInRequestDAO;

  @Inject(CoopMemberDDAO)
  private coopMemberDDAO: CoopMemberDDAO;

  @Inject(PushNotificationQueue)
  private pushNotificationQueue: PushNotificationQueue;

  @Inject(Logger)
  private logger: Logger;

  protected workerName = QUEUE_CHICKIN_REQUEST_UPDATED;

  protected async handle(data: ChickInRequest) {
    try {
      const chickInReq = await this.cirDAO.getOne({
        where: {
          id: data.id,
        },
        select: {
          id: true,
          coopId: true,
          coop: {
            coopName: true,
          },
        },
        relations: {
          coop: true,
        },
      });

      if (!chickInReq) return;

      const [coopMembers, count] = await this.coopMemberDDAO.getMany({
        where: {
          coopId: chickInReq.coopId,
          isInternal: true,
        },
      });

      if (!coopMembers && count === 0) return;

      const notificationReceiverMap: { [key: string]: boolean } = {};

      coopMembers.forEach((coopMember) => {
        notificationReceiverMap[coopMember.userId] = true;
      });

      const userReceivers = Object.keys(notificationReceiverMap);

      await this.pushNotificationQueue.addJob({
        userReceivers,
        content: {
          headline: `Perubahan permintaan DOC-in di kandang ${chickInReq.coop.coopName}`,
          subHeadline: 'Terus pantau status DOC-in-nya ya',
          body: 'Ada perubahan permintaan dari rekanmu coba cek ya',
          type: 'chick-in-request',
        },
        notification: {
          subjectId: 'DOC-in',
          notificationType: 'chick-in-request',
          headline: 'Hey ada perubahan permintaan DOC-in dari rekanmu',
          subHeadline: 'Terus pantau status DOC-in-nya ya',
          referenceId: `chick-in-request-id: ${data.id}`,
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
