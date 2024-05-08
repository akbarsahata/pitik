import { Column, Entity, PrimaryColumn } from 'typeorm';
import { SMART_RECORDER_UPLOAD_STATE } from '../../../libs/constants';

@Entity('ai_smart_recorder_job')
export class SmartRecorderJob {
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

  @Column({ name: 'path', type: 'varchar' })
  path: string;

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
      'ERROR_UPLOAD_AUDIO',
    ],
  })
  uploadState?: keyof typeof SMART_RECORDER_UPLOAD_STATE;
}
