import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from 'typeorm';
import { DataVerificationGamification } from './DataVerificationGamification.entity';
import { TaskTicketD } from './TaskTicketD.entity';

@Entity('t_dataverificationgamification_d')
export class DataVerificationGamificationD {
  @PrimaryColumn()
  id: string;

  @Column({ name: 'ref_dataverificationgamification_id', type: 'varchar', length: 32 })
  dataVerificationGamificationId: string;

  @Column({ name: 'ref_taskticketd_id', type: 'varchar', length: 32 })
  taskTicketDId: string;

  @Column({ name: 'has_correct_data', type: 'bool', default: false })
  hasCorrectData: boolean;

  @OneToOne(() => TaskTicketD)
  @JoinColumn({ name: 'ref_taskticketd_id', referencedColumnName: 'id' })
  taskTicketD: TaskTicketD;

  @ManyToOne(() => DataVerificationGamification, (dvg) => dvg.details)
  @JoinColumn({ name: 'ref_dataverificationgamification_id', referencedColumnName: 'id' })
  dataVerificationGamification: DataVerificationGamification;
}
