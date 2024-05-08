import { Static, Type } from '@sinclair/typebox';
import { paginationDTO } from './common.dto';

export const privilegeItemDTO = Type.Object({
  userId: Type.String(),
  apiId: Type.String(),
  expirationDate: Type.String(),
});

export const privilegeItemOutputDTO = Type.Object({
  id: Type.String(),
  userId: Type.String(),
  apiId: Type.String(),
  expirationDate: Type.String(),
  createdDate: Type.String(),
  createdBy: Type.String(),
  modifiedDate: Type.Optional(Type.String()),
  modifiedBy: Type.Optional(Type.String()),
});

export const createPrivilegeItemRequestBodyDTO = Type.Object({
  ...privilegeItemDTO.properties,
});

export const createPrivilegeItemResponseDTO = Type.Object({
  ...privilegeItemDTO.properties,
  createdBy: Type.Optional(Type.String()),
  createdDate: Type.Optional(Type.String()),
});

export const createPrivilegeResponseDTO = Type.Object({
  code: Type.Number(),
  data: createPrivilegeItemResponseDTO,
});

export const getPrivilegesQueryDTO = Type.Object({
  ...Type.Partial(paginationDTO).properties,
  userId: Type.Optional(Type.String()),
  apiId: Type.Optional(Type.String()),
});

export const getPrivilegesResponseDTO = Type.Object({
  code: Type.Number(),
  count: Type.Number(),
  data: Type.Array(privilegeItemOutputDTO),
});

export const getPrivilegeParamsDTO = Type.Object({
  privilegeId: Type.String(),
});

export const getPrivilegeByIdResponseDTO = Type.Object({
  code: Type.Number(),
  data: privilegeItemOutputDTO,
});

export const updatePrivilegeParamsDTO = Type.Object({
  privilegeId: Type.String(),
});

export const updatePrivilegeBodyDTO = Type.Object({
  ...Type.Partial(privilegeItemDTO).properties,
});

export const updatePrivilegeItemResponseDTO = Type.Object({
  ...privilegeItemOutputDTO.properties,
  modifiedBy: Type.String(),
  modifiedDate: Type.String(),
});

export const updatePrivilegeResponseDTO = Type.Object({
  code: Type.Number(),
  data: updatePrivilegeItemResponseDTO,
});

export const deletePrivilegeParamsDTO = Type.Object({
  privilegeId: Type.String(),
});

export const deletePrivilegeResponseDTO = Type.Object({
  code: Type.Number(),
  data: Type.String(),
});

export type CreatePrivilegeRequestBody = Static<typeof createPrivilegeItemRequestBodyDTO>;

export type CreatePrivilegeItemResponse = Static<typeof createPrivilegeItemResponseDTO>;

export type CreatePrivilegeResponse = Static<typeof createPrivilegeResponseDTO>;

export type GetPrivilegesQuery = Static<typeof getPrivilegesQueryDTO>;

export type GetPrivilegeResponse = Static<typeof privilegeItemOutputDTO>;

export type GetPrivilegesResponse = Static<typeof getPrivilegesResponseDTO>;

export type GetPrivilegeParams = Static<typeof getPrivilegeParamsDTO>;

export type GetPrivilegeByIdResponse = Static<typeof getPrivilegeByIdResponseDTO>;

export type UpdatePrivilegeParams = Static<typeof updatePrivilegeParamsDTO>;

export type UpdatePrivilegeBody = Static<typeof updatePrivilegeBodyDTO>;

export type UpdatePrivilegeItemResponse = Static<typeof updatePrivilegeItemResponseDTO>;

export type UpdatePrivilegeResponse = Static<typeof updatePrivilegeResponseDTO>;

export type DeletePrivilegeParams = Static<typeof deletePrivilegeParamsDTO>;

export type DeletePrivilegeResponse = Static<typeof deletePrivilegeResponseDTO>;
