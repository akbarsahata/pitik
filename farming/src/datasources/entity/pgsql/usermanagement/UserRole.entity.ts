import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Role } from './Role.entity';
import { User } from './User.entity';

@Entity({
  name: 'userrole',
  schema: 'usermanagement',
})
export class UserRole {
  @PrimaryColumn({ name: 'user_id', type: 'uuid' })
  userId: string;

  @PrimaryColumn({ name: 'role_id', type: 'uuid' })
  roleId: string;

  @Column({ name: 'created_by', type: 'varchar', length: 50 })
  createdBy: string;

  @Column({ name: 'created_date', type: 'timestamp' })
  createdDate: Date;

  @Column({ name: 'modified_by', type: 'varchar', length: 50 })
  modifiedBy: string;

  @Column({ name: 'modified_date', type: 'timestamp' })
  modifiedDate: Date;

  @DeleteDateColumn({ name: 'deleted_date' })
  deletedDate: Date | null;

  @ManyToOne(() => User, (u) => u.userRoles)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Role, (r) => r.userRoles)
  @JoinColumn({ name: 'role_id' })
  role: Role;
}
