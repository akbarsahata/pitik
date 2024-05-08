import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { BoolSmallIntTransformer } from '../../../libs/utils/transformers';
import { TaskSourceEnum } from '../../../dto/task.dto';
import { CMSBase } from './Base.entity';
import { FarmingCycle } from './FarmingCycle.entity';
import { GamificationPointHistory } from './GamificationPointHistory.entity';
import { TaskTicketD } from './TaskTicketD.entity';
import { DailyMonitoring } from './DailyMonitoring.entity';
import { FarmingCycleTaskD } from './FarmingCycleTaskD.entity';
import { User } from './User.entity';

@Entity('t_taskticket')
export class TaskTicket extends CMSBase {
  @Column({ name: 'ticket_code', type: 'varchar', length: 50 })
  ticketCode: string;

  @Column({ name: 'reported_date', type: 'timestamp' })
  reportedDate: Date;

  @Column({ name: 'ref_farmingcycle_id', type: 'varchar', length: 32 })
  farmingCycleId: string;

  @Column({ name: 'ref_farmingcycletask_id', type: 'varchar', length: 32 })
  farmingCycleTaskId: string;

  @Column({
    name: 'ref_farmingcyclealertinstruction_id',
    type: 'varchar',
    length: 32,
  })
  farmingCycleAlertInstructionId: string;

  @Column({ name: 'ref_alertriggered_id', type: 'varchar', length: 32 })
  alertTriggeredId: string;

  @Column({ name: 'ref_harvesttask_id', type: 'varchar', length: 32 })
  harvestTaskId: string;

  @Column({ name: 'ref_issue_id', type: 'varchar', length: 32 })
  issueId: string;

  @Column({ name: 'ref_feedbrand_id', type: 'varchar', length: 32 })
  feedBrandId: string;

  @Column({ name: 'task_name', type: 'text' })
  taskName: string;

  @Column({ name: 'instruction', type: 'text' })
  instruction: string;

  @Column({ name: 'ticket_source', type: 'varchar', length: 50 })
  ticketSource: TaskSourceEnum;

  @Column({ name: 'deadline', type: 'float' })
  deadline: number;

  @Column({ name: 'executed_by', type: 'varchar', length: 50 })
  executedBy: string;

  @Column({ name: 'executed_date', type: 'timestamp' })
  executedDate: Date;

  @Column({ name: 'already_execute', type: 'smallint', transformer: new BoolSmallIntTransformer() })
  alreadyExecute: boolean;

  @Column({ name: 'ticket_status', type: 'smallint' })
  ticketStatus: number;

  @Column({ name: 'remarks', type: 'text' })
  remarks: string;

  @ManyToOne(() => FarmingCycle, (fc) => fc.taskTickets)
  @JoinColumn({ name: 'ref_farmingcycle_id', referencedColumnName: 'id' })
  farmingCycle: FarmingCycle;

  @OneToMany(() => TaskTicketD, (ttd) => ttd.taskTicket)
  @JoinColumn({ referencedColumnName: 'id' })
  details: TaskTicketD[];

  @OneToMany(() => GamificationPointHistory, (gph) => gph.taskTicket)
  @JoinColumn({ referencedColumnName: 'id' })
  gamificationPointHistory: GamificationPointHistory[];

  @ManyToOne(() => FarmingCycleTaskD, (task) => task)
  @JoinColumn({ name: 'ref_farmingcycletask_id' })
  farmingCycleTask: FarmingCycleTaskD;

  @OneToOne(() => DailyMonitoring)
  @JoinColumn({ name: 'id' })
  dailyMonitoring?: DailyMonitoring;

  @OneToOne(() => User)
  @JoinColumn({ name: 'executed_by' })
  executor?: User;
}
