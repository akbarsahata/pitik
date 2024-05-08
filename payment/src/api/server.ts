/* eslint-disable no-console */
import Fastify, { FastifyInstance } from 'fastify';
import { bootstrap } from 'fastify-decorators';

import cors from '@fastify/cors';
import formbody from '@fastify/formbody';
import helmet from '@fastify/helmet';
import pkg from '../../package.json';

import { env } from '../config/env';
import { KafkaConsumer } from '../dao/kafka/consumer/kafka.consumer';
import { ExternalController } from './controller/external.controller';
import { HealthController } from './controller/health.controller';
import { PaymentController } from './controller/payment.controller';
import { SlackController } from './controller/slack.controller';
import { VirtualAccountController } from './controller/virtualAccount.controller';
import { JobsController } from '../jobs';

const server: FastifyInstance = Fastify({ logger: true, pluginTimeout: 60000 });

server.addHook('onError', (_, __, error, done) => {
  if (env.NODE_ENV !== 'test') {
    console.error(error);
  }

  done();
});
server.register(cors, { origin: '*' });
server.register(helmet, { global: true });
server.register(formbody);
server.register(bootstrap, {
  controllers: [
    ExternalController,
    HealthController,
    JobsController,
    KafkaConsumer,
    PaymentController,
    SlackController,
    VirtualAccountController,
  ],
});
server.setErrorHandler((error, _, reply) => {
  let code = error.statusCode || 500;

  if (error.validation) {
    code = 400;
  }

  reply.status(code);
  reply.send({
    code,
    error: {
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

server.all('/', async () => `${pkg.name} v${pkg.version}`);

export default server;
