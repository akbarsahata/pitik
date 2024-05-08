import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ai_notif_config')
export class AiNotifConfig {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'ref_sensor_id', type: 'varchar' })
  sensorId: string;

  @Column({ name: 'notify_crowd', type: 'bool' })
  notifyCrowd: boolean;

  @Column({ name: 'notify_abw', type: 'bool' })
  notifyAbw: boolean;

  @Column({ name: 'notify_uniformity', type: 'bool' })
  notifyUniformity: boolean;

  @Column({ name: 'notify_density', type: 'bool' })
  notifyDensity: boolean;

  @Column({ name: 'created_at', type: 'varchar' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'varchar' })
  updatedAt: Date;
}
