import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ai_bw_img_prediction')
export class AiBwImgPrediction {
  @PrimaryColumn({ name: 'id', type: 'int' })
  id: number;

  @Column({ name: 'coop_id', type: 'varchar' })
  coopId: string;

  @Column({ name: 'room_id', type: 'varchar' })
  roomId: string;

  @Column({ name: 'cam_id', type: 'varchar' })
  camId: string;

  @Column({ name: 'chickin_date', type: 'date' })
  chickInDate: string;

  @Column({ name: 'day', type: 'int8' })
  day: number;

  @Column({ name: 'abw_actual', type: 'float8' })
  abwActual: number;

  @Column({ name: 'abw_prediction', type: 'float8' })
  abwPrediction: number;

  @Column({ name: 'is_tilted', type: 'int4' })
  isTilted: number;

  @Column({ name: 'pixel_area', type: 'float8' })
  pixelArea: number;

  @Column({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @Column({ name: 'farmingcycle_id', type: 'varchar', length: 32 })
  farmingCycleId: string;
}
