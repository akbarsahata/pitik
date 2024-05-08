import { Api } from './Api.entity';
import { App } from './App.entity';
import { Module } from './Module.entity';
import { PresetAccess } from './PresetAccess.entity';
import { PresetAccessD } from './PresetAccessD.entity';
import { Privilege } from './Privilege.entity';
import { Role } from './Role.entity';
import { RoleAcl } from './RoleAcl.entity';
import { RoleModule } from './RoleModule.entity';
import { RoleRank } from './RoleRank.entity';
import { User as UserManagement } from './User.entity';
import { UserAcl } from './UserAcl.entity';
import { UserRole } from './UserRole.entity';
import { UserSupervisor } from './UserSupervisor.entity';

export const UserManagementEntities = [
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
  UserManagement,
  UserAcl,
  UserRole,
  UserSupervisor,
];
