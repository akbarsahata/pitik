import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { DailyMonitoring } from './DailyMonitoring.entity';

@Entity('dailymonitoring_mortality')
export class DailyMonitoringMortality {
  @PrimaryColumn({ name: 'id', type: 'varchar', length: 36 })
  id: string;

  @Column({ name: 'dailymonitoring_id', type: 'varchar', length: 36 })
  dailyMonitoringId: string;

  @Column({ name: 'quantity', type: 'int' })
  quantity: number;

  @Column({ name: 'cause', type: 'varchar', length: 255 })
  cause: string;

  @Column({ name: 'created_by', type: 'varchar', length: 32 })
  createdBy: string;

  @Column({ name: 'created_date', type: 'timestamp' })
  createdDate: Date;

  @Column({ name: 'modified_by', type: 'varchar', length: 32 })
  modifiedBy: string;

  @Column({ name: 'modified_date', type: 'timestamp' })
  modifiedDate: Date;

  @DeleteDateColumn({ name: 'deleted_date', type: 'timestamp' })
  deletedDate: Date | null;

  @ManyToOne(() => DailyMonitoring, (dailyMonitoring) => dailyMonitoring.mortalities)
  @JoinColumn({ name: 'dailymonitoring_id' })
  dailyMonitoring: DailyMonitoring;
}
