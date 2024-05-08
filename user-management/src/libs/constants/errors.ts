import createError from 'fastify-error';

const AUTH_FORBIDDEN = 'AUTH_FORBIDDEN';

const TOO_MANY_ATTEMPT = 'TOO_MANY_ATTEMPT';

const AUTH_UNAUTHORIZED = 'AUTH_UNAUTHORIZED';

const AUTH_REFRESH_TOKEN_EXPIRED = 'AUTH_REFRESH_TOKEN_EXPIRED';

const INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR';

const ENTITY_NOT_FOUND = 'ENTITY_NOT_FOUND';

const BAD_REQUEST = (desc?: string): string => {
  if (!desc) return 'BAD_REQUEST';

  const propperDesc = desc
    .split(' ')
    .map((w) => w.toUpperCase())
    .join('_');

  return `BAD_REQUEST_${propperDesc}`;
};

export const ERR_USER_NOT_FOUND = createError(ENTITY_NOT_FOUND, 'User not found', 404);

export const ERR_RECORD_NOT_FOUND = createError(ENTITY_NOT_FOUND, 'Record not found', 404);

export const ERR_AUTH_FORBIDDEN = createError(AUTH_FORBIDDEN, 'request forbidden', 403);

export const ERR_AUTH_APP_ACCESS_FORBIDDEN = createError(
  AUTH_FORBIDDEN,
  'User does not have access to the apps',
  403,
);

export const ERR_REFRESH_TOKEN_EXPIRED = createError(
  AUTH_REFRESH_TOKEN_EXPIRED,
  'refresh token expired',
  422,
);

export const ERR_AUTH_INVALID_TOKEN = createError(
  BAD_REQUEST(),
  'error user token does not belong to current user',
  400,
);

export const ERR_TOO_MANY_ATTEMPT = createError(
  TOO_MANY_ATTEMPT,
  'Anda telah mencoba masuk lebih dari 5 kali dengan kata sandi yang salah.',
  403,
);

export const ERR_AUTH_UNAUTHORIZED = createError(AUTH_UNAUTHORIZED, 'request unauthorized', 401);

export const ERR_INTERNAL_SERVER = createError(INTERNAL_SERVER_ERROR, 'internal server error', 500);

export const ERR_BAD_REQUEST = createError(BAD_REQUEST(), 'bad request', 400);

export const ERR_BAD_REQUEST_WRONG_PASSWORD = createError(
  BAD_REQUEST(),
  'bad request - invalid password',
  400,
);

export const ERR_METHOD_NOT_IMPLEMENTED = createError(
  INTERNAL_SERVER_ERROR,
  'Method is not implemented yet',
  500,
);

export const ERR_OLD_PASSWORD_NOT_MATCH = createError(
  'OLD_PASSWORD_NOT_MATCH',
  'old password is not match',
  400,
);

export const ERR_CONFIRMATION_PASSWORD_NOT_MATCH = createError(
  'CONFIRMATION_PASSWORD_NOT_MATCH',
  'confirmation password is not match',
  400,
);

export const ERR_INVALID_PASSWORD = createError(
  'ERR_INVALID_PASSWORD',
  'invalid password format',
  400,
);

export const ERR_SUPERVISOR_UPSERT_FAILED = createError(
  BAD_REQUEST('ERR_SUPERVISOR_UPSERT_FAILED'),
  'Something wrong, upsert supervisor is failed',
  400,
);

export const ERR_SELF_SUPERVISOR_EXCEPTION = createError(
  BAD_REQUEST('ERR_SELF_SUPERVISOR_EXCEPTION'),
  'Cannot set same user as supervisor',
  400,
);
