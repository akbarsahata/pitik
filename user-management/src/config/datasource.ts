/**
 * CONFIG RELATED TO DATABASE
 */

import { cleanEnv, str, port, bool, num } from 'envalid';

export const psqlEnv = cleanEnv(process.env, {
  PSQL_DB: str(),
  PSQL_HOST: str(),
  PSQL_CMS_HOST: str(),
  PSQL_PORT: port({ default: 5432 }),
  PSQL_USERNAME: str(),
  PSQL_PASSWORD: str(),
  PSQL_CMS_PASSWORD: str(),
  PSQL_SCHEMA: str(),
  PSQL_LOG: bool({ default: false }),
  PSQL_LISTENER: bool({ default: false }),
  PSQL_USE_SSL: bool({ default: false }),
});

export const redisEnv = cleanEnv(process.env, {
  REDIS_DB: num({ default: 0 }),
  REDIS_HOST: str(),
  REDIS_PORT: port({ default: 6379 }),
  REDIS_USERNAME: str(),
  REDIS_PASSWORD: str(),
  REDIS_CONNECTION_TIMEOUT: num({ default: 10000 }),
});

export const esEnv = cleanEnv(process.env, {
  ES_NODE: str({ default: 'http://127.0.0.1:9200' }),
  ES_USERNAME: str({ default: '' }),
  ES_PASSWORD: str({ default: '' }),
  ES_IDX_AUDIT: str({ default: 'audit' }),
});
