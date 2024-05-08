import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { Api } from './Api.entity';
import { Base } from './Base.entity';
import { Role } from './Role.entity';

@Entity({
  name: 'roleacl',
  schema: 'usermanagement',
})
@Unique(['roleId', 'apiId'])
export class RoleAcl extends Base {
  @Column({ name: 'ref_role_id', type: 'uuid' })
  roleId: string;

  @Column({ name: 'ref_api_id', type: 'uuid' })
  apiId: string;

  @ManyToOne(() => Role, (role) => role.roleAcl)
  @JoinColumn({ name: 'ref_role_id' })
  role: Role;

  @ManyToOne(() => Api, (api) => api.roleAcl)
  @JoinColumn({ name: 'ref_api_id' })
  api: Api;
}
