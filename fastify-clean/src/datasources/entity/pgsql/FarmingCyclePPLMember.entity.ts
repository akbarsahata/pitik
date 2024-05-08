import { Column, PrimaryColumn, Generated, Entity, OneToOne, JoinColumn } from 'typeorm';
import { FarmingCycle } from './FarmingCycle.entity';

@Entity('t_farmingcyclepplmember')
export class FarmingCyclePPLMember {
  @PrimaryColumn()
  id: string;

  @Column({ name: 'seq_no', type: 'int' })
  @Generated('increment')
  seqNo: number;

  @Column({ name: 'ref_farmingcycle_id', type: 'varchar', length: 32 })
  farmingCycleId: string;

  @Column({ name: 'ref_user_ppl_id', type: 'varchar', length: 32 })
  userPplId: string;

  @OneToOne(() => FarmingCycle)
  @JoinColumn({ name: 'ref_farmingcycle_id', referencedColumnName: 'id' })
  farmingCycle: FarmingCycle;
}
