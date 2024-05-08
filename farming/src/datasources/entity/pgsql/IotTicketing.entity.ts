/* eslint-disable no-unused-vars */
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { IotDevice } from './IotDevice.entity';
import { User } from './User.entity';

@Entity('iot_ticketing')
export class IotTicketing {
  @Column({ primary: true, type: 'varchar' })
  id: string;

  @Column({ nullable: true, name: 'status', type: 'varchar', length: 50 })
  status: string;

  @Column({ name: 'ref_device_id', type: 'varchar' })
  refDeviceId: string;

  @Column({ name: 'ref_user_id', type: 'string' })
  refUserId: string | null;

  @Column({ name: 'created_on', type: 'timestamp' })
  createdOn: Date;

  @Column({ name: 'notes', type: 'text' })
  notes: string;

  @Column({ name: 'created_by', type: 'varchar' })
  createdBy: string;

  @Column({ name: 'modified_by', type: 'varchar' })
  modifiedBy: string;

  @Column({ name: 'created_date', type: 'timestamp' })
  createdDate: Date;

  @Column({ name: 'modified_date', type: 'timestamp' })
  modifiedDate: Date;

  @ManyToOne(() => IotDevice)
  @JoinColumn({ name: 'ref_device_id', referencedColumnName: 'id' })
  iotDevice: IotDevice;

  @OneToOne(() => User)
  @JoinColumn({ name: 'ref_user_id', referencedColumnName: 'id' })
  userPIC: User;

  @OneToOne(() => User)
  @JoinColumn({ name: 'modified_by', referencedColumnName: 'id' })
  userModifier: User | null;
}
