import { Static, Type } from '@sinclair/typebox';
import { ChickTypeCategory } from '../datasources/entity/pgsql/ChickType.entity';
import { paginationDTO } from './common.dto';

export const chickTypeItemDTO = Type.Object({
  id: Type.Optional(Type.String()),
  seqNo: Type.Optional(Type.Number()),
  chickTypeCode: Type.String(),
  chickTypeName: Type.String(),
  status: Type.Boolean(),
  remarks: Type.String(),
  createdBy: Type.Optional(Type.String()),
  createdDate: Type.Optional(Type.String()),
  modifiedBy: Type.Optional(Type.String()),
  modifiedDate: Type.Optional(Type.String()),
  category: Type.Optional(Type.Enum(ChickTypeCategory)),
});

export const createChickTypeBodyDTO = Type.Object({
  ...chickTypeItemDTO.properties,
});

export const createChickTypeResponseDTO = Type.Object({
  code: Type.Number(),
  data: chickTypeItemDTO,
});

export const getChickTypesQueryDTO = Type.Object({
  chickTypeCode: Type.Optional(Type.String()),
  chickTypeName: Type.Optional(Type.String()),
  status: Type.Optional(Type.Boolean()),
  category: Type.Optional(Type.Enum(ChickTypeCategory)),
  ...Type.Partial(paginationDTO).properties,
  $order: Type.Optional(Type.String()),
});

export const getChickTypeResponseDTO = Type.Object({
  code: Type.Number(),
  count: Type.Number(),
  data: Type.Array(chickTypeItemDTO),
});

export const getChickTypeByIdParamsDTO = Type.Object({
  id: Type.String(),
});

export const getChickTypeByIdResponseDTO = Type.Object({
  code: Type.Number(),
  data: chickTypeItemDTO,
});

export const updateChickTypeByIdParamsDTO = Type.Object({
  id: Type.String(),
});

export const updateChickTypeByIdBodyDTO = Type.Object({
  ...Type.Partial(chickTypeItemDTO).properties,
});

export const updateChickTypeByIdResponnseDTO = Type.Object({
  code: Type.Number(),
  data: chickTypeItemDTO,
});

export type ChickTypeItem = Static<typeof chickTypeItemDTO>;

export type CreateChickTypeBody = Static<typeof createChickTypeBodyDTO>;

export type CreateChickTypeResponse = Static<typeof createChickTypeResponseDTO>;

export type GetChickTypesQuery = Static<typeof getChickTypesQueryDTO>;

export type GetChickTypesResponse = Static<typeof getChickTypeResponseDTO>;

export type GetChickTypeByIdParams = Static<typeof getChickTypeByIdParamsDTO>;

export type GetChickTypeByIdResponse = Static<typeof getChickTypeByIdResponseDTO>;

export type UpdateChickTypeByIdParams = Static<typeof updateChickTypeByIdParamsDTO>;

export type UpdateChickTypeByIdBody = Static<typeof updateChickTypeByIdBodyDTO>;

export type UpdateChickTypeByIdResponnse = Static<typeof updateChickTypeByIdResponnseDTO>;
