import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { SmartCameraJob } from './SmartCameraJob.entity';

@Entity('ai_crowd_manual_checking')
export class AiCrowdManualChecking {
  @PrimaryColumn({ name: 'id', type: 'int' })
  id: number;

  @Column({ name: 'ref_job_id', type: 'varchar' })
  jobId: string;

  @Column({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @Column({ name: 'ppl_checked_by', type: 'varchar' })
  pplCheckedBy: string;

  @Column({ name: 'ppl_actual_probability', type: 'float8' })
  pplActualProbability?: number;

  @Column({ name: 'ppl_remarks', type: 'varchar' })
  pplRemarks?: string;

  @OneToOne(() => SmartCameraJob)
  @JoinColumn({ name: 'ref_job_id', referencedColumnName: 'id' })
  job: SmartCameraJob;
}
