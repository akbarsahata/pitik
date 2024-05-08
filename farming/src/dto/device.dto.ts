import { Static, Type } from '@sinclair/typebox';
import { paginationDTO } from './common.dto';

export const deviceItemDTO = Type.Object({
  id: Type.String(),
  userId: Type.String(),
  uuid: Type.String({ format: 'uuid' }),
  token: Type.String(),
  type: Type.String(),
  os: Type.String(),
  model: Type.String(),
  createdDate: Type.String({ format: 'date-time' }),
  modifiedDate: Type.String({ format: 'date-time' }),
});

export const deviceListDTO = Type.Array(deviceItemDTO);

export const deviceQueryDTO = Type.Object({
  ...paginationDTO.properties,
});

export const deviceParamsDTO = Type.Object({
  id: Type.String(),
});

export const deviceBodyDTO = Type.Object({
  uuid: Type.Optional(Type.String({ format: 'uuid' })),
  token: Type.String(),
  type: Type.String(),
  os: Type.String(),
  model: Type.String(),
});

export const deviceResponseDTO = Type.Object({
  data: Type.Partial(deviceItemDTO),
});

export const deviceResponsePaginatedDTO = Type.Object({
  data: deviceListDTO,
  count: Type.Number(),
});

export type DeviceItem = Static<typeof deviceItemDTO>;

export type DeviceList = Static<typeof deviceListDTO>;

export type DeviceQuery = Static<typeof deviceQueryDTO>;

export type DeviceParams = Static<typeof deviceParamsDTO>;

export type DeviceBody = Static<typeof deviceBodyDTO>;

export type DeviceResponse = Static<typeof deviceResponseDTO>;

export type DeviceResponsePaginated = Static<typeof deviceResponsePaginatedDTO>;
