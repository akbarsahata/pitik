import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SMART_AUDIO_UPLOAD_FILE_STATE } from '../../../libs/constants';
import { AiSmartAudioResult } from './AiSmartAudioResult.entity';
import { Coop } from './Coop.entity';
import { IotSensor } from './IotSensor.entity';
import { Room } from './Room.entity';

@Entity({
  name: 'ai_smart_audio_job',
  schema: 'cms',
})
export class AiSmartAudioJob {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'ref_coop_id', type: 'varchar', length: 36 })
  coopId: string;

  @Column({ name: 'ref_room_id', type: 'varchar', length: 36 })
  roomId: string;

  @Column({ name: 'ref_sensor_id', type: 'varchar', length: 36 })
  sensorId: string;

  @Column({ name: 'bucket', type: 'text' })
  bucket: string;

  @Column({ name: 'file_path', type: 'text' })
  filePath: string;

  @Column({
    name: 'upload_state',
    type: 'varchar',
    enum: SMART_AUDIO_UPLOAD_FILE_STATE,
    default: SMART_AUDIO_UPLOAD_FILE_STATE.COMMAND_RECEIVED_IN_SERVER,
  })
  uploadState: SMART_AUDIO_UPLOAD_FILE_STATE;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => IotSensor, (s) => s.smartAudioJobs)
  @JoinColumn({ name: 'ref_sensor_id', referencedColumnName: 'id' })
  sensor: IotSensor;

  @ManyToOne(() => Coop, (s) => s.smartAudioJobs)
  @JoinColumn({ name: 'ref_coop_id', referencedColumnName: 'id' })
  coop: IotSensor;

  @ManyToOne(() => Room, (s) => s.smartAudioJobs)
  @JoinColumn({ name: 'ref_room_id', referencedColumnName: 'id' })
  room: Room;

  @OneToMany(() => AiSmartAudioResult, (asar) => asar.job)
  @JoinColumn({ referencedColumnName: 'id' })
  smartAudioResults: AiSmartAudioResult[];
}
