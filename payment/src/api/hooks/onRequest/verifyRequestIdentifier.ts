import { onRequestAsyncHookHandler } from 'fastify';
import { getInstanceByToken } from 'fastify-decorators';
import { env } from '../../../config/env';
import { ERR_AUTH_UNAUTHORIZED } from '../../../libs/constants/errors';
import { rateLimiter } from '../../../libs/utils/helpers';
import { Logger } from '../../../libs/utils/logger';

const logger = getInstanceByToken<Logger>(Logger);

export const verifyRequestIdentifier: onRequestAsyncHookHandler = async (request) => {
  if (!env.isTest) {
    try {
      if (!request.headers['x-request-identifier']) {
        throw Error('request identifier is required');
      }

      const { 'x-request-identifier': identifier } = request.headers;

      await rateLimiter(`request-identifier:${identifier as string}`, 15);
    } catch (error) {
      logger.error(error, 'verifyRequestIdentifier');
      throw ERR_AUTH_UNAUTHORIZED(error.message);
    }
  }
};
