/* eslint-disable no-unused-vars */
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { IotDevice } from './IotDevice.entity';
import { Room } from './Room.entity';

export enum IotSensorTypeEnum {
  XIAOMI_SENSOR = 'XIAOMI_SENSOR',
  AMMONIA = 'AMMONIA',
  LIGHT = 'LIGHT',
  WIND_SPEED = 'WIND_SPEED',
  TEMPERATURE_SENSOR = 'TEMPERATURE_SENSOR',
  HUMIDITY_SENSOR = 'HUMIDITY_SENSOR',
  CAMERA = 'CAMERA',
}

@Entity('iot_sensor')
export class IotSensor {
  @Column({ primary: true, name: 'id', type: 'varchar', length: 36 })
  id: string;

  @Column({ name: 'sensor_code', type: 'varchar', length: 50 })
  sensorCode: string;

  @Column({ name: 'sensor_type', type: 'varchar', length: 50, enum: IotSensorTypeEnum })
  sensorType: keyof typeof IotSensorTypeEnum;

  @Column({ name: 'status', type: 'smallint' })
  status: number;

  @Column({ nullable: true, name: 'position', type: 'varchar', length: 36 })
  position: string | null;

  @Column({
    name: 'additional',
    type: 'json',
    nullable: true,
  })
  additional: {
    ipCamera?: string;
  };

  @Column({ nullable: false, name: 'ref_iot_device_id', type: 'uuid' })
  iotDeviceId: string;

  @Column({ nullable: true, name: 'ref_room_id', type: 'varchar', length: 36 })
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

  @OneToOne(() => IotDevice)
  @JoinColumn({ name: 'ref_iot_device_id', referencedColumnName: 'id' })
  iotDevice: IotDevice;

  @OneToOne(() => Room)
  @JoinColumn({ name: 'ref_room_id', referencedColumnName: 'id' })
  room: Room;
}
