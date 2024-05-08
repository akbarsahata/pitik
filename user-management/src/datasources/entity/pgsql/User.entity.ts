import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { Base } from './Base.entity';
import { Privilege } from './Privilege.entity';
import { Role } from './Role.entity';
import { UserRole } from './UserRole.entity';
import { UserSupervisor } from './UserSupervisor.entity';

@Entity('user')
export class User extends Base {
  @Column({ name: 'full_name', type: 'varchar', length: 255 })
  fullName: string;

  @Column({ name: 'email', type: 'varchar', length: 255 })
  email: string;

  @Column({ name: 'phone', type: 'varchar', length: 255 })
  phone: string;

  @Column({ name: 'password', type: 'varchar', length: 255 })
  password: string;

  @Column({ name: 'status', type: 'boolean' })
  status: boolean;

  @Column({ name: 'lang', type: 'varchar', length: 5 })
  lang: string;

  @Column({ name: 'accept_tnc', type: 'smallint' })
  acceptTnc: number;

  @Column({ name: 'parent_id', type: 'varchar', length: 50 })
  parentId: string;

  @Column({ name: 'role_id', type: 'varchar' })
  roleId: string;

  @Column({ name: 'organization_id', type: 'uuid' })
  organizationId: string;

  @OneToOne(() => Role)
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @OneToMany(() => Privilege, (privilege) => privilege.user)
  @JoinColumn({ referencedColumnName: 'id' })
  privilege: Privilege[];

  @OneToMany(() => UserRole, (ur) => ur.user)
  @JoinColumn({ referencedColumnName: 'user_id' })
  userRoles: UserRole[];

  @OneToMany(() => UserSupervisor, (ur) => ur.subordinate)
  @JoinColumn({ referencedColumnName: 'subordinate_id' })
  supervisors: UserSupervisor[];

  @OneToMany(() => UserSupervisor, (ur) => ur.supervisor)
  @JoinColumn({ referencedColumnName: 'supervisor_id' })
  subordinates: UserSupervisor[];
}
