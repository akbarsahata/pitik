/* eslint-disable no-unused-vars */
import { Static, Type } from '@sinclair/typebox';
import { Nullable } from '../libs/utils/typebox';
import { paginationDTO } from './common.dto';

export enum SensorTypeEnum {
  temperature = 'temperature',
  relativeHumidity = 'relativeHumidity',
  heatStressIndex = 'heatStressIndex',
  ammonia = 'ammonia',
  lights = 'lights',
  wind = 'wind',
}

export const roomTypeItemDTO = Type.Object({
  id: Type.String(),
  name: Type.String(),
  isActive: Type.String(),
});

export const buildingItemDTO = Type.Object({
  id: Type.String(),
  name: Type.String(),
  isActive: Type.String(),
});

export const coopItemDTO = Type.Object({
  id: Type.String(),
  coopCode: Type.String(),
  coopName: Type.String(),
  status: Type.Boolean(),
});

export const roomItemDTO = Type.Object({
  id: Type.String(),
  roomCode: Type.String(),
  roomType: roomTypeItemDTO,
  building: buildingItemDTO,
  coop: coopItemDTO,
});

export const iotSensorItemDTO = Type.Object({
  id: Type.String(),
  sensorCode: Type.String(),
  sensorType: Type.String(),
  position: Type.String(),
  status: Type.Number(),
  // FIXME: Additional values are still unknown
  additional: Nullable(Type.Object({})),
  roomId: Type.String(),
  room: roomItemDTO,
});

export const getSensorQueryDTO = Type.Object({
  ...Type.Partial(paginationDTO).properties,
  sensorCode: Type.Optional(Type.String()),
  sensorType: Type.Optional(Type.Enum(SensorTypeEnum)),
  position: Type.Optional(Type.String()),
  status: Type.Optional(Type.Number()),
  roomId: Type.Optional(Type.String()),
  buildingId: Type.Optional(Type.String()),
  coopId: Type.Optional(Type.String()),
});

export const getSensorResponseDTO = Type.Object({
  code: Type.Number(),
  count: Type.Number(),
  data: Type.Array(iotSensorItemDTO),
});

export const sensorListQueryDTO = Type.Object({
  roomId: Type.Optional(Type.String()),
  coopId: Type.Optional(Type.String()),
  buildingId: Type.Optional(Type.String()),
  sensorType: Type.Optional(Type.Enum(SensorTypeEnum)),
});

export const sensorItemListResponseDTO = Type.Object({
  id: Type.String(),
  sensorCode: Type.String(),
  position: Nullable(Type.String()),
  sensorType: Type.String(),
});

export const sensorListResponseDTO = Type.Object({
  code: Type.Number(),
  count: Type.Number(),
  data: Type.Array(sensorItemListResponseDTO),
});

export const sensorLatestConditionQueryDTO = Type.Object({
  farmingCycleId: Type.String(),
  roomId: Type.Optional(Type.String()),
});

export const sensorHistoricalQueryDTO = Type.Object({
  farmingCycleId: Type.String(),
  farmId: Type.Optional(Type.String()),
  coopId: Type.Optional(Type.String()),
  sensorType: Type.Enum(SensorTypeEnum),
  from: Type.Optional(Type.String({ format: 'date-time' })),
  to: Type.Optional(Type.String({ format: 'date-time' })),
  days: Type.Optional(Type.String()),
  roomId: Type.Optional(Type.String()),
});

export const sensorLatestConditionDTO = Type.Object({
  temperature: Type.Optional(
    Type.Object({
      value: Type.Number(),
      uom: Type.String(),
      status: Type.String(),
    }),
  ),
  relativeHumidity: Type.Optional(
    Type.Object({
      value: Type.Number(),
      uom: Type.String(),
      status: Type.String(),
    }),
  ),
  heatStressIndex: Type.Optional(
    Type.Object({
      value: Type.Number(),
      uom: Type.String(),
      status: Type.String(),
    }),
  ),
  ammonia: Type.Optional(
    Type.Object({
      value: Type.Number(),
      uom: Type.String(),
      status: Type.String(),
    }),
  ),
  lights: Type.Optional(
    Type.Object({
      value: Type.Number(),
      uom: Type.String(),
      status: Type.String(),
    }),
  ),
  wind: Type.Optional(
    Type.Object({
      value: Type.Number(),
      uom: Type.String(),
      status: Type.String(),
    }),
  ),
});

export const sensorLatestConditionResponseDTO = Type.Object({
  data: sensorLatestConditionDTO,
});

export const iotSensorsDTO = Type.Object({
  iotSensors: Type.Array(
    Type.Object({
      sensorCode: Type.Optional(Type.String()),
      position: Type.Optional(Type.String()),
    }),
  ),
});

export const sensorHistoricalItemDTO = Type.Object({
  value: Type.Union([
    Type.Number(),
    Type.Object({
      min: Type.Optional(Type.Number()),
      max: Type.Optional(Type.Number()),
    }),
  ]),
  created: Type.String(),
});

export const sensorHistoricalListDTO = Type.Array(sensorHistoricalItemDTO);

export const sensorHistoricalDTO = Type.Object({
  current: sensorHistoricalListDTO,
  benchmark: sensorHistoricalListDTO,
});

export const sensorHistoricalResponseDTO = Type.Object({
  data: sensorHistoricalDTO,
});

export const sensorHistoricalParsedResponseDTO = Type.Object({
  code: Type.Number(),
  data: Type.Array(
    Type.Object({
      current: Type.Number(),
      label: Type.String(),
      benchmarkMin: Type.Optional(Type.Number()),
      benchmarkMax: Type.Optional(Type.Number()),
    }),
  ),
});

export const sensorHistoricalMappedDTO = Type.Object({
  labels: Type.Array(Type.String()),
  current: Type.Array(Type.Number()),
  previous: Type.Optional(Type.Array(Type.Number())),
  benchmark: Type.Optional(Type.Array(Type.Number())),
});

export type IotSensorItem = Static<typeof iotSensorItemDTO>;

export type GetSensorQuery = Static<typeof getSensorQueryDTO>;

export type GetSensorResponse = Static<typeof getSensorResponseDTO>;

export type SensorListQuery = Static<typeof sensorListQueryDTO>;

export type SensorItemList = Static<typeof sensorItemListResponseDTO>;

export type SensorListResponse = Static<typeof sensorListResponseDTO>;

export type SensorLatestConditionQuery = Static<typeof sensorLatestConditionQueryDTO>;

export type SensorLatestCondition = Static<typeof sensorLatestConditionDTO>;

export type SensorLatestConditionResponse = Static<typeof sensorLatestConditionResponseDTO>;

export type SensorHistoricalQuery = Static<typeof sensorHistoricalQueryDTO>;

export type SensorHistoricalItem = Static<typeof sensorHistoricalItemDTO>;

export type SensorHistoricalList = Static<typeof sensorHistoricalListDTO>;

export type SensorHistorical = Static<typeof sensorHistoricalDTO>;

export type SensorHistoricalResponse = Static<typeof sensorHistoricalResponseDTO>;

export type SensorHistoricalMapped = Static<typeof sensorHistoricalMappedDTO>;

export type SensorTypes = keyof typeof SensorTypeEnum;

export type SensorHistoricalParsedResponse = Static<typeof sensorHistoricalParsedResponseDTO>;
