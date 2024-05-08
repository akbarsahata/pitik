/* eslint-disable no-unused-vars */
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { IotDevice } from './IotDevice.entity';

@Entity('iot_device_tracker')
export class IotDeviceTracker {
  @Column({ primary: true, generated: 'uuid' })
  id: string;

  @Column({ name: 'iot_device_id', type: 'varchar', length: 256 })
  iotDeviceId: string;

  @Column({ default: false, name: 'is_online', type: 'boolean' })
  isOnline: boolean;

  @Column({ name: 'last_online_time', type: 'timestamp' })
  lastOnlineTime: Date;

  @Column({ name: 'back_online_time', type: 'timestamp' })
  backOnlineTime: Date;

  @Column({ name: 'description', type: 'text' })
  description: string;

  @Column('json')
  additional: object;

  @Column({ name: 'created_date', type: 'timestamp' })
  createdDate: Date;

  @Column({ name: 'modified_date', type: 'timestamp' })
  modifiedDate: Date;

  @ManyToOne(() => IotDevice)
  @JoinColumn({ name: 'iot_device_id', referencedColumnName: 'id' })
  iotDevice: IotDevice;
}
