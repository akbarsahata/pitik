import { Column, Entity, JoinColumn, OneToMany } from 'typeorm';
import { CMSBase } from '../Base.entity';
import { B2BFarm } from './B2BFarm.entity';
import { B2BFarmInfrastructure } from './B2BFarmInfrastructure.entity';
import { B2BOrganizationMember } from './B2BOrganizationMember.entity';

@Entity({
  name: 'b2b_organization',
  schema: 'b2b',
})
export class B2BOrganization extends CMSBase {
  @Column({ primary: true, generated: 'uuid' })
  id: string;

  @Column({ name: 'name', type: 'varchar', length: 50 })
  name: string;

  @Column({ name: 'code', type: 'varchar', length: 4 })
  code: string;

  @Column({ name: 'image', type: 'text' })
  image: string;

  @OneToMany(() => B2BOrganizationMember, (om) => om.organization)
  @JoinColumn({ referencedColumnName: 'id' })
  members: B2BOrganizationMember[];

  @OneToMany(() => B2BFarm, (of) => of.organization)
  @JoinColumn({ referencedColumnName: 'id' })
  farms: B2BFarm[];

  @OneToMany(() => B2BFarmInfrastructure, (fi) => fi.organization)
  @JoinColumn({ referencedColumnName: 'id' })
  farmInfrastructures: B2BFarmInfrastructure[];
}
