import { onRequestAsyncHookHandler } from 'fastify';
import { verify, JwtPayload } from 'jsonwebtoken';
import env from '../../../config/env';
import { ERR_AUTH_UNAUTHORIZED } from '../../../libs/constants/errors';

interface PitikJwtPayload extends JwtPayload {
  ['id']: string;
  ['role']: string;
}

export const verifyToken: onRequestAsyncHookHandler = async (request) => {
  try {
    if (!request.headers.authorization || !request.headers['x-id']) {
      throw Error('token is required');
    }

    const { authorization } = request.headers;

    let authHeaders = '';
    if (/^Bearer/gi.test(authorization)) {
      authHeaders = authorization.replace(/^Bearer /gi, '');
    } else {
      authHeaders = authorization;
    }

    const payload = verify(authHeaders, env.JWT_SECRET, {
      algorithms: ['HS256'],
    }) as PitikJwtPayload;

    if (payload.id !== request.headers['x-id']) {
      throw Error('invalid token');
    }

    request.user = {
      id: payload.id,
      role: payload.role,
    };
  } catch (error) {
    throw ERR_AUTH_UNAUTHORIZED(error.message);
  }
};
