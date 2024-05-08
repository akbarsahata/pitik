import { TaskCancelledError } from 'cockatiel';
import { FastifyRequest, onRequestAsyncHookHandler } from 'fastify';
import fetch from 'node-fetch';
import env from '../../../config/env';
import {
  ERR_AUTH_FORBIDDEN,
  ERR_AUTH_UNAUTHORIZED,
  ERR_INTERNAL_SERVER,
} from '../../../libs/constants/errors';
import { createCircuitBreaker } from '../../../libs/utils/circuitBreaker';

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
      role: 'developer',
      roleRank: {
        internal: 'super mega ultra higher level',
      },
    };

    return;
  }

  try {
    if (
      (!request.headers.authorization && !request.headers.Authorization) ||
      (!request.headers['x-id'] && !request.headers['X-ID'])
    ) {
      throw ERR_AUTH_UNAUTHORIZED('token is required');
    }

    const circuitBreaker = createCircuitBreaker();

    const result = await circuitBreaker.execute(() =>
      fetch(`${env.HOST_AUTH_V2}/verify`, buildFetchOption(request)),
    );

    const response = await result.json();

    if (response.error) {
      switch (response.code) {
        case 401:
          throw ERR_AUTH_UNAUTHORIZED();
        case 403:
          throw ERR_AUTH_FORBIDDEN();
        default:
          throw ERR_INTERNAL_SERVER();
      }
    }

    const user = response.data;

    if (!user.status) {
      throw ERR_AUTH_FORBIDDEN('inactive user');
    }

    request.user = {
      id: user.additional.id_cms,
      role: user.additional.role,
      roleRank: user.additional.roleRank,
    };
  } catch (error) {
    if (error instanceof TaskCancelledError) {
      throw ERR_INTERNAL_SERVER(`: fetch ${env.HOST_AUTH_V2}/verify timed out`);
    }

    throw error;
  }
};
