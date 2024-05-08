import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { Building } from './Building.entity';
import { ControllerType } from './ControllerType.entity';
import { Coop } from './Coop.entity';
import { Fan } from './Fan.entity';
import { FloorType } from './FloorType.entity';
import { HeaterInRoom } from './HeaterInRoom.entity';
import { IotSensor } from './IotSensor.entity';
import { RoomType } from './RoomType.entity';

type InletPositionEnum = {
  DEPAN: null;
  SAMPING: null;
  LETTER_U: null;
};

@Entity('room')
export class Room {
  @PrimaryColumn()
  id: string;

  @Column({
    name: 'room_code',
    type: 'varchar',
    length: 8,
  })
  roomCode: string;

  @Column({ name: 'population', type: 'int' })
  population: number;

  @Column({ name: 'inlet_width', type: 'float4' })
  inletWidth: number | null;

  @Column({ name: 'inlet_length', type: 'float4' })
  inletLength: number | null;

  @Column({ name: 'inlet_position', type: 'enum', enum: ['DEPAN', 'SAMPING', 'LETTER_U'] })
  inletPosition: keyof InletPositionEnum | null;

  @Column({ name: 'is_cooling_pad_exist', type: 'boolean' })
  isCoolingPadExist: boolean;

  @Column({ name: 'is_active', type: 'boolean' })
  isActive: boolean;

  @Column({ name: 'building_id', type: 'varchar' })
  buildingId: string;

  @Column({ name: 'room_type_id', type: 'varchar' })
  roomTypeId: string;

  @Column({ name: 'floor_type_id', type: 'varchar' })
  floorTypeId: string;

  @Column({ name: 'controller_type_id', type: 'varchar' })
  controllerTypeId: string | null;

  @Column({ name: 'coop_id', type: 'varchar' })
  coopId: string | null;

  @Column({ name: 'created_by', type: 'varchar', length: 50 })
  createdBy: string | null;

  @Column({ name: 'created_date', type: 'timestamp' })
  createdDate: Date | null;

  @Column({ name: 'modified_by', type: 'varchar', length: 50 })
  modifiedBy: string | null;

  @Column({ name: 'modified_date', type: 'timestamp' })
  modifiedDate: Date | null;

  @ManyToOne(() => Building)
  @JoinColumn({ name: 'building_id', referencedColumnName: 'id' })
  building: Building;

  @ManyToOne(() => RoomType)
  @JoinColumn({ name: 'room_type_id', referencedColumnName: 'id' })
  roomType: RoomType;

  @ManyToOne(() => FloorType)
  @JoinColumn({ name: 'floor_type_id', referencedColumnName: 'id' })
  floorType: FloorType;

  @ManyToOne(() => ControllerType)
  @JoinColumn({ name: 'controller_type_id', referencedColumnName: 'id' })
  controllerType: ControllerType | null;

  @ManyToOne(() => Coop)
  @JoinColumn({ name: 'coop_id', referencedColumnName: 'id' })
  coop: Coop | null;

  @OneToMany(() => HeaterInRoom, (hir) => hir.room)
  @JoinColumn({ referencedColumnName: 'room_id' })
  heaterInRooms: HeaterInRoom[];

  @OneToMany(() => Fan, (f) => f.room)
  @JoinColumn({ referencedColumnName: 'room_id' })
  fans: Fan[];

  @OneToMany(() => IotSensor, (iotSensor) => iotSensor.room)
  @JoinColumn({ referencedColumnName: 'room_id' })
  iotSensors: IotSensor[];
}
