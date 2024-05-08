import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Room } from './Room.entity';

@Entity('fan')
export class Fan {
  @PrimaryColumn()
  id: string;

  @Column({ name: 'room_id', type: 'varchar' })
  roomId: string;

  @Column({ name: 'size', type: 'float4' })
  size: number;

  @Column({ name: 'capacity', type: 'float4' })
  capacity: number;

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
}
