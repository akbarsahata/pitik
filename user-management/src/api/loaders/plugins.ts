import { fastifyRequestContext } from '@fastify/request-context';
import { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import multer from 'fastify-multer';

export const registerPlugins = async (server: FastifyInstance) => {
  await server.register(fastifyRequestContext, {
    defaultStoreValues: {
      requestId: '',
      userId: '',
      userToken: '',
      startTime: Date.now(),
    },
  });

  server.register(cors, { origin: '*' });
  server.register(helmet, { global: true });
  server.register(multer.contentParser);
};
