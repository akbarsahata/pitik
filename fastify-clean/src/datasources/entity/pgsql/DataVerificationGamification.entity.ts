import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { CMSBase } from './Base.entity';
import { DataVerificationGamificationD } from './DataVerificationGamificationD.entity';
import { FarmingCycle } from './FarmingCycle.entity';
import { TaskTicket } from './TaskTicket.entity';
import { User } from './User.entity';

@Entity('t_dataverificationgamification')
export class DataVerificationGamification extends CMSBase {
  @Column({ name: 'ref_farmingcycle_id', type: 'varchar', length: 32 })
  farmingCycleId: string;

  @Column({ name: 'ref_taskticket_id', type: 'varchar', length: 32 })
  taskTicketId: string;

  @Column({ name: 'ref_user_verifier_id', type: 'varchar', length: 32 })
  userVerifierId: string;

  @Column({ name: 'on_time_status', type: 'bool' })
  onTimeStatus: boolean;

  @OneToOne(() => FarmingCycle)
  @JoinColumn({ name: 'ref_farmingcycle_id', referencedColumnName: 'id' })
  farmingCycle: FarmingCycle;

  @OneToOne(() => TaskTicket)
  @JoinColumn({ name: 'ref_taskticket_id', referencedColumnName: 'id' })
  taskTicket: TaskTicket;

  @OneToOne(() => User)
  @JoinColumn({ name: 'ref_user_verifier_id', referencedColumnName: 'id' })
  userVerifier: User;

  @OneToMany(() => DataVerificationGamificationD, (dvgd) => dvgd.dataVerificationGamification)
  @JoinColumn({ referencedColumnName: 'id' })
  details: DataVerificationGamificationD[];
}
