import { Static, Type } from '@sinclair/typebox';
import { paginationDTO } from './common.dto';

export const targetItemDTO = Type.Object({
  id: Type.Optional(Type.String()),
  targetCode: Type.String(),
  targetName: Type.String(),
  targetDaysCount: Type.Number(),
  status: Type.Boolean(),
  remarks: Type.Optional(Type.String()),
});

export const coopTypeItemDTO = Type.Object({
  id: Type.String(),
  coopTypeCode: Type.String(),
  coopTypeName: Type.String(),
});

export const chickTypeItemDTO = Type.Object({
  id: Type.String(),
  chickTypeCode: Type.String(),
  chickTypeName: Type.String(),
});

export const variableItemDTO = Type.Object({
  id: Type.String(),
  variableCode: Type.String(),
  variableName: Type.String(),
  variableUOM: Type.String(),
  variableType: Type.String(),
  variableFormula: Type.String(),
});

export const getTargetQueryDTO = Type.Object({
  ...Type.Partial(paginationDTO).properties,
  targetCode: Type.Optional(Type.String()),
  targetName: Type.Optional(Type.String()),
  coopTypeId: Type.Optional(Type.String()),
  chickTypeId: Type.Optional(Type.String()),
  variableId: Type.Optional(Type.String()),
  status: Type.Optional(Type.Boolean()),
});

export const getTargetResponseItemDTO = Type.Object({
  ...targetItemDTO.properties,
  coopType: Type.Optional(coopTypeItemDTO),
  chickType: Type.Optional(chickTypeItemDTO),
  variable: Type.Optional(variableItemDTO),
  modifiedBy: Type.String(),
  modifiedDate: Type.Optional(Type.String()),
});

export const getTargetResponseDTO = Type.Object({
  code: Type.Number(),
  count: Type.Number(),
  data: Type.Array(getTargetResponseItemDTO),
});

export const targetDaysDItemDTO = Type.Object({
  id: Type.Optional(Type.String()),
  day: Type.Number(),
  minValue: Type.Optional(Type.Number()),
  maxValue: Type.Optional(Type.Number()),
});

export const getTargetByIdParamsDTO = Type.Object({
  id: Type.String(),
});

export const getTargetByIdResponseItemDTO = Type.Object({
  ...targetItemDTO.properties,
  coopType: Type.Optional(coopTypeItemDTO),
  chickType: Type.Optional(chickTypeItemDTO),
  variable: Type.Optional(variableItemDTO),
  modifiedBy: Type.String(),
  modifiedDate: Type.Optional(Type.String()),
  targetDays: Type.Array(targetDaysDItemDTO),
});

export const getTargetByIdResponseDTO = Type.Object({
  code: Type.Number(),
  data: getTargetByIdResponseItemDTO,
});

export const createTargetResponseItemDTO = Type.Object({
  ...targetItemDTO.properties,
  coopType: Type.Optional(coopTypeItemDTO),
  chickType: Type.Optional(chickTypeItemDTO),
  variable: Type.Optional(variableItemDTO),
  createdBy: Type.String(),
  createdDate: Type.Optional(Type.String()),
});

export const createTargetBodyDTO = Type.Object({
  ...targetItemDTO.properties,
  coopTypeId: Type.String(),
  chickTypeId: Type.String(),
  variableId: Type.String(),
  targets: Type.Array(targetDaysDItemDTO),
});

export const createTargetResponseDTO = Type.Object({
  code: Type.Number(),
  data: createTargetResponseItemDTO,
});

export const updateTargetParamsDTO = Type.Object({
  id: Type.String(),
});

export const updateTargetBodyDTO = Type.Object({
  ...Type.Partial(targetItemDTO).properties,
  coopTypeId: Type.String(),
  chickTypeId: Type.String(),
  variableId: Type.String(),
  targets: Type.Array(targetDaysDItemDTO),
});

export const updateTargetResponseDTO = Type.Object({
  code: Type.Number(),
  data: getTargetResponseItemDTO,
});

export type TargetItem = Static<typeof targetItemDTO>;

export type GetTargetQuery = Static<typeof getTargetQueryDTO>;

export type GetTargetResponseItem = Static<typeof getTargetResponseItemDTO>;

export type GetTargetResponse = Static<typeof getTargetResponseDTO>;

export type GetTargetByIdParams = Static<typeof getTargetByIdParamsDTO>;

export type GetTargetByIdResponse = Static<typeof getTargetByIdResponseDTO>;

export type CreateTargetBody = Static<typeof createTargetBodyDTO>;

export type CreateTargetResponse = Static<typeof createTargetResponseDTO>;

export type UpdateTargetParams = Static<typeof updateTargetParamsDTO>;

export type UpdateTargetBody = Static<typeof updateTargetBodyDTO>;

export type UpdateTargetResponse = Static<typeof updateTargetResponseDTO>;
