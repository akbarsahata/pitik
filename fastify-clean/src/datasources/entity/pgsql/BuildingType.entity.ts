import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('building_type')
export class BuildingType {
  @PrimaryColumn()
  id: string;

  @Column({ name: 'name', type: 'varchar', length: 50 })
  name: string;

  @Column({ name: 'is_active', type: 'boolean' })
  isActive: boolean;
}
