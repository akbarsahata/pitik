import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CMSBase } from './Base.entity';
import { TaskTicket } from './TaskTicket.entity';

@Entity('t_gamificationpointhistory')
export class GamificationPointHistory extends CMSBase {
  @Column({ name: 'ref_farmingcycle_id', type: 'varchar', length: 32 })
  farmingCycleId: string;

  @Column({ name: 'ref_dataverification_id', type: 'varchar', length: 32 })
  dataVerificationId: string;

  @Column({ name: 'ref_taskticket_id', type: 'varchar', length: 32 })
  taskTicketId: string;

  @Column({ name: 'ref_user_submitter_id', type: 'varchar', length: 32 })
  userSubmitterId: string;

  @Column({ name: 'ref_user_verifier_id', type: 'varchar', length: 32 })
  userVerifierId: string;

  @Column({ name: 'earned_points', type: 'int' })
  earnedPoints: number;

  @ManyToOne(() => TaskTicket, (tt) => tt.gamificationPointHistory)
  @JoinColumn({ name: 'ref_taskticket_id', referencedColumnName: 'id' })
  taskTicket: TaskTicket;
}
