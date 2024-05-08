import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BoolSmallIntTransformer } from '../../../libs/utils/transformers';
import { CMSBase } from './Base.entity';
import { Coop } from './Coop.entity';
import { User } from './User.entity';

@Entity('t_coopmember_d')
export class CoopMemberD extends CMSBase {
  @Column({ name: 'ref_coop_id', type: 'varchar', length: 32 })
  coopId: string;

  @Column({ name: 'ref_user_id', type: 'varchar', length: 32 })
  userId: string;

  @Column({ name: 'is_leader', type: 'smallint', transformer: new BoolSmallIntTransformer() })
  isLeader: boolean;

  @Column({ name: 'is_internal', type: 'bool', default: false })
  isInternal: boolean;

  @OneToOne(() => Coop)
  @JoinColumn({ name: 'ref_coop_id', referencedColumnName: 'id' })
  coop: Coop;

  @OneToOne(() => User)
  @JoinColumn({ name: 'ref_user_id', referencedColumnName: 'id' })
  user: User;
}
