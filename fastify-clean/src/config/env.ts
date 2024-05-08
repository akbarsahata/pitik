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
  SENTRY_DSN: str(),
  JWT_SECRET: str(),
  INTERNAL_JWT_SECRET: str(),
  GAMIFICATION_START_DATE: validDate(),
  AWS_ACCESS_KEY_ID: str(),
  AWS_BUCKET: str(),
  AWS_DEFAULT_REGION: str(),
  AWS_SECRET_ACCESS_KEY: str(),
  AWS_AI_BUCKET: str({ default: 'pitik-ai' }),
  AWS_AI_PUBLIC_BUCKET: str({ default: 'pitik-ai-public' }),
  AWS_URL: url(),
  AWS_AI_URL: url({ default: 'https://cloudfront-ai.pitik.id/' }),
  FIREBASE_URL: url(),
  FIREBASE_SERVER_KEY: str(),
  HOST_AUTH_V2: url(),
  HOST_API_V2: url(),
  HOST_ERP_V1: url(),
  HOST_CMS: url(),
  API_KEY_ERP: str(),
  USE_ERP: bool({ default: false }),
  USE_ERP_CONTRACT: bool({ default: false }),
  API_VERSION: str({ default: 'v2' }),
  DEFAULT_PASSWORD: str({ default: '12345' }),
  TOTP_KEY: str(),
  SMART_CAMERA_FOLDER: str({ default: 'staging' }),
  SMART_CAMERA_CROWD_PROBABILITY_THRESHOLD: num({ default: 0.8 }),
  ENABLE_MQTT_SUBSCRIBER: bool({ default: false }),
  IOT_DEVICE_ALERT_TIMEOUT: num({ default: 15 * 60 }), // in seconds
});

export default env;
