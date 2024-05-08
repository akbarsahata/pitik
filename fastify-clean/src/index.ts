/* eslint-disable no-console */
import 'reflect-metadata';

import * as Sentry from '@sentry/node';

import figlet from 'figlet';

import { getInstanceByToken } from 'fastify-decorators';
import pkg from '../package.json';
import { initServer } from './api/server';
import env from './config/env';
import { Logger } from './libs/utils/logger';

Sentry.init({
  dsn: env.SENTRY_DSN,
  environment: env.NODE_ENV,
  release: `${pkg.name}@${pkg.version}`,
});

const logger = getInstanceByToken<Logger>(Logger);

const start = async () => {
  try {
    const server = await initServer();

    await server.ready();

    server.swagger();

    await server.listen({
      port: env.APP_PORT,
      host: env.APP_HOST,
    });

    if (env.isDev) {
      figlet(env.APP_NAME, (err, text) => {
        if (err) {
          throw err;
        }

        console.log(text);
        console.log(`v${pkg.version}`);
        console.log(`Server is running at http://${env.APP_HOST}:${env.APP_PORT}`);
        console.log(
          `Swagger can be viewed at http://localhost:${env.APP_PORT}/farming-documentation`,
        );
      });
    }
  } catch (error) {
    logger.error(error);
  }
};

start();
