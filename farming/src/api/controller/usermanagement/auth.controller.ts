import { FastifyRequest } from 'fastify';
import { Controller, DELETE, Inject, PATCH, POST } from 'fastify-decorators';
import {
  CreateAuthItemRequest,
  createAuthItemRequestBodyDTO,
  CreateAuthItemRequestHeaders,
  createAuthItemRequestHeadersDTO,
  CreateAuthLoginAppleRequestBody,
  CreateAuthLoginGoogleRequestBody,
  CreateAuthResponse,
  createAuthResponseDTO,
  CreateAuthVerifyRequestBody,
  createAuthVerifyRequestBodyDTO,
  CreateAuthVerifyResponse,
  createAuthVerifyResponseDTO,
  ForceLogoutRequestParams,
  forceLogoutRequestParamsDTO,
  ForceLogoutResponse,
  forceLogoutResponseDTO,
  LogoutRequestHeaders,
  logoutRequestHeadersDTO,
  LogoutResponse,
  logoutResponseDTO,
  RefreshTokenRequestBody,
  refreshTokenRequestBodyDTO,
  RefreshTokenResponse,
  refreshTokenResponseDTO,
  ResetPasswordRequestBody,
  resetPasswordRequestBodyDTO,
  ResetPasswordResponse,
  resetPasswordResponseDTO,
} from '../../../dto/usermanagement/auth.dto';
import { AuthService } from '../../../services/usermanagement/auth.service';
import { verifyAccessToken } from '../../hooks/onRequest/verifyAccessToken';
import { verifyAdmin } from '../../hooks/onRequest/verifyAdmin';
import { verifyToken } from '../../hooks/onRequest/verifyToken';

type CreateAuthRequest = FastifyRequest<{
  Body: CreateAuthItemRequest;
  Headers: CreateAuthItemRequestHeaders;
}>;

type CreateAuthVerifyRequest = FastifyRequest<{
  Body: CreateAuthVerifyRequestBody;
}>;

type LogoutRequest = FastifyRequest<{
  Headers: LogoutRequestHeaders;
}>;

type ForceLogoutRequest = FastifyRequest<{
  Params: ForceLogoutRequestParams;
}>;

type RefreshTokenRequest = FastifyRequest<{
  Body: RefreshTokenRequestBody;
}>;

type CreateAuthLoginGoogleRequest = FastifyRequest<{
  Body: CreateAuthLoginGoogleRequestBody;
}>;

type CreateAuthLoginAppleRequest = FastifyRequest<{
  Body: CreateAuthLoginAppleRequestBody;
}>;

@Controller({
  route: '/auth',
  type: 0,
  tags: [{ name: 'auth' }],
})
export class AuthController {
  @Inject(AuthService)
  private service!: AuthService;

  @POST({
    url: '/',
    options: {
      schema: {
        body: createAuthItemRequestBodyDTO,
        headers: createAuthItemRequestHeadersDTO,
        response: {
          200: createAuthResponseDTO,
        },
      },
    },
  })
  async auth(request: CreateAuthRequest): Promise<CreateAuthResponse> {
    const auth = await this.service.auth(request.body, request.headers as any);

    return {
      code: 200,
      data: auth,
    };
  }

  @POST({
    url: '/verify',
    options: {
      schema: {
        body: createAuthVerifyRequestBodyDTO,
        response: {
          200: createAuthVerifyResponseDTO,
        },
      },
      preValidation: [verifyAccessToken],
    },
  })
  async verify(request: CreateAuthVerifyRequest): Promise<CreateAuthVerifyResponse> {
    const authVerify = await this.service.verify(request.user, request.body);

    return {
      code: 200,
      data: authVerify,
    };
  }

  @POST({
    url: '/refresh_token',
    options: {
      schema: {
        body: refreshTokenRequestBodyDTO,
        response: {
          200: refreshTokenResponseDTO,
        },
      },
    },
  })
  async refreshToken(request: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    const tokenKey = request.body.refreshToken || request.body.token;

    const newToken = await this.service.refreshToken(request.body.id, tokenKey as string);

    return {
      code: 200,
      data: newToken,
    };
  }

  @DELETE({
    url: '/logout',
    options: {
      schema: {
        headers: logoutRequestHeadersDTO,
        response: {
          200: logoutResponseDTO,
        },
      },
      onRequest: [verifyToken],
    },
  })
  async logout(request: LogoutRequest): Promise<LogoutResponse> {
    await this.service.logout(request.user.id, request.headers.Authorization as any);

    return {
      code: 200,
      data: {
        message: 'Success Logout',
      },
    };
  }

  @DELETE({
    url: '/:userId/force-logout',
    options: {
      schema: {
        params: forceLogoutRequestParamsDTO,
        response: {
          200: forceLogoutResponseDTO,
        },
      },
      onRequest: [verifyToken, verifyAdmin],
    },
  })
  async forceLogout(request: ForceLogoutRequest): Promise<ForceLogoutResponse> {
    await this.service.forceLogout(request.params.userId);

    return {
      code: 200,
      data: {
        message: 'Force Logout Executed',
      },
    };
  }

  @PATCH({
    url: '/reset-password',
    options: {
      schema: {
        body: resetPasswordRequestBodyDTO,
        response: {
          200: resetPasswordResponseDTO,
        },
      },
      onRequest: [verifyToken],
    },
  })
  async resetPassword(
    req: FastifyRequest<{
      Body: ResetPasswordRequestBody;
    }>,
  ): Promise<ResetPasswordResponse> {
    await this.service.resetPassword(req.user, req.body);

    return {
      code: 200,
      data: {
        message: 'OK',
      },
    };
  }

  @POST({
    url: '/google/login',
    options: {
      schema: {
        response: {
          200: createAuthResponseDTO,
        },
      },
    },
  })
  async oauthGoogleCallback(request: CreateAuthLoginGoogleRequest) {
    const result = await this.service.googleAuth(request.body.credentials);

    return {
      code: 200,
      data: result,
    };
  }

  @POST({
    url: '/apple/login',
    options: {
      schema: {
        response: {
          200: createAuthResponseDTO,
        },
      },
    },
  })
  async oauthAppleCallback(request: CreateAuthLoginAppleRequest) {
    const result = await this.service.appleAuth(request.body.credentials);

    return {
      code: 200,
      data: result,
    };
  }
}
