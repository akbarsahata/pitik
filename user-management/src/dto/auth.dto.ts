import { Static, Type } from '@sinclair/typebox';
import { Nullable } from '../libs/utils/typebox';

export const generalVoidResponseDTO = Type.Object({
  code: Type.Number(),
  data: Type.Object({
    message: Type.String(),
  }),
});

const roleItemDTO = Type.Object({
  id: Type.String(),
  name: Type.String(),
});

export const createAuthItemRequestBodyDTO = Type.Object({
  username: Type.String(),
  password: Type.String(),
});

export const createAuthItemRequestHeadersDTO = Type.Object({
  'X-ID': Type.Optional(Type.String()),
  'X-APP-ID': Type.Optional(Type.String()),
});

export const createAuthItemResponseDTO = Type.Object({
  id: Type.String(),
  token: Type.String(),
  acceptTnc: Type.Number(),
  refreshToken: Type.String(),
  action: Nullable(Type.String()),
});

export const createAuthResponseDTO = Type.Object({
  code: Type.Number(),
  data: createAuthItemResponseDTO,
});

export const createAuthVerifyRequestBodyDTO = Type.Object({
  'X-ID': Type.String(),
  'X-APP-ID': Type.Optional(Type.String()),
  endpoint: Type.String(),
  method: Type.KeyOf(
    Type.Object({
      GET: Type.String(),
      POST: Type.String(),
      PATCH: Type.String(),
      PUT: Type.String(),
      DELETE: Type.String(),
    }),
  ),
  accessToken: Type.String(),
});

export const createAuthVerifyItemResponseDTO = Type.Object({
  id: Type.String(),
  endpoint: Type.String(),
  method: Type.String(),
  status: Type.Boolean(),
  roles: Type.Array(roleItemDTO, { default: [] }),
  additional: Type.Object({
    id_cms: Type.String(),
    role: Type.String(),
    roleRank: Type.Optional(
      Type.Object({
        internal: Type.Optional(Type.Number()),
        ownerApp: Type.Optional(Type.Number()),
        downstream: Type.Optional(Type.Number()),
      }),
    ),
  }),
  organizationId: Type.Optional(Type.String()),
});

export const createAuthVerifyResponseDTO = Type.Object({
  code: Type.Number(),
  data: createAuthVerifyItemResponseDTO,
});

export const refreshTokenRequestBodyDTO = Type.Object({
  id: Type.String(),
  token: Type.Optional(Type.String()),
  refreshToken: Type.Optional(Type.String()),
});

export const refreshTokenResponseDTO = Type.Object({
  code: Type.Number(),
  data: Type.Object({
    id: Type.String(),
    token: Type.String(),
    refreshToken: Type.String(),
  }),
});

export const resetPasswordRequestBodyDTO = Type.Object({
  oldPassword: Type.String(),
  newPassword: Type.String(),
  confirmationPassword: Type.String(),
});

export const resetPasswordResponseDTO = Type.Object({
  ...generalVoidResponseDTO.properties,
});

export const logoutRequestHeadersDTO = Type.Object({
  Authorization: Type.String(),
});

export const logoutResponseDTO = Type.Object({
  code: Type.Number(),
  data: Type.Object({
    message: Type.String(),
  }),
});

export const forceLogoutRequestParamsDTO = Type.Object({
  userId: Type.String(),
});

export const forceLogoutResponseDTO = Type.Object({
  ...generalVoidResponseDTO.properties,
});

export const createAuthLoginGoogleRequestBodyDTO = Type.Object({
  credentials: Type.String(),
});

export const createAuthLoginAppleRequestBodyDTO = Type.Object({
  credentials: Type.String(),
});

export type CreateAuthItemRequestHeaders = Static<typeof createAuthItemRequestHeadersDTO>;

export type CreateAuthItemRequest = Static<typeof createAuthItemRequestBodyDTO>;

export type CreateAuthItemResponse = Static<typeof createAuthItemResponseDTO>;

export type CreateAuthResponse = Static<typeof createAuthResponseDTO>;

export type CreateAuthVerifyRequestBody = Static<typeof createAuthVerifyRequestBodyDTO>;

export type CreateAuthVerifyItemResponse = Static<typeof createAuthVerifyItemResponseDTO>;

export type CreateAuthVerifyResponse = Static<typeof createAuthVerifyResponseDTO>;

export type RefreshTokenRequestBody = Static<typeof refreshTokenRequestBodyDTO>;

export type RefreshTokenResponse = Static<typeof refreshTokenResponseDTO>;

export type ResetPasswordRequestBody = Static<typeof resetPasswordRequestBodyDTO>;

export type ResetPasswordResponse = Static<typeof resetPasswordResponseDTO>;

export type LogoutRequestHeaders = Static<typeof logoutRequestHeadersDTO>;

export type LogoutResponse = Static<typeof logoutResponseDTO>;

export type ForceLogoutRequestParams = Static<typeof forceLogoutRequestParamsDTO>;

export type ForceLogoutResponse = Static<typeof forceLogoutResponseDTO>;

export type CreateAuthLoginGoogleRequestBody = Static<typeof createAuthLoginGoogleRequestBodyDTO>;

export type CreateAuthLoginAppleRequestBody = Static<typeof createAuthLoginAppleRequestBodyDTO>;
