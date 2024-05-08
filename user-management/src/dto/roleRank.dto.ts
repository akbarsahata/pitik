import { Static, Type } from '@sinclair/typebox';
import { paginationDTO } from './common.dto';

export const roleRankItemDTO = Type.Object({
  rank: Type.Number(),
  context: Type.String(),
  roleId: Type.String(),
});

export const roleRankItemOutputDTO = Type.Object({
  id: Type.String(),
  ...roleRankItemDTO.properties,
  createdDate: Type.String(),
  createdBy: Type.String(),
  modifiedDate: Type.Optional(Type.String()),
  modifiedBy: Type.Optional(Type.String()),
});

export const createRoleRankItemRequestBodyDTO = Type.Object({
  ...roleRankItemDTO.properties,
});

export const createRoleRankItemResponseDTO = Type.Object({
  ...roleRankItemOutputDTO.properties,
});

export const createRoleRankResponseDTO = Type.Object({
  code: Type.Number(),
  data: createRoleRankItemResponseDTO,
});

export const getRoleRanksQueryDTO = Type.Object({
  ...Type.Partial(paginationDTO).properties,
  rank: Type.Optional(Type.Number()),
  context: Type.Optional(Type.String()),
});

export const getRoleRanksResponseDTO = Type.Object({
  code: Type.Number(),
  count: Type.Number(),
  data: Type.Array(roleRankItemOutputDTO),
});

export const getRoleRankParamsDTO = Type.Object({
  roleRankId: Type.String(),
});

export const getRoleRankByIdResponseDTO = Type.Object({
  code: Type.Number(),
  data: roleRankItemOutputDTO,
});

export const updateRoleRankParamsDTO = Type.Object({
  roleRankId: Type.String(),
});

export const updateRoleRankBodyDTO = Type.Object({
  ...Type.Partial(roleRankItemDTO).properties,
});

export const updateRoleRankItemResponseDTO = Type.Object({
  ...roleRankItemOutputDTO.properties,
  modifiedBy: Type.String(),
  modifiedDate: Type.String(),
});

export const updateRoleRankResponseDTO = Type.Object({
  code: Type.Number(),
  data: updateRoleRankItemResponseDTO,
});

export const deleteRoleRankParamsDTO = Type.Object({
  roleRankId: Type.String(),
});

export const deleteRoleRankResponseDTO = Type.Object({
  code: Type.Number(),
  data: Type.String(),
});

export type CreateRoleRankRequestBody = Static<typeof createRoleRankItemRequestBodyDTO>;

export type CreateRoleRankItemResponse = Static<typeof createRoleRankItemResponseDTO>;

export type CreateRoleRankResponse = Static<typeof createRoleRankResponseDTO>;

export type GetRoleRanksQuery = Static<typeof getRoleRanksQueryDTO>;

export type GetRoleRankResponse = Static<typeof roleRankItemOutputDTO>;

export type GetRoleRanksResponse = Static<typeof getRoleRanksResponseDTO>;

export type GetRoleRankParams = Static<typeof getRoleRankParamsDTO>;

export type GetRoleRankByIdResponse = Static<typeof getRoleRankByIdResponseDTO>;

export type UpdateRoleRankParams = Static<typeof updateRoleRankParamsDTO>;

export type UpdateRoleRankBody = Static<typeof updateRoleRankBodyDTO>;

export type UpdateRoleRankItemResponse = Static<typeof updateRoleRankItemResponseDTO>;

export type UpdateRoleRankResponse = Static<typeof updateRoleRankResponseDTO>;

export type DeleteRoleRankParams = Static<typeof deleteRoleRankParamsDTO>;

export type DeleteRoleRankResponse = Static<typeof deleteRoleRankResponseDTO>;
