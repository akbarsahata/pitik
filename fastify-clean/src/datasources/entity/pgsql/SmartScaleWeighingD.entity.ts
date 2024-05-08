import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { SmartScaleWeighing } from './SmartScaleWeighing.entity';

@Entity('t_smartscaleweighing_d')
export class SmartScaleWeighingD {
  @PrimaryColumn()
  id: string;

  @Column({ name: 'ref_smartscaleweighing_id', type: 'varchar', length: 32 })
  smartScaleWeighingId: string;

  @Column({ name: 'section', type: 'int' })
  section: number;

  @Column({ name: 'total_count', type: 'int' })
  totalCount: number;

  @Column({ name: 'total_weight', type: 'float' })
  totalWeight: number;

  @ManyToOne(() => SmartScaleWeighing, (ssw) => ssw.details)
  @JoinColumn({ name: 'ref_smartscaleweighing_id', referencedColumnName: 'id' })
  smartScaleWeighing: SmartScaleWeighing;
}
