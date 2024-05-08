import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { CMSBase } from './Base.entity';
import { SmartScaleWeighingD } from './SmartScaleWeighingD.entity';
import { FarmingCycle } from './FarmingCycle.entity';

@Entity('t_smartscaleweighing')
export class SmartScaleWeighing extends CMSBase {
  @Column({ name: 'ref_farmingcycle_id', type: 'varchar', length: 32 })
  farmingCycleId: string;

  @Column({ name: 'executed_date', type: 'timestamp' })
  executedDate: Date;

  @Column({ name: 'total_count', type: 'int' })
  totalCount: number;

  @Column({ name: 'current_population', type: 'int' })
  currentPopulation: number;

  @Column({ name: 'avg_weight', type: 'float' })
  avgWeight: number;

  @Column({ name: 'weighing_number', type: 'varchar', length: 32 })
  weighingNumber: string;

  @OneToOne(() => FarmingCycle)
  @JoinColumn({ name: 'ref_farmingcycle_id', referencedColumnName: 'id' })
  farmingCycle: FarmingCycle;

  @OneToMany(() => SmartScaleWeighingD, (sswd) => sswd.smartScaleWeighing)
  @JoinColumn({ referencedColumnName: 'id' })
  details: SmartScaleWeighingD[];
}
