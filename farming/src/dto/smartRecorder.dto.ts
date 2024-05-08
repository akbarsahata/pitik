import { Static, Type } from '@sinclair/typebox';

export const createJobRequestBodyDTO = Type.Object({
  jobId: Type.Optional(Type.String()),
  sensorCode: Type.String(),
  capturedAt: Type.Optional(Type.String()),
});

export const createJobResponseItemDTO = Type.Object({
  jobId: Type.String(),
  bucket: Type.String(),
  httpMethod: Type.String(),
  pathFile: Type.String(),
  presignedUrl: Type.String(),
});

export const createJobResponseDTO = Type.Object({
  code: Type.Number(),
  data: createJobResponseItemDTO,
});

export type CreateJobRequestBody = Static<typeof createJobRequestBodyDTO>;

export type CreateJobResponseItem = Static<typeof createJobResponseItemDTO>;

export type CreateJobResponse = Static<typeof createJobResponseDTO>;
