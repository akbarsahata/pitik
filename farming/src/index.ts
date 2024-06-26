import 'reflect-metadata';

import figlet from 'figlet';

import closeWithGrace from 'close-with-grace';
import { getInstanceByToken } from 'fastify-decorators';
import pkg from '../package.json';
import { initServer } from './api/server';
import env from './config/env';
import { sleep } from './libs/utils/helpers';
import { Logger } from './libs/utils/logger';
import { WorkerUtil } from './libs/utils/workers';

const logger = getInstanceByToken<Logger>(Logger);
const workersUtil = getInstanceByToken<WorkerUtil>(WorkerUtil);

const start = async () => {
  try {
    const server = await initServer();

    server.swagger();

    await server.listen({
      port: env.APP_PORT,
      host: env.APP_HOST,
    });

    // Sleep for 3 seconds to allow all dependencies to start
    if (!env.isTest && !env.isDev) await sleep(3000);

    await server.ready();

    closeWithGrace(async () => {
      logger.info('workers are closing');
      await workersUtil.closeAllWorkers();
      logger.info('workers are closed');

      logger.info('server is closing');
      await server.close();
      logger.info('server is closed');
    });
  } catch (error) {
    logger.error(error);

    throw error;
  }
};

start()
  .then(() => {
    if (env.isDev) {
      figlet(env.APP_NAME, (err, text) => {
        if (err) {
          throw err;
        }

        logger.info(text);
        logger.info(`v${pkg.version}`);
        logger.info(`Server is running at http://${env.APP_HOST}:${env.APP_PORT}`);
        logger.info(
          `Swagger can be viewed at http://localhost:${env.APP_PORT}/farming-documentation`,
        );
      });
    }

    process.send?.('ready');
  })
  .catch(() => {
    process.exit(1);
  });
