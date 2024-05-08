import { TaskCancelledError } from 'cockatiel';
import { FastifyRequest, onRequestAsyncHookHandler } from 'fastify';
import { JwtPayload, verify } from 'jsonwebtoken';
import fetch from 'node-fetch';
import env, { authEnv } from '../../../config/env';
import { CreateAuthVerifyRequestBody } from '../../../dto/usermanagement/auth.dto';
import {
  ERR_AUTH_FORBIDDEN,
  ERR_AUTH_UNAUTHORIZED,
  ERR_INTERNAL_SERVER,
} from '../../../libs/constants/errors';
import { createCircuitBreaker } from '../../../libs/utils/circuitBreaker';
import { authServiceInstance } from '../../../services/usermanagement/auth.service';

interface PitikJwtPayload extends JwtPayload {
  ['id']: string;
  ['role']: string;
}

function getEndpoint(request: FastifyRequest): string {
  const proxyUrl =
    (request.headers['X-PROXY-URL'] as string) || (request.headers['x-proxy-url'] as string);

  const version = proxyUrl ? proxyUrl.split('/')[1] : env.API_VERSION;

  return `/${version}${request.routerPath}`;
}

function buildFetchOption(request: FastifyRequest) {
  const accessToken = request.headers.Authorization || request.headers.authorization;
  const xId = request.headers['X-ID'] || request.headers['x-id'];
  const xAppId = request.headers['X-APP-ID'] || request.headers['x-app-id'];
  const endpoint = getEndpoint(request);
  const method = request.method.toUpperCase();

  return {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      'X-ID': xId,
      'X-APP-ID': xAppId,
      endpoint,
      method,
      accessToken,
    }),
  };
}

export const verifyAccess: onRequestAsyncHookHandler = async (request) => {
  if (env.isTest) {
    request.user = {
      id: 'pitik-test-1',
      userManagementId: 'user-mgmt-test-1',
      role: 'developer',
      roles: [],
      roleRank: {
        internal: 0,
        ownerApp: 0,
        downstream: 0,
      },
    };

    return;
  }

  let circuitBreaker: ReturnType<typeof createCircuitBreaker> | null = null;

  try {
    if (
      (!request.headers.authorization && !request.headers.Authorization) ||
      (!request.headers['x-id'] && !request.headers['X-ID'])
    ) {
      throw ERR_AUTH_UNAUTHORIZED('token is required');
    }

    let result: any;
    if (env.USE_INTERNAL_ACCESS_VERIFICATION) {
      const token: string = request.headers.authorization as string;
      const xId: string = request.headers['x-id'] as string;

      let authKey: string = '';
      if (/^Bearer/gi.test(token)) {
        authKey = token.replace(/^Bearer /gi, '');
      } else {
        authKey = token;
      }

      const payload = (await verify(authKey, authEnv.JWT_SECRET, {
        audience: authEnv.AUDIENCE,
        issuer: authEnv.ISSUER,
        algorithms: ['HS256'],
      })) as PitikJwtPayload;

      if (payload.id !== xId && payload.sub !== xId) {
        throw Error('Invalid access token');
      }

      const userId = payload.sub ? payload.sub : payload.id;
      request.user = {
        id: userId,
        role: payload.roleId,
        roles: [],
        userManagementId: '',
      };

      const accessPayload: CreateAuthVerifyRequestBody = {
        'X-ID': (request.headers['X-ID'] || request.headers['x-id']) as string,
        'X-APP-ID': (request.headers['X-APP-ID'] || request.headers['x-app-id']) as string,
        endpoint: getEndpoint(request),
        method: request.method.toUpperCase() as 'POST' | 'GET' | 'PATCH' | 'PUT' | 'DELETE',
        accessToken: (request.headers.Authorization || request.headers.authorization) as string,
      };

      result = await authServiceInstance.verify(request.user, accessPayload);

      if (!result) throw ERR_INTERNAL_SERVER(`${result.code} - ${result.message}`);

      request.user = {
        id: result.additional.id_cms,
        userManagementId: result.id,
        role: result.additional.role,
        roles: result.roles,
        roleRank: result.additional.roleRank,
        organizationId: result.organizationId,
      };

      request.appId = (request.headers['x-app-id'] || request.headers['X-APP-ID'] || '') as string;
    } else {
      circuitBreaker = createCircuitBreaker();

      const response = await circuitBreaker.execute(() =>
        fetch(`${env.HOST_AUTH_V2}/verify`, buildFetchOption(request)),
      );

      const responseText = await response.text();

      result = JSON.parse(responseText);

      if (!result && !result.data && !result.error) {
        throw new Error('unexpected response');
      }

      if (result.error) {
        switch (result.code) {
          case 401:
            throw ERR_AUTH_UNAUTHORIZED(`${result.error.message}`);
          case 403:
            throw ERR_AUTH_FORBIDDEN(`${result.error.message}`);
          default:
            throw ERR_INTERNAL_SERVER(`${result.code} - ${result.message}`);
        }
      }

      if (!result.data.status) {
        throw ERR_AUTH_FORBIDDEN('inactive user');
      }

      request.user = {
        id: result.data.additional.id_cms,
        userManagementId: result.data.id,
        role: result.data.additional.role,
        roles: result.data.roles,
        roleRank: result.data.additional.roleRank,
        organizationId: result.data.organizationId,
      };

      request.appId = (request.headers['x-app-id'] || request.headers['X-APP-ID'] || '') as string;
    }
  } catch (error) {
    if (error instanceof TaskCancelledError) {
      throw ERR_INTERNAL_SERVER(`: fetch ${env.HOST_AUTH_V2}/verify timed out`);
    }

    throw error;
  } finally {
    if (!env.USE_INTERNAL_ACCESS_VERIFICATION) {
      circuitBreaker = null;
    }
  }
};
