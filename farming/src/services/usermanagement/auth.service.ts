import { compare } from 'bcryptjs';
import { hoursToMilliseconds } from 'date-fns';
import { Inject, Service } from 'fastify-decorators';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { JwksClient, SigningKey } from 'jwks-rsa';
import { In, MoreThan } from 'typeorm';
import env, { authEnv } from '../../config/env';
import { ApiDAO } from '../../dao/usermanagement/api.dao';
import { PrivilegeDAO } from '../../dao/usermanagement/privilege.dao';
import { RoleAclDAO } from '../../dao/usermanagement/roleAcl.dao';
import { UserCoreDAO as UserDAO } from '../../dao/usermanagement/userCore.dao';
import { RedisConnection } from '../../datasources/connection/redis.connection';
import { User } from '../../datasources/entity/pgsql/usermanagement/User.entity';
import {
  CreateAuthItemRequest,
  CreateAuthItemRequestHeaders,
  CreateAuthItemResponse,
  CreateAuthVerifyItemResponse,
  CreateAuthVerifyRequestBody,
  ResetPasswordRequestBody,
} from '../../dto/usermanagement/auth.dto';
import {
  AUTH_ATTEMPT_COUNTER_KEY,
  AUTH_ATTEMPT_LIMIT,
  CACHE_KEY_AUTH_VERIFY,
  DEFAULT_EXPIRATION_REFRESH_TOKEN,
  DEFAULT_EXPIRATION_TOKEN,
} from '../../libs/constants';
import { COMMON_PASSWORDS } from '../../libs/constants/commonPassword';
import {
  ERR_AUTH_APP_ACCESS_FORBIDDEN,
  ERR_AUTH_FORBIDDEN,
  ERR_AUTH_UNAUTHORIZED,
  ERR_BAD_REQUEST_WRONG_PASSWORD,
  ERR_CONFIRMATION_PASSWORD_NOT_MATCH,
  ERR_INVALID_PASSWORD,
  ERR_OLD_PASSWORD_NOT_MATCH,
  ERR_REFRESH_TOKEN_EXPIRED,
  ERR_TOO_MANY_ATTEMPT,
} from '../../libs/constants/errors';
import { passwordRegexp } from '../../libs/constants/regexp';
import { HTTP_METHOD_ENUM, LOGIN_ACTION } from '../../libs/enums/userManagement.enum';
import { RequestUser } from '../../libs/types/index.d';
import {
  generateHashedPassword,
  getHighestRoleRankPerContext,
  isEmail,
  removeTrailingSlash,
} from '../../libs/utils/userManagementHelper';

export interface AuthStrategy {
  key: string;
  value: string;
}

export interface AuthTokenPayload {
  id: string;
  roleId: string;
}

export interface AccessToken {
  id: string;
  token: string;
  refreshToken: string;
}

@Service()
export class AuthService {
  @Inject(UserDAO)
  private userDAO!: UserDAO;

  @Inject(ApiDAO)
  private apiDAO!: ApiDAO;

  @Inject(RoleAclDAO)
  private roleAclDAO!: RoleAclDAO;

  @Inject(PrivilegeDAO)
  private privilageDAO!: PrivilegeDAO;

  @Inject(RedisConnection)
  private redisConnection!: RedisConnection;

  async auth(
    input: CreateAuthItemRequest,
    inputHeaders: Partial<CreateAuthItemRequestHeaders> | undefined = undefined,
  ): Promise<CreateAuthItemResponse> {
    const authStrategy = this.getAuthStrategy(input);

    const user = await this.userDAO.getOneStrict({
      where: {
        [authStrategy.key]: authStrategy.value.toLowerCase(),
        status: true,
      },
      relations: {
        role: true,
      },
    });

    // TODO: make this dynamic based on user's app privilleges
    this.checkClientAppAuthorization(authStrategy.key, user, inputHeaders);

    await this.countAuthAttempt(user.id);

    const isPasswordMatch = await compare(input.password, user.password);
    if (!isPasswordMatch) {
      throw ERR_BAD_REQUEST_WRONG_PASSWORD();
    }

    const authTokenPayload: AuthTokenPayload = { id: user.id, roleId: user.roleId };

    this.resetAuthAttempt(user.id);
    this.userDAO.clearUserCache(user.id);

    return {
      id: user.id,
      token: await this.generateToken(authTokenPayload),
      refreshToken: await this.generateRefreshToken(authTokenPayload),
      acceptTnc: user.acceptTnc,
      action: this.determineLoginAction({
        password: input.password,
      }),
    };
  }

  async googleAuth(authToken: string): Promise<CreateAuthItemResponse> {
    const googleData = await fetch(authEnv.GOOGLE_USER_INFO_API, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    const resultGoogleData = await googleData.json();

    const user = await this.userDAO.getOneStrict({
      where: {
        email: resultGoogleData.email,
        status: true,
      },
      relations: {
        role: true,
      },
    });

    // TODO: make this dynamic based on user's app privilleges
    this.checkClientAppAuthorization('email', user);

    await this.countAuthAttempt(user.id);

    const authTokenPayload: AuthTokenPayload = { id: user.id, roleId: user.roleId };

    this.resetAuthAttempt(user.id);
    this.userDAO.clearUserCache(user.id);

    return {
      id: user.id,
      token: await this.generateToken(authTokenPayload),
      refreshToken: await this.generateRefreshToken(authTokenPayload),
      acceptTnc: user.acceptTnc,
      action: null,
    };
  }

  async appleAuth(authToken: string): Promise<CreateAuthItemResponse> {
    const decodedToken: any = jwt.decode(authToken, { complete: true });
    if (!decodedToken) {
      throw new Error('Invalid token');
    }

    const { kid } = decodedToken.header;

    const applePublicKey = await this.getApplePublicKey(kid);

    if (!applePublicKey) {
      throw new Error('Public key not found');
    }

    jwt.verify(authToken, applePublicKey, {
      algorithms: ['RS256'],
      issuer: 'https://appleid.apple.com',
    });

    const user = await this.userDAO.getOneStrict({
      where: {
        email: decodedToken.payload.email,
        status: true,
      },
      relations: {
        role: true,
      },
    });

    // TODO: make this dynamic based on user's app privilleges
    this.checkClientAppAuthorization('email', user);

    await this.countAuthAttempt(user.id);

    const authTokenPayload: AuthTokenPayload = { id: user.id, roleId: user.roleId };

    this.resetAuthAttempt(user.id);
    this.userDAO.clearUserCache(user.id);

    return {
      id: user.id,
      token: await this.generateToken(authTokenPayload),
      refreshToken: await this.generateRefreshToken(authTokenPayload),
      acceptTnc: user.acceptTnc,
      action: null,
    };
  }

  async verify(
    requester: RequestUser,
    input: CreateAuthVerifyRequestBody,
  ): Promise<CreateAuthVerifyItemResponse> {
    if (authEnv.USE_AUTH_REDIS_CHECK) {
      await this.checkAccessToken(requester, input.accessToken);
    }

    this.overridePutMethod(input);

    const [currentUser, api] = await Promise.all([
      this.userDAO.getOne({
        select: {
          id: true,
          roleId: true,
          role: {
            id: true,
            name: true,
            roleRank: {
              context: true,
              rank: true,
            },
          },
          additional: true,
          organizationId: true,
        },
        where: {
          id: requester.id,
          status: true,
        },
        relations: {
          role: {
            roleRank: true,
          },
          userRoles: {
            role: {
              roleRank: true,
            },
          },
        },
        cache: {
          id: `${CACHE_KEY_AUTH_VERIFY.USER}:${requester.id}`,
          milliseconds: hoursToMilliseconds(1),
        },
      }),
      this.apiDAO.getOne({
        where: {
          method: input.method,
          endpoint: removeTrailingSlash(input.endpoint),
        },
        cache: {
          id: `${CACHE_KEY_AUTH_VERIFY.API}:${input.method}:${input.endpoint}`,
          milliseconds: hoursToMilliseconds(2),
        },
      }),
    ]);

    if (!currentUser || !api) {
      throw ERR_AUTH_FORBIDDEN(': user / api not registered in the system');
    }

    const roles = [currentUser.role, ...currentUser.userRoles.map((ur) => ur.role)].filter(
      (val, idx, arr) => arr.findIndex((arrVal) => arrVal.id === val.id) === idx,
    );

    const roleIds = roles.map((r) => r.id);

    const roleAcl = await this.roleAclDAO.getOne({
      where: {
        apiId: api.id,
        roleId: In(roleIds),
      },
      cache: {
        id: `${CACHE_KEY_AUTH_VERIFY.ROLE_ACL}:${api.id}:${roleIds.join(',')}`,
        milliseconds: hoursToMilliseconds(1),
      },
    });

    if (!roleAcl) {
      const today = new Date().toISOString();

      const privilege = await this.privilageDAO.getOne({
        where: {
          userId: requester.id,
          apiId: api.id,
          expirationDate: MoreThan(today),
        },
        cache: {
          id: `${CACHE_KEY_AUTH_VERIFY.PRIVILEGE}:${api.id}:${requester.id}`,
          milliseconds: hoursToMilliseconds(24),
        },
      });

      if (!privilege) {
        throw ERR_AUTH_FORBIDDEN(': user does not have access or privilege');
      }
    }

    const highestRoleRankPerContext = getHighestRoleRankPerContext(
      currentUser.userRoles,
      currentUser.role?.roleRank,
    );

    return {
      id: requester.id,
      endpoint: api.endpoint,
      method: api.method,
      status: true,
      roles,
      additional: {
        id_cms: currentUser.additional.id_cms as string,
        role: currentUser.role.name,
        roleRank: highestRoleRankPerContext,
      },
      organizationId: currentUser.organizationId,
    };
  }

  async refreshToken(userId: string, refreshToken: string): Promise<AccessToken> {
    let redisKey: string;
    if (authEnv.RESTRICT_MULTIPLE_LOGIN) {
      redisKey = `user:refreshToken:${userId}`;
    } else {
      redisKey = `user:refreshToken:${userId}:${refreshToken}`;
    }

    const storedRefreshToken = await this.redisConnection.connection.get(redisKey);

    if (!refreshToken || storedRefreshToken !== refreshToken) {
      throw ERR_REFRESH_TOKEN_EXPIRED();
    }

    await this.redisConnection.connection.del(redisKey);

    const decodedToken = await this.decodeToken(refreshToken, authEnv.REFRESH_TOKEN_SECRET);

    const requester: AuthTokenPayload = { id: userId, roleId: decodedToken.roleId };

    const newAccessToken: string = await this.generateToken(requester);

    const newRefreshToken: string = await this.generateRefreshToken(requester);

    return {
      id: userId,
      token: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  // FIXME: for case allowed multiple login, please update remove refresh token
  async logout(userId: string, accessToken: string): Promise<void> {
    const token = accessToken.replace(/^Bearer /gi, '');

    let redisKey: string = '';

    let redisKeyRefreshToken: string = '';

    if (authEnv.RESTRICT_MULTIPLE_LOGIN) {
      redisKey = `user:token:${userId}`;
      redisKeyRefreshToken = `user:refreshToken:${userId}`;
    } else {
      redisKey = `user:token:${userId}:${token}`;
      redisKeyRefreshToken = `user:refreshToken:${userId}`;
    }

    await this.deleteRedisToken(redisKey, redisKeyRefreshToken);
  }

  async forceLogout(userId: string): Promise<void> {
    const redisToken: string[] = await this.redisConnection.connection.keys(
      `user:token:${userId}:*`,
    );
    const redisRefreshToken: string[] = await this.redisConnection.connection.keys(
      `user:refreshToken:${userId}:*`,
    );
    this.deleteRedisToken(...redisToken, ...redisRefreshToken);
  }

  async resetPassword(requestUser: RequestUser, input: ResetPasswordRequestBody) {
    if (input.newPassword !== input.confirmationPassword) {
      throw ERR_CONFIRMATION_PASSWORD_NOT_MATCH();
    }

    if (!passwordRegexp.test(input.newPassword)) {
      throw ERR_INVALID_PASSWORD();
    }

    const user = await this.userDAO.getOneStrict({
      where: {
        id: requestUser.id,
      },
    });

    const isPasswordMatch = await compare(input.oldPassword, user.password);
    if (!isPasswordMatch) {
      throw ERR_OLD_PASSWORD_NOT_MATCH();
    }

    const password = await generateHashedPassword(input.newPassword);
    await this.userDAO.updateOne(
      {
        id: user.id,
      },
      {
        password,
      },
      requestUser,
    );

    this.resetAuthAttempt(user.id);
  }

  private async checkAccessToken(user: RequestUser, accessToken: string): Promise<void> {
    const rawToken = accessToken.replace(/^Bearer /gi, '');

    let redisKey: string = '';
    if (authEnv.RESTRICT_MULTIPLE_LOGIN) {
      redisKey = `user:token:${user.id}`;
    } else {
      redisKey = `user:token:${user.id}:${rawToken}`;
    }

    const token = await this.redisConnection.connection.get(redisKey);

    if (!token || token !== rawToken) {
      throw ERR_AUTH_UNAUTHORIZED('User not authorized or token expired please relogin');
    }
  }

  // eslint-disable-next-line class-methods-use-this
  private async generateToken(user: AuthTokenPayload): Promise<string> {
    const privateKey = authEnv.JWT_SECRET;

    const payload = { id: user.id, roleId: user.roleId };

    const token = jwt.sign(payload, privateKey, {
      algorithm: 'HS256',
      audience: authEnv.AUDIENCE,
      issuer: authEnv.ISSUER,
      expiresIn: authEnv.EXPIRESIN,
    });

    let cacheKey: string = '';
    if (authEnv.RESTRICT_MULTIPLE_LOGIN) {
      cacheKey = `user:token:${user.id}`;
    } else {
      cacheKey = `user:token:${user.id}:${token}`;
    }

    this.setUserRedisAuth(cacheKey, token);

    return token;
  }

  // eslint-disable-next-line class-methods-use-this
  private async generateRefreshToken(user: AuthTokenPayload): Promise<string> {
    const privateKeyRefreshToken = authEnv.REFRESH_TOKEN_SECRET;

    const payload = { id: user.id, roleId: user.roleId };

    const refreshToken = jwt.sign(payload, privateKeyRefreshToken, {
      algorithm: 'HS256',
      audience: authEnv.AUDIENCE,
      issuer: authEnv.ISSUER,
      expiresIn: authEnv.REFRESH_TOKEN_EXPIRESIN,
    });

    let cacheKey: string = '';
    if (authEnv.RESTRICT_MULTIPLE_LOGIN) {
      cacheKey = `user:refreshToken:${user.id}`;
    } else {
      cacheKey = `user:refreshToken:${user.id}:${refreshToken}`;
    }

    this.setUserRedisAuth(cacheKey, refreshToken, DEFAULT_EXPIRATION_REFRESH_TOKEN);

    return refreshToken;
  }

  // eslint-disable-next-line class-methods-use-this
  private getAuthStrategy(input: CreateAuthItemRequest): AuthStrategy {
    const authStrategy: AuthStrategy = {
      key: 'phone',
      value: input.username,
    };

    if (isEmail(input.username)) {
      authStrategy.key = 'email';
    }

    return authStrategy;
  }

  // eslint-disable-next-line class-methods-use-this
  private checkClientAppAuthorization(
    authKeyType: string,
    user: User,
    inputHeaders: CreateAuthItemRequestHeaders | undefined = undefined,
  ): void {
    if (authEnv.USE_HEADER_CLIENT_CHECK) {
      const allowedRoleInFms = env.ALLOWED_ROLE_TYPE_FMS.split(',');

      if (authKeyType === 'email' && allowedRoleInFms.indexOf(user.role.name) === -1) {
        throw ERR_AUTH_APP_ACCESS_FORBIDDEN();
      }

      if (
        inputHeaders &&
        inputHeaders['X-APP-ID'] === 'fms' &&
        allowedRoleInFms.indexOf(user.role.name) === -1
      ) {
        throw ERR_AUTH_APP_ACCESS_FORBIDDEN();
      }
    }
  }

  // eslint-disable-next-line class-methods-use-this
  private async decodeToken(token: string, secretType: string): Promise<JwtPayload> {
    const decodedToken: JwtPayload = (await jwt.verify(token, secretType, {
      audience: authEnv.AUDIENCE,
      issuer: authEnv.ISSUER,
    })) as JwtPayload;

    return decodedToken;
  }

  private setUserRedisAuth(
    key: string,
    token: string,
    expires: number = DEFAULT_EXPIRATION_TOKEN,
  ): void {
    this.redisConnection.connection.set(key, token, 'EX', expires);
  }

  private async deleteRedisToken(...key: string[]) {
    await Promise.all(key.map((k) => this.redisConnection.connection.del(k)));
  }

  // eslint-disable-next-line class-methods-use-this
  private overridePutMethod(input: CreateAuthVerifyRequestBody): void {
    if (input.method === HTTP_METHOD_ENUM.PUT) {
      // eslint-disable-next-line no-param-reassign
      input.method = HTTP_METHOD_ENUM.PATCH;
    }
  }

  private async countAuthAttempt(userId: string): Promise<number> {
    const key = AUTH_ATTEMPT_COUNTER_KEY.replace('$', userId);
    const val = await this.redisConnection.connection.incr(key);
    const ttl = await this.redisConnection.connection.ttl(key);

    if (val > AUTH_ATTEMPT_LIMIT) {
      throw ERR_TOO_MANY_ATTEMPT(`Coba lagi dalam ${(ttl / 60).toFixed(0)} menit`);
    }

    // set TTL: 1 hour after last limit attempt
    this.redisConnection.connection.set(key, val, 'EX', 3600);
    return val;
  }

  private resetAuthAttempt(userId: string) {
    const key = AUTH_ATTEMPT_COUNTER_KEY.replace('$', userId);
    this.redisConnection.connection.del(key);
  }

  // eslint-disable-next-line class-methods-use-this
  private determineLoginAction(opts: { password: string }) {
    if (env.DEFAULT_PASSWORD === opts.password) {
      return LOGIN_ACTION.DEFAULT_PASSWORD;
    }
    if (COMMON_PASSWORDS.some((pw) => pw === opts.password)) {
      return LOGIN_ACTION.WEAK_PASSWORD;
    }

    return null;
  }

  // eslint-disable-next-line class-methods-use-this
  private async getApplePublicKey(kid: string) {
    const client = new JwksClient({
      cache: true,
      jwksUri: 'https://appleid.apple.com/auth/keys',
    });
    const key = await new Promise<SigningKey | undefined>((resolve, reject) => {
      client.getSigningKey(kid, (error, result) => {
        if (error) {
          return reject(error);
        }
        return resolve(result);
      });
    });
    return key?.getPublicKey();
  }
}

export const authServiceInstance = new AuthService();
