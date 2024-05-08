import { Static, Type } from '@sinclair/typebox';
import { paginationDTO } from './common.dto';

export const roleItemDTO = Type.Object({
  name: Type.String(),
});

export const roleItemOutputDTO = Type.Object({
  id: Type.String(),
  name: Type.String(),
  createdDate: Type.String(),
  createdBy: Type.String(),
  modifiedDate: Type.Optional(Type.String()),
  modifiedBy: Type.Optional(Type.String()),
  roleAcl: Type.Optional(Type.Array(Type.Any())),
  roleRanks: Type.Optional(
    Type.Object({
      rank: Type.Optional(Type.Number()),
      context: Type.Optional(Type.String()),
    }),
  ),
});

export const createRoleItemRequestBodyDTO = Type.Object({
  ...roleItemDTO.properties,
});

export const createRoleItemResponseDTO = Type.Object({
  ...roleItemOutputDTO.properties,
  createdBy: Type.Optional(Type.String()),
  createdDate: Type.Optional(Type.String()),
});

export const createRoleResponseDTO = Type.Object({
  code: Type.Number(),
  data: createRoleItemResponseDTO,
});

export const getRolesQueryDTO = Type.Object({
  ...Type.Partial(paginationDTO).properties,
  name: Type.Optional(Type.String()),
  context: Type.Optional(Type.String()),
});

export const getRolesResponseDTO = Type.Object({
  code: Type.Number(),
  count: Type.Number(),
  data: Type.Array(roleItemOutputDTO),
});

export const getRoleParamsDTO = Type.Object({
  roleId: Type.String(),
});

export const getRoleByIdResponseDTO = Type.Object({
  code: Type.Number(),
  data: roleItemOutputDTO,
});

export const updateRoleParamsDTO = Type.Object({
  roleId: Type.String(),
});

export const updateRoleBodyDTO = Type.Object({
  ...Type.Partial(roleItemDTO).properties,
});

export const updateRoleItemResponseDTO = Type.Object({
  ...roleItemOutputDTO.properties,
  modifiedBy: Type.String(),
  modifiedDate: Type.String(),
});

export const updateRoleResponseDTO = Type.Object({
  code: Type.Number(),
  data: updateRoleItemResponseDTO,
});

export const deleteRoleParamsDTO = Type.Object({
  roleId: Type.String(),
});

export const deleteRoleItemResponseDTO = Type.Object({
  id: Type.String(),
  name: Type.String(),
});

export const deleteRoleResponseDTO = Type.Object({
  code: Type.Number(),
  data: deleteRoleItemResponseDTO,
});

export type CreateRoleRequestBody = Static<typeof createRoleItemRequestBodyDTO>;

export type CreateRoleItemResponse = Static<typeof createRoleItemResponseDTO>;

export type CreateRoleResponse = Static<typeof createRoleResponseDTO>;

export type GetRolesQuery = Static<typeof getRolesQueryDTO>;

export type GetRoleResponse = Static<typeof roleItemOutputDTO>;

export type GetRolesResponse = Static<typeof getRolesResponseDTO>;

export type GetRoleParams = Static<typeof getRoleParamsDTO>;

export type GetRoleByIdResponse = Static<typeof getRoleByIdResponseDTO>;

export type UpdateRoleParams = Static<typeof updateRoleParamsDTO>;

export type UpdateRoleBody = Static<typeof updateRoleBodyDTO>;

export type UpdateRoleItemResponse = Static<typeof updateRoleItemResponseDTO>;

export type UpdateRoleResponse = Static<typeof updateRoleResponseDTO>;

export type DeleteRoleParams = Static<typeof deleteRoleParamsDTO>;

export type DeleteRoleItemResponse = Static<typeof deleteRoleItemResponseDTO>;

export type DeleteRoleResponse = Static<typeof deleteRoleResponseDTO>;
