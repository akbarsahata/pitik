import 'dotenv/config';
import { Destructor, Initializer, Inject, Service } from 'fastify-decorators';
import { DataSource } from 'typeorm';

import { readFileSync } from 'fs';
import { minutesToMilliseconds } from 'date-fns';
import { env } from '../../config/env';
import { psqlEnv } from '../../libs/config/datasources';
import { DBLogger, Logger } from '../../libs/utils/logger';
import { VirtualAccount } from '../entity/postgresql/virtualAccount.entity';
import { VirtualAccountPayment } from '../entity/postgresql/virtualAccountPayment.entity';
import { XenditLog } from '../entity/postgresql/xenditLog';

@Service()
export class PostgreSQLConnection {
  connection!: DataSource;

  @Inject(Logger)
  private logger!: Logger;

  @Inject(DBLogger)
  private dbLogger!: DBLogger;

  constructor() {
    const migrationDir = __dirname.replace('connection', 'migration/postgresql');
    this.connection = new DataSource({
      type: 'postgres',
      database: psqlEnv.PSQL_DB,
      host: psqlEnv.PSQL_HOST,
      port: psqlEnv.PSQL_PORT,
      schema: psqlEnv.PSQL_SCHEMA,
      username: psqlEnv.PSQL_USERNAME,
      password: psqlEnv.PSQL_PASSWORD,
      maxQueryExecutionTime: minutesToMilliseconds(10),
      synchronize: env.NODE_ENV === 'test',
      migrationsRun: env.NODE_ENV === 'test',
      cache: {
        type: 'ioredis',
        options: {
          host: env.REDIS_HOST,
          port: env.REDIS_PORT,
        },
        ignoreErrors: true,
      },
      ...(psqlEnv.PSQL_USE_SSL && { ssl: PostgreSQLConnection.getSslOptions(env.NODE_ENV) }),
      extra: {
        max: 10,
      },
      entities: [VirtualAccount, VirtualAccountPayment, XenditLog],
      migrations: [`${migrationDir}/**/*.ts`],
      logging: env.DEBUG_MODE,
      logger: this.dbLogger,
    });
  }

  @Initializer()
  async init() {
    try {
      await this.connection.initialize();

      this.logger.info({ message: '[CONNECTION] Connected to PostgreSQL' });
    } catch (error) {
      this.logger.info({
        message: '[CONNECTION] Error connecting to PostgreSQL',
      });
      this.logger.error(error);
    }
  }

  @Destructor()
  async destroy() {
    await this.connection.destroy();
  }

  private static getSslOptions(nodeEnv: string) {
    if (nodeEnv === 'production') {
      return {
        rejectUnauthorized: false,
        ca: readFileSync('./config/ca-production.pem').toString(),
        key: readFileSync('./config/key-production.pem').toString(),
        cert: readFileSync('./config/cert-production.pem').toString(),
      };
    }

    return {
      rejectUnauthorized: false,
      ca: readFileSync('./config/ca.pem').toString(),
      key: readFileSync('./config/key.pem').toString(),
      cert: readFileSync('./config/cert.pem').toString(),
    };
  }
}

export default new PostgreSQLConnection().connection;
