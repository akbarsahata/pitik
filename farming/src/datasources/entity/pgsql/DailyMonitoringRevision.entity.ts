/* eslint-disable no-unused-vars */
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from 'typeorm';
import { DailyMonitoring } from './DailyMonitoring.entity';
import { User } from './User.entity';

export enum DailyMonitoringRevisionStatusEnum {
  REQUESTED = 'REQUESTED',
  REVISED = 'REVISED',
}

@Entity('dailymonitoring_revision')
export class DailyMonitoringRevision {
  @PrimaryColumn({ name: 'id', type: 'varchar', length: 36 })
  id: string;

  @Column({ name: 'ref_dailymonitoring_id', type: 'varchar', length: 36 })
  dailyMonitoringId: string;

  @Column({ name: 'reason', type: 'varchar' })
  reason: string;

  @Column({ name: 'changes', type: 'varchar', array: true })
  changes: string[];

  @Column({ name: 'status', type: 'varchar' })
  status: DailyMonitoringRevisionStatusEnum;

  @Column({ name: 'snapshot_data', type: 'jsonb', nullable: true })
  snapshotData: object | null;

  @Column({ name: 'created_by', type: 'varchar', length: 32 })
  createdBy: string;

  @Column({ name: 'created_date', type: 'timestamp' })
  createdDate: Date;

  @Column({ name: 'modified_by', type: 'varchar', length: 32 })
  modifiedBy: string;

  @Column({ name: 'modified_date', type: 'timestamp' })
  modifiedDate: Date;

  @ManyToOne(() => DailyMonitoring, (dm) => dm.revisions)
  @JoinColumn({ name: 'ref_dailymonitoring_id' })
  dailyMonitoring: DailyMonitoring;

  @OneToOne(() => User)
  @JoinColumn({ name: 'created_by', referencedColumnName: 'id' })
  userRequestor: User | null;
}
