/* eslint-disable no-unused-vars */
import { Column, DeleteDateColumn, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { AiSmartAudioJob } from './AiSmartAudioJob.entity';
import { IotDevice } from './IotDevice.entity';
import { Room } from './Room.entity';
import { SmartCameraJob } from './SmartCameraJob.entity';

export enum IotSensorTypeEnum {
  XIAOMI_SENSOR = 'XIAOMI_SENSOR',
  AMMONIA = 'AMMONIA',
  LIGHT = 'LIGHT',
  WIND_SPEED = 'WIND_SPEED',
  TEMPERATURE_SENSOR = 'TEMPERATURE_SENSOR',
  HUMIDITY_SENSOR = 'HUMIDITY_SENSOR',
  CAMERA = 'CAMERA',
  TEMPERATURE_OR_HUMIDITY = 'TEMPERATURE_OR_HUMIDITY',
  RECORDER = 'RECORDER',
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

  @DeleteDateColumn({ name: 'deleted_date', type: 'timestamp', nullable: true })
  deletedDate: Date | null;

  @OneToOne(() => IotDevice)
  @JoinColumn({ name: 'ref_iot_device_id', referencedColumnName: 'id' })
  iotDevice: IotDevice;

  @OneToOne(() => Room)
  @JoinColumn({ name: 'ref_room_id', referencedColumnName: 'id' })
  room: Room;

  @OneToMany(() => SmartCameraJob, (scj) => scj.sensor)
  @JoinColumn({ referencedColumnName: 'id' })
  smartCameraJobs: SmartCameraJob[];

  @OneToMany(() => AiSmartAudioJob, (asaj) => asaj.sensor)
  @JoinColumn({ referencedColumnName: 'id' })
  smartAudioJobs: AiSmartAudioJob[];
}
