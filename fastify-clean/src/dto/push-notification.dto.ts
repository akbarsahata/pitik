import { Static, Type } from '@sinclair/typebox';
import { notificationAdditionalParametersDTO, notificationBodyDTO } from './notification.dto';

export const pushNotificationJobDTO = Type.Object({
  userReceivers: Type.Array(Type.String()),
  content: Type.Object({
    priority: Type.Optional(Type.String({ default: 'high' })),
    id: Type.Optional(Type.String()),
    type: Type.String(),
    headline: Type.String(),
    subHeadline: Type.String(),
    body: Type.String(),
    target: Type.Optional(Type.String()),
    additionalParameters: Type.Optional(notificationAdditionalParametersDTO),
  }),
  notification: notificationBodyDTO,
});

export type PushNotificationJob = Static<typeof pushNotificationJobDTO>;
