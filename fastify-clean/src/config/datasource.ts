/**
 * CONFIG RELATED TO DATABASE
 */

import { bool, cleanEnv, num, port, str } from 'envalid';

export const psqlEnv = cleanEnv(process.env, {
  PSQL_DB: str(),
  PSQL_HOST: str(),
  PSQL_PORT: port({ default: 5432 }),
  PSQL_USERNAME: str(),
  PSQL_PASSWORD: str(),
  PSQL_SCHEMA: str(),
  PSQL_LOG: bool({ default: false }),
});

export const esEnv = cleanEnv(process.env, {
  ES_NODE: str(),
  ES_USERNAME: str(),
  ES_PASSWORD: str(),
  ES_IDX_IOT: str(),
  ES_IDX_IOT_CONVENTRON: str({ default: 'iot-conventron' }),
  ES_IDX_PRODUCT: str(),
  ES_PRODUCT_MIN_SCORE: num({ default: 0.79 }),
});

export const redisEnv = cleanEnv(process.env, {
  REDIS_DB: num({ default: 0 }),
  REDIS_HOST: str(),
  REDIS_PORT: port({ default: 6379 }),
  REDIS_USERNAME: str(),
  REDIS_PASSWORD: str(),
});

export const mqttEnv = cleanEnv(process.env, {
  MQTT_HOST: str(),
  MQTT_PORT: port({ default: 1883 }),
  MQTT_USERNAME: str(),
  MQTT_PASSWORD: str(),
});

export const statsdEnv = cleanEnv(process.env, {
  STATSD_HOST: str(),
  STATSD_PORT: port({ default: 8125 }),
});
