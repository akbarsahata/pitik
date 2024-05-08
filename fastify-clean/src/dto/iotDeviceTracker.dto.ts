import { Static, Type } from '@sinclair/typebox';
import { paginationDTO } from './common.dto';

export const iotDeviceTrackerInputDTO = Type.Object({
  iotDeviceId: Type.String(),
  lastOnlineTime: Type.String(),
  backOnlineTime: Type.Optional(Type.String()),
});

export const offlineTrackerParamsDTO = Type.Object({
  ...Type.Partial(paginationDTO).properties,
  startDate: Type.Optional(Type.String()),
  endDate: Type.Optional(Type.String()),
  coopId: Type.Optional(Type.String()),
  farmId: Type.Optional(Type.String()),
});

export const offlineTrackerReportDTO = Type.Object({
  id: Type.Optional(Type.String()),
  totalOfflineCount: Type.Number(),
  totalOfflineTime: Type.String(),
  status: Type.Boolean(),
  isOnline: Type.Boolean(),
  mac: Type.String(),
  firmwareVersion: Type.Optional(Type.String()),
  coopCode: Type.String(),
  deviceId: Type.Optional(Type.String()),
  coopId: Type.String(),
  roomId: Type.String(),
  farmId: Type.String(),
  coop: Type.Object({
    id: Type.String(),
    coopCode: Type.String(),
    coopName: Type.String(),
    farm: Type.Object({
      id: Type.String(),
      farmCode: Type.String(),
      farmName: Type.String(),
    }),
  }),
  room: Type.Object({
    id: Type.String(),
    roomCode: Type.String(),
    roomType: Type.Object({
      id: Type.String(),
      name: Type.String(),
    }),
    building: Type.Object({
      id: Type.String(),
      name: Type.String(),
      buildingType: Type.Object({
        id: Type.String(),
        name: Type.String(),
      }),
    }),
  }),
  createdDate: Type.String(),
  modifiedDate: Type.String(),
});

export const getOfflineTrackerResponseDTO = Type.Object({
  code: Type.Number(),
  count: Type.Number(),
  data: Type.Array(offlineTrackerReportDTO),
});

export type OfflineTrackerParams = Static<typeof offlineTrackerParamsDTO>;

export type IotDeviceTrackerInput = Static<typeof iotDeviceTrackerInputDTO>;

export type OfflineTrackerReport = Static<typeof offlineTrackerReportDTO>;
