import { Inject, Service } from 'fastify-decorators';
import { Between, In, MoreThanOrEqual } from 'typeorm';
import { FarmingCycleDAO } from '../dao/farmingCycle.dao';
import NotificationDAO from '../dao/notification.dao';
import { User } from '../datasources/entity/pgsql/User.entity';
import {
  NotificationBody,
  NotificationItem,
  NotificationList,
  NotificationQuery,
} from '../dto/notification.dto';
import {
  NotificationAppTarget,
  PushNotificationQueue,
} from '../jobs/queues/push-notification.queue';
import { GAMIFICATION_PAUSE_REMINDER, GAMIFICATION_REMINDER } from '../libs/constants/notification';
import { targetPage } from '../libs/constants/targetPage';
import { RequestUser } from '../libs/types/index.d';

@Service()
export default class NotificationService {
  @Inject(NotificationDAO)
  notificationDAO!: NotificationDAO;

  @Inject(PushNotificationQueue)
  pushNotificationQueue!: PushNotificationQueue;

  @Inject(FarmingCycleDAO)
  farmingCycleDAO: FarmingCycleDAO;

  async getAllNotificationsByUser(
    query: NotificationQuery,
    user: RequestUser,
  ): Promise<[NotificationList, number]> {
    const [notifications, count] = await this.notificationDAO.getMany({
      where: {
        userId: user.id,
        appTarget: query.appTarget,
      },
      order: {
        createdDate: 'DESC',
      },
      skip: (query.$page - 1) * query.$limit,
      take: query.$limit,
    });

    return [
      notifications.map((n) => ({
        ...n,
        subHeadline: n.subHeadline.replace('{coopName}', n.subHeadline),
        createdDate: n.createdDate.toISOString(),
        modifiedDate: n.modifiedDate.toISOString(),
        target: NotificationService.setTargetPage(n.target, n.additionalParameters, n.appTarget),
      })),
      count,
    ];
  }

  async getUnreadCountByUser(user: RequestUser): Promise<number> {
    const count = await this.notificationDAO.count({
      where: {
        isRead: false,
        userId: user.id,
      },
    });

    return count;
  }

  async getNotificationById(id: string, user: RequestUser): Promise<NotificationItem> {
    const notification = await this.notificationDAO.getOne({ where: { id, userId: user.id } });

    return {
      ...notification,
      createdDate: notification.createdDate.toISOString(),
      modifiedDate: notification.modifiedDate.toISOString(),
      target: NotificationService.setTargetPage(
        notification.target,
        notification.additionalParameters,
      ),
      additionalParameters: notification.additionalParameters || {},
    };
  }

  async readUserNotificationById(id: string, user: RequestUser): Promise<NotificationItem> {
    const readNotif = await this.notificationDAO.updateOne(
      {
        id,
        userId: user.id,
      },
      {
        isRead: true,
      },
    );

    return {
      ...readNotif,
      createdDate: readNotif.createdDate.toISOString(),
      modifiedDate: readNotif.modifiedDate.toISOString(),
      target: NotificationService.setTargetPage(readNotif.target, readNotif.additionalParameters),
      additionalParameters: readNotif.additionalParameters || {},
    };
  }

  async readUserNotifications(user: RequestUser): Promise<[NotificationList, number]> {
    const readNotifs = await this.notificationDAO.updateMany(
      {
        userId: user.id,
        isRead: false,
      },
      {
        isRead: true,
      },
    );

    return [
      readNotifs.map((rd) => ({
        ...rd,
        createdDate: rd.createdDate.toISOString(),
        modifiedDate: rd.modifiedDate.toISOString(),
        target: NotificationService.setTargetPage(rd.target, rd.additionalParameters),
        additionalParameters: rd.additionalParameters || {},
      })),
      readNotifs.length,
    ];
  }

  async createNotification(data: NotificationBody, user: RequestUser) {
    await this.pushNotificationQueue.sendNotificationToApp(
      (data.appTarget as NotificationAppTarget) || 'ppl',
      {
        appTarget: (data.appTarget as NotificationAppTarget) || 'ppl',
        userReceivers: [user.id],
        content: {
          headline: data.headline,
          subHeadline: data.subHeadline,
          body: data.subHeadline,
          type: data.notificationType,
          target: NotificationService.setTargetPage(data.target, data.additionalParameters),
          additionalParameters: data.additionalParameters,
        },
        notification: data,
      },
    );
  }

  async gamificationDailyReminder(cityIds?: number[]) {
    const userSelection = {
      id: true,
      fullName: true,
      userType: true,
    };
    const farmingCycles = await this.farmingCycleDAO.getAll({
      where: {
        farmingCycleStartDate: MoreThanOrEqual(new Date('2022-06-27')), // release of gamification feature
        cycleStatus: true, // only active farming cycle
        farm: {
          cityId: cityIds && cityIds.length > 0 ? In(cityIds) : undefined,
        },
      },
      select: {
        id: true,
        farm: {
          userOwnerId: true,
          owner: userSelection,
        },
        farmingCycleMembers: {
          userId: true,
          user: userSelection,
        },
      },
      relations: {
        farm: {
          owner: true,
        },
        farmingCycleMembers: {
          user: true,
        },
      },
    });

    const uniqueUser = new Map<string, User>();
    farmingCycles.forEach((farmingCycle) => {
      // owner
      if (farmingCycle.farm && farmingCycle.farm.owner && farmingCycle.farm.owner.id) {
        uniqueUser.set(farmingCycle.farm.owner.id, farmingCycle.farm.owner);
      }

      // AK & KK
      farmingCycle.farmingCycleMembers.forEach((fcMember) => {
        if (fcMember && fcMember.user && fcMember.user.id) {
          uniqueUser.set(fcMember.user.id, fcMember.user);
        }
      });
    });

    uniqueUser.forEach((user) => {
      this.createNotification(
        {
          headline: GAMIFICATION_REMINDER.HEADLINE.replace(
            '{name}',
            user.fullName || 'Kawan Pitik',
          ),
          subHeadline: GAMIFICATION_REMINDER.SUB_HEADLINE.replace(
            '{name}',
            user.fullName || 'Kawan Pitik',
          ),
          notificationType: GAMIFICATION_REMINDER.NOTIFICATION_TYPE,
          subjectId: GAMIFICATION_REMINDER.SUBJECT_ID,
          target: targetPage.android.ppl.notificationPage,
          additionalParameters: {},
        },
        {
          id: user.id,
          role: user.userType,
        },
      );
    });
  }

  async gamificationPauseReminder(cityIds?: number[]) {
    const userSelection = {
      id: true,
      fullName: true,
      userType: true,
    };
    const farmingCycles = await this.farmingCycleDAO.getAll({
      where: {
        farmingCycleStartDate: Between(new Date('2022-10-27'), new Date('2022-11-02')),
        cycleStatus: true, // only active farming cycle
        farm: {
          cityId: cityIds && cityIds.length > 0 ? In(cityIds) : undefined,
        },
      },
      select: {
        id: true,
        farm: {
          userOwnerId: true,
          owner: userSelection,
        },
        farmingCycleMembers: {
          userId: true,
          user: userSelection,
        },
      },
      relations: {
        farm: {
          owner: true,
        },
        farmingCycleMembers: {
          user: true,
        },
      },
    });

    const uniqueUser = new Map<string, User>();
    farmingCycles.forEach((farmingCycle) => {
      // owner
      if (farmingCycle.farm && farmingCycle.farm.owner && farmingCycle.farm.owner.id) {
        uniqueUser.set(farmingCycle.farm.owner.id, farmingCycle.farm.owner);
      }

      // AK & KK & PPL & MM
      farmingCycle.farmingCycleMembers.forEach((fcMember) => {
        if (fcMember && fcMember.user && fcMember.user.id) {
          uniqueUser.set(fcMember.user.id, fcMember.user);
        }
      });
    });

    uniqueUser.forEach((user) => {
      this.createNotification(
        {
          headline: GAMIFICATION_PAUSE_REMINDER.HEADLINE,
          subHeadline: GAMIFICATION_PAUSE_REMINDER.SUB_HEADLINE,
          notificationType: GAMIFICATION_PAUSE_REMINDER.NOTIFICATION_TYPE,
          subjectId: GAMIFICATION_PAUSE_REMINDER.SUBJECT_ID,
          target: targetPage.android.ppl.notificationPage,
          additionalParameters: {},
        },
        {
          id: user.id,
          role: user.userType,
        },
      );
    });
  }

  private static setTargetPage(
    target: string,
    additionalParameters: any,
    appTarget?: NotificationAppTarget | string,
  ): string {
    if (additionalParameters?.type === 'detailTask') {
      return targetPage.android.ppl.taskDetailPage;
    }

    if (!target && appTarget === 'ppl') return targetPage.android.ppl.notificationPage;

    if (!target && appTarget === 'internal') return targetPage.android.internal.navbarTugas;

    return target || '';
  }
}
