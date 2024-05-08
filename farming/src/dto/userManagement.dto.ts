import { Static, Type } from '@sinclair/typebox';
import { ROLE_RANK_CONTEXT } from '../libs/constants';

export const userManagementItemDTO = Type.Object({
  id: Type.String(),
  cmsId: Type.String(),
  fullName: Type.String(),
  email: Type.String(),
  phone: Type.String(),
  status: Type.Boolean(),
  parentId: Type.Optional(Type.String()),
  roleId: Type.Optional(Type.String()),
  roles: Type.Optional(
    Type.Array(
      Type.Object({
        id: Type.String(),
        name: Type.String(),
      }),
      { default: [] },
    ),
  ),
  supervisors: Type.Optional(
    Type.Array(
      Type.Object({
        context: Type.Enum(ROLE_RANK_CONTEXT),
        supervisorId: Type.String(),
      }),
      { default: [] },
    ),
  ),
  modules: Type.Optional(
    Type.Object({
      downstreamApp: Type.Array(Type.String(), { default: [] }),
      fms: Type.Array(Type.String(), { default: [] }),
      pplApp: Type.Array(Type.String(), { default: [] }),
      ownerApp: Type.Array(Type.String(), { default: [] }),
    }),
  ),
  organizationId: Type.Optional(Type.String()),
});

export const getUserManagementDetailResponseDTO = Type.Object({
  ...userManagementItemDTO.properties,
});

export const subordinateItemDTO = Type.Object({
  id: Type.String(),
  cmsId: Type.String(),
  fullName: Type.String(),
  email: Type.String(),
  phone: Type.String(),
});

export type UserManagementItem = Static<typeof userManagementItemDTO>;

export type GetUserManagementDetailResponse = Static<typeof getUserManagementDetailResponseDTO>;

export type SubordinateItem = Static<typeof subordinateItemDTO>;
