import { preValidationAsyncHookHandler } from 'fastify';
import { JwtPayload, verify } from 'jsonwebtoken';
import { authEnv } from '../../../config/env';
import { ERR_AUTH_UNAUTHORIZED } from '../../../libs/constants/errors';

interface PitikJwtPayload extends JwtPayload {
  ['id']: string;
  ['role']: string;
}

interface PitikAuthVerifyBody {
  ['accessToken']: string;
  ['X-ID']: string;
}

export const verifyAccessToken: preValidationAsyncHookHandler = async (request) => {
  try {
    const requestBody = request.body as PitikAuthVerifyBody;

    const requestHeaders = request.headers;

    if (
      !requestHeaders.authorization &&
      !requestHeaders['x-id'] &&
      !requestBody.accessToken &&
      !requestBody['X-ID']
    ) {
      throw Error('Access token is required');
    }

    let token: string = '';
    let xId: string = '';
    if (requestHeaders.authorization) {
      token = requestHeaders.authorization;
      xId = requestHeaders['x-id'] as string;
    } else {
      token = requestBody.accessToken;
      xId = requestBody['X-ID'];
    }

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
  } catch (error) {
    throw ERR_AUTH_UNAUTHORIZED(error.message);
  }
};
