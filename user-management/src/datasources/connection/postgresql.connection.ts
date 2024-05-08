/* eslint-disable no-console */
import { Destructor, Initializer, Service, Inject } from 'fastify-decorators';
import { DataSource } from 'typeorm';

import { readFileSync } from 'fs';
import { psqlEnv, redisEnv } from '../../config/datasource';
import { Api } from '../entity/pgsql/Api.entity';
import { App } from '../entity/pgsql/App.entity';
import { PresetAccess } from '../entity/pgsql/PresetAccess.entity';
import { PresetAccessD } from '../entity/pgsql/PresetAccessD.entity';
import { Privilege } from '../entity/pgsql/Privilege.entity';
import { Role } from '../entity/pgsql/Role.entity';
import { RoleAcl } from '../entity/pgsql/RoleAcl.entity';
import { RoleModule } from '../entity/pgsql/RoleModule.entity';
import { RoleRank } from '../entity/pgsql/RoleRank.entity';
import { User } from '../entity/pgsql/User.entity';
import { UserRole } from '../entity/pgsql/UserRole.entity';
import { UserSupervisor } from '../entity/pgsql/UserSupervisor.entity';
import { Module } from '../entity/pgsql/Module.entity';
import env from '../../config/env';
import { DBLogger, Logger } from '../../libs/utils/logger';

@Service()
export class PostgreSQLConnection {
  connection!: DataSource;

  @Inject(Logger)
  private logger!: Logger;

  @Inject(DBLogger)
  private dbLogger!: DBLogger;

  @Initializer()
  async init() {
    this.connection = new DataSource({
      type: 'postgres',
      database: psqlEnv.PSQL_DB,
      host: psqlEnv.PSQL_HOST,
      port: psqlEnv.PSQL_PORT,
      schema: psqlEnv.PSQL_SCHEMA,
      username: psqlEnv.PSQL_USERNAME,
      password: psqlEnv.PSQL_PASSWORD,
      synchronize: false,
      cache: {
        type: 'ioredis',
        options: {
          host: redisEnv.REDIS_HOST,
          port: redisEnv.REDIS_PORT,
        },
        ignoreErrors: true,
      },
      ...(psqlEnv.PSQL_USE_SSL && { ssl: PostgreSQLConnection.getSslOptions(env.NODE_ENV) }),
      extra: {
        max: 10,
      },
      entities: [
        Api,
        App,
        Module,
        PresetAccess,
        PresetAccessD,
        Privilege,
        Role,
        RoleAcl,
        RoleModule,
        RoleRank,
        User,
        UserRole,
        UserSupervisor,
      ],
      logging: psqlEnv.PSQL_LOG,
      logger: this.dbLogger,
    });

    await this.connection.initialize();

    this.logger.info({ message: '[CONNECTION] Connected to PostgreSQL' });
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
