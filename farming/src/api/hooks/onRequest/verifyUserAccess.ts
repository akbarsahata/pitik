import { onRequestAsyncHookHandler } from 'fastify';
import { ERR_AUTH_UNAUTHORIZED } from '../../../libs/constants/errors';

export const verifyUserAccess: onRequestAsyncHookHandler = async (request) => {
  try {
    if (
      (!request.headers.authorization && !request.headers.Authorization) ||
      (!request.headers['x-id'] && !request.headers['X-ID'])
    ) {
      throw ERR_AUTH_UNAUTHORIZED('token is required');
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
};
