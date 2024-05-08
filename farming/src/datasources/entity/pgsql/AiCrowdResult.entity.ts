import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { SmartCameraJob } from './SmartCameraJob.entity';

@Entity('ai_crowd_result')
export class AiCrowdResult {
  @PrimaryColumn({ name: 'id', type: 'int' })
  id: number;

  @Column({ name: 'ref_job_id', type: 'int' })
  jobId: number;

  @Column({ name: 'crowd_probability', type: 'real' })
  crowdProbability: number;

  @Column({ name: 'crowd_probability_densenet', type: 'real' })
  crowdProbabilityDensenet: number;

  @Column({ name: 'crowd_probability_resnet', type: 'real' })
  crowdProbabilityResnet: number;

  @Column({ name: 'crowd_probability_inception', type: 'real' })
  crowdProbabilityInception: number;

  @Column({ name: 'crowd_probability_darknet', type: 'real' })
  crowdProbabilityDarknet: number;

  @Column({ name: 'conclusion', type: 'varchar', length: 255 })
  conclusion: string;

  @Column({ name: 'result_bucket', type: 'varchar', length: 255 })
  resultBucket: string;

  @Column({ name: 'result_image_path', type: 'varchar', length: 255 })
  resultImagePath: string;

  @Column({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @OneToOne(() => SmartCameraJob)
  @JoinColumn({ name: 'ref_job_id', referencedColumnName: 'id' })
  job: SmartCameraJob;
}
