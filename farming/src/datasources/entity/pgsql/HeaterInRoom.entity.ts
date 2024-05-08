import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { HeaterType } from './HeaterType.entity';
import { Room } from './Room.entity';

@Entity('heater_in_room')
export class HeaterInRoom {
  @PrimaryColumn({ name: 'room_id', type: 'varchar' })
  roomId: string;

  @PrimaryColumn({ name: 'heater_type_id', type: 'varchar' })
  heaterTypeId: string;

  @Column({ name: 'quantity', type: 'int' })
  quantity: number;

  @Column({ name: 'created_by', type: 'varchar', length: 50 })
  createdBy: string | null;

  @Column({ name: 'created_date', type: 'timestamp' })
  createdDate: Date | null;

  @Column({ name: 'modified_by', type: 'varchar', length: 50 })
  modifiedBy: string | null;

  @Column({ name: 'modified_date', type: 'timestamp' })
  modifiedDate: Date | null;

  @ManyToOne(() => Room)
  @JoinColumn({ name: 'room_id', referencedColumnName: 'id' })
  room: Room;

  @ManyToOne(() => HeaterType)
  @JoinColumn({ name: 'heater_type_id', referencedColumnName: 'id' })
  heaterType: HeaterType;
}
