import { requestContext } from '@fastify/request-context';
import * as Sentry from '@sentry/node';
import { hoursToSeconds, minutesToSeconds, secondsToHours, secondsToMinutes } from 'date-fns';
import { FastifyInstance } from 'fastify';
import { getInstanceByToken } from 'fastify-decorators';
import pkg from '../../../package.json';
import { env } from '../../config/env';
import { Logger } from '../../libs/utils/logger';

const logger = getInstanceByToken<Logger>(Logger);

export const registerOtherHandlers = async (server: FastifyInstance) => {
  server.setErrorHandler((error, _, reply) => {
    if (!env.isDev) {
      Sentry.captureException(error);
    }

    if (env.DEBUG_MODE) {
      Reflect.set(error, 'request_id', requestContext.get('requestId')!);

      logger.error(error);
    }

    let code = error.statusCode || 500;

    if (error.validation) {
      code = 400;
    }

    reply.status(code);
    reply.send({
      code,
      error: {
        name: error.code,
        message: error.message,
        ...(error.stack && env.isDev && { stack: error.stack }),
      },
    });
  });

  server.setNotFoundHandler((request, reply) => {
    reply.status(404);
    reply.send({
      code: 404,
      error: {
        message: `Route ${request.method}:${request.url} not found`,
      },
    });
  });

  server.all('/', async (_, reply) => {
    let seconds = process.uptime();
    const hours = secondsToHours(seconds);
    const minutes = secondsToMinutes(seconds - hoursToSeconds(hours));
    seconds = seconds - hoursToSeconds(hours) - minutesToSeconds(minutes);

    const uptime = `${hours} hours ${minutes} minutes ${seconds.toFixed(0)} seconds`;

    reply.header('content-type', 'application/json');
    reply.status(200);

    reply.send({
      code: 200,
      data: {
        name: pkg.name,
        version: `v${pkg.version}`,
        pid: process.pid,
        uptime,
        memoryUsage: process.memoryUsage(),
        cpuUsage: process.cpuUsage(),
      },
    });
  });
};
