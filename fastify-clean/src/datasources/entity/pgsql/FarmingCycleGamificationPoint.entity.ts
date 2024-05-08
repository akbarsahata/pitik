import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { CMSBase } from './Base.entity';
import { FarmingCycle } from './FarmingCycle.entity';

@Entity('t_farmingcyclegamificationpoint')
export class FarmingCycleGamificationPoint extends CMSBase {
  @Column({ name: 'ref_farmingcycle_id', type: 'varchar', length: 32 })
  farmingCycleId: string;

  @Column({ name: 'potential_points', type: 'int' })
  potentialPoints: number;

  @Column({ name: 'current_points', type: 'int' })
  currentPoints: number;

  @OneToOne(() => FarmingCycle)
  @JoinColumn({ name: 'ref_farmingcycle_id', referencedColumnName: 'id' })
  farmingCycle: FarmingCycle;
}
