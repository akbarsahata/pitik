import { captureException } from '@sentry/node';
import { Inject, Service } from 'fastify-decorators';
import { FarmingCycleDAO } from '../../dao/farmingCycle.dao';
import { FarmingCycleGamificationPointDAO } from '../../dao/farmingCycleGamificationPoint.dao';
import { FarmingCycleMemberDDAO } from '../../dao/farmingCycleMemberD.dao';
import { GamificationPointHistoryDAO } from '../../dao/gamificationPointHistory.dao';
import { GamificationTaskPoint } from '../../dto/gamification.dto';
import { QUEUE_GAMIFICATION_TASK_POINT } from '../../libs/constants/queue';
import {
  assignLevelAndTarget,
  isGamificationContinued,
  pointLevelling,
} from '../../libs/utils/gamification';
import { Logger } from '../../libs/utils/logger';
import { PushNotificationQueue } from '../queues/push-notification.queue';
import { BaseWorker } from './base.worker';

@Service()
export class GamificationTaskPointWorker extends BaseWorker<GamificationTaskPoint> {
  @Inject(GamificationPointHistoryDAO)
  private pointHistoryDAO: GamificationPointHistoryDAO;

  @Inject(FarmingCycleGamificationPointDAO)
  private fcgPointDAO: FarmingCycleGamificationPointDAO;

  @Inject(FarmingCycleMemberDDAO)
  private fcMemberDAO: FarmingCycleMemberDDAO;

  @Inject(FarmingCycleDAO)
  private fcDAO: FarmingCycleDAO;

  @Inject(PushNotificationQueue)
  private pushNotificationQueue: PushNotificationQueue;

  @Inject(Logger)
  private logger: Logger;

  protected workerName = QUEUE_GAMIFICATION_TASK_POINT;

  protected async handle(data: GamificationTaskPoint) {
    try {
      // CREATE POINT HISTORY
      const pointHistory = await this.pointHistoryDAO.createOne(
        {
          farmingCycleId: data.farmingCycleId,
          dataVerificationId: data.dataVerificationId,
          taskTicketId: data.taskTicketId,
          userSubmitterId: data.userSubmitterId,
          userVerifierId: data.userVerifierId,
          earnedPoints: data.earnedPoints,
        },
        data.userSubmitterId,
      );

      const fcgPoint = await this.fcgPointDAO.getOne({
        where: {
          farmingCycleId: data.farmingCycleId,
        },
      });

      // ADD POINT TO FARMING CYCLE
      await this.fcgPointDAO.increaseFarmingCyclePoint(
        data.farmingCycleId,
        data.earnedPoints,
        data.userVerifierId || data.userSubmitterId,
      );

      // PUSH NOTIF EARN POINT
      const farmingCycle = await this.fcDAO.getOneStrict({
        where: {
          id: data.farmingCycleId,
        },
        relations: {
          farm: true,
        },
      });

      const [fcMembers] = await this.fcMemberDAO.getMany({
        where: {
          farmingCycleId: data.farmingCycleId,
        },
      });

      const notificationReceiverMap: { [key: string]: boolean } = {};

      notificationReceiverMap[farmingCycle.farm.userOwnerId] = true;

      fcMembers.forEach((fcm) => {
        notificationReceiverMap[fcm.userId] = true;
      });

      const userReceivers = Object.keys(notificationReceiverMap);

      if (isGamificationContinued(farmingCycle)) {
        await this.pushNotificationQueue.addJob({
          userReceivers,
          content: {
            headline: 'Hore selamat kamu dapat poin!',
            subHeadline: `Poin kamu bertambah ${data.earnedPoints} XP`,
            body: `Poin kamu bertambah ${data.earnedPoints} XP`,
            type: 'gamification-add-point',
          },
          notification: {
            subjectId: 'Gamification',
            notificationType: 'gamification-add-point',
            headline: 'Hore selamat kamu dapat poin!',
            subHeadline: `Poin kamu bertambah ${data.earnedPoints} XP`,
            referenceId: `point-history-id: ${pointHistory.id}`,
            icon: '',
            iconPath: '',
          },
        });
      }

      // CHECK LEVEL UP
      const levelPoints = pointLevelling(fcgPoint.potentialPoints);

      const [, currentTargetPoint] = assignLevelAndTarget(fcgPoint.currentPoints, levelPoints);

      // IF LEVEL UP, PUSH NOTIF LEVEL UP
      if (fcgPoint.currentPoints + data.earnedPoints > currentTargetPoint) {
        if (isGamificationContinued(farmingCycle)) {
          await this.pushNotificationQueue.addJob({
            userReceivers,
            content: {
              headline: 'Hore kamu saat ini naik level!',
              subHeadline: 'Terus tingkatkan performa kamu ya',
              body: 'Terus tingkatkan performa kamu ya',
              type: 'gamification-add-point',
            },
            notification: {
              subjectId: 'Gamification',
              notificationType: 'gamification-add-point',
              headline: 'Hore kamu saat ini naik level!',
              subHeadline: 'Terus tingkatkan performa kamu ya',
              referenceId: `point-history-id: ${pointHistory.id}`,
              icon: '',
              iconPath: '',
            },
          });
        }
      }
    } catch (error) {
      this.logger.error(error);

      captureException(error);

      throw error;
    }
  }
}
