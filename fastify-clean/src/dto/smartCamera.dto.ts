import { Static, Type } from '@sinclair/typebox';
import { Nullable } from '../libs/utils/typebox';
import { paginationDTO } from './common.dto';

export const createJobRequestBodyDTO = Type.Object({
  jobId: Type.Optional(Type.String()),
  sensorCode: Type.String(),
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

export const smartCameraDayRecordsItemDTO = Type.Object({
  day: Type.Number(),
  date: Type.String({ type: 'date' }),
  recordCount: Type.Number(),
});

export const getSmartCameraDayRecordsParamsDTO = Type.Object({
  coopId: Type.String(),
});

export const getSmartCameraDayRecordsResponseDTO = Type.Object({
  code: Type.Number(),
  count: Type.Number(),
  data: Type.Array(smartCameraDayRecordsItemDTO),
});

export const createCoopJobParamsDTO = Type.Object({
  coopId: Type.String(),
});

export const roomTypeItemDTO = Type.Object({
  id: Type.String(),
  name: Type.String(),
});

export const buildingItemDTO = Type.Object({
  id: Type.String(),
  name: Type.String(),
});

export const roomItemDTO = Type.Object({
  id: Type.String(),
  roomCode: Type.String(),
  roomType: roomTypeItemDTO,
  building: buildingItemDTO,
});

const sensorTypeEnum = Type.KeyOf(
  Type.Object({
    XIAOMI_SENSOR: Type.String(),
    AMMONIA: Type.String(),
    LIGHT: Type.String(),
    WIND_SPEED: Type.String(),
    TEMPERATURE_SENSOR: Type.String(),
    HUMIDITY_SENSOR: Type.String(),
    CAMERA: Type.String(),
  }),
);

export const sensorItemDTO = Type.Object({
  id: Type.String(),
  sensorCode: Type.String(),
  sensorType: sensorTypeEnum,
  position: Nullable(Type.String()),
  room: roomItemDTO,
});

export const recordItemDTO = Type.Object({
  temperature: Type.Number(),
  humidity: Type.Number(),
  createdAt: Type.String(),
  link: Type.String(),
  sensor: sensorItemDTO,
});

export const getRecordImagesParamsDTO = Type.Object({
  coopId: Type.String(),
  day: Type.Number({ minimum: 0 }),
});

export const getRecordImagesQueryDTO = Type.Object({
  ...Type.Partial(paginationDTO).properties,
  sensorId: Type.Optional(Type.String()),
  startDate: Type.Optional(Type.String({ format: 'date-time' })),
  endDate: Type.Optional(Type.String({ format: 'date-time' })),
});

export const getRecordImagesBySensorIdParamsDTO = Type.Object({
  coopId: Type.String(),
  day: Type.Number({ minimum: 0 }),
  sensorId: Type.String(),
});

export const getRecordImagesBySensorIdQueryDTO = Type.Object({
  ...Type.Partial(paginationDTO).properties,
  startDate: Type.Optional(Type.String({ format: 'date-time' })),
  endDate: Type.Optional(Type.String({ format: 'date-time' })),
});

export const imageDataItemDTO = Type.Object({
  seqNo: Type.Optional(Type.Number()),
  jobId: Type.String(),
  sensor: sensorItemDTO,
  temperature: Nullable(Type.Number()),
  humidity: Nullable(Type.Number()),
  createdAt: Nullable(Type.String({ type: 'date-time' })),
  link: Nullable(Type.String()),
  isCrowded: Nullable(Type.Boolean()),
  remarks: Type.Optional(Type.String()),
});

export const recordImagesItemDTO = Type.Object({
  date: Type.String({ type: 'date' }),
  records: Type.Array(imageDataItemDTO),
});

export const getRecordImagesResponseDTO = Type.Object({
  code: Type.Number(),
  count: Type.Number(),
  data: Nullable(recordImagesItemDTO),
});

export const getRecordImagesBySensorIdResponseDTO = Type.Object({
  code: Type.Number(),
  count: Type.Number(),
  data: Type.Object({
    date: Nullable(Type.String({ type: 'date' })),
    buildingName: Type.String(),
    roomTypeName: Type.String(),
    records: Nullable(Type.Array(imageDataItemDTO)),
  }),
});

export const evaluateImageParamsDTO = Type.Object({
  jobId: Type.String(),
});

export const evaluateImageBodyDTO = Type.Object({
  isCrowded: Type.Boolean(),
  remarks: Type.Optional(Nullable(Type.String())),
});

export const evaluateImageResponseDTO = Type.Object({
  code: Type.Number(),
  data: evaluateImageBodyDTO,
});

export const getCamerasParamDTO = Type.Object({
  coopId: Type.String(),
  day: Type.Number(),
});

export const cameraItemDTO = Type.Object({
  id: Type.String(),
  sensorCode: Type.String(),
  sensorType: sensorTypeEnum,
  position: Nullable(Type.String()),
  status: Type.Number(),
  // FIXME: Additional values are still unknown
  additional: Nullable(Type.Object({})),
  roomId: Nullable(Type.String()),
  room: roomItemDTO,
  recordCount: Type.Number({
    default: 0,
  }),
});

export const getCameraResponseDTO = Type.Object({
  code: Type.Number(),
  count: Type.Number(),
  data: Type.Array(cameraItemDTO),
});

export type CreateJobRequestBody = Static<typeof createJobRequestBodyDTO>;

export type CreateJobResponseItem = Static<typeof createJobResponseItemDTO>;

export type CreateJobResponse = Static<typeof createJobResponseDTO>;

export type GetSmartCameraDayRecordsParams = Static<typeof getSmartCameraDayRecordsParamsDTO>;

export type SmartCameraDayRecordsItem = Static<typeof smartCameraDayRecordsItemDTO>;

export type GetSmartCameraDayRecordsResponse = Static<typeof getSmartCameraDayRecordsResponseDTO>;

export type CreateCoopJobParams = Static<typeof createCoopJobParamsDTO>;

export type RecordItem = Static<typeof recordItemDTO>;

export type GetRecordImagesParams = Static<typeof getRecordImagesParamsDTO>;

export type GetRecordImagesBySensorIdParams = Static<typeof getRecordImagesBySensorIdParamsDTO>;

export type GetRecordImagesQuery = Static<typeof getRecordImagesQueryDTO>;

export type GetRecordImagesBySensorIdQuery = Static<typeof getRecordImagesBySensorIdQueryDTO>;

export type ImageDataItem = Static<typeof imageDataItemDTO>;

export type RecordImagesItem = Static<typeof recordImagesItemDTO>;

export type GetRecordImagesResponse = Static<typeof getRecordImagesResponseDTO>;

export type GetRecordImagesBySensorIdResponse = Static<typeof getRecordImagesBySensorIdResponseDTO>;

export type EvaluateImageParams = Static<typeof evaluateImageParamsDTO>;

export type EvaluateImageBody = Static<typeof evaluateImageBodyDTO>;

export type EvaluateImageResponse = Static<typeof evaluateImageResponseDTO>;

export type GetCamerasParam = Static<typeof getCamerasParamDTO>;

export type GetCameraResponse = Static<typeof getCameraResponseDTO>;
