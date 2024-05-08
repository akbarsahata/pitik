import { onRequestAsyncHookHandler } from 'fastify';
import { ERR_AUTH_FORBIDDEN } from '../../../libs/constants/errors';

export const verifyRoleOwner: onRequestAsyncHookHandler = async (request) => {
  if (request.user.role !== 'owner') {
    throw ERR_AUTH_FORBIDDEN(`insufficient role (${request.user.role})`);
  }
};
