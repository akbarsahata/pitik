import { Column, Entity, JoinColumn, OneToMany, PrimaryColumn } from 'typeorm';
import { HeaterInRoom } from './HeaterInRoom.entity';

@Entity('heater_type')
export class HeaterType {
  @PrimaryColumn()
  id: string;

  @Column({ name: 'name', type: 'varchar', length: 50 })
  name: string;

  @Column({ name: 'is_active', type: 'boolean' })
  isActive: boolean;

  @OneToMany(() => HeaterInRoom, (hir) => hir.heaterType)
  @JoinColumn({ referencedColumnName: 'heater_type_id' })
  heaterInRooms: HeaterInRoom[];
}
