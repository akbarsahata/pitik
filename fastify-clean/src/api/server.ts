import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import Fastify, { FastifyInstance } from 'fastify';

import { registerControllers } from './controller';
import { registerHooks } from './loaders/hooks';
import { registerOtherHandlers } from './loaders/otherHandlers';
import { registerPlugins } from './loaders/plugins';

export async function initServer(): Promise<FastifyInstance> {
  const server: FastifyInstance = Fastify({
    logger: false,
    pluginTimeout: 60000,
  }).withTypeProvider<TypeBoxTypeProvider>();

  await registerPlugins(server);

  await registerHooks(server);

  await registerControllers(server);

  await registerOtherHandlers(server);

  return server;
}
