/* eslint-disable no-console */
import { bool, cleanEnv, num, port, str, url } from 'envalid';
import pkg from '../../package.json';

export const env = cleanEnv(process.env, {
  APP_NAME: str({ default: pkg.name }),
  APP_PORT: port({ default: 3003 }),
  APP_VERSION: str({ default: pkg.version }),
  APP_HOST: str({ default: '0.0.0.0' }),
  NODE_ENV: str({ choices: ['development', 'test', 'production', 'staging'] }),
  SENTRY_DSN: str(),
  JWT_SECRET: str(),
  DEBUG_MODE: bool({ default: false }),
  XENDIT_SECRET_KEY: str(),
  XENDIT_VA_LIFESPAN: num({ default: 0 }),
  REDIS_DB: num({ default: 0 }),
  REDIS_HOST: str(),
  REDIS_PORT: port({ default: 6379 }),
  REDIS_USERNAME: str(),
  REDIS_PASSWORD: str(),
  ES_NODE: str(),
  ES_USERNAME: str(),
  ES_PASSWORD: str(),
  HOST_ERP_V1: str(),
  API_KEY_ERP: str(),
  SLACK_WEBHOOK_FAILED_API: str({
    default: 'https://hooks.slack.com/services/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',
  }),
  SLACK_SIGNING_SECRET: str(),
  KAFKA_CLIENT_ID: str({ default: 'whale-service-1' }),
  KAFKA_BROKERS: str({
    default: 'localhost:9092,localhost:9093,localhost:9094',
  }),
  KAFKA_CONSUMER_GROUP: str({ default: 'whale-service' }),
  VA_BLACKLIST: str({ default: '' }),
  PAUSE_REPEATABLE_JOB: bool({ default: true }),
  HOST_QUEUE_MONITOR: url({ default: 'http://queue-monitor.staging.pitik.internal/ui/queue/' }),
  PSQL_USE_SSL: bool({ default: false }),
});

console.info('[SECRET] Secret validated successfully!');
