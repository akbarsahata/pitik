import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { CMSBase } from '../Base.entity';
import { Farm } from '../Farm.entity';
import { User } from '../User.entity';
import { B2BFarmMember } from './B2BFarmMember.entity';
import { B2BOrganization } from './B2BOrganization.entity';

@Entity({
  name: 'b2b_farm',
  schema: 'b2b',
})
export class B2BFarm extends CMSBase {
  @Column({ primary: true, generated: 'uuid' })
  id: string;

  @Column({ name: 'ref_organization_id', type: 'uuid' })
  organizationId: string;

  @Column({ name: 'ref_farm_id', type: 'varchar' })
  farmId: string;

  @Column({ name: 'ref_owner_id', type: 'varchar' })
  ownerId: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'ref_owner_id', referencedColumnName: 'id' })
  owner: User;

  @OneToOne(() => Farm)
  @JoinColumn({ name: 'ref_farm_id', referencedColumnName: 'id' })
  farm: Farm;

  @ManyToOne(() => B2BOrganization, (o) => o.farms)
  @JoinColumn({ name: 'ref_organization_id', referencedColumnName: 'id' })
  organization: B2BOrganization;

  @OneToMany(() => B2BFarmMember, (farm) => farm.farm)
  @JoinColumn({ referencedColumnName: 'id' })
  members: B2BFarmMember[];
}
