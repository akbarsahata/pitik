import { FastifyInstance } from 'fastify';
import { bootstrap } from 'fastify-decorators';
import { ApiController } from './api.controller';
import { AppController } from './app.controller';
import { AuthController } from './auth.controller';
import { HealthController } from './health.controller';
import { PresetAccessController } from './presetAccess.controller';
import { PrivilegeController } from './privilege.controller';

// TODO: Please remove CustomController Once userManagementDAO in Farming is updated
import { CustomController } from './custom.controller';

import { JobsController } from '../../jobs';
import { RoleController } from './role.controller';
import { RoleAclController } from './roleAcl.controller';
import { RoleRankController } from './roleRank.controller';
import { UserController } from './user.controller';

export const registerControllers = async (server: FastifyInstance) => {
  server.register(bootstrap, {
    controllers: [
      ApiController,
      AppController,
      AuthController,
      // TODO: Please remove CustomController Once userManagementDAO in Farming is updated
      CustomController,
      HealthController,
      JobsController,
      PresetAccessController,
      PrivilegeController,
      RoleAclController,
      RoleController,
      RoleRankController,
      UserController,
    ],
  });
};
