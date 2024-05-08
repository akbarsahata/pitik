/**
 * GENERAL CONFIG OR UNCATEGORIZED CONFIG
 */

import { zonedTimeToUtc } from 'date-fns-tz';
import { bool, cleanEnv, makeValidator, num, port, str, url } from 'envalid';

import pkg from '../../package.json';
import { DEFAULT_TIME_ZONE } from '../libs/constants';

const validDate = makeValidator((x) => {
  const date = new Date(x);

  return zonedTimeToUtc(date, DEFAULT_TIME_ZONE);
});

export const env = cleanEnv(process.env, {
  APP_NAME: str(),
  APP_VERSION: str({ default: pkg.version }),
  APP_PORT: port({ default: 8080 }),
  APP_HOST: str({ default: '0.0.0.0' }),
  NODE_ENV: str({ choices: ['development', 'test', 'production', 'staging'] }),
  DEBUG_MODE: bool({ default: false }),
  PAUSE_REPEATABLE_JOB: bool({ default: false }),
  JWT_SECRET: str(),
  INTERNAL_JWT_SECRET: str(),
  GAMIFICATION_START_DATE: validDate(),
  AWS_ACCESS_KEY_ID: str(),
  AWS_BUCKET: str(),
  AWS_DEFAULT_REGION: str(),
  AWS_SECRET_ACCESS_KEY: str(),
  AI_BUCKET: str({ default: 'gcs-ai-staging' }),
  AI_PUBLIC_BUCKET: str({ default: 'gcs-ai-notification-staging' }),
  AWS_URL: url(),
  AI_URL: url({ default: 'https://storage.googleapis.com/' }),
  HOST_AUTH_V2: url(),
  HOST_API_V2: url(),
  HOST_ERP_V1: url(),
  HOST_USER_MGMT: url(),
  API_KEY_ERP: str(),
  API_VERSION: str({ default: 'v2' }),
  DEFAULT_PASSWORD: str({ default: '12345' }),
  TOTP_KEY: str(),
  SMART_CAMERA_FOLDER: str({ default: 'staging' }),
  SMART_AUDIO_FOLDER: str({ default: 'staging' }),
  SMART_CAMERA_CROWD_PROBABILITY_THRESHOLD: num({ default: 0.8 }),
  SMART_RECORDER_FOLDER: str({ default: 'staging' }),
  ENABLE_MQTT_SUBSCRIBER: bool({ default: false }),
  IOT_DEVICE_ALERT_TIMEOUT: num({ default: 15 * 60 }), // in seconds
  GOOGLE_GEOCODING_API_KEY: str({ default: '' }),
  GCP_CLOUD_STORAGE_PROJECT_ID: str(),
  GCP_CLOUD_STORAGE_CREDS: str(),
  GCP_CLOUD_STORAGE_BUCKET: str({ default: 'gcs-farming-staging' }),
  GCP_CLOUD_URL: str({}),
  FCM_PPL_CREDS: str({}),
  FCM_INTERNAL_CREDS: str({}),
  ODOO_CUTOFF_DATE: str({ default: '2023-06-19 15:00:00.000' }),
  JOB_BACKOFF: str({ default: '2m' }),
  IOT_ALERTS_SLACK_ID: str({ default: '<!subteam^S03SZUPMRGQ>' }),
  IOT_ALERTS_SEARCH_TOKEN: str({ default: 'xoxp' }),

  // TODO: remove once statsd is ready to be integrated
  STATSD_IS_ACTIVE: bool({ default: false }),
  BULLMQ_FAILED_JOBS_WEBHOOK: url({
    default: 'https://hooks.slack.com/services/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',
  }),
  IOT_ALERTS_WEBHOOK: url({
    default: 'https://hooks.slack.com/services/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', // alert-iot-staging channel
  }),
  IOT_HOT_COLD_ALERTS_WEBHOOK: url({
    default: 'https://hooks.slack.com/services/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',
  }),
  HOST_QUEUE_MONITOR: url({ default: 'http://queue-monitor.staging.pitik.internal/ui/queue/' }),

  // Feature Flags
  B2B_DEVICE_INTEGRATION_IS_ACTIVE: bool({ default: false }),

  // TODO: (iot-ticketing): remove feature flags once the feature is stable
  FEATURE_FLAG_IOT_TICKETING_STAGE: bool({ default: false }),
  FEATURE_FLAG_IOT_TICKETING_STAGE_TELEGRAM_INTEGRATION: bool({ default: false }),

  // Farming >< Odoo Cron Related Flag
  HARVEST_REALIZATION_CRON_EXPRESSION: str({ default: '0 0 * * * *' }),
  HARVEST_REALIZATION_QUERY_TAKE_LIMIT: num({ default: 5 }),

  // Telegram Bot Configs
  TELEGRAM_API_URL: str({ default: 'https://api.telegram.org/bot' }),
  TELEGRAM_BOT_TOKEN_IOT_TICKETING_STAGE: str({
    default: '6306237378:AAERzKQVGu9_7dQ9UcHg0yIS2SlN2Ekm_fc',
  }),
  TELEGRAM_CHAT_ID_IOT_TICKETING_STAGE: str({ default: '-4007848179' }),

  // User Management Config
  ALLOWED_ROLE_IDS: str(),
  ALLOWED_ROLE_TYPE_FMS: str({
    default: 'superadmin,admin,superadminiot,adminiot,itsupport,iotoperations,sales admin,sales',
  }),
  USE_INTERNAL_ACCESS_VERIFICATION: bool({ default: false }),
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
