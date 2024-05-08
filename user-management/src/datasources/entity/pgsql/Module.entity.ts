/* eslint-disable no-unused-vars */
import { Column, Entity, JoinColumn, OneToMany, PrimaryColumn } from 'typeorm';
import { RoleModule } from './RoleModule.entity';

export enum PlatformName {
  downstreamApp = 'downstreamApp',
  fms = 'fms',
  pplApp = 'pplApp',
  ownerApp = 'ownerApp',
}

@Entity('module')
export class Module {
  @PrimaryColumn({ name: 'id', type: 'uuid' })
  id: string;

  @Column({ name: 'platform_name', type: 'varchar', length: 50 })
  platformName: PlatformName;

  @Column({ name: 'module_name', type: 'varchar', length: 50 })
  moduleName: string;

  @OneToMany(() => RoleModule, (ur) => ur.module)
  @JoinColumn({ referencedColumnName: 'module_id' })
  roleModules: RoleModule[];
}
