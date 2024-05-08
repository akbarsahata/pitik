import { onRequestAsyncHookHandler } from 'fastify';
import { env } from '../../../config/env';
import { ERR_AUTH_UNAUTHORIZED } from '../../../libs/constants/errors';

export const verifyAdmin: onRequestAsyncHookHandler = async (request) => {
  const allowedRoles = env.ALLOWED_ROLE_IDS.split(',');

  if (!allowedRoles.includes(request.user.role)) {
    throw ERR_AUTH_UNAUTHORIZED(`insufficient role (${request.user.role})`);
  }
};
