import { Static, Type } from '@sinclair/typebox';
import { paginationDTO } from './common.dto';

export const coopTypeItemDTO = Type.Object({
  id: Type.Optional(Type.String()),
  coopTypeCode: Type.String(),
  coopTypeName: Type.String(),
  remarks: Type.String(),
  status: Type.Boolean(),
  createdBy: Type.Optional(Type.String()),
  createdDate: Type.Optional(Type.String()),
  modifiedBy: Type.Optional(Type.String()),
  modifiedDate: Type.Optional(Type.String()),
});

export const getCoopTypesResponseDTO = Type.Object({
  code: Type.Number(),
  count: Type.Number(),
  data: Type.Array(coopTypeItemDTO),
});

export const getCoopTypesQueryDTO = Type.Object({
  ...Type.Partial(paginationDTO).properties,
  status: Type.Optional(Type.Boolean()),
  coopTypeName: Type.Optional(Type.String()),
});

export const getCoopTypeByIdParamsDTO = Type.Object({
  id: Type.String(),
});

export const getCoopTypeByIdResponseDTO = Type.Object({
  code: Type.Number(),
  data: coopTypeItemDTO,
});

export const createCoopTypeBodyDTO = Type.Object({
  ...coopTypeItemDTO.properties,
});

export const createCoopTypeResponseDTO = Type.Object({
  code: Type.Number(),
  data: coopTypeItemDTO,
});

export const updateCoopTypeParamsDTO = Type.Object({
  id: Type.String(),
});

export const updateCoopTypeBodyDTO = Type.Object({
  ...Type.Partial(coopTypeItemDTO).properties,
});

export const updateCoopTypeResponseDTO = Type.Object({
  code: Type.Number(),
  data: coopTypeItemDTO,
});

export type CoopTypeItem = Static<typeof coopTypeItemDTO>;

export type GetCoopTypesResponse = Static<typeof getCoopTypesResponseDTO>;

export type GetCoopTypesQuery = Static<typeof getCoopTypesQueryDTO>;

export type GetCoopTypeByIdParams = Static<typeof getCoopTypeByIdParamsDTO>;

export type GetCoopTypeByIdResponse = Static<typeof getCoopTypeByIdResponseDTO>;

export type CreateCoopTypeBody = Static<typeof createCoopTypeBodyDTO>;

export type CreateCoopTypeResponse = Static<typeof createCoopTypeResponseDTO>;

export type UpdateCoopTypeParams = Static<typeof updateCoopTypeParamsDTO>;

export type UpdateCoopTypeBody = Static<typeof updateCoopTypeBodyDTO>;

export type UpdateCoopTypeResponse = Static<typeof updateCoopTypeResponseDTO>;
