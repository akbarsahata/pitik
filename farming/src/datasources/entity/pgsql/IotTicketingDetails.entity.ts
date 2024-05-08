/* eslint-disable no-unused-vars */
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { IotTicketing } from './IotTicketing.entity';

@Entity('iot_ticketing_details')
export class IotTicketingDetails {
  @Column({ primary: true, type: 'varchar' })
  id: string;

  @Column({ nullable: true, name: 'action_status', type: 'varchar', length: 50 })
  actionStatus: string;

  @Column({ name: 'ref_ticketing_id', type: 'string' })
  refTicketingId: string;

  @Column({ name: 'notes', type: 'text' })
  notes: string;

  @Column({ name: 'time_action', type: 'timestamp' })
  timeAction: Date;

  @Column({ name: 'created_by', type: 'varchar' })
  createdBy: string;

  @Column({ name: 'modified_by', type: 'varchar' })
  modifiedBy: string;

  @Column({ name: 'created_date', type: 'timestamp' })
  createdDate: Date;

  @Column({ name: 'modified_date', type: 'timestamp' })
  modifiedDate: Date;

  @ManyToOne(() => IotTicketing)
  @JoinColumn({ name: 'ref_ticketing_id', referencedColumnName: 'id' })
  ticketing: IotTicketing;
}
