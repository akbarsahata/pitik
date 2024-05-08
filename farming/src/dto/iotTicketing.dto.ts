import { Static, Type } from '@sinclair/typebox';
import { Nullable } from '../libs/utils/typebox';
import { devicesSensorsResponseItemDTO } from './devicesSensors.dto';
import { ticketingHistoryItemsDTO } from './iotTicketingHistory.dto';

export const ticketingItemsDTO = Type.Object({
  id: Type.String(),
  status: Type.String(),
  refDeviceId: Type.String(),
  pic: Nullable(Type.String()),
  createdOn: Type.String(),
  createdDate: Type.String({ format: 'date-time' }),
  modifiedDate: Type.String(),
  createdBy: Type.String(),
  modifiedBy: Type.String(),
});

export const ticketingPayloadDTO = Type.Object({
  status: Type.String(),
  pic: Type.String(),
  notes: Type.String(),
});

export const ticketingParamsDTO = Type.Object({
  id: Type.String(),
});

export const ticketingResponseDTO = Type.Object({
  code: Type.Integer(),
  data: ticketingItemsDTO,
});

export const ticketingResponseCreateDTO = Type.Object({
  code: Type.Integer(),
  data: Type.String(),
});

export const ticketingResponse = Type.Object({
  ...Type.Partial(ticketingItemsDTO).properties,
  macAddress: Nullable(Type.String()),
  deviceId: Nullable(Type.String()),
  deviceType: Nullable(Type.String()),
  coopCode: Nullable(Type.String()),
  farmId: Nullable(Type.String()),
  farmName: Nullable(Type.String()),
  branchId: Nullable(Type.String()),
  branchName: Nullable(Type.String()),
  buildingName: Nullable(Type.String()),
  roomName: Nullable(Type.String()),
  incident: Nullable(Type.String()),
  pic: Nullable(Type.String()),
  action: Nullable(Type.String()),
  notes: Nullable(Type.String()),
});

export const ticketingQueryParams = Type.Object({
  ...Type.Partial(ticketingItemsDTO).properties,
  macAddress: Nullable(Type.String()),
  deviceId: Nullable(Type.String()),
  coopId: Nullable(Type.String()),
  coopCode: Nullable(Type.String()),
  farmId: Nullable(Type.String()),
  farmName: Nullable(Type.String()),
  branchId: Nullable(Type.String()),
  branchName: Nullable(Type.String()),
  incident: Nullable(Type.String()),
  picId: Nullable(Type.String()),
  pic: Nullable(Type.String()),
  action: Nullable(Type.String()),
});

export const ticketingResponseOne = Type.Object({
  ...Type.Partial(ticketingItemsDTO).properties,
  macAddress: Nullable(Type.String()),
  deviceId: Nullable(Type.String()),
  deviceType: Nullable(Type.String()),
  coopCode: Nullable(Type.String()),
  farmName: Nullable(Type.String()),
  branchName: Nullable(Type.String()),
  buildingName: Nullable(Type.String()),
  roomName: Nullable(Type.String()),
  incident: Nullable(Type.String()),
  pic: Nullable(Type.String()),
  action: Nullable(Type.String()),
  notes: Nullable(Type.String()),
  history: Type.Array(Type.Partial(ticketingHistoryItemsDTO)),
});

export const ticketingDeviceStatusDTO = Type.Object({
  open: Type.Integer(),
  onMaintenance: Type.Integer(),
  resolved: Type.Integer(),
  others: Type.Integer(),
});

export const ticketingResponseListDTO = Type.Object({
  count: Type.Integer(),
  deviceStatus: ticketingDeviceStatusDTO,
  data: Type.Array(ticketingResponse),
});

export const ticketingResponseOneDTO = Type.Object({
  code: Type.Integer(),
  data: ticketingResponseOne,
});

export const ticketingQueryDTO = Type.Object({
  ...Type.Partial(ticketingQueryParams).properties,
  $limit: Type.Optional(Type.Integer()),
  $page: Type.Optional(Type.Integer()),
  $order: Type.Optional(Type.String()),
});

export const ticketingAssignPayloadDTO = Type.Object({
  pic: Type.String(),
});

export const RelayController = Type.Object({
  fan1: Type.Boolean(),
  fan2: Type.Boolean(),
  fan3: Type.Boolean(),
  fan4: Type.Boolean(),
  fan5: Type.Boolean(),
  fan6: Type.Boolean(),
  fan7: Type.Boolean(),
  fan8: Type.Boolean(),
  heater: Type.Boolean(),
  lamp: Type.Boolean(),
  cooler: Type.Boolean(),
  alarm: Type.Boolean(),
});

export const IntermittentFanController = Type.Object({
  fan1: Type.Boolean(),
  fan2: Type.Boolean(),
  fan3: Type.Boolean(),
  fan4: Type.Boolean(),
  fan5: Type.Boolean(),
  fan6: Type.Boolean(),
  fan7: Type.Boolean(),
  fan8: Type.Boolean(),
});

export const TemperaturesController = Type.Object({
  temperature1: Type.Number(),
  temperature2: Type.Number(),
});

export const HumiditysController = Type.Object({
  humidity1: Type.Number(),
  humidity2: Type.Number(),
});

export const ErrorsController = Type.Object({
  rtc: Type.String(),
  relay: Type.String(),
  modbus: Type.String(),
  sdCard: Type.String(),
  eeprom: Type.String(),
  serial: Type.String(),
});

export const IOTSensorController = Type.Object({
  version: Type.String(),
  hardwareVersion: Type.String(),
  created: Type.Optional(Type.String()),
  relay: RelayController,
  intermittentFan: Type.Optional(IntermittentFanController),
  temperatures: Type.Optional(TemperaturesController),
  humiditys: Type.Optional(HumiditysController),
  errors: Type.Optional(ErrorsController),
  dateTime: Type.String(),
  paths: Type.Array(Type.String()),
  coopId: Type.String(),
  deviceId: Type.String(),
  raw: Type.String(),
  temperature: Type.Number(),
  humidity: Type.Number(),
});

export const RelayInputConventron = Type.Object({
  alarm: Type.Boolean(),
  heater: Type.Boolean(),
  fan_1: Type.Boolean(),
  fan_2: Type.Boolean(),
  fan_3: Type.Boolean(),
  fan_4: Type.Boolean(),
  fan_5: Type.Boolean(),
  cooling_pad: Type.Boolean(),
});

export const RelayOutputConventron = Type.Object({
  alarm: Type.Boolean(),
  heater: Type.Boolean(),
  fan_1: Type.Boolean(),
  fan_2: Type.Boolean(),
  fan_3: Type.Boolean(),
  fan_4: Type.Boolean(),
  fan_5: Type.Boolean(),
  cooling_pad: Type.Boolean(),
});

export const IntermittentRelayConventron = Type.Object({
  fan_1: Type.Boolean(),
  fan_2: Type.Boolean(),
  fan_3: Type.Boolean(),
  fan_4: Type.Boolean(),
  fan_5: Type.Boolean(),
  cooling_pad: Type.Boolean(),
});

export const TemperatureConventron = Type.Object({
  temperature_1: Type.Number(),
  temperature_2: Type.Number(),
  temperature_3: Type.Number(),
  temperature_4: Type.Number(),
  temperature_5: Type.Number(),
});

export const ErrorsConventron = Type.Object({
  ads: Type.String(),
  temperature: Type.String(),
  sd_card: Type.String(),
  rtc: Type.String(),
  connection: Type.String(),
});

export const IOTSensorConventron = Type.Object({
  version: Type.String(),
  created: Type.Optional(Type.String()),
  relayInput: Type.Optional(RelayInputConventron),
  relayOutput: Type.Optional(RelayOutputConventron),
  intermittentRelay: Type.Optional(IntermittentRelayConventron),
  temperature: Type.Optional(TemperatureConventron),
  humidity: Type.Number(),
  errors: ErrorsConventron,
  dateTime: Type.String(),
  paths: Type.Array(Type.String()),
  coop_id: Type.String(),
  device_id: Type.String(),
  raw: Type.String(),
});

export const VoltElmon = Type.Object({
  AB: Type.Number(),
  BC: Type.Number(),
  CA: Type.Number(),
  AN: Type.Number(),
  BN: Type.Number(),
  CN: Type.Number(),
});

export const CurrentElmon = Type.Object({
  A: Type.Number(),
  B: Type.Number(),
  C: Type.Number(),
});

export const PwrElmon = Type.Object({
  activeA: Type.Number(),
  activeB: Type.Number(),
  activeC: Type.Number(),
  activeTotal: Type.Number(),
  reactiveA: Type.Number(),
  reactiveB: Type.Number(),
  reactiveC: Type.Number(),
  reactiveTotal: Type.Number(),
  pfA: Type.Number(),
  pfB: Type.Number(),
  pfC: Type.Number(),
  pfTotal: Type.Number(),
  apparentA: Type.Number(),
  apparentB: Type.Number(),
  apparentC: Type.Number(),
  apparentTotal: Type.Number(),
});

export const ThdCurrentElmon = Type.Object({
  A: Type.Number(),
  B: Type.Number(),
  C: Type.Number(),
});

export const ThdVoltageElmon = Type.Object({
  AN: Type.Number(),
  BN: Type.Number(),
  CN: Type.Number(),
});

export const EnergyElmon = Type.Object({
  absorptiveActive: Type.Number(),
  releaseActive: Type.Number(),
  inductiveReactive: Type.Number(),
  capasitiveReactive: Type.Number(),
});

export const AngleElmon = Type.Object({
  phaseA: Type.Number(),
  phaseB: Type.Number(),
  phaseC: Type.Number(),
});

export const IOTSensorElmon = Type.Object({
  volt: Type.Optional(VoltElmon),
  current: Type.Optional(CurrentElmon),
  pwr: Type.Optional(PwrElmon),
  thdCurrent: Type.Optional(ThdCurrentElmon),
  thdVoltage: Type.Optional(ThdVoltageElmon),
  energy: Type.Optional(EnergyElmon),
  angle: Type.Optional(AngleElmon),
  f: Type.Number(),
  created: Type.Optional(Type.String()),
  topic: Type.String(),
  mac: Type.String(),
});

export const IOTSensorDataItem = Type.Object({
  id: Type.String(),
  t: Type.Number(),
  h: Type.Number(),
  b: Type.Number(),
  s: Type.Number(),
  Rs: Type.Number(),
  R0: Type.Number(),
  ppm: Type.Number(),
});

export const IOTSensorData = Type.Object({
  topic: Type.String(),
  paths: Type.Array(Type.String()),
  message: Type.String(),
  sensors: Type.Object({
    a: IOTSensorDataItem,
    s1: IOTSensorDataItem,
    s2: IOTSensorDataItem,
    s3: IOTSensorDataItem,
    s4: IOTSensorDataItem,
    s5: IOTSensorDataItem,
    s6: IOTSensorDataItem,
    s7: IOTSensorDataItem,
    s8: IOTSensorDataItem,
    w: Type.Number(),
    l: Type.Number(),
  }),
  created: Type.Optional(Type.String()),
});

export const iotSensors = Type.Union([
  IOTSensorData,
  IOTSensorConventron,
  IOTSensorController,
  IOTSensorElmon,
]);

export const devicesSensorsItemDTO = Type.Object({
  ...devicesSensorsResponseItemDTO.properties,
  history: Type.Union([iotSensors, Type.Null()]),
});

export type TicketingItemsResponse = Static<typeof ticketingItemsDTO>;

export type TicketingBoydPayload = Static<typeof ticketingPayloadDTO>;

export type TicketingQuery = Static<typeof ticketingQueryDTO>;

export type TicketingParams = Static<typeof ticketingParamsDTO>;

export type TicketingResponse = Static<typeof ticketingResponseDTO>;

export type TicketingResponseList = Static<typeof ticketingResponseListDTO>;

export type TicketingResponseSingle = Static<typeof ticketingResponse>;

export type TicketingDeviceStatus = Static<typeof ticketingDeviceStatusDTO>;

export type TicketingResponseItem = Static<typeof ticketingResponseOneDTO>;

export type TicketingResponseDetail = Static<typeof ticketingResponseOne>;

export type TicketingAssignBodyPayload = Static<typeof ticketingAssignPayloadDTO>;

export type TicketingResponseCreate = Static<typeof ticketingResponseCreateDTO>;
