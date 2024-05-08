/**
 * GENERAL CONFIG OR UNCATEGORIZED CONFIG
 */

import { cleanEnv, str, port, bool } from 'envalid';

import pkg from '../../package.json';

export const env = cleanEnv(process.env, {
  APP_NAME: str(),
  APP_VERSION: str({ default: pkg.version }),
  APP_PORT: port({ default: 8080 }),
  APP_HOST: str({ default: '0.0.0.0' }),
  NODE_ENV: str({ choices: ['development', 'test', 'production', 'staging'] }),
  SENTRY_DSN: str(),
  DEBUG_MODE: bool({ default: false }),
  ALLOWED_ROLE_IDS: str(),
  ALLOWED_ROLE_TYPE_FMS: str({
    default: 'superadmin,admin,superadminiot,adminiot,itsupport,iotoperations,sales admin,sales',
  }),
  DEFAULT_PASSWORD: str({ default: '12345' }),
  ENABLE_AUDIT_TRAIL: bool({ default: false }),
});

export const authEnv = cleanEnv(process.env, {
  AUDIENCE: str(),
  ISSUER: str(),
  ALGORITHM: str({ default: 'HS256' }),
  EXPIRESIN: str({ default: '12h' }),
  JWT_SECRET: str(),
  REFRESH_TOKEN_SECRET: str(),
  REFRESH_TOKEN_EXPIRESIN: str({ default: '1d' }),
  RESTRICT_MULTIPLE_LOGIN: bool({ default: false }),
  USE_AUTH_REDIS_CHECK: bool({ default: false }),
  GOOGLE_USER_INFO_API: str(),
  USE_HEADER_CLIENT_CHECK: bool({ default: false }),
});

export default env;
