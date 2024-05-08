import { Static, Type } from '@sinclair/typebox';
import { paginationDTO } from './common.dto';
import { deviceTypeDTO } from './devicesSensors.dto';

export const getFirmwareQueryDTO = Type.Object({
  ...Type.Partial(paginationDTO).properties,
  id: Type.Optional(Type.String()),
  version: Type.Optional(Type.String()),
  fileName: Type.Optional(Type.String()),
  fileSize: Type.Optional(Type.Number()),
  description: Type.Optional(Type.String()),
  deviceType: Type.Optional(deviceTypeDTO),
  ...Type.Partial(paginationDTO).properties,
});

export const firmwareBodyDTO = Type.Object({
  version: Type.Optional(Type.String()),
  fileName: Type.Optional(Type.String()),
  fileSize: Type.Optional(Type.Number()),
  description: Type.Optional(Type.String()),
  deviceType: Type.Optional(Type.Union([deviceTypeDTO, Type.Null()])),
});

export const getFirmwareResponseDTO = Type.Object({
  code: Type.Number(),
  count: Type.Number(),
  data: Type.Array(
    Type.Object({
      ...getFirmwareQueryDTO.properties,
      createdDate: Type.Optional(Type.String({ format: 'date-time' })),
      modifiedDate: Type.Optional(Type.String({ format: 'date-time' })),
    }),
  ),
});

export const firmwareResponseDTO = Type.Object({
  code: Type.Number(),
  data: Type.Object({
    ...firmwareBodyDTO.properties,
    createdDate: Type.Optional(Type.String({ format: 'date-time' })),
    modifiedDate: Type.Optional(Type.String({ format: 'date-time' })),
  }),
});

export const deleteFirmwareParamDTO = Type.Object({
  id: Type.String(),
});

export const deleteFirmwareResponseDTO = Type.Object({
  code: Type.Number(),
  data: Type.Object({
    id: Type.String(),
    deletedDate: Type.String({ format: 'date-time' }),
  }),
});

export type GetFirmwareQuery = Static<typeof getFirmwareQueryDTO>;

export type FirmwareBody = Static<typeof firmwareBodyDTO>;

export type GetFirmwareResponse = Static<typeof getFirmwareResponseDTO>;

export type FirmwareResponse = Static<typeof firmwareResponseDTO>;

export type DeleteFirmwareParams = Static<typeof deleteFirmwareParamDTO>;

export type DeleteFirmwareResponse = Static<typeof deleteFirmwareResponseDTO>;
