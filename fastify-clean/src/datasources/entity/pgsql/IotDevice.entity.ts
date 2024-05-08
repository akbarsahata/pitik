/* eslint-disable no-unused-vars */
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { DEVICE_TYPE } from '../../../libs/constants';
import { Building } from './Building.entity';
import { Coop } from './Coop.entity';
import { HeaterType } from './HeaterType.entity';
import { IotSensor } from './IotSensor.entity';
import { Room } from './Room.entity';

export interface DeviceSensors {
  name: string;
  position: string;
}

@Entity('iot_device')
export class IotDevice {
  @Column({ primary: true, generated: 'uuid' })
  id: string;

  @Column({ nullable: true, name: 'phone_number', type: 'varchar', length: 50 })
  phoneNumber: string;

  @Column({ name: 'registration_date', type: 'timestamp' })
  registrationDate: Date;

  @Column({ default: false, name: 'status', type: 'boolean' })
  status: boolean;

  @Column({ default: false, name: 'is_online', type: 'boolean' })
  isOnline: boolean;

  @Column('macaddr')
  mac: string;

  @Column({ name: 'firmware_version', type: 'varchar', length: 50 })
  firmWareVersion: string;

  @OneToMany(() => IotSensor, (sensor) => sensor.iotDevice)
  @JoinColumn({ referencedColumnName: 'id' })
  sensors: IotSensor[];

  @Column('json')
  additional: object;

  @Column({ nullable: true, name: 'farm_id', type: 'varchar', length: 50 })
  farmId: string | null;

  @Column({ nullable: true, name: 'coop_id', type: 'varchar', length: 50 })
  coopId: string | null;

  @Column({ nullable: true, name: 'building_id', type: 'varchar', length: 50 })
  buildingId: string | null;

  @Column({ nullable: true, name: 'room_id', type: 'varchar', length: 50 })
  roomId: string | null;

  @Column({ name: 'created_by', type: 'varchar' })
  createdBy: string;

  @Column({ name: 'modified_by', type: 'varchar' })
  modifiedBy: string;

  @Column({ name: 'created_date', type: 'timestamp' })
  createdDate: Date;

  @Column({ name: 'modified_date', type: 'timestamp' })
  modifiedDate: Date;

  @Column({ name: 'deleted_date', type: 'timestamp' })
  deletedDate: Date;

  @Column({ name: 'device_type', type: 'varchar' })
  deviceType: keyof typeof DEVICE_TYPE;

  @Column({ name: 'device_id', type: 'varchar' })
  deviceId: string;

  @Column({ name: 'total_fan', type: 'integer', default: 0 })
  totalFan: number;

  @Column({ name: 'heater_id', type: 'varchar', nullable: true })
  heaterId: string | null;

  @Column({ name: 'cooling_pad', type: 'boolean', default: false })
  coolingPad: boolean;

  @Column({ name: 'lamp', type: 'boolean', default: false })
  lamp: boolean;

  @Column({ name: 'total_camera', type: 'integer', default: 0 })
  totalCamera: number;

  @Column({
    name: 'camera',
    type: 'json',
    array: false,
    default: () => "'[]'",
    nullable: false,
  })
  camera: string[];

  @Column({
    name: 'error_code',
    type: 'json',
    array: false,
    default: () => "'[]'",
    nullable: false,
  })
  errorCode: string[];

  @OneToOne(() => HeaterType)
  @JoinColumn({ name: 'heater_id', referencedColumnName: 'id' })
  heaterType: HeaterType;

  @OneToOne(() => Building)
  @JoinColumn({ name: 'building_id', referencedColumnName: 'id' })
  building: Building;

  @OneToOne(() => Coop)
  @JoinColumn({ name: 'coop_id', referencedColumnName: 'id' })
  coop: Coop;

  @OneToOne(() => Room)
  @JoinColumn({ name: 'room_id', referencedColumnName: 'id' })
  room: Room;
}
