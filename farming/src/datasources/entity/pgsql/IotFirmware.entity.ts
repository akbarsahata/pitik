/* eslint-disable no-unused-vars */
import { Column, Entity } from 'typeorm';
import { DEVICE_TYPE } from '../../../libs/constants';

@Entity('iot_firmware')
export class IotFirmware {
  @Column({ primary: true, generated: 'uuid' })
  id: string;

  @Column({ nullable: true, name: 'version', type: 'varchar', length: 50 })
  version: string;

  @Column({ nullable: true, name: 'file_name', type: 'varchar', length: 255 })
  fileName: string;

  @Column({ nullable: true, name: 'description', type: 'text' })
  description: string;

  @Column({ nullable: true, name: 'file_size', type: 'float4' })
  fileSize: number;

  @Column('json')
  additional: object;

  @Column({ nullable: true, name: 'device_type', type: 'varchar' })
  deviceType: keyof typeof DEVICE_TYPE | null;

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
}
