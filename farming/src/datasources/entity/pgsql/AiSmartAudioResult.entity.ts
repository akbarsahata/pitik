import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AiSmartAudioJob } from './AiSmartAudioJob.entity';

@Entity({
  name: 'ai_smart_audio_result',
  schema: 'cms',
})
export class AiSmartAudioResult {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'ref_job_id', type: 'uuid' })
  jobId: number;

  @Column({ name: 'probability', type: 'real', nullable: true })
  probability: number | null;

  @Column({ name: 'ground_truth', type: 'text', nullable: true })
  groundTruth: string | null;

  @Column({ name: 'conclusion', type: 'varchar', length: 256, nullable: true })
  conclusion: string | null;

  @Column({ name: 'result_bucket', type: 'varchar', length: 256 })
  resultBucket: string;

  @Column({ name: 'result_audio_path', type: 'text' })
  resultAudioPath: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @OneToOne(() => AiSmartAudioJob)
  @JoinColumn({ name: 'ref_job_id', referencedColumnName: 'id' })
  job: AiSmartAudioJob;
}
