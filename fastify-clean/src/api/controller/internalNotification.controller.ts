import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, Inject, POST } from 'fastify-decorators';
import {
  CreateNotificationBody,
  createNotificationBodyDTO,
  CreateNotificationResponse,
  createNotificationResponseDTO,
  crowdednessFcmPayloadDTO,
} from '../../dto/internalNotification.dto';
import { NotificationServiceQueue } from '../../jobs/queues/notification-service.queue';
import { ERR_INVALID_NOTIFICATION_PAYLOAD } from '../../libs/constants/errors';
import { NOTIFICATION_TEMPLATE_NAME } from '../../libs/constants/notification';
import { validateType } from '../../libs/utils/helpers';
import { Logger } from '../../libs/utils/logger';
import { verifyInternalRequest } from '../hooks/onRequest/verifyInternalRequest';

@Controller({
  route: '/',
  type: 0,
  tags: [{ name: 'internal-notifications' }],
})
export class InternalNotificationController {
  @Inject(Logger)
  private logger: Logger;

  @Inject(NotificationServiceQueue)
  private notificationServiceQueue: NotificationServiceQueue;

  @POST({
    url: '/internal/notifications',
    options: {
      schema: {
        body: createNotificationBodyDTO,
        response: {
          201: createNotificationResponseDTO,
        },
      },
      onRequest: verifyInternalRequest,
    },
  })
  async createNotification(
    req: FastifyRequest<{
      Body: CreateNotificationBody;
    }>,
    reply: FastifyReply,
  ): Promise<CreateNotificationResponse> {
    const { payload } = req.body;

    let validationError: string | null;
    switch (req.body.templateName) {
      case NOTIFICATION_TEMPLATE_NAME.crowdednessFCM:
        validationError = validateType(crowdednessFcmPayloadDTO, payload);
        break;
      default:
        throw new Error('missing payload validation for this template');
    }

    if (validationError) {
      this.logger.info(validationError);
      throw ERR_INVALID_NOTIFICATION_PAYLOAD(validationError);
    }

    await this.notificationServiceQueue.addJob(req.body);

    return reply.code(201).send({
      code: 201,
      data: {
        message: 'OK',
      },
    });
  }
}
