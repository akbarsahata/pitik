import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BoolSmallIntTransformer } from '../../../libs/utils/transformers';
import { CMSBase } from './Base.entity';
import { FarmingCycle } from './FarmingCycle.entity';
import { User } from './User.entity';

@Entity('t_farmingcyclemember_d')
export class FarmingCycleMemberD extends CMSBase {
  @Column({ name: 'ref_farmingcycle_id', type: 'varchar', length: 32 })
  farmingCycleId: string;

  @Column({ name: 'ref_user_id', type: 'varchar', length: 32 })
  userId: string;

  @Column({
    name: 'is_leader',
    type: 'smallint',
    default: 0,
    transformer: new BoolSmallIntTransformer(),
  })
  isLeader: boolean;

  @Column({ name: 'is_internal', type: 'bool', default: false })
  isInternal: boolean;

  /**
   * supposed to be ManyToOne as this is a conjunction table
   * but set OneToOne for quicker implementation
   */
  @OneToOne(() => User)
  @JoinColumn({ name: 'ref_user_id', referencedColumnName: 'id' })
  user: User;

  @OneToOne(() => FarmingCycle)
  @JoinColumn({ name: 'ref_farmingcycle_id', referencedColumnName: 'id' })
  farmingCycle: FarmingCycle;
}
