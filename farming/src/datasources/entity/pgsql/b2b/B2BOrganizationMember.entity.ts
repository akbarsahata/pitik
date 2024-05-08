import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { CMSBase } from '../Base.entity';
import { User } from '../User.entity';
import { B2BOrganization } from './B2BOrganization.entity';

@Entity({
  name: 'b2b_organization_member',
  schema: 'b2b',
})
export class B2BOrganizationMember extends CMSBase {
  @Column({ primary: true, generated: true })
  id: string;

  @Column({ name: 'ref_organization_id', type: 'uuid' })
  organizationId: string;

  @Column({ name: 'ref_user_id', type: 'varchar' })
  userId: string;

  @ManyToOne(() => B2BOrganization, (o) => o.members)
  @JoinColumn({ name: 'ref_organization_id', referencedColumnName: 'id' })
  organization: B2BOrganization;

  @OneToOne(() => User)
  @JoinColumn({ name: 'ref_user_id', referencedColumnName: 'id' })
  user: User;
}
