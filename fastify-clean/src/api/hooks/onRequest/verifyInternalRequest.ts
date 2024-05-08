import { onRequestAsyncHookHandler } from 'fastify';
import { verify } from 'jsonwebtoken';
import env from '../../../config/env';
import { ERR_AUTH_UNAUTHORIZED } from '../../../libs/constants/errors';

export const verifyInternalRequest: onRequestAsyncHookHandler = async (request) => {
  try {
    const xPitikInternal = (request.headers['x-pitik-internal'] ||
      request.headers['X-PITIK-INTERNAL']) as string;
    if (!xPitikInternal) {
      throw new Error('internal request header is required');
    }

    const internalToken = xPitikInternal.replace(/^Bearer /gi, '');

    verify(internalToken, env.INTERNAL_JWT_SECRET, {
      algorithms: ['HS256'],
    });
  } catch (error) {
    throw ERR_AUTH_UNAUTHORIZED(error.message);
  }
};
