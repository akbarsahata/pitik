import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ai_crowd_job_activity')
export class AiCrowdJobActivity {
  @PrimaryColumn({ name: 'id', type: 'int' })
  id: number;

  @Column({ name: 'ref_job_id', type: 'varchar' })
  jobId: string;

  @Column({ name: 'current_task', type: 'varchar' })
  currentTask: string;

  @Column({ name: 'status', type: 'varchar' })
  status: string;

  @Column({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
