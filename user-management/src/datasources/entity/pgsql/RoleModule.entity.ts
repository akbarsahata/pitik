/* eslint-disable no-unused-vars */
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Role } from './Role.entity';
import { Module } from './Module.entity';

@Entity('rolemodule')
export class RoleModule {
  @PrimaryColumn({ name: 'role_id', type: 'uuid' })
  roleId: string;

  @PrimaryColumn({ name: 'module_id', type: 'uuid' })
  moduleId: string;

  @ManyToOne(() => Role, (u) => u.roleModules)
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @ManyToOne(() => Module, (u) => u.roleModules)
  @JoinColumn({ name: 'module_id' })
  module: Module;
}
