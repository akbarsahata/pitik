import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { Base } from './Base.entity';
import { Role } from './Role.entity';

@Entity({
  name: 'rolerank',
  schema: 'usermanagement',
})
@Unique(['rank', 'context'])
export class RoleRank extends Base {
  @Column({ name: 'rank', type: 'int4' })
  rank: number;

  @Column({ name: 'context', type: 'varchar', length: 255 })
  context: string;

  @Column({ name: 'ref_role_id', type: 'uuid' })
  roleId: string;

  @ManyToOne(() => Role, (role) => role.roleRank)
  @JoinColumn({ name: 'ref_role_id' })
  role: Role;
}
