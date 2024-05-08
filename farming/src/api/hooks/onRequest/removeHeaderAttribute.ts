import { onRequestAsyncHookHandler } from 'fastify';

export const removeHeaderAttributes =
  (...headerAttributes: string[]): onRequestAsyncHookHandler =>
  async (request) => {
    headerAttributes.forEach((headerAttribute) => {
      if (request.headers[headerAttribute]) delete request.headers[headerAttribute];
    });
  };
