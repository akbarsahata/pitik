import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from 'typeorm';
import { DAILY_MONITORING_STATUS_ENUM } from '../../../libs/constants';
import { FarmingCycle } from './FarmingCycle.entity';
import { TaskTicket } from './TaskTicket.entity';

@Entity('dailymonitoring')
export class DailyMonitoring {
  @PrimaryColumn({ name: 'ref_farmingcycle_id', type: 'varchar', length: 32 })
  farmingCycleId: string;

  @PrimaryColumn({ name: 'ref_taskticket_id', type: 'varchar', length: 32 })
  taskTicketId: string;

  @Column({ name: 'erp_code', type: 'varchar', length: '50' })
  erpCode: string | null;

  @Column({ name: 'day', type: 'int' })
  day: number;

  @Column({ name: 'date', type: 'date' })
  date: string;

  @Column({
    name: 'report_status',
    type: 'varchar',
    length: 50,
    enum: ['EMPTY', 'FILLED', 'REVIEWED', 'LATE', 'DONE'],
  })
  reportStatus: keyof typeof DAILY_MONITORING_STATUS_ENUM;

  @Column({ name: 'executed_by', type: 'varchar', length: 32 })
  executedBy: string | null;

  @Column({ name: 'reviewed_by', type: 'varchar', length: 32 })
  reviewedBy: string | null;

  @Column({ name: 'bw', type: 'float' })
  bw: number | null;

  @Column({ name: 'adg', type: 'float' })
  adg: number | null;

  @Column({ name: 'ip', type: 'float' })
  ip: number | null;

  @Column({ name: 'fcr', type: 'float' })
  fcr: number | null;

  @Column({ name: 'feed_intake', type: 'float' })
  feedIntake: number | null;

  @Column({ name: 'mortality', type: 'float' })
  mortality: number | null;

  @Column({ name: 'feed_remaining', type: 'float' })
  feedRemaining: number | null;

  @Column({ name: 'feed_stockout_date', type: 'date' })
  feedStockoutDate: string | null;

  @Column({ name: 'population_total', type: 'float' })
  populationTotal: number | null;

  @Column({ name: 'population_harvested', type: 'float' })
  populationHarvested: number | null;

  @Column({ name: 'population_mortaled', type: 'float' })
  populationMortaled: number | null;

  @Column({ name: 'average_chicken_age', type: 'float' })
  averageChickenAge: number | null;

  @Column({ name: 'created_date', type: 'timestamp' })
  createdDate: Date;

  @Column({ name: 'modified_date', type: 'timestamp' })
  modifiedDate: Date;

  @ManyToOne(() => FarmingCycle, (fc) => fc.dailyMonitoring)
  @JoinColumn({ name: 'ref_farmingcycle_id' })
  farmingCycle: FarmingCycle | null;

  @OneToOne(() => TaskTicket)
  @JoinColumn({ name: 'ref_taskticket_id' })
  taskTicket: TaskTicket | null;
}
