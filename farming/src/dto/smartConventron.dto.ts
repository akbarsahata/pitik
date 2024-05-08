import { Static, Type } from '@sinclair/typebox';
import { IotSensorTypeEnum } from '../datasources/entity/pgsql/IotSensor.entity';
import { Nullable } from '../libs/utils/typebox';

export const getConventronSummaryQueryStringDTO = Type.Object(
  {
    deviceId: Type.String(),
  },
  {
    additionalProperties: false,
  },
);

export const getConventronSummaryItemResponseDTO = Type.Object({
  generalInfo: Type.Object({
    deviceId: Type.String(),
    buildingName: Type.String(),
    roomTypeName: Type.String(),
    conventronType: Type.String(),
    day: Type.Number(),
    period: Type.Number(),
    chickInDate: Type.String(),
  }),
  temperatureInfo: Type.Object({
    value: Type.Number(),
    uom: Type.String({ default: '°C' }),
  }),
  alarmInfo: Nullable(
    Type.Object({
      status: Type.String({ default: 'Mati' }),
    }),
  ),
  fanInfo: Nullable(
    Type.Object({
      status: Type.String({ default: 'Mati' }),
      totalActive: Type.Number({ default: 0 }),
      totalInActive: Type.Number({ default: 0 }),
      detailFanStatus: Nullable(
        Type.Object({
          fan1: Type.Optional(Type.String()),
          fan2: Type.Optional(Type.String()),
          fan3: Type.Optional(Type.String()),
          fan4: Type.Optional(Type.String()),
          fan5: Type.Optional(Type.String()),
        }),
      ),
    }),
  ),
  heaterInfo: Nullable(
    Type.Object({
      status: Type.String({ default: 'Mati' }),
    }),
  ),
  coolerInfo: Nullable(
    Type.Object({
      status: Type.String({ default: 'Mati' }),
    }),
  ),
});

export const getConventronSummaryResponseDTO = Type.Object({
  code: Type.Number(),
  data: getConventronSummaryItemResponseDTO,
});

export const getConventronByCoopIdParamsDTO = Type.Object(
  {
    coopId: Type.String(),
  },
  {
    additionalProperties: false,
  },
);

export const getConventronByCoopIdItemRoomDTO = Type.Object({
  roomId: Type.String(),
  roomCode: Type.String(),
  roomTypeName: Type.String(),
  sensorType: Type.Enum(IotSensorTypeEnum),
  conventronType: Type.String(),
  day: Type.Number(),
  period: Type.Number(),
  chickInDate: Type.String(),
  temperature: Type.Number(),
});

export const getConventronByCoopIdItemDTO = Type.Object({
  deviceId: Type.String(),
  buildingId: Type.String(),
  buildingName: Type.String(),
  ...getConventronByCoopIdItemRoomDTO.properties,
});

export const getConventronByCoopIdResponseDTO = Type.Object({
  code: Type.Number(),
  count: Type.Number(),
  data: Type.Array(getConventronByCoopIdItemDTO),
});

export const conventronAdditionalDataDTO = Type.Object({
  conventronType: Type.Optional(Type.String()),
});

export const getConventronHistoricalQueryStringDTO = Type.Object(
  {
    farmingCycleId: Type.String(),
    sensorType: Type.Optional(Type.String({ default: 'temperature' })),
    deviceId: Type.Optional(Type.String()),
    from: Type.Optional(Type.String({ format: 'date-time' })),
    to: Type.Optional(Type.String({ format: 'date-time' })),
    days: Type.Optional(Type.String()),
  },
  {
    additionalProperties: false,
  },
);

export const conventronHistoricalItemDTO = Type.Object({
  value: Type.Union([
    Type.Number(),
    Type.Object({
      min: Type.Optional(Type.Number()),
      max: Type.Optional(Type.Number()),
    }),
  ]),
  created: Type.String(),
});

export const getConventronHistoricalItemResponseDTO = Type.Object({
  current: Type.Array(conventronHistoricalItemDTO),
  benchmark: Type.Array(conventronHistoricalItemDTO),
});

export const getConventronHistoricalResponseDTO = Type.Object({
  code: Type.Number(),
  data: Type.Array(
    Type.Object({
      current: Type.Number(),
      label: Type.String(),
    }),
  ),
});

export const payloadConventronJobDTO = Type.Object(
  {
    t: Type.Object({
      t1: Type.Number(),
      t2: Type.Number(),
      t3: Type.Number(),
      t4: Type.Number(),
      t5: Type.Number(),
    }),
    relayInput: Type.Object({
      alarm: Type.Boolean(),
      heater: Type.Boolean(),
      fan1: Type.Boolean(),
      fan2: Type.Boolean(),
      fan3: Type.Boolean(),
      fan4: Type.Boolean(),
      fan5: Type.Boolean(),
      coolingPad: Type.Boolean(),
    }),
    relayOutput: Type.Object({
      alarm: Type.Boolean(),
      heater: Type.Boolean(),
      fan1: Type.Boolean(),
      fan2: Type.Boolean(),
      fan3: Type.Boolean(),
      fan4: Type.Boolean(),
      fan5: Type.Boolean(),
      coolingPad: Type.Boolean(),
    }),
    intermittentRelay: Type.Object({
      fan1: Type.Boolean(),
      fan2: Type.Boolean(),
      fan3: Type.Boolean(),
      fan4: Type.Boolean(),
      fan5: Type.Boolean(),
      coolingPad: Type.Boolean(),
    }),
    e: Type.Object({
      ads: Type.String(),
      temperature: Type.String(),
      sdCard: Type.String(),
      rtc: Type.String(),
      connection: Type.String(),
    }),
    paths: Type.Array(Type.String()),
    h: Type.Number(),
    raw: Type.String(),
    created: Type.String(),
    fwVersion: Type.String(),
    temptronVersion: Type.String(),
    hwVersion: Type.String(),
    coopId: Type.String(),
    deviceId: Type.String(),
  },
  {
    additionalProperties: false,
  },
);

export const conventronCreatedJobDTO = Type.Partial(payloadConventronJobDTO);

export type GetConventronSummaryQueryString = Static<typeof getConventronSummaryQueryStringDTO>;

export type GetConventronSummaryItemResponse = Static<typeof getConventronSummaryItemResponseDTO>;

export type GetConventronSummaryResponse = Static<typeof getConventronSummaryResponseDTO>;

export type ConventronAdditionalData = Static<typeof conventronAdditionalDataDTO>;

export type GetConventronByCoopIdItem = Static<typeof getConventronByCoopIdItemDTO>;

export type GetConventronByCoopIdParams = Static<typeof getConventronByCoopIdParamsDTO>;

export type GetConventronByCoopIdResponse = Static<typeof getConventronByCoopIdResponseDTO>;

export type GetConventronHistoricalQuery = Static<typeof getConventronHistoricalQueryStringDTO>;

export type GetConventronHistoricalItem = Static<typeof getConventronHistoricalItemResponseDTO>;

export type GetConventronHistoricalResponse = Static<typeof getConventronHistoricalResponseDTO>;

export type PayloadConventronJob = Static<typeof payloadConventronJobDTO>;

export type ConventronCreatedJob = Static<typeof conventronCreatedJobDTO>;
