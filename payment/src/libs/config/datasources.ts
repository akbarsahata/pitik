import { bool, cleanEnv, port, str } from 'envalid';

export const psqlEnv = cleanEnv(process.env, {
  PSQL_DB: str(),
  PSQL_HOST: str(),
  PSQL_PORT: port({ default: 5432 }),
  PSQL_USERNAME: str(),
  PSQL_PASSWORD: str(),
  PSQL_SCHEMA: str(),
  PSQL_LOG: bool({ default: false }),
  PSQL_USE_SSL: bool({ default: false }),
});
