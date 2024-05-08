import { onRequestAsyncHookHandler } from 'fastify';
import { getInstanceByToken } from 'fastify-decorators';
import { env } from '../../../config/env';
import { SecretManagerConnection } from '../../../datasources/connection/secretmanager.connection';
import { ERR_AUTH_UNAUTHORIZED } from '../../../libs/constants/errors';
import { rateLimiter } from '../../../libs/utils/helpers';
import { Logger } from '../../../libs/utils/logger';

const logger = getInstanceByToken<Logger>(Logger);

const secretManager = getInstanceByToken<SecretManagerConnection>(SecretManagerConnection);

export const verifyXenditCallback: onRequestAsyncHookHandler = async (request) => {
  if (!env.isTest) {
    try {
      if (!request.headers['x-callback-token']) {
        throw Error('token is required');
      }

      const { 'x-callback-token': callbackToken } = request.headers;

      // get from secret manager
      if (callbackToken !== secretManager.xendit.callbackToken) {
        throw new Error('invalid token');
      }

      const webhookId = request.headers['webhook-id'] as string;
      await rateLimiter(`xendit:webhook:${webhookId}`, 15);
    } catch (error) {
      logger.error(error, 'verifyXenditCallback');
      throw ERR_AUTH_UNAUTHORIZED(error.message);
    }
  }
};
