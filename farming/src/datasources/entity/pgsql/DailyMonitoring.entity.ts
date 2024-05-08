import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';
import { DAILY_MONITORING_STATUS_ENUM } from '../../../libs/constants';
import { DailyMonitoringMortality } from './DailyMonitoringMortality.entity';
import { DailyMonitoringRevision } from './DailyMonitoringRevision.entity';
import { FarmingCycle } from './FarmingCycle.entity';
import { TaskTicket } from './TaskTicket.entity';
import { User } from './User.entity';

@Entity('dailymonitoring')
export class DailyMonitoring {
  @PrimaryColumn({ name: 'id', type: 'varchar', length: 36 })
  id: string;

  @Column({ name: 'ref_farmingcycle_id', type: 'varchar', length: 36 })
  farmingCycleId: string;

  @Column({ name: 'ref_taskticket_id', type: 'varchar', length: 36 })
  taskTicketId: string | null;

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
    enum: ['EMPTY', 'FILLED', 'REVIEWED', 'LATE', 'DONE', 'REVISION'],
  })
  reportStatus: keyof typeof DAILY_MONITORING_STATUS_ENUM;

  @Column({ name: 'executed_by', type: 'varchar', length: 36 })
  executedBy: string | null;

  @Column({ name: 'reviewed_by', type: 'varchar', length: 36 })
  reviewedBy: string | null;

  @Column({ name: 'bw', type: 'float' })
  bw: number | null;

  @Column({ name: 'adg', type: 'float' })
  adg: number | null;

  @Column({ name: 'ip', type: 'float' })
  ip: number | null;

  @Column({ name: 'fcr', type: 'float' })
  fcr: number | null;

  /**
   * Feed intake per population in the current day's monitoring.
   * This value is in gram.
   */
  @Column({ name: 'feed_intake', type: 'float' })
  feedIntake: number | null;

  @Column({ name: 'cull', type: 'int' })
  cull: number | null;

  /**
   * mortality rate, in percentage
   */
  @Column({ name: 'mortality', type: 'float' })
  mortality: number | null;

  /**
   * The remaining feed in the current day's monitoring.
   * This value is in sack (karung).
   */
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

  @Column({ name: 'remarks', type: 'varchar' })
  remarks: string | null;

  @Column({ name: 'recording_image', type: 'varchar' })
  recordingImage: string | null;

  @Column({ name: 'mortality_image', type: 'varchar' })
  mortalityImage: string | null;

  @Column({ name: 'hdp', type: 'float' })
  hdp: number | null;

  @Column({ name: 'egg_weight', type: 'float' })
  eggWeight: number | null;

  @Column({ name: 'egg_mass', type: 'float' })
  eggMass: number | null;

  @Column({ name: 'created_by', type: 'varchar', length: 32 })
  createdBy: string | null;

  @Column({ name: 'created_date', type: 'timestamp' })
  createdDate: Date;

  @Column({ name: 'modified_by', type: 'varchar', length: 32 })
  modifiedBy: string | null;

  @Column({ name: 'modified_date', type: 'timestamp' })
  modifiedDate: Date;

  @Column({ name: 'executed_date', type: 'timestamp' })
  executedDate: Date | null;

  @ManyToOne(() => FarmingCycle, (fc) => fc.dailyMonitoring)
  @JoinColumn({ name: 'ref_farmingcycle_id' })
  farmingCycle: FarmingCycle | null;

  @OneToOne(() => TaskTicket)
  @JoinColumn({ name: 'ref_taskticket_id' })
  taskTicket: TaskTicket | null;

  @OneToMany(() => DailyMonitoringMortality, (mortality) => mortality.dailyMonitoring)
  @JoinColumn({ name: 'id', referencedColumnName: 'dailymonitoring_id' })
  mortalities: DailyMonitoringMortality[];

  @OneToOne(() => User)
  @JoinColumn({ name: 'executed_by' })
  executor?: User;

  @OneToMany(() => DailyMonitoringRevision, (dmr) => dmr.dailyMonitoring)
  @JoinColumn({ name: 'id', referencedColumnName: 'ref_dailymonitoring_id' })
  revisions?: DailyMonitoringRevision[];
}
