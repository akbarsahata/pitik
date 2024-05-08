import { Static, Type } from '@sinclair/typebox';
import { USER_TYPE } from '../libs/constants';
import { paginationDTO } from './common.dto';

export const userItemDTO = Type.Object({
  id: Type.Optional(Type.String()),
  userType: Type.Enum(USER_TYPE),
  userCode: Type.String(),
  fullName: Type.String(),
  email: Type.String(),
  phoneNumber: Type.String(),
  waNumber: Type.String(),
  status: Type.Boolean(),
  ownerId: Type.Optional(Type.String()),
  parentId: Type.Optional(Type.String()),
  roleId: Type.Optional(Type.String()),
  acceptTnc: Type.Optional(Type.Boolean()),
});

export const createUserBodyDTO = Type.Object({
  ...userItemDTO.properties,
  email: Type.Optional(Type.String()),
  password: Type.String(),
});

export const createUserResponseDTO = Type.Object({
  code: Type.Number(),
  data: Type.Object({
    ...userItemDTO.properties,
  }),
});

export const getUsersQueryStringDTO = Type.Object({
  userType: Type.Optional(Type.Enum(USER_TYPE)),
  userTypes: Type.Optional(Type.String()),
  name: Type.Optional(Type.String()),
  userCode: Type.Optional(Type.String()),
  email: Type.Optional(Type.String()),
  phoneNumber: Type.Optional(Type.String()),
  waNumber: Type.Optional(Type.String()),
  status: Type.Optional(Type.Boolean()),
  ownerName: Type.Optional(Type.String()),
  ownerId: Type.Optional(Type.String()),
  ...paginationDTO.properties,
  $order: Type.Optional(Type.String()),
});

export const ownerItemDTO = Type.Object({
  fullName: Type.Optional(Type.String()),
});

export const getUserResponseItemDTO = Type.Object({
  ...userItemDTO.properties,
  owner: Type.Optional(ownerItemDTO),
  modifiedBy: Type.String(),
  modifiedDate: Type.Optional(Type.String()),
});

export const getUsersResponseDTO = Type.Object({
  code: Type.Number(),
  count: Type.Number(),
  data: Type.Array(getUserResponseItemDTO),
});

export const getUserByIdParamDTO = Type.Object({
  userId: Type.String(),
});

export const getUserByIdResponseDTO = Type.Object({
  code: Type.Number(),
  data: userItemDTO,
});

export const userMeItemDTO = Type.Object({
  id: Type.String(),
  userCode: Type.String(),
  fullName: Type.String(),
  email: Type.String(),
  phoneNumber: Type.String(),
  waNumber: Type.Optional(Type.String()),
  userType: Type.String(),
  status: Type.Number(),
  acceptTnc: Type.Number(),
  isPplAppUser: Type.Optional(Type.Boolean()),
  createdDate: Type.String(),
});

export const getUserMeResponseDTO = Type.Object({
  code: Type.Number(),
  data: userMeItemDTO,
});

export const updateUserByIdParamDTO = Type.Object({
  userId: Type.String(),
});

export const updateUserByIdBodyDTO = Type.Object({
  ...Type.Partial(userItemDTO).properties,
  password: Type.Optional(Type.String()),
});

export const updateUserByIdResponseDTO = Type.Object({
  code: Type.Number(),
  data: Type.Object({
    ...userItemDTO.properties,
    modifiedBy: Type.String(),
    modifiedDate: Type.Optional(Type.String()),
  }),
});

export const getUserSupervisorResponseDTO = Type.Object({
  id: Type.String(),
  name: Type.String(),
  email: Type.String(),
  phone: Type.String(),
  role: Type.String(),
  roleId: Type.String(),
  parentId: Type.String(),
  idCms: Type.String(),
});

export const patchMeRequestBodyDTO = Type.Object({
  acceptTnc: Type.Optional(Type.Boolean()),
  oldPassword: Type.Optional(Type.String()),
  password: Type.Optional(Type.String()),
  confirmPassword: Type.Optional(Type.String()),
});

export type UserItem = Static<typeof userItemDTO>;

export type UserMeItem = Static<typeof userMeItemDTO>;

export type CreateUserBody = Static<typeof createUserBodyDTO>;

export type CreateUserResponse = Static<typeof createUserResponseDTO>;

export type GetUsersQueryString = Static<typeof getUsersQueryStringDTO>;

export type GetUserResponseItem = Static<typeof getUserResponseItemDTO>;

export type GetUserMeItemResponse = Static<typeof getUserMeResponseDTO>;

export type GetUsersResponse = Static<typeof getUsersResponseDTO>;

export type GetUserByIdParam = Static<typeof getUserByIdParamDTO>;

export type GetUserByIdResponse = Static<typeof getUserByIdResponseDTO>;

export type UpdateUserByIdParam = Static<typeof updateUserByIdParamDTO>;

export type UpdateUserByIdBody = Static<typeof updateUserByIdBodyDTO>;

export type UpdateUserByIdResponse = Static<typeof updateUserByIdResponseDTO>;

export type GetUserSupervisorResponse = Static<typeof getUserSupervisorResponseDTO>;

export type PatchMeRequestBody = Static<typeof patchMeRequestBodyDTO>;
