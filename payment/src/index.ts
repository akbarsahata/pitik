/* eslint-disable no-console */
import 'reflect-metadata';

import figlet from 'figlet';
import pkg from '../package.json';
import server from './api/server';
import { env } from './config/env';

const start = async () => {
  try {
    await server.listen({ port: env.APP_PORT, host: env.APP_HOST });

    if (env.isDev) {
      figlet(env.APP_NAME, (err, text) => {
        if (err) {
          throw err;
        }

        console.log(text);
        console.log(`v${pkg.version}`);
        console.log(`Server is running at http://${env.APP_HOST}:${env.APP_PORT}`);
      });
    }
  } catch (error) {
    console.error(error);
  }
};

start();
