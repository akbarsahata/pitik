import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, GET, Inject, PATCH, POST } from 'fastify-decorators';
import {
  GamificationDailyReminderQuery,
  NotificationBody,
  notificationBodyDTO,
  NotificationCountResponse,
  notificationCountResponseDTO,
  NotificationParams,
  notificationParamsDTO,
  NotificationQuery,
  notificationQueryDTO,
  NotificationResponse,
  notificationResponseDTO,
  NotificationResponsePaginated,
  notificationResponsePaginatedDTO,
} from '../../dto/notification.dto';
import NotificationService from '../../services/notification.service';
import { verifyAccess } from '../hooks/onRequest/verifyAccess';

export type GetManyNotificationRequest = FastifyRequest<{
  Querystring: NotificationQuery;
}>;

export type GetNotificationByIdRequest = FastifyRequest<{
  Params: NotificationParams;
}>;

export type ReadNotificationRequest = FastifyRequest<{
  Params: NotificationParams;
}>;

export type CreateNotificationRequest = FastifyRequest<{
  Body: NotificationBody;
}>;

export type GamificationDailyReminderRequest = FastifyRequest<{
  Querystring: GamificationDailyReminderQuery;
}>;

@Controller({
  route: '/notifications',
  type: 0,
  tags: [{ name: 'notifications' }],
})
export class NotificationController {
  @Inject(NotificationService)
  service!: NotificationService;

  @GET({
    url: '/',
    options: {
      schema: {
        querystring: notificationQueryDTO,
        response: { 200: notificationResponsePaginatedDTO },
      },
      onRequest: verifyAccess,
    },
  })
  async getNotifications(
    request: GetManyNotificationRequest,
  ): Promise<NotificationResponsePaginated> {
    const [data, count] = await this.service.getAllNotificationsByUser(
      {
        ...request.query,
        $page: request.query.$page || 1,
        $limit: request.query.$limit || 10,
        $order: request.query.$order || '',
      },
      request.user,
    );

    return {
      code: 200,
      data,
      count,
    };
  }

  @GET({
    url: '/:id',
    options: {
      schema: {
        params: notificationParamsDTO,
        response: { 200: notificationResponseDTO },
      },
      onRequest: verifyAccess,
    },
  })
  async getNotificationDetailById(
    request: GetNotificationByIdRequest,
  ): Promise<NotificationResponse> {
    const data = await this.service.getNotificationById(request.params.id, request.user);

    return {
      code: 200,
      data,
    };
  }

  @GET({
    url: '/unread/count',
    options: {
      schema: {
        response: { 200: notificationCountResponseDTO },
      },
      onRequest: verifyAccess,
    },
  })
  async getUnreadNotificationCount(request: FastifyRequest): Promise<NotificationCountResponse> {
    const data = await this.service.getUnreadCountByUser(request.user);

    return {
      code: 200,
      data,
    };
  }

  @PATCH({
    url: '/read',
    options: {
      schema: {
        response: { 200: notificationResponsePaginatedDTO },
      },
      onRequest: verifyAccess,
    },
  })
  async readNotifications(request: FastifyRequest): Promise<NotificationResponsePaginated> {
    const [data, count] = await this.service.readUserNotifications(request.user);

    return {
      code: 200,
      data,
      count,
    };
  }

  @PATCH({
    url: '/read/:id',
    options: {
      schema: {
        params: notificationParamsDTO,
        response: { 200: notificationResponseDTO },
      },
      onRequest: verifyAccess,
    },
  })
  async readNotificationById(request: ReadNotificationRequest): Promise<NotificationResponse> {
    const data = await this.service.readUserNotificationById(request.params.id, request.user);

    return {
      code: 200,
      data,
    };
  }

  @POST({
    url: '/',
    options: {
      schema: {
        body: notificationBodyDTO,
      },
      onRequest: verifyAccess,
    },
  })
  async createNotification(request: CreateNotificationRequest, reply: FastifyReply) {
    await this.service.createNotification(request.body, request.user);

    return reply.code(204).send();
  }

  @GET({
    url: '/reminder/daily-gamification',
    options: {
      onRequest: [verifyAccess],
    },
  })
  async gamificationDailyReminder(request: GamificationDailyReminderRequest, reply: FastifyReply) {
    // async process, no need to wait function result
    const cityIds =
      (request.query.cityIds &&
        request.query.cityIds
          .split(',')
          .map((cityId) => parseInt(cityId, 10))
          .filter((cityId) => cityId > 0)) ||
      [];
    this.service.gamificationDailyReminder(cityIds);
    return reply.code(204).send();
  }
}
