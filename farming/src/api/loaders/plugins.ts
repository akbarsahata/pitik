import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import { fastifyRequestContext } from '@fastify/request-context';
import fasitfySwagger from '@fastify/swagger';
import fastifySwaggerUI from '@fastify/swagger-ui';
import { FastifyInstance } from 'fastify';
import multer from 'fastify-multer';
import pkg from '../../../package.json';
import env from '../../config/env';

let HOST = 'localhost';
let SCHEMES = ['http'];

if (env.isDev) {
  HOST = 'localhost:3002';
  SCHEMES = ['http'];
} else if (env.isProd) {
  HOST = 'api.pitik.id/v2';
  SCHEMES = ['https'];
} else if (env.NODE_ENV === 'staging') {
  HOST = 'api-dev.pitik.id/v2';
  SCHEMES = ['https'];
}

export const registerPlugins = async (server: FastifyInstance) => {
  await server.register(fastifyRequestContext, {
    defaultStoreValues: {
      requestId: '',
      userId: '',
      userToken: '',
      startTime: Date.now(),
      responsePayload: {},
    },
  });

  await server.register(cors, { origin: '*' });
  await server.register(helmet, { global: true });
  await server.register(multer.contentParser);
  await server.register(fasitfySwagger, {
    swagger: {
      info: {
        title: 'Farming swagger',
        description: 'Farming REST API documentation',
        version: pkg.version,
      },
      host: HOST,
      schemes: SCHEMES,
      consumes: ['application/json'],
      produces: ['application/json'],
      securityDefinitions: {
        Authorization: {
          type: 'apiKey',
          name: 'Authorization',
          in: 'header',
        },
        'X-ID': {
          type: 'apiKey',
          name: 'X-ID',
          in: 'header',
        },
      },
      security: [
        {
          Authorization: [],
        },
        {
          'X-ID': [],
        },
      ],
    },
  });

  await server.register(fastifySwaggerUI, {
    routePrefix: '/farming-documentation',
    uiConfig: {
      docExpansion: 'none',
      deepLinking: true,
      persistAuthorization: true,
    },
    uiHooks: {
      onRequest: function onRequest(_, __, next) {
        next();
      },
      preHandler: function preHandler(_, __, next) {
        next();
      },
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    transformSpecification: (swaggerObject) => swaggerObject,
    transformSpecificationClone: true,
  });
};
