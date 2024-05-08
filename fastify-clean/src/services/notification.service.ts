import { Inject, Service } from 'fastify-decorators';
import { Between, In, MoreThanOrEqual } from 'typeorm';
import { FarmingCycleDAO } from '../dao/farmingCycle.dao';
import NotificationDAO from '../dao/notification.dao';
import { User } from '../datasources/entity/pgsql/User.entity';
import {
  NotificationBody,
  NotificationCountResponse,
  NotificationQuery,
  NotificationResponse,
  NotificationResponsePaginated,
} from '../dto/notification.dto';
import { PushNotificationQueue } from '../jobs/queues/push-notification.queue';
import { GAMIFICATION_PAUSE_REMINDER, GAMIFICATION_REMINDER } from '../libs/constants/notification';
import { RequestUser } from '../libs/types/index.d';

@Service()
export default class NotificationService {
  @Inject(NotificationDAO)
  dao!: NotificationDAO;

  @Inject(PushNotificationQueue)
  queue!: PushNotificationQueue;

  @Inject(FarmingCycleDAO)
  farmingCycleDAO: FarmingCycleDAO;

  async getAllNotificationsByUser(
    params: NotificationQuery,
    user: RequestUser,
  ): Promise<NotificationResponsePaginated> {
    const notifications = await this.dao.getMany({
      where: {
        userId: user.id,
      },
      order: {
        createdDate: 'DESC',
      },
      skip: (params.$page - 1) * params.$limit,
      take: params.$limit,
    });
    const count = await this.dao.count({
      where: {
        userId: user.id,
      },
    });

    return {
      data: notifications.map((n) => ({
        ...n,
        subHeadline: n.subHeadline.replace('{coopName}', n.subHeadline),
        createdDate: n.createdDate.toISOString(),
        modifiedDate: n.modifiedDate.toISOString(),
      })),
      count,
    };
  }

  async getUnreadCountByUser(user: RequestUser): Promise<NotificationCountResponse> {
    const count = await this.dao.count({
      where: {
        isRead: false,
        userId: user.id,
      },
    });

    return {
      data: count,
    };
  }

  async getNotificationById(id: string, user: RequestUser): Promise<NotificationResponse> {
    const notification = await this.dao.getOne({ where: { id, userId: user.id } });

    return {
      data: {
        ...notification,
        createdDate: notification.createdDate.toISOString(),
        modifiedDate: notification.modifiedDate.toISOString(),
      },
    };
  }

  async readUserNotificationById(id: string, user: RequestUser): Promise<NotificationResponse> {
    const readNotif = await this.dao.updateOne(
      {
        id,
        userId: user.id,
      },
      {
        isRead: true,
      },
    );

    return {
      data: {
        ...readNotif,
        createdDate: readNotif.createdDate.toISOString(),
        modifiedDate: readNotif.modifiedDate.toISOString(),
      },
    };
  }

  async readUserNotifications(user: RequestUser): Promise<NotificationResponsePaginated> {
    const readNotifs = await this.dao.updateMany(
      {
        userId: user.id,
        isRead: false,
      },
      {
        isRead: true,
      },
    );

    return {
      data: readNotifs.map((rd) => ({
        ...rd,
        createdDate: rd.createdDate.toISOString(),
        modifiedDate: rd.modifiedDate.toISOString(),
      })),
      count: readNotifs.length,
    };
  }

  async createNotification(data: NotificationBody, user: RequestUser) {
    await this.queue.addJob({
      userReceivers: [user.id],
      content: {
        headline: data.headline,
        subHeadline: data.subHeadline,
        body: data.subHeadline,
        type: data.notificationType,
        target: data.target,
        additionalParameters: data.additionalParameters,
      },
      notification: data,
    });
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
        },
        {
          id: user.id,
          role: user.userType,
        },
      );
    });
  }
}
