import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IotDevice } from './IotDevice.entity';

@Entity('iot_device_settings')
export class IotDeviceSettings {
  @PrimaryColumn({ generated: 'uuid' })
  id: string;

  @Column({ name: 'iot_device_id', type: 'uuid', nullable: false })
  iotDeviceId: string;

  @Column({ name: 'settings', type: 'jsonb', nullable: false })
  settings: object;

  @CreateDateColumn({ name: 'created_date', type: 'timestamp' })
  createdDate: Date;

  @UpdateDateColumn({ name: 'modified_date', type: 'timestamp' })
  modifiedDate: Date;

  @ManyToOne(() => IotDevice, (d) => d.settings)
  @JoinColumn({ name: 'iot_device_id', referencedColumnName: 'id' })
  iotDevice: IotDevice;
}
