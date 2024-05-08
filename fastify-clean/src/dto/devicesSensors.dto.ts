/* eslint-disable no-unused-vars */
import { Static, Type } from '@sinclair/typebox';
import { IotSensorTypeEnum } from '../datasources/entity/pgsql/IotSensor.entity';
import { Nullable } from '../libs/utils/typebox';
import { paginationDTO } from './common.dto';

export enum SetDeviceEnum {
  SET_COOP_CODE = 'setCoopCode',
  SET_DEVICE_ID = 'setId',
}

export const deviceTypeDTO = Type.KeyOf(
  Type.Object({
    SMART_MONITORING: Type.String(),
    SMART_CONTROLLER: Type.String(),
    SMART_CAMERA: Type.String(),
    SMART_CONVENTRON: Type.String(),
    SMART_ELMON: Type.String(),
    SMART_SCALE: Type.String(),
  }),
);

export const iotSensorBodyItemDTO = Type.Object({
  id: Type.Optional(Type.String()),
  sensorCode: Type.String(),
  sensorType: Type.Enum(IotSensorTypeEnum),
  position: Nullable(Type.String()),
  status: Type.Number(),
  additional: Type.Optional(Type.Object({})),
  roomId: Nullable(Type.String()),
  ipCamera: Nullable(Type.String()),
});

export const iotSensorResponseItemDTO = Type.Object({
  id: Type.String(),
  sensorCode: Type.String(),
  sensorType: Type.String(),
  position: Nullable(Type.String()),
  status: Type.Number(),
  additional: Nullable(
    Type.Object({
      ipCamera: Type.Optional(Type.String()),
    }),
  ),
  roomId: Nullable(Type.String()),
  ipCamera: Type.Optional(Type.String()),
  room: Nullable(
    Type.Object({
      id: Type.String(),
      roomCode: Type.String(),
      roomType: Type.Object({
        id: Type.String(),
        name: Type.String(),
      }),
    }),
  ),
});

export const devicesSensorsRequestBodyDTO = Type.Object({
  deviceType: deviceTypeDTO,
  totalFan: Type.Optional(Type.Integer({ minimum: 0 })),
  heaterId: Type.Optional(Nullable(Type.String())),
  coolingPad: Type.Optional(Type.Boolean()),
  lamp: Type.Optional(Type.Boolean()),
  totalCamera: Type.Optional(Type.Integer({ minimum: 0 })),
  phoneNumber: Type.Optional(Type.String()),
  status: Type.Optional(Type.Boolean()),
  isOnline: Type.Optional(Type.Boolean()),
  mac: Type.String(),
  firmWareVersion: Type.Optional(Type.String()),
  farmId: Type.Optional(Nullable(Type.String())),
  coopId: Type.Optional(Nullable(Type.String())),
  buildingId: Type.Optional(Nullable(Type.String())),
  roomId: Type.Optional(Nullable(Type.String())),
  errors: Type.Optional(
    Type.Array(
      Type.Object({
        code: Type.String(),
        description: Type.String(),
      }),
    ),
  ),
  deviceId: Type.Optional(Type.String()),
  controllerTypeId: Type.Optional(Type.String()),
});

export const devicesSensorsQueryDTO = Type.Object({
  ...Type.Partial(paginationDTO).properties,
  id: Type.Optional(Type.String()),
  phoneNumber: Type.Optional(Type.String()),
  status: Type.Optional(Type.Boolean()),
  isOnline: Type.Optional(Type.Boolean()),
  mac: Type.Optional(Type.String()),
  firmWareVersion: Type.Optional(Type.String()),
  coopId: Type.Optional(Type.String()),
  roomId: Type.Optional(Type.String()),
  farmId: Type.Optional(Type.String()),
  buildingId: Type.Optional(Type.String()),
  deviceId: Type.Optional(Type.String()),
  deviceType: Type.Optional(deviceTypeDTO),
});

export const deviceSensorsLocationQuery = Type.Object({
  mac: Type.String(),
});

export const deviceSensorsLocationResponseItemDTO = Type.Object({
  mac: Type.String(),
  coopId: Type.String(),
  roomCode: Type.String(),
});

export const deviceSensorsLocationResponseDTO = Type.Object({
  code: Type.Number(),
  data: deviceSensorsLocationResponseItemDTO,
});

export const devicesSensorsResponseItemDTO = Type.Object({
  id: Type.Optional(Type.String()),
  deviceType: deviceTypeDTO,
  totalFan: Type.Optional(Type.Integer({ minimum: 0 })),
  heaterId: Type.Optional(Nullable(Type.String())),
  coolingPad: Type.Optional(Type.Boolean()),
  lamp: Type.Optional(Type.Boolean()),
  totalCamera: Type.Optional(Type.Integer({ minimum: 0 })),
  phoneNumber: Type.Optional(Type.String()),
  registrationDate: Type.Optional(Type.String({ format: 'date-time' })),
  status: Type.Optional(Type.Boolean()),
  isOnline: Type.Optional(Type.Boolean()),
  mac: Type.Optional(Type.String()),
  firmWareVersion: Type.Optional(Type.String()),
  sensors: Type.Array(iotSensorResponseItemDTO),
  farmId: Type.Optional(Nullable(Type.String())),
  coopId: Type.Optional(Nullable(Type.String())),
  buildingId: Type.Optional(Nullable(Type.String())),
  roomId: Type.Optional(Nullable(Type.String())),
  deviceId: Type.Optional(Type.String()),
  coop: Type.Optional(
    Type.Object({
      id: Type.String(),
      coopCode: Type.String(),
      coopName: Type.String(),
      farm: Type.Object({
        id: Type.String(),
        farmCode: Type.String(),
        farmName: Type.String(),
      }),
    }),
  ),
  room: Type.Optional(
    Type.Object({
      id: Type.String(),
      roomCode: Type.String(),
      roomType: Type.Object({
        id: Type.String(),
        name: Type.String(),
      }),
      building: Type.Object({
        id: Type.String(),
        name: Type.String(),
        buildingType: Type.Optional(
          Type.Object({
            id: Type.String(),
            name: Type.String(),
          }),
        ),
      }),
      controllerType: Nullable(
        Type.Object({
          id: Type.String(),
          name: Type.String(),
          isActive: Type.Boolean(),
        }),
      ),
    }),
  ),
  errors: Type.Optional(
    Type.Array(
      Type.Object({
        code: Type.String(),
        description: Type.String(),
      }),
    ),
  ),
  createdDate: Type.Optional(Type.String({ format: 'date-time' })),
  modifiedDate: Type.Optional(Type.String({ format: 'date-time' })),
});

export const assignDeviceOtasBodyDTO = Type.Object({
  firmwareId: Type.String(),
  deviceIds: Type.Array(Type.String()),
});

export const getOneDevicesSensorsParamDTO = Type.Object({
  id: Type.String(),
});

export const updateDevicesSensorsParamDTO = Type.Object({
  id: Type.String(),
});

export const deleteDevicesSensorsParamDTO = Type.Object({
  id: Type.String(),
});

export const createDevicesSensorsBodyDTO = Type.Object({
  ...devicesSensorsRequestBodyDTO.properties,
  sensors: Type.Array(iotSensorBodyItemDTO),
});

export const setIdDevicesSensorsBodyDTO = Type.Object({
  macAddress: Type.String(),
  deviceId: Type.String(),
  type: Type.Enum(SetDeviceEnum),
});

export const resetIdDevicesSensorsBodyDTO = Type.Object({
  macAddress: Type.String(),
});

export const resetIdDevicesSensorsResponseItemDTO = Type.Object({
  macAddress: Type.String(),
});

export const resetIdDevicesSensorsResponseDTO = Type.Object({
  code: Type.Number(),
  data: resetIdDevicesSensorsResponseItemDTO,
});

export const setIdDevicesSensorsResponseDTO = Type.Object({
  code: Type.Number(),
  data: Type.Object({
    macAddress: Type.String(),
    deviceId: Type.String(),
  }),
});

export const getDeviceSensorsResponsePaginatedDTO = Type.Object({
  code: Type.Number(),
  count: Type.Number(),
  data: Type.Array(devicesSensorsResponseItemDTO),
});

export const getOneDevicesSensorsResponseDTO = Type.Object({
  code: Type.Number(),
  data: devicesSensorsResponseItemDTO,
});

export const updateDevicesSensorsBodyDTO = Type.Object({
  ...devicesSensorsRequestBodyDTO.properties,
  sensors: Type.Array(iotSensorBodyItemDTO),
});

export const updateDeviceSensorsResponseDTO = Type.Object({
  code: Type.Number(),
  data: devicesSensorsResponseItemDTO,
});

export const createDeviceSensorsResponseDTO = Type.Object({
  code: Type.Number(),
  data: devicesSensorsResponseItemDTO,
});

export const deleteDeviceSensorsResponseItemDTO = Type.Object({
  id: Type.String(),
  deletedDate: Type.String({ format: 'date-time' }),
});

export const deleteDeviceSensorsResponseDTO = Type.Object({
  code: Type.Number(),
  data: deleteDeviceSensorsResponseItemDTO,
});

export const assignDeviceOtasResponseDTO = Type.Object({
  code: Type.Number(),
  data: Type.Array(Type.Partial(devicesSensorsResponseItemDTO)),
});

export const setDevicesStatusJobDTO = Type.Object({
  status: Type.Boolean(),
  deviceTypes: Type.Array(deviceTypeDTO),
  coopId: Type.Optional(Type.String()),
  farmId: Type.Optional(Type.String()),
  buildingId: Type.Optional(Type.String()),
  roomId: Type.Optional(Type.String()),
});

export const generateIotDeviceAlertJobDTO = Type.Object({
  redisKey: Type.String(),
  macAddress: Type.String(),
  metricName: Type.String(),
});

export type IotSensorResponseItem = Static<typeof iotSensorResponseItemDTO>;

export const iotSensorDataItem = Type.Object({
  id: Type.String(),
  t: Type.Number(),
  h: Type.Number(),
  b: Type.Number(),
  s: Type.Number(),
  Rs: Type.Optional(Type.Number()),
  R0: Type.Optional(Type.Number()),
  ppm: Type.Optional(Type.Number()),
});

export const deviceReportData = Type.Object({
  paths: Type.Optional(Type.Array(Type.String())),
  sensors: Type.Object({
    s1: Type.Optional(iotSensorDataItem),
    s2: Type.Optional(iotSensorDataItem),
    s3: Type.Optional(iotSensorDataItem),
    s4: Type.Optional(iotSensorDataItem),
    s5: Type.Optional(iotSensorDataItem),
    s6: Type.Optional(iotSensorDataItem),
    s7: Type.Optional(iotSensorDataItem),
    s8: Type.Optional(iotSensorDataItem),
    w: Type.Optional(Type.Union([Type.Number(), Type.Null()])),
    v: Type.Optional(Type.String()),
    t: Type.Optional(Type.Number()),
    l: Type.Optional(Type.Union([Type.Number(), Type.Null()])),
    e: Type.Optional(Type.Number()),
    a: Type.Optional(Type.Union([Type.Number(), Type.Null()])),
  }),
  created: Type.String(),
});

export const getDeviceReportsQueryDTO = Type.Object({
  ...Type.Partial(paginationDTO).properties,
  deviceId: Type.String(),
  coopCode: Type.Optional(Type.String()),
  startDate: Type.Optional(Type.String({ format: 'date-time' })),
  endDate: Type.Optional(Type.String({ format: 'date-time' })),
  interval: Type.Number(),
});

export const historicalData = Type.Object({
  time: Type.String(),
  temperature: Type.Any(),
  humidity: Type.Any(),
  lamp: Type.Any(),
  windSpeed: Type.Any(),
  ammonia: Type.Any(),
});

export const getDeviceReportsResponseDTO = Type.Object({
  code: Type.Number(),
  count: Type.Number(),
  data: Type.Array(historicalData),
});

export type GetOneDevicesSensorsParam = Static<typeof getOneDevicesSensorsParamDTO>;

export type GetOneDevicesSensorsResponse = Static<typeof getOneDevicesSensorsResponseDTO>;

export type GetDevicesSensorsResponsePaginated = Static<
  typeof getDeviceSensorsResponsePaginatedDTO
>;

export type DevicesSensorsQuery = Static<typeof devicesSensorsQueryDTO>;

export type DeviceSensorsLocationQuery = Static<typeof deviceSensorsLocationQuery>;

export type DeviceSensorsLocationResponseItem = Static<typeof deviceSensorsLocationResponseItemDTO>;

export type DeviceSensorsLocationResponse = Static<typeof deviceSensorsLocationResponseDTO>;

export type IotSensorItemBody = Static<typeof iotSensorBodyItemDTO>;

export type CreateDevicesSensorsBody = Static<typeof createDevicesSensorsBodyDTO>;

export type DevicesSensorsResponseItem = Static<typeof devicesSensorsResponseItemDTO>;

export type UpdateDevicesSensorsParam = Static<typeof updateDevicesSensorsParamDTO>;

export type UpdateDevicesSensorsBody = Static<typeof updateDevicesSensorsBodyDTO>;

export type UpdateDevicesSensorsResponse = Static<typeof updateDeviceSensorsResponseDTO>;

export type CreateDevicesSensorsResponse = Static<typeof createDeviceSensorsResponseDTO>;

export type SetIdDevicesSensorsBody = Static<typeof setIdDevicesSensorsBodyDTO>;

export type SetIdDevicesSensorsResponse = Static<typeof setIdDevicesSensorsResponseDTO>;

export type ResetIdDevicesSensorsBody = Static<typeof resetIdDevicesSensorsBodyDTO>;

export type ResetIdDevicesSensorsResponseItem = Static<typeof resetIdDevicesSensorsResponseItemDTO>;

export type ResetIdDevicesSensorsResponse = Static<typeof resetIdDevicesSensorsResponseDTO>;

export type DeleteDevicesSensorsParam = Static<typeof deleteDevicesSensorsParamDTO>;

export type DeleteDeviceSensorsResponseItem = Static<typeof deleteDeviceSensorsResponseItemDTO>;

export type DeleteDevicesSensorsResponse = Static<typeof deleteDeviceSensorsResponseDTO>;

export type AssignDeviceOtasBody = Static<typeof assignDeviceOtasBodyDTO>;

export type AssignDeviceOtasResponse = Static<typeof assignDeviceOtasResponseDTO>;

export type SetDevicesStatusJob = Static<typeof setDevicesStatusJobDTO>;

export type GenerateIotDeviceAlertJob = Static<typeof generateIotDeviceAlertJobDTO>;

export type IotSensorDataItem = Static<typeof iotSensorDataItem>;

export type DeviceReportData = Static<typeof deviceReportData>;

export type HistoricalData = Static<typeof historicalData>;

export type GetDeviceReportsResponse = Static<typeof getDeviceReportsResponseDTO>;

export type GetDeviceReportsQuery = Static<typeof getDeviceReportsQueryDTO>;
