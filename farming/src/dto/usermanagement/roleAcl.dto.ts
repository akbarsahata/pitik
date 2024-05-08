import { Static, Type } from '@sinclair/typebox';
import { paginationDTO } from './common.dto';

export const roleAclItemDTO = Type.Object({
  id: Type.Optional(Type.String()),
  roleId: Type.String(),
  apiId: Type.String(),
});

export const roleAclItemOutputDTO = Type.Object({
  id: Type.String(),
  roleId: Type.String(),
  apiId: Type.String(),
  createdDate: Type.String(),
  createdBy: Type.String(),
  modifiedDate: Type.Optional(Type.String()),
  modifiedBy: Type.Optional(Type.String()),
});

export const createRoleAclItemRequestBodyDTO = Type.Object({
  ...roleAclItemDTO.properties,
});

export const createRoleAclItemResponseDTO = Type.Object({
  ...roleAclItemOutputDTO.properties,
  createdBy: Type.Optional(Type.String()),
  createdDate: Type.Optional(Type.String()),
});

export const createRoleAclResponseDTO = Type.Object({
  code: Type.Number(),
  data: createRoleAclItemResponseDTO,
});

export const getRoleAclsQueryDTO = Type.Object({
  ...Type.Partial(paginationDTO).properties,
  roleId: Type.Optional(Type.String()),
  apiId: Type.Optional(Type.String()),
});

export const getRoleAclsResponseDTO = Type.Object({
  code: Type.Number(),
  count: Type.Number(),
  data: Type.Array(roleAclItemOutputDTO),
});

export const getRoleAclParamsDTO = Type.Object({
  roleAclId: Type.String(),
});

export const getRoleAclByIdResponseDTO = Type.Object({
  code: Type.Number(),
  data: roleAclItemOutputDTO,
});

export const getRoleAclValidateQueryDTO = Type.Object({
  name: Type.String(),
  method: Type.Optional(
    Type.KeyOf(
      Type.Object({
        POST: Type.String(),
        GET: Type.String(),
        PATCH: Type.String(),
        PUT: Type.String(),
        DELETE: Type.String(),
      }),
    ),
  ),
});

export const getRoleAclValidateResponseDTO = Type.Object({
  code: Type.Number(),
  data: Type.Object({
    isAllowed: Type.Boolean(),
  }),
});

export const updateRoleAclParamsDTO = Type.Object({
  roleAclId: Type.String(),
});

export const updateRoleAclBodyDTO = Type.Object({
  ...Type.Partial(roleAclItemDTO).properties,
});

export const updateRoleAclItemResponseDTO = Type.Object({
  ...roleAclItemOutputDTO.properties,
  modifiedBy: Type.String(),
  modifiedDate: Type.String(),
});

export const updateRoleAclResponseDTO = Type.Object({
  code: Type.Number(),
  data: updateRoleAclItemResponseDTO,
});

export const deleteRoleAclParamsDTO = Type.Object({
  roleAclId: Type.String(),
});

export const deleteRoleAclItemResponse = Type.Object({
  id: Type.String(),
  roleId: Type.String(),
  apiId: Type.String(),
});

export const deleteRoleAclResponseDTO = Type.Object({
  code: Type.Number(),
  data: Type.Object({
    ...deleteRoleAclItemResponse.properties,
  }),
});

export type CreateRoleAclRequestBody = Static<typeof createRoleAclItemRequestBodyDTO>;

export type CreateRoleAclItemResponse = Static<typeof createRoleAclItemResponseDTO>;

export type CreateRoleAclResponse = Static<typeof createRoleAclResponseDTO>;

export type GetRoleAclsQuery = Static<typeof getRoleAclsQueryDTO>;

export type GetRoleAclResponse = Static<typeof roleAclItemOutputDTO>;

export type GetRoleAclsResponse = Static<typeof getRoleAclsResponseDTO>;

export type GetRoleAclParams = Static<typeof getRoleAclParamsDTO>;

export type GetRoleAclByIdResponse = Static<typeof getRoleAclByIdResponseDTO>;

export type GetRoleAclValidateQuery = Static<typeof getRoleAclValidateQueryDTO>;

export type GetRoleAclValidateResponse = Static<typeof getRoleAclValidateResponseDTO>;

export type UpdateRoleAclParams = Static<typeof updateRoleAclParamsDTO>;

export type UpdateRoleAclBody = Static<typeof updateRoleAclBodyDTO>;

export type UpdateRoleAclItemResponse = Static<typeof updateRoleAclItemResponseDTO>;

export type UpdateRoleAclResponse = Static<typeof updateRoleAclResponseDTO>;

export type DeleteRoleAclParams = Static<typeof deleteRoleAclParamsDTO>;

export type DeleteRoleAclItemResponse = Static<typeof deleteRoleAclItemResponse>;

export type DeleteRoleAclResponse = Static<typeof deleteRoleAclResponseDTO>;
