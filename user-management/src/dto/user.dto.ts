import { Static, Type } from '@sinclair/typebox';
import { ROLE_RANK_CONTEXT } from '../libs/constants';
import { paginationDTO } from './common.dto';

export const userItemDTO = Type.Object({
  id: Type.Optional(Type.String()),
  fullName: Type.String(),
  email: Type.Optional(Type.String()),
  phone: Type.String(),
  password: Type.String(),
  status: Type.Boolean({ default: true }),
  lang: Type.Optional(Type.String({ default: 'id' })),
  parentId: Type.Optional(Type.String()),
  roleId: Type.String(),
  roles: Type.Array(
    Type.Object({
      id: Type.String(),
      name: Type.String(),
    }),
    { default: [] },
  ),
  additional: Type.Optional(
    Type.Object({
      id_cms: Type.Optional(Type.String()),
    }),
  ),
  createdBy: Type.Optional(Type.String()),
  acceptTnc: Type.Number({ default: 0 }),
  organizationId: Type.Optional(Type.String()),
});

export const userItemOutputDTO = Type.Object({
  id: Type.String(),
  cmsId: Type.Optional(Type.String()),
  fullName: Type.String(),
  email: Type.Optional(Type.String()),
  phone: Type.String(),
  status: Type.Boolean(),
  lang: Type.String(),
  acceptTnc: Type.Number(),
  parentId: Type.Optional(Type.String()),
  roleId: Type.String(),
  roles: Type.Array(
    Type.Object({
      id: Type.String(),
      name: Type.String(),
    }),
    { default: [] },
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
  roleName: Type.Optional(Type.String()),
  createdDate: Type.String(),
  createdBy: Type.String(),
  modifiedDate: Type.Optional(Type.String()),
  modifiedBy: Type.Optional(Type.String()),
  modules: Type.Optional(
    Type.Object({
      downstreamApp: Type.Array(Type.String(), { default: [] }),
      fms: Type.Array(Type.String(), { default: [] }),
      pplApp: Type.Array(Type.String(), { default: [] }),
      ownerApp: Type.Array(Type.String(), { default: [] }),
    }),
  ),
});

export const createUserItemRequestBodyDTO = Type.Object({
  ...userItemDTO.properties,
  roleIds: Type.Array(Type.String(), { default: [] }),
});

export const createUserItemResponseDTO = Type.Object({
  ...userItemOutputDTO.properties,
});

export const createUserResponseDTO = Type.Object({
  code: Type.Number(),
  data: createUserItemResponseDTO,
});

export const getUsersQueryDTO = Type.Object({
  ...Type.Partial(paginationDTO).properties,
  name: Type.Optional(Type.String()),
  'additional.id_cms': Type.Optional(Type.String()),
  cmsIds: Type.Optional(Type.Union([Type.String(), Type.Array(Type.String(), { default: [] })])),
});

export const getUsersResponseDTO = Type.Object({
  code: Type.Number(),
  count: Type.Number(),
  data: Type.Array(userItemOutputDTO),
});

export const getUserParamsDTO = Type.Object({
  userId: Type.String(),
});

export const getUserByIdResponseDTO = Type.Object({
  code: Type.Number(),
  data: userItemOutputDTO,
});

export const getUserSupervisorQueryDTO = Type.Object({
  ...Type.Partial(paginationDTO).properties,
  context: Type.Enum(ROLE_RANK_CONTEXT, { default: ROLE_RANK_CONTEXT.internal }),
  rank: Type.Optional(Type.Number()),
  'rank[$lte]': Type.Optional(Type.Number()),
  cms_id: Type.Optional(Type.String()),
});

export const getUserSupervisorItemDTO = Type.Object({
  id: Type.String(),
  name: Type.String(),
  email: Type.String(),
  phone: Type.String(),
  role: Type.String(),
  roleId: Type.String(),
  parentId: Type.String(),
  idCms: Type.Optional(Type.String()),
});

export const getUserSupervisorResponseDTO = Type.Object({
  code: Type.Number(),
  count: Type.Number(),
  data: Type.Array(getUserSupervisorItemDTO),
});

export const getUserSupervisorChainListParamsDTO = Type.Object({
  idCms: Type.String(),
});

export const getUserSupervisorChainListResponseDTO = Type.Object({
  ...getUserSupervisorResponseDTO.properties,
});

export const updateUserParamsDTO = Type.Object({
  userId: Type.String(),
});

export const updateUserBodyDTO = Type.Object({
  ...Type.Partial(userItemDTO).properties,
  roleIds: Type.Optional(Type.Array(Type.String(), { default: [] })),
  confirmPassword: Type.Optional(Type.String()),
  modifiedBy: Type.Optional(Type.String()),
  supervisors: Type.Optional(
    Type.Array(
      Type.Object({
        context: Type.Enum(ROLE_RANK_CONTEXT),
        supervisorId: Type.String(),
      }),
      { default: [] },
    ),
  ),
});

export const updateUserItemResponseDTO = Type.Object({
  ...userItemOutputDTO.properties,
  modifiedBy: Type.String(),
  modifiedDate: Type.String(),
});

export const updateUserResponseDTO = Type.Object({
  code: Type.Number(),
  data: updateUserItemResponseDTO,
});

// TODO: This DTO is used only to unblock farming integration
export const patchUserBodyDTO = Type.Object({
  fullName: Type.String(),
  email: Type.String(),
  phone: Type.String(),
  password: Type.Optional(Type.String()),
  roleId: Type.Optional(Type.String()),
  roleIds: Type.Optional(Type.Array(Type.String(), { default: [] })),
  parentId: Type.Optional(Type.String()),
  acceptTnc: Type.Optional(Type.Number()),
  modifiedBy: Type.String(),
  supervisors: Type.Optional(
    Type.Array(
      Type.Object({
        context: Type.Enum(ROLE_RANK_CONTEXT),
        supervisorId: Type.String(),
      }),
      { default: [] },
    ),
  ),
  organizationId: Type.Optional(Type.String()),
});

export const deleteUserParamsDTO = Type.Object({
  userId: Type.String(),
});

export const deleteUserResponseDTO = Type.Object({
  code: Type.Number(),
  data: Type.String(),
});

export const getUserRolesResponseDTO = Type.Object({
  code: Type.Number(),
  count: Type.Number(),
  data: Type.Array(
    Type.Object({
      id: Type.String(),
      name: Type.String(),
    }),
  ),
});

export const searchUsersBodyDTO = Type.Object({
  ...Type.Partial(paginationDTO).properties,
  cmsIds: Type.Optional(Type.Array(Type.String(), { default: [] })),
});

export const getSubordinatesQueryDTO = Type.Object({
  ...Type.Partial(paginationDTO).properties,
  context: Type.Optional(Type.Enum(ROLE_RANK_CONTEXT)),
});

export const getSubordinatesResponseItemDTO = Type.Object({
  id: Type.String(),
  cmsId: Type.String(),
  fullName: Type.String(),
  email: Type.String(),
  phone: Type.String(),
});

export const getSubordinatesResponseDTO = Type.Object({
  code: Type.Number(),
  count: Type.Number(),
  data: Type.Array(getSubordinatesResponseItemDTO),
});

export const searchUserIdsQueryDTO = Type.Object({
  roleIds: Type.Optional(Type.String()),
  roleNames: Type.Optional(Type.String()),
});

export const searchUserIdsResponseDTO = Type.Object({
  code: Type.Number(),
  count: Type.Number(),
  data: Type.Array(Type.String()),
});

export type CreateUserRequestBody = Static<typeof createUserItemRequestBodyDTO>;

export type CreateUserItemResponse = Static<typeof createUserItemResponseDTO>;

export type CreateUserResponse = Static<typeof createUserResponseDTO>;

export type GetUsersQuery = Static<typeof getUsersQueryDTO>;

export type GetUserResponse = Static<typeof userItemOutputDTO>;

export type GetUsersResponse = Static<typeof getUsersResponseDTO>;

export type GetUserParams = Static<typeof getUserParamsDTO>;

export type GetUserByIdResponse = Static<typeof getUserByIdResponseDTO>;

export type GetUserSupervisorQuery = Static<typeof getUserSupervisorQueryDTO>;

export type GetUserSupervisorItemResponse = Static<typeof getUserSupervisorItemDTO>;

export type GetUserSupervisorResponse = Static<typeof getUserSupervisorResponseDTO>;

export type GetUserSupervisorChainListParams = Static<typeof getUserSupervisorChainListParamsDTO>;

export type GetUserSupervisorChainListResponse = Static<
  typeof getUserSupervisorChainListResponseDTO
>;

export type UpdateUserParams = Static<typeof updateUserParamsDTO>;

export type UpdateUserBody = Static<typeof updateUserBodyDTO>;

export type UpdateUserItemResponse = Static<typeof updateUserItemResponseDTO>;

export type UpdateUserResponse = Static<typeof updateUserResponseDTO>;

// TODO: This DTO is used only to unblock farming integration
export type PatchUserRequestBody = Static<typeof patchUserBodyDTO>;

export type DeleteUserParams = Static<typeof deleteUserParamsDTO>;

export type DeleteUserResponse = Static<typeof deleteUserResponseDTO>;

export type GetUserRolesResponse = Static<typeof getUserRolesResponseDTO>;

export type SearchUsersBody = Static<typeof searchUsersBodyDTO>;

export type GetSubordinatesQuery = Static<typeof getSubordinatesQueryDTO>;

export type GetSubordinatesResponseItem = Static<typeof getSubordinatesResponseItemDTO>;

export type GetSubordinatesResponse = Static<typeof getSubordinatesResponseDTO>;

export type SearchUserIdsQuery = Static<typeof searchUserIdsQueryDTO>;

export type SearchUserIdsResponse = Static<typeof searchUserIdsResponseDTO>;
