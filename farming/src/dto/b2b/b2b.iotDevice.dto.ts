import { Static, Type } from '@sinclair/typebox';
import { IotSensorTypeEnum } from '../../datasources/entity/pgsql/IotSensor.entity';
import { Nullable } from '../../libs/utils/typebox';
import { paginationDTO } from '../common.dto';
import {
  createDeviceSensorsResponseDTO,
  createDevicesSensorsBodyDTO,
  deviceTypeDTO,
} from '../devicesSensors.dto';
import {
  sensorHistoricalDTO,
  sensorHistoricalListDTO,
  sensorHistoricalParsedResponseDTO,
  SensorTypeEnum,
} from '../sensor.dto';

export const b2bIotSensorDefaultItemDTO = Type.Object({
  id: Type.Optional(Type.String()),
  sensorCode: Type.String(),
  sensorType: Type.Enum(IotSensorTypeEnum),
  status: Type.Optional(Type.Number({ default: 1 })),
  additional: Type.Optional(Type.Object({})),
  roomId: Type.Optional(Nullable(Type.String())),
  position: Type.Optional(Nullable(Type.String())),
  ipCamera: Type.Optional(Nullable(Type.String())),
});

export const b2bIotDeviceDefaultItemDTO = Type.Object({
  deviceId: Type.String(),
  deviceName: Type.String(),
  deviceType: Type.String(),
  coopId: Type.String(),
  coopName: Type.String(),
  roomId: Type.String(),
  roomName: Type.String(),
  mac: Type.String(),
  status: Type.String(),
  sensors: Type.Array(b2bIotSensorDefaultItemDTO),
});

export const getB2BIotDevicesQueryDTO = Type.Object({
  ...Type.Partial(paginationDTO).properties,
  farmId: Type.Optional(Type.String()),
  coopId: Type.Optional(Type.String()),
  deviceType: Type.Optional(deviceTypeDTO),
  mac: Type.Optional(Type.String()),
});

export const getB2BIotDeviceItemResponseDTO = Type.Object({
  id: Type.String(),
  mac: Type.String(),
  deviceType: Type.String(deviceTypeDTO),
  farmName: Type.String(),
  farmCode: Type.String(),
  farmOwner: Type.String(),
  coopName: Type.String(),
  coopCode: Type.String(),
  buildingName: Type.String(),
  roomName: Type.String(),
  firmwareVersion: Type.String(),
  status: Type.Boolean(),
  state: Type.Boolean(),
  totalSensor: Type.Number(),
  sensors: Type.Array(
    Type.Object({
      sensorCode: Type.String(),
      position: Type.Optional(Type.String()),
    }),
  ),
  dateRegistered: Type.Date(),
});

export const getB2BIotDevicesResponseDTO = Type.Object({
  code: Type.Number(),
  data: Type.Array(getB2BIotDeviceItemResponseDTO),
  count: Type.Number(),
});

export const b2bIotDeviceDefaultParamDTO = Type.Object({
  deviceId: Type.String(),
});

export const getB2BSmartMonitoringParamDTO = Type.Object({
  ...b2bIotDeviceDefaultParamDTO.properties,
});

export const getB2BSmartMonitoringItemResponseDTO = Type.Object({
  ...b2bIotDeviceDefaultItemDTO.properties,
});

export const getB2BSmartMonitoringResponseDTO = Type.Object({
  code: Type.Number(),
  data: Type.Object({
    ...getB2BSmartMonitoringItemResponseDTO.properties,
  }),
});

export const editB2BSmartMonitoringParamDTO = Type.Object({
  ...b2bIotDeviceDefaultParamDTO.properties,
});

export const editB2BSmartMonitoringBodyDTO = Type.Object({
  ...Type.Partial(b2bIotDeviceDefaultItemDTO).properties,
  status: Type.String(),
  sensors: Type.Array(
    Type.Object({
      sensorCode: Type.String(),
      sensorType: Type.String(),
    }),
  ),
});

export const editB2BSmartMonitoringItemResponseDTO = Type.Object({
  ...b2bIotDeviceDefaultItemDTO.properties,
});

export const editB2BSmartMonitoringResponseDTO = Type.Object({
  code: Type.Number(),
  data: editB2BSmartMonitoringItemResponseDTO,
});

export const createB2BSmartMonitoringDTO = Type.Object({
  ...createDevicesSensorsBodyDTO.properties,
  coopId: Type.String(),
  roomId: Type.String(),
  sensors: Type.Array(b2bIotSensorDefaultItemDTO),
});

export const editB2BIotDeviceParamDTO = Type.Object({
  ...b2bIotDeviceDefaultParamDTO.properties,
});

export const editB2BIotDeviceBodyDTO = Type.Object({
  deviceId: Type.Optional(Type.String()),
  deviceName: Type.String(),
  status: Type.Optional(Type.String({ default: '1' })),
  isOnline: Type.Optional(Type.String({ default: '1' })),
});

export const editB2BIotDeviceItemResponseDTO = Type.Object({
  ...editB2BIotDeviceBodyDTO.properties,
});

export const editB2BIotDeviceResponseDTO = Type.Object({
  code: Type.Number(),
  data: editB2BIotDeviceBodyDTO,
});

export const createB2BSmartMonitoringResponseDTO = Type.Object({
  ...createDeviceSensorsResponseDTO.properties,
});

export const reRegisterB2BSmartMonitoringParamDTO = Type.Object({
  deviceId: Type.String(),
});

export const reRegisterB2BSmartMonitoringResponseDTO = Type.Object({
  code: Type.Number(),
  data: Type.Object({
    message: Type.String(),
  }),
});

export const getSmartMonitoringLatestConditionDTO = Type.Object({
  ...b2bIotDeviceDefaultParamDTO.properties,
});

export const getSmartMonitoringLatestConditionQueryDTO = Type.Object({
  roomId: Type.Optional(Type.String()),
  sensorCode: Type.Optional(Type.String()),
});

export const getSmartMonitoringLatestConditionItemResponseDTO = Type.Any();

export const getSmartMonitoringLatestConditionResponseDTO = Type.Object({
  code: Type.Number(),
  data: getSmartMonitoringLatestConditionItemResponseDTO,
});

export const getB2BSmartMonitoringByCoopAndRoomIdDTO = Type.Object({
  coopId: Type.String(),
  roomId: Type.String(),
});

export const getB2BSmartMonitoringByCoopAndRoomIdResponseDTO = Type.Object({
  mac: Type.String(),
  deviceId: Type.String(),
  deviceName: Type.String(),
  deviceType: Type.String(),
  deviceSummary: Type.Any(),
  sensorCount: Type.Optional(Type.Number()),
});

export const getB2BSmartMonitoringHistoricalParamDTO = Type.Object({
  ...b2bIotDeviceDefaultParamDTO.properties,
});

export const getB2BSmartMonitoringHistoricalQueryDTO = Type.Object({
  sensorType: Type.Enum(SensorTypeEnum),
  sensorCode: Type.Optional(Type.String()),
  from: Type.Optional(Type.String({ format: 'date-time' })),
  to: Type.Optional(Type.String({ format: 'date-time' })),
  days: Type.Optional(Type.String({ default: '-1' })),
});

export const getB2BSmartMonitoringHistoricalItemResponseDTO = Type.Object({
  ...sensorHistoricalDTO.properties,
  benchmark: Nullable(Type.Optional(sensorHistoricalListDTO)),
});

export const getB2BSmartMonitoringHistoricalResponseDTO = Type.Object({
  ...sensorHistoricalParsedResponseDTO.properties,
});

export const deleteAllB2BIotDeviceParamDTO = Type.Object({
  deviceId: Type.String(),
  roomId: Type.String(),
});

export const deleteAllB2BIotDeviceResponseDTO = Type.Object({
  code: Type.Number(),
  data: Type.Object({
    message: Type.String(),
  }),
});

export type GetB2BIotDevicesQuery = Static<typeof getB2BIotDevicesQueryDTO>;

export type GetB2BIotDeviceItemResponse = Static<typeof getB2BIotDeviceItemResponseDTO>;

export type GetB2BIotDevicesResponse = Static<typeof getB2BIotDevicesResponseDTO>;

export type GetB2BSmartMonitoringParam = Static<typeof getB2BSmartMonitoringParamDTO>;

export type GetB2BSmartMonitoringItemResponse = Static<typeof getB2BSmartMonitoringItemResponseDTO>;

export type GetB2BSmartMonitoringResponse = Static<typeof getB2BSmartMonitoringResponseDTO>;

export type EditB2BSmartMonitoringParam = Static<typeof editB2BSmartMonitoringParamDTO>;

export type EditB2BSmartMonitoringBody = Static<typeof editB2BSmartMonitoringBodyDTO>;

export type EditB2BSmartMonitoringItemResponse = Static<
  typeof editB2BSmartMonitoringItemResponseDTO
>;

export type EditB2BSmartMonitoringResponse = Static<typeof editB2BSmartMonitoringResponseDTO>;

export type CreateB2BSmartMonitoringBody = Static<typeof createB2BSmartMonitoringDTO>;

export type CreateB2BSmartMonitoringResponse = Static<typeof createB2BSmartMonitoringResponseDTO>;

export type EditB2BIotDeviceParam = Static<typeof editB2BIotDeviceParamDTO>;

export type EditB2BIotDeviceBody = Static<typeof editB2BIotDeviceBodyDTO>;

export type EditB2BIotDeviceItemResponse = Static<typeof editB2BIotDeviceItemResponseDTO>;

export type EditB2BIotDeviceResponse = Static<typeof editB2BIotDeviceResponseDTO>;

export type ReRegisterB2BSmartMonitoringParam = Static<typeof reRegisterB2BSmartMonitoringParamDTO>;

export type ReRegisterB2BSmartMonitoringResponse = Static<
  typeof reRegisterB2BSmartMonitoringResponseDTO
>;

export type GetSmartMonitoringLatestConditionParam = Static<
  typeof getSmartMonitoringLatestConditionDTO
>;

export type GetSmartMonitoringLatestConditionQuery = Static<
  typeof getSmartMonitoringLatestConditionQueryDTO
>;

export type GetSmartMonitoringLatestConditionItemResponse = Static<
  typeof getSmartMonitoringLatestConditionItemResponseDTO
>;

export type GetSmartMonitoringLatestConditionResponse = Static<
  typeof getSmartMonitoringLatestConditionResponseDTO
>;

export type GetB2BSmartMonitoringByCoopAndRoomId = Static<
  typeof getB2BSmartMonitoringByCoopAndRoomIdDTO
>;

export type GetB2BSmartMonitoringByCoopAndRoomIdResponse = Static<
  typeof getB2BSmartMonitoringByCoopAndRoomIdResponseDTO
>;

export type GetB2BSmartMonitoringHistoricalParam = Static<
  typeof getB2BSmartMonitoringHistoricalParamDTO
>;

export type GetB2BSmartMonitoringHistoricalQuery = Static<
  typeof getB2BSmartMonitoringHistoricalQueryDTO
>;

export type GetB2BSmartMonitoringHistoricalItemResponse = Static<
  typeof getB2BSmartMonitoringHistoricalItemResponseDTO
>;

export type GetB2BSmartMonitoringHistoricalResponse = Static<
  typeof getB2BSmartMonitoringHistoricalResponseDTO
>;

export type DeleteAllB2BIotDeviceParam = Static<typeof deleteAllB2BIotDeviceParamDTO>;

export type DeleteAllB2BIotDeviceResponse = Static<typeof deleteAllB2BIotDeviceResponseDTO>;
