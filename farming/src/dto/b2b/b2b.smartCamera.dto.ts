import { Static, Type } from '@sinclair/typebox';
import { Nullable } from '../../libs/utils/typebox';
import { paginationDTO } from '../common.dto';

// Base
export const roomResponseItem = Type.Object({
  id: Type.String(),
  roomCode: Type.String(),
});

export const roomTypeItemDTO = Type.Object({
  id: Type.String(),
  name: Type.String(),
});

export const buildingItemDTO = Type.Object({
  id: Type.String(),
  name: Type.String(),
});

export const coopResponseItem = Type.Object({
  id: Type.String(),
  coopCode: Type.String(),
  coopName: Type.String(),
  farm: Type.Object({
    id: Type.String(),
    farmCode: Type.String(),
    farmName: Type.String(),
  }),
});

export const sensorResponseItemDTO = Type.Object({
  id: Type.String(),
  sensorCode: Type.String(),
  sensorType: Type.String(),
  position: Type.String(),
  status: Type.Number(),
  additional: Type.Optional(Type.Object({})),
  ipCamera: Nullable(Type.String()),
  room: roomResponseItem,
});

export const devicesResponseItemDTO = Type.Object({
  id: Type.String(),
  deviceType: Type.String(),
  totalFan: Type.Number(),
  heaterId: Type.Optional(Type.String()),
  coolingPad: Type.Boolean(),
  lamp: Type.Boolean(),
  totalCamera: Type.Number(),
  phoneNumber: Nullable(Type.String()),
  registrationDate: Type.String(),
  status: Type.String(),
  isOnline: Type.Boolean(),
  mac: Type.String(),
  firmWareVersion: Nullable(Type.String()),
  sensors: Type.Array(sensorResponseItemDTO),
  farmId: Type.String(),
  buildingId: Type.String(),
  coopId: Type.String(),
  coop: coopResponseItem,
  roomId: Type.String(),
  room: roomResponseItem,
  errors: Type.Optional(
    Type.Array(
      Type.Object({
        code: Type.String(),
        description: Type.String(),
      }),
    ),
  ),
  createdDate: Type.String(),
  modifiedDate: Type.String(),
});

export const getDeviceSensorResponseItemDTO = Type.Object({
  ...Type.Omit(devicesResponseItemDTO, ['farmId', 'buildingId', 'coopId', 'roomId', 'heaterId'])
    .properties,
});

// POST /b2b/iot-devices/smart-camera/register
export const createB2BSmartCameraBodyDTO = Type.Object({
  ...Type.Pick(devicesResponseItemDTO, ['coopId', 'roomId', 'mac']).properties,
  sensors: Type.Array(
    Type.Object({
      ...Type.Pick(sensorResponseItemDTO, ['sensorCode']).properties,
    }),
  ),
});

export const createB2BSmartCameraResponseDTO = Type.Object({
  code: Type.Number(),
  data: getDeviceSensorResponseItemDTO,
});

// GET /b2b/iot-devices/smart-camera/:coopId/records
export const smartCameraRecordsItemDTO = Type.Object({
  sensor: Type.Object({
    id: Type.String(),
    sensorCode: Type.String(),
    sensorType: Type.String(),
    position: Type.String(),
    status: Type.Number(),
    additional: Type.Optional(Type.Object({})),
    ipCamera: Nullable(Type.String()),
    room: Type.Object({
      id: Type.String(),
      roomCode: Type.String(),
      roomType: roomTypeItemDTO,
      building: buildingItemDTO,
      coop: coopResponseItem,
    }),
  }),
  recordCount: Type.Number(),
});

export const getSmartCameraRecordsParamsDTO = Type.Object({
  coopId: Type.String(),
});

export const getSmartCameraRecordsQueryDTO = Type.Object({
  roomId: Type.Optional(Type.String()),
});

export const getSmartCameraRecordsResponseDTO = Type.Object({
  code: Type.Number(),
  count: Type.Number(),
  data: Type.Array(smartCameraRecordsItemDTO),
});

// POST /b2b/iot-devices/smart-camera/jobs/:coopId
export const createCoopJobParamsDTO = Type.Object({
  coopId: Type.String(),
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
    TEMPERATURE_OR_HUMIDITY: Type.String(),
    RECORDER: Type.String(),
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

// GET /b2b/iot-devices/smart-camera/:coopId/records/:day
export const getRecordImagesParamsDTO = Type.Object({
  coopId: Type.String(),
});

export const getRecordImagesQueryDTO = Type.Object({
  ...Type.Partial(paginationDTO).properties,
  sensorId: Type.Optional(Type.String()),
  startDate: Type.Optional(Type.String({ format: 'date-time' })),
  endDate: Type.Optional(Type.String({ format: 'date-time' })),
});

// GET /b2b/iot-devices/smart-camera/:coopId/records
export const getRecordImagesBySensorIdParamsDTO = Type.Object({
  coopId: Type.String(),
  sensorId: Type.String(),
});

// GET /b2b/iot-devices/smart-camera/:coopId/records/:day/:sensorId
export const getRecordImagesBySensorIdQueryDTO = Type.Object({
  ...Type.Partial(paginationDTO).properties,
  $limit: Type.Number(),
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
    buildingName: Type.String(),
    roomTypeName: Type.String(),
    records: Nullable(Type.Array(imageDataItemDTO)),
  }),
});

export const cameraItemDTO = Type.Object({
  id: Type.String(),
  sensorCode: Type.String(),
  sensorType: Type.String(),
  position: Nullable(Type.String()),
  status: Type.Number(),
  additional: Nullable(Type.Object({})),
  roomId: Nullable(Type.String()),
  room: roomItemDTO,
  recordCount: Type.Number({
    default: 0,
  }),
});

// PATCH /b2b/iot-devices/smart-camera/:deviceId/rename
export const renameSmartCameraParamsDTO = Type.Object({
  deviceId: Type.String(),
});

export const renameSmartCameraBodyDTO = Type.Object({
  deviceName: Type.String(),
});

export const renameSmartCameraResponseDTO = Type.Object({
  code: Type.Number(),
  data: Type.Object({
    deviceId: Type.String(),
    deviceName: Type.String(),
  }),
});

// PATCH /b2b/iot-devices/smart-camera/:deviceId/edit
export const editSmartCameraParamsDTO = Type.Object({
  deviceId: Type.String(),
});

export const editSmartCameraBodyDTO = Type.Object({
  status: Type.String(),
  sensors: Type.Array(
    Type.Object({
      ...Type.Pick(sensorResponseItemDTO, ['sensorCode']).properties,
    }),
  ),
});

export const editSmartCameraResponseDTO = Type.Object({
  code: Type.Number(),
  data: getDeviceSensorResponseItemDTO,
});

export type GetDeviceSensorResponseItem = Static<typeof getDeviceSensorResponseItemDTO>;

export type CreateB2BSmartCameraBody = Static<typeof createB2BSmartCameraBodyDTO>;

export type CreateB2BSmartCameraResponse = Static<typeof createB2BSmartCameraResponseDTO>;

export type GetSmartCameraRecordsParams = Static<typeof getSmartCameraRecordsParamsDTO>;

export type GetSmartCameraRecordsQueryDTO = Static<typeof getSmartCameraRecordsQueryDTO>;

export type SmartCameraRecordsItem = Static<typeof smartCameraRecordsItemDTO>;

export type GetSmartCameraRecordsResponse = Static<typeof getSmartCameraRecordsResponseDTO>;

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

export type RenameSmartCameraParams = Static<typeof renameSmartCameraParamsDTO>;

export type RenameSmartCameraBody = Static<typeof renameSmartCameraBodyDTO>;

export type RenameSmartCameraResponse = Static<typeof renameSmartCameraResponseDTO>;

export type EditSmartCameraParams = Static<typeof editSmartCameraParamsDTO>;

export type EditSmartCameraBody = Static<typeof editSmartCameraBodyDTO>;

export type EditSmartCameraResponse = Static<typeof editSmartCameraResponseDTO>;
