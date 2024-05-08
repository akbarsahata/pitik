/* eslint-disable no-unused-vars */
import { Static, Type } from '@sinclair/typebox';
import { Nullable } from '../../libs/utils/typebox';

// Base
export const deviceTypeDTO = Type.KeyOf(
  Type.Object({
    SMART_MONITORING: Type.String(),
    SMART_CONTROLLER: Type.String(),
    SMART_CAMERA: Type.String(),
    SMART_CONVENTRON: Type.String(),
    SMART_ELMON: Type.String(),
    SMART_SCALE: Type.String(),
    SMART_AUDIO: Type.String(),
  }),
);

export enum IntervalOptionsEnum {
  m10 = 10,
  m30 = 30,
  h1 = 60,
  h3 = 180,
  h12 = 720,
  d1 = 1440,
}

export const roomTypeResponseItemDTO = Type.Object({
  id: Type.String(),
  name: Type.String(),
});

export const roomResponseItemDTO = Type.Object({
  id: Type.String(),
  roomCode: Type.String(),
  roomType: roomTypeResponseItemDTO,
});

export const b2bHistoricalDataItem = Type.Object({
  categories: Type.Array(Type.String()),
  data: Type.Array(Type.Any()),
});

export const b2bHistoricalDataResponseItemDTO = Type.Object({
  roomId: Type.String(),
  room: roomResponseItemDTO,
  ammonia: Nullable(b2bHistoricalDataItem),
  windSpeed: Nullable(b2bHistoricalDataItem),
  temperature: Nullable(b2bHistoricalDataItem),
  humidity: Nullable(b2bHistoricalDataItem),
  lamp: Nullable(b2bHistoricalDataItem),
});

export const getB2BHistoricalDataResponseItemDTO = Type.Object({
  ...Type.Omit(b2bHistoricalDataResponseItemDTO, ['roomId']).properties,
});

// GET /v1/historical-data
export const getB2BHistoricalDataQueryDTO = Type.Object({
  ...Type.Pick(b2bHistoricalDataResponseItemDTO, ['roomId']).properties,
  deviceType: deviceTypeDTO,
  interval: Type.Enum(IntervalOptionsEnum),
  start: Type.String(),
  end: Type.String(),
});

export const getB2BHistoricalDataResponseDTO = Type.Object({
  code: Type.Number(),
  data: Nullable(getB2BHistoricalDataResponseItemDTO),
});

export type B2BHistoricalDataItem = Static<typeof b2bHistoricalDataItem>;

export type B2BHistoricalDataResponseItem = Static<typeof b2bHistoricalDataResponseItemDTO>;

export type GetB2BHistoricalDataResponseItem = Static<typeof getB2BHistoricalDataResponseItemDTO>;

export type GetB2BHistoricalDataQuery = Static<typeof getB2BHistoricalDataQueryDTO>;

export type GetB2BHistoricalDataResponse = Static<typeof getB2BHistoricalDataResponseDTO>;
