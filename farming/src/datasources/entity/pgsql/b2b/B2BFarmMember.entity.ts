import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { CMSBase } from '../Base.entity';
import { User } from '../User.entity';
import { B2BFarm } from './B2BFarm.entity';

@Entity({
  name: 'b2b_farm_member',
  schema: 'b2b',
})
export class B2BFarmMember extends CMSBase {
  @Column({ primary: true, generated: 'uuid' })
  id: string;

  @Column({ name: 'ref_b2b_farm_id', type: 'uuid' })
  b2bFarmId: string;

  @Column({ name: 'ref_user_id', type: 'varchar' })
  userId: string;

  @ManyToOne(() => B2BFarm, (b2bFarm) => b2bFarm.members)
  @JoinColumn({ name: 'ref_b2b_farm_id', referencedColumnName: 'id' })
  farm: B2BFarm;

  @OneToOne(() => User)
  @JoinColumn({ name: 'ref_user_id', referencedColumnName: 'id' })
  user: User;
}
