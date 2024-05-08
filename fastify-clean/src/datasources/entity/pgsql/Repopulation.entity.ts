import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CMSBase } from './Base.entity';
import { FarmingCycle } from './FarmingCycle.entity';

@Entity('repopulation')
export class Repopulation extends CMSBase {
  @Column({ name: 'farmingcycle_id', type: 'varchar', length: 32 })
  farmingCycleId: string;

  @Column({ name: 'approved_amount', type: 'int' })
  approvedAmount: number;

  @Column({ name: 'repopulate_date', type: 'varchar', length: 50 })
  repopulateDate: Date;

  @Column({ name: 'repopulate_day', type: 'int' })
  repopulateDay: number;

  @Column({ name: 'repopulate_reason', type: 'varchar' })
  repopulateReason: string;

  @ManyToOne(() => FarmingCycle, (fc) => fc.repopulations)
  @JoinColumn({ name: 'farmingcycle_id', referencedColumnName: 'id' })
  farmingCycle: FarmingCycle;
}
