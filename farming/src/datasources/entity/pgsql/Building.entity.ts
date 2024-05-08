import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';
import { B2BFarmInfrastructure } from './b2b/B2BFarmInfrastructure.entity';
import { BuildingType } from './BuildingType.entity';
import { Farm } from './Farm.entity';
import { Room } from './Room.entity';

@Entity('building')
export class Building {
  @PrimaryColumn()
  id: string;

  @Column({ name: 'name', type: 'varchar', length: 50 })
  name: string;

  @Column({ name: 'is_active', type: 'boolean' })
  isActive: boolean;

  @Column({ name: 'length', type: 'int' })
  length: number;

  @Column({ name: 'width', type: 'int' })
  width: number;

  @Column({ name: 'height', type: 'int' })
  height: number;

  @Column({ name: 'farm_id', type: 'varchar' })
  farmId: string;

  @Column({ name: 'building_type_id', type: 'varchar' })
  buildingTypeId: string;

  @Column({ name: 'created_by', type: 'varchar', length: 50 })
  createdBy: string | null;

  @Column({ name: 'created_date', type: 'timestamp' })
  createdDate: Date | null;

  @Column({ name: 'modified_by', type: 'varchar', length: 50 })
  modifiedBy: string | null;

  @Column({ name: 'modified_date', type: 'timestamp' })
  modifiedDate: Date | null;

  @OneToOne(() => Farm)
  @JoinColumn({ name: 'farm_id', referencedColumnName: 'id' })
  farm: Farm;

  @OneToOne(() => BuildingType)
  @JoinColumn({ name: 'building_type_id', referencedColumnName: 'id' })
  buildingType: BuildingType;

  @OneToMany(() => Room, (room) => room.building)
  @JoinColumn({ referencedColumnName: 'id' })
  rooms: Room[];

  @OneToMany(() => B2BFarmInfrastructure, (fi) => fi.building)
  @JoinColumn({ referencedColumnName: 'id' })
  b2bFarmInfrastructures: B2BFarmInfrastructure[];
}
