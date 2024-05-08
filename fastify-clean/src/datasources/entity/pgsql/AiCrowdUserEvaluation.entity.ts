import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ai_crowd_user_evaluation')
export class AiCrowdUserEvaluation {
  @PrimaryColumn({ name: 'job_id', type: 'int' })
  jobId: number;

  @PrimaryColumn({ name: 'user_id', type: 'varchar' })
  userId: string;

  @Column({ name: 'is_crowded', type: 'boolean' })
  isCrowded: boolean;

  @Column({ name: 'remarks', type: 'varchar' })
  remarks: string | null;

  @Column({ name: 'created_date', type: 'timestamp' })
  createdAt: Date;

  @Column({ name: 'updated_date', type: 'timestamp' })
  updatedAt: Date;
}
