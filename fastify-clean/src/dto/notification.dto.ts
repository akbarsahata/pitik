import { Static, Type } from '@sinclair/typebox';
import { Nullable } from '../libs/utils/typebox';
import { paginationDTO } from './common.dto';

export const coopPerformanceItemDTO = Type.Object({
  bw: Type.Optional(
    Type.Object({
      actual: Type.Number(),
      standard: Type.Number(),
    }),
  ),
  ip: Type.Optional(
    Type.Object({
      actual: Type.Number(),
      standard: Type.Number(),
    }),
  ),
});

export const coopItemDTO = Type.Object({
  id: Type.String(),
  coopName: Type.String(),
  coopDistrict: Type.String(),
  coopCity: Type.String(),
  isNew: Type.Boolean(),
  period: Type.Number(),
  day: Type.Number(),
  farmingCycleId: Type.String(),
  farmId: Type.String(),
  startDate: Type.Optional(Type.String()),
  isActionNeeded: Type.Boolean(),
  ...coopPerformanceItemDTO.properties,
});

export const notificationAdditionalParametersDTO = Type.Object({
  type: Type.Optional(Type.String()),
  taskId: Type.Optional(Type.String()),
  coopId: Type.Optional(Type.String()),
  alertId: Type.Optional(Type.String()),
  taskDate: Type.Optional(Type.String()),
  alertDate: Type.Optional(Type.String()),
  farmingCycleId: Type.Optional(Type.String()),
  coop: Type.Optional(coopItemDTO),
  day: Type.Optional(Type.Number()),
});

export const notificationBodyDTO = Type.Object({
  subjectId: Type.String(),
  notificationType: Type.String(),
  headline: Type.String(),
  subHeadline: Type.String(),
  icon: Type.Optional(Type.String()),
  iconPath: Type.Optional(Type.String()),
  referenceId: Type.Optional(Type.String()),
  target: Type.Optional(Type.String()),
  additionalParameters: Type.Optional(notificationAdditionalParametersDTO),
});

export const notificationItemDTO = Type.Object({
  id: Type.String(),
  userId: Type.String(),
  subjectId: Type.String(),
  notificationType: Type.String(),
  headline: Type.String(),
  subHeadline: Type.String(),
  icon: Type.Optional(Type.String()),
  iconPath: Type.Optional(Type.String()),
  target: Type.Optional(Type.String()),
  additionalParameters: Nullable(notificationAdditionalParametersDTO),
  isRead: Type.Boolean(),
  createdDate: Type.String({ format: 'date-time' }),
  modifiedDate: Type.String({ format: 'date-time' }),
});

export const notificationListDTO = Type.Array(notificationItemDTO);

export const notificationQueryDTO = Type.Object({
  ...paginationDTO.properties,
  $order: Type.Optional(Type.String()),
});

export const notificationParamsDTO = Type.Object({
  id: Type.String(),
});

export const notificationResponseDTO = Type.Object({
  data: notificationItemDTO,
});

export const notificationCountResponseDTO = Type.Object({
  data: Type.Integer(),
});

export const notificationResponsePaginatedDTO = Type.Object({
  data: notificationListDTO,
  count: Type.Integer(),
});

export const gamificationDailyReminderQueryDTO = Type.Object({
  cityIds: Type.String(),
});

export type NotificationBody = Static<typeof notificationBodyDTO>;

export type NotificationItem = Static<typeof notificationItemDTO>;

export type NotificationList = Static<typeof notificationListDTO>;

export type NotificationQuery = Static<typeof notificationQueryDTO>;

export type NotificationParams = Static<typeof notificationParamsDTO>;

export type NotificationResponse = Static<typeof notificationResponseDTO>;

export type NotificationCountResponse = Static<typeof notificationCountResponseDTO>;

export type NotificationResponsePaginated = Static<typeof notificationResponsePaginatedDTO>;

export type GamificationDailyReminderQuery = Static<typeof gamificationDailyReminderQueryDTO>;
