import { captureException } from '@sentry/node';
import { Inject, Service } from 'fastify-decorators';
import { ChickInRequestDAO } from '../../dao/chickInRequest.dao';
import { CoopMemberDDAO } from '../../dao/coopMemberD.dao';
import { FarmingCycleDAO } from '../../dao/farmingCycle.dao';
import { ChickInRequest } from '../../datasources/entity/pgsql/ChickInRequest.entity';
import { QUEUE_CHICKIN_REQUEST_APPROVED } from '../../libs/constants/queue';
import { Logger } from '../../libs/utils/logger';
import { ContractCreatedQueue } from '../queues/contract-created.queue';
import { PushNotificationQueue } from '../queues/push-notification.queue';
import { BaseWorker } from './base.worker';

// FIXME: please remove import env once flow with ODOO is ready
import env from '../../config/env';

@Service()
export class ChickInRequestApprovedWorker extends BaseWorker<ChickInRequest> {
  @Inject(ChickInRequestDAO)
  private cirDAO: ChickInRequestDAO;

  @Inject(FarmingCycleDAO)
  private farmingCycleDAO: FarmingCycleDAO;

  @Inject(CoopMemberDDAO)
  private coopMemberDDAO: CoopMemberDDAO;

  @Inject(Logger)
  private logger: Logger;

  @Inject(PushNotificationQueue)
  private pushNotificationQueue: PushNotificationQueue;

  @Inject(ContractCreatedQueue)
  private contractCreatedQueue: ContractCreatedQueue;

  protected workerName = QUEUE_CHICKIN_REQUEST_APPROVED;

  protected async handle(data: ChickInRequest) {
    try {
      const chickInReq = await this.cirDAO.getOne({
        where: {
          id: data.id,
        },
        select: {
          id: true,
          coopId: true,
          isApproved: true,
          coop: {
            coopName: true,
          },
          farmingCycleId: true,
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

      let content;
      let notification;

      if (chickInReq.isApproved) {
        content = {
          headline: `Permintaan DOC-in di kandang ${chickInReq.coop.coopName} telah disetujui`,
          subHeadline: 'Terus pantau status DOC-in-nya ya',
          body: 'Permintaan DOC-in dari rekanmu telah disetujui',
          type: 'chick-in-request',
        };
        notification = {
          subjectId: 'DOC-in',
          notificationType: 'chick-in-request',
          headline: 'Permintaan DOC-in dari rekanmu telah disetujui',
          subHeadline: 'Terus pantau status DOC-in-nya ya',
          referenceId: `chick-in-request-id: ${data.id}`,
          icon: '',
          iconPath: '',
        };
      } else {
        content = {
          headline: `Request DOC-in di kandang ${chickInReq.coop.coopName} ditolak`,
          subHeadline: 'Terus pantau status DOC-in-nya ya',
          body: 'Permintaan DOC-in dari rekanmu ditolak',
          type: 'chick-in-request',
        };
        notification = {
          subjectId: 'DOC-in',
          notificationType: 'chick-in-request',
          headline: 'Permintaan DOC-in dari rekanmu ditolak',
          subHeadline: 'Terus pantau status DOC-in-nya ya',
          referenceId: `chick-in-request-id: ${data.id}`,
          icon: '',
          iconPath: '',
        };
      }

      // FIXME:  please remove conditional USE_ERP & USE_ERP_CONTRACT feature flags
      // once flow with ODOO is ready
      if (env.USE_ERP || env.USE_ERP_CONTRACT) {
        const farmingCycle = await this.farmingCycleDAO.getOneById(chickInReq.farmingCycleId);
        await this.contractCreatedQueue.addJob(farmingCycle);
      }

      await this.pushNotificationQueue.addJob({ userReceivers, content, notification });
    } catch (error) {
      this.logger.error(error);

      captureException(error);

      throw error;
    }
  }
}
