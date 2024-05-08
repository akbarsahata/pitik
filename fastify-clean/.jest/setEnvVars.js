const pkg = require('../package.json')

/**
 * take a look at your own .env and replace the variables!
 */

process.env.NODE_ENV = 'test';

process.env.PSQL_DB = 'test';
process.env.PSQL_HOST = 'test';
process.env.PSQL_USERNAME = 'test';
process.env.PSQL_PASSWORD = 'test';
process.env.PSQL_SCHEMA = 'test';

process.env.ES_NODE = 'test';
process.env.ES_USERNAME = 'test';
process.env.ES_PASSWORD = 'test';
process.env.ES_IDX_IOT = 'test';
process.env.ES_IDX_PRODUCT = 'test';
process.env.ES_PRODUCT_MIN_SCORE = 'test';

process.env.REDIS_HOST = 'test';
process.env.REDIS_USERNAME = 'test';
process.env.REDIS_PASSWORD = 'test';

process.env.MQTT_HOST = 'test';
process.env.MQTT_USERNAME = 'test';
process.env.MQTT_PASSWORD = 'test';

process.env.STATSD_HOST = 'test';

process.env.APP_NAME = 'test';
process.env.APP_PORT = 'test';
process.env.APP_VERSION = pkg.version
process.env.NODE_ENV = 'test';
process.env.SENTRY_DSN = 'test';
process.env.JWT_SECRET = 'test';
process.env.INTERNAL_JWT_SECRET = 'test';
process.env.GAMIFICATION_START_DATE = 'test';
process.env.AWS_DEFAULT_REGION = 'test';
process.env.AWS_ACCESS_KEY_ID = 'test';
process.env.AWS_BUCKET = 'test';
process.env.AWS_SECRET_ACCESS_KEY = 'test';
process.env.AWS_URL = 'test';
process.env.FIREBASE_URL = 'test';
process.env.FIREBASE_SERVER_KEY = 'test';
process.env.HOST_AUTH_V2 = 'test';
process.env.HOST_API_V2 = 'test';
process.env.HOST_ERP_V1 = 'test';
process.env.HOST_CMS = 'test';
process.env.API_KEY_ERP = 'test';
process.env.TOTP_KEY = 'test';

process.env.DEBUG_MODE='true'