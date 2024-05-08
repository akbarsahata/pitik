import { Static, Type } from '@sinclair/typebox';

export const crowdednessFcmPayloadDTO = Type.Object({
  jobId: Type.String(),
});

export const createNotificationBodyDTO = Type.Object({
  channel: Type.KeyOf(
    Type.Object({
      FCM: Type.String(),
      EMAIL: Type.String(),
    }),
  ),
  templateName: Type.KeyOf(
    Type.Object({
      crowdednessFCM: Type.String(),
    }),
  ),
  payload: Type.Optional(crowdednessFcmPayloadDTO),
});

export const createNotificationResponseDTO = Type.Object({
  code: Type.Number(),
  data: Type.Object({
    message: Type.String(),
  }),
});

export type CrowdednessFcmPayload = Static<typeof crowdednessFcmPayloadDTO>;

export type CreateNotificationBody = Static<typeof createNotificationBodyDTO>;

export type CreateNotificationResponse = Static<typeof createNotificationResponseDTO>;
