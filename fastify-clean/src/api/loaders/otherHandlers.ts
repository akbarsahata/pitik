import { requestContext } from '@fastify/request-context';
import * as Sentry from '@sentry/node';
import { FastifyInstance } from 'fastify';
import { getInstanceByToken } from 'fastify-decorators';
import pkg from '../../../package.json';
import { env } from '../../config/env';
import { secondsToDurationText } from '../../libs/utils/helpers';
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
    const uptime = secondsToDurationText(process.uptime());

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

  //* TODO: remove this after v1 apps has been fully unused!
  server.all('/v1', async (_, reply) => {
    reply.header('content-type', 'application/json');
    reply.status(410);

    reply.send({
      code: 410,
      error: {
        message:
          'Versi aplikasi yang Anda gunakan saat ini tidak bisa digunakan lagi. Silahkan melakukan pembaruan melalui Playstore.',
      },
    });
  });
};
