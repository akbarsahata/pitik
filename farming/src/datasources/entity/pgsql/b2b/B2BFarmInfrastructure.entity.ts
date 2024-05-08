import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { CMSBase } from '../Base.entity';
import { Building } from '../Building.entity';
import { Coop } from '../Coop.entity';
import { Farm } from '../Farm.entity';
import { B2BIotDevice } from './B2BIotDevice.entity';
import { B2BOrganization } from './B2BOrganization.entity';

@Entity({
  name: 'b2b_farm_infrastructure',
  schema: 'b2b',
})
export class B2BFarmInfrastructure extends CMSBase {
  @Column({ primary: true, generated: 'uuid' })
  id: string;

  @Column({ name: 'ref_organization_id', type: 'varchar' })
  organizationId: string;

  @Column({ name: 'ref_farm_id', type: 'varchar' })
  farmId: string;

  @Column({ name: 'ref_building_id', type: 'varchar' })
  buildingId: string;

  @Column({ name: 'ref_coop_id', type: 'varchar' })
  coopId: string;

  @ManyToOne(() => Farm, (f) => f.b2bFarmInfrastructures)
  @JoinColumn({ name: 'ref_farm_id', referencedColumnName: 'id' })
  farm: Farm;

  @ManyToOne(() => B2BOrganization, (o) => o.farmInfrastructures)
  @JoinColumn({ name: 'ref_organization_id', referencedColumnName: 'id' })
  organization: B2BOrganization;

  @ManyToOne(() => Building, (b) => b.b2bFarmInfrastructures)
  @JoinColumn({ name: 'ref_building_id', referencedColumnName: 'id' })
  building: Building;

  @ManyToOne(() => Coop, (c) => c.b2bFarmInfrastructures)
  @JoinColumn({ name: 'ref_coop_id', referencedColumnName: 'id' })
  coop: Coop;

  @OneToMany(() => B2BIotDevice, (iot) => iot.farmInfrastructure)
  @JoinColumn({ referencedColumnName: 'id' })
  devices: B2BIotDevice[];
}
