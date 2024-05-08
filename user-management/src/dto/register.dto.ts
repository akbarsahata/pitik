import { Static, Type } from '@sinclair/typebox';
import { ROLE_RANK_CONTEXT } from '../libs/constants';

/**
 * TODO: This register.dto is used only to unblock farming integration
 * Please remove once userManagement.dao.ts in farming is updated
 */
export const registerUserItemRequestBodyDTO = Type.Object({
  fullName: Type.String(),
  email: Type.Optional(Type.String()),
  phone: Type.String(),
  password: Type.String(),
  lang: Type.String(),
  role: Type.Optional(Type.String()),
  roleId: Type.Optional(Type.String()),
  roleIds: Type.Optional(Type.Array(Type.String(), { default: [] })),
  status: Type.Optional(Type.Boolean()),
  createdBy: Type.Optional(Type.String()),
  parentId: Type.Optional(Type.String()),
  additional: Type.Optional(
    Type.Object({
      id_cms: Type.Optional(Type.String()),
    }),
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
  organizationId: Type.Optional(Type.String()),
});

export const registerUserItemResponseDTO = Type.Object({
  id: Type.String(),
  ...Type.Partial(registerUserItemRequestBodyDTO).properties,
  createdDate: Type.String(),
  createdBy: Type.String(),
});

export const registerUserResponseDTO = Type.Object({
  code: Type.Number(),
  data: Type.Object({
    id: Type.String(),
    ...Type.Partial(registerUserItemRequestBodyDTO).properties,
  }),
});

export type RegisterUserRequestBody = Static<typeof registerUserItemRequestBodyDTO>;

export type RegisterUserItemResponse = Static<typeof registerUserItemResponseDTO>;

export type RegisterUserResponse = Static<typeof registerUserResponseDTO>;
