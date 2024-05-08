import { Static, Type } from '@sinclair/typebox';
import { VariableType } from '../datasources/entity/pgsql/Variable.entity';
import { paginationDTO } from './common.dto';

export const variableItemDTO = Type.Object({
  id: Type.Optional(Type.String()),
  variableCode: Type.String(),
  variableName: Type.String(),
  variableUOM: Type.Optional(Type.String()),
  variableType: Type.Enum(VariableType),
  variableFormula: Type.Optional(Type.String()),
  digitComa: Type.Optional(Type.Number()),
  status: Type.Boolean(),
  remarks: Type.Optional(Type.String()),
});

export const getVariableQueryDTO = Type.Object({
  ...Type.Partial(paginationDTO).properties,
  variableCode: Type.Optional(Type.String()),
  variableName: Type.Optional(Type.String()),
  variableUOM: Type.Optional(Type.String()),
  variableType: Type.Optional(Type.Enum(VariableType)),
  status: Type.Optional(Type.Boolean()),
});

export const getVariableResponseItemDTO = Type.Object({
  ...variableItemDTO.properties,
  modifiedBy: Type.String(),
  modifiedDate: Type.Optional(Type.String()),
});

export const getVariableResponseDTO = Type.Object({
  code: Type.Number(),
  count: Type.Number(),
  data: Type.Array(getVariableResponseItemDTO),
});

export const getVariableByIdParamsDTO = Type.Object({
  id: Type.String(),
});

export const getVariableByIdResponseItemDTO = Type.Object({
  ...variableItemDTO.properties,
  modifiedBy: Type.String(),
  modifiedDate: Type.Optional(Type.String()),
});

export const getVariableByIdResponseDTO = Type.Object({
  code: Type.Number(),
  data: getVariableByIdResponseItemDTO,
});

export const createVariableResponseItemDTO = Type.Object({
  ...variableItemDTO.properties,
  createdBy: Type.String(),
  createdDate: Type.Optional(Type.String()),
});

export const createVariableBodyDTO = Type.Object({
  ...variableItemDTO.properties,
});

export const createVariableResponseDTO = Type.Object({
  code: Type.Number(),
  data: createVariableResponseItemDTO,
});

export const updateVariableParamsDTO = Type.Object({
  id: Type.String(),
});

export const updateVariableBodyDTO = Type.Object({
  ...Type.Partial(variableItemDTO).properties,
});

export const updateVariableResponseDTO = Type.Object({
  code: Type.Number(),
  data: getVariableByIdResponseItemDTO,
});

export type VariableItem = Static<typeof variableItemDTO>;

export type GetVariableQuery = Static<typeof getVariableQueryDTO>;

export type GetVariableResponseItem = Static<typeof getVariableResponseItemDTO>;

export type GetVariableResponse = Static<typeof getVariableResponseDTO>;

export type GetVariableByIdParams = Static<typeof getVariableByIdParamsDTO>;

export type GetVariableByIdResponseItem = Static<typeof getVariableByIdResponseItemDTO>;

export type GetVariableByIdResponse = Static<typeof getVariableByIdResponseDTO>;

export type CreateVariableResponseItem = Static<typeof createVariableResponseItemDTO>;

export type CreateVariableBody = Static<typeof createVariableBodyDTO>;

export type CreateVariableResponse = Static<typeof createVariableResponseDTO>;

export type UpdateVariableParams = Static<typeof updateVariableParamsDTO>;

export type UpdateVariableBody = Static<typeof updateVariableBodyDTO>;

export type UpdateVariableResponse = Static<typeof updateVariableResponseDTO>;
