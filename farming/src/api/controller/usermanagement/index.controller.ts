import { ApiController } from './api.controller';
import { AppController } from './app.controller';
import { AuthController } from './auth.controller';
import { CustomController } from './custom.controller';
import { PresetAccessController } from './presetAccess.controller';
import { PrivilegeController } from './privilege.controller';
import { RoleController } from './role.controller';
import { RoleAclController } from './roleAcl.controller';
import { RoleRankController } from './roleRank.controller';
import { UserCoreController } from './userCore.controller';

export const UserManagementController = [
  ApiController,
  AppController,
  AuthController,
  CustomController,
  PresetAccessController,
  PrivilegeController,
  RoleController,
  RoleAclController,
  RoleRankController,
  UserCoreController,
];
