import { Static, Type } from '@sinclair/typebox';

export const userManagementItemDTO = Type.Object({
  parentId: Type.Optional(Type.String()),
  roleId: Type.Optional(Type.String()),
});

export const getUserManagementDetailResponseDTO = Type.Object({
  ...userManagementItemDTO.properties,
});

export type UserManagementItem = Static<typeof userManagementItemDTO>;

export type GetUserManagementDetailResponse = Static<typeof getUserManagementDetailResponseDTO>;
