import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';
import { SMART_CAMERA_UPLOAD_IMAGE_STATE } from '../../../libs/constants';
import { AiCrowdManualChecking } from './AiCrowdManualChecking.entity';
import { AiCrowdResult } from './AiCrowdResult.entity';
import { IotSensor } from './IotSensor.entity';

@Entity('ai_smart_camera_job')
export class SmartCameraJob {
  @PrimaryColumn({ name: 'id', type: 'varchar' })
  id: string;

  @Column({ name: 'ref_coop_id', type: 'varchar' })
  coopId: string;

  @Column({ name: 'floor_id', type: 'varchar' })
  floorId: string;

  @Column({ name: 'sensor_id', type: 'varchar' })
  sensorId: string;

  @Column({ name: 'bucket', type: 'varchar' })
  bucket: string;

  @Column({ name: 'image_path', type: 'varchar' })
  imagePath: string;

  @Column({ name: 'request_by', type: 'varchar' })
  requestedBy: string;

  @Column({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @Column({
    name: 'upload_state',
    type: 'varchar',
    enum: [
      'COMMAND_RECEIVED_IN_SERVER',
      'COMMAND_RECEIVED_IN_DEVICE',
      'PRESIGN_REQUESTED',
      'PRESIGN_RECEIVED',
      'UPLOADING_PROCESS_IN_DEVICE',
      'DONE',
      'ERROR_SEND_COMMAND',
      'ERROR_SEND_PRESIGN_URL',
      'ERROR_UPLOAD_IMAGE',
    ],
  })
  uploadState?: keyof typeof SMART_CAMERA_UPLOAD_IMAGE_STATE;

  @ManyToOne(() => IotSensor, (s) => s.smartCameraJobs)
  @JoinColumn({ name: 'sensor_id', referencedColumnName: 'id' })
  sensor: IotSensor;

  @OneToMany(() => AiCrowdResult, (result) => result.job)
  @JoinColumn({ referencedColumnName: 'id' })
  crowdResults: AiCrowdResult[];

  @OneToOne(() => AiCrowdManualChecking, (manualChecking) => manualChecking.job)
  manualChecking?: AiCrowdManualChecking;
}
