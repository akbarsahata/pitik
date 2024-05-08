import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { CMSBase } from './Base.entity';
import { FarmingCycle } from './FarmingCycle.entity';

@Entity('t_dailyperformance_d')
export class DailyPerformanceD extends CMSBase {
  @Column({ name: 'ref_farmingcycle_id', type: 'varchar', length: 32 })
  farmingCycleId: string;

  @Column({ name: 'daily_issue', type: 'text' })
  dailyIssue: string;

  @Column({ name: 'summary', type: 'varchar', length: 32 })
  summary: string;

  @Column({ name: 'day', type: 'int' })
  day: number;

  @Column({ name: 'infrastructure_issues', type: 'text' })
  infrastructureIssues: string | null;

  @Column({ name: 'management_issues', type: 'text' })
  managementIssues: string | null;

  @Column({ name: 'farm_input_issues', type: 'text' })
  farmInputIssues: string | null;

  @Column({ name: 'disease_issues', type: 'text' })
  diseaseIssues: string | null;

  @Column({ name: 'force_majeure_issues', type: 'text' })
  forceMajeureIssues: string | null;

  @Column({ name: 'other_issues', type: 'text' })
  otherIssues: string | null;

  @Column({ name: 'treatment', type: 'text' })
  treatment: string | null;

  @OneToOne(() => FarmingCycle)
  @JoinColumn({ name: 'ref_farmingcycle_id', referencedColumnName: 'id' })
  farmingCycle: FarmingCycle;
}
