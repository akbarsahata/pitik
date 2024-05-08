import { Column, Entity, JoinColumn, OneToMany } from 'typeorm';
import { Base } from './Base.entity';
import { RoleAcl } from './RoleAcl.entity';
import { RoleModule } from './RoleModule.entity';
import { RoleRank } from './RoleRank.entity';
import { UserRole } from './UserRole.entity';

@Entity({
  name: 'role',
  schema: 'usermanagement',
})
export class Role extends Base {
  @Column({ name: 'name', type: 'varchar', length: 50 })
  name: string;

  @OneToMany(() => RoleAcl, (roleAcl) => roleAcl.role)
  @JoinColumn({ referencedColumnName: 'id' })
  roleAcl: RoleAcl[];

  @OneToMany(() => RoleRank, (roleRank) => roleRank.role)
  @JoinColumn({ referencedColumnName: 'id' })
  roleRank: RoleRank[];

  @OneToMany(() => UserRole, (ur) => ur.role)
  @JoinColumn({ referencedColumnName: 'role_id' })
  userRoles: UserRole[];

  @OneToMany(() => RoleModule, (ur) => ur.role)
  @JoinColumn({ referencedColumnName: 'role_id' })
  roleModules: RoleModule[];
}
