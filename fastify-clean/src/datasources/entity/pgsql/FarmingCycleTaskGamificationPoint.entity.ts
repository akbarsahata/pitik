import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { CMSBase } from './Base.entity';
import { FarmingCycleTaskD } from './FarmingCycleTaskD.entity';

@Entity('t_farmingcycletaskgamificationpoint')
export class FarmingCycleTaskGamificationPoint extends CMSBase {
  @Column({ name: 'ref_farmingcycletask_id', type: 'varchar', length: 32 })
  farmingCycleTaskId: string;

  @Column({ name: 'potential_points', type: 'int' })
  potentialPoints: number;

  @OneToOne(() => FarmingCycleTaskD)
  @JoinColumn({ name: 'ref_farmingcycletask_id', referencedColumnName: 'id' })
  farmingCycleTask: FarmingCycleTaskD;
}
