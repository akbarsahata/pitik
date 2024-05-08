import { Column, Entity, JoinColumn, OneToMany } from 'typeorm';
import { BoolSmallIntTransformer } from '../../../libs/utils/transformers';
import { CMSBase } from './Base.entity';
import { TaskTicket } from './TaskTicket.entity';

@Entity('t_farmingcycletask_d')
export class FarmingCycleTaskD extends CMSBase {
  @Column({ name: 'ref_farmingcycle_id', type: 'varchar', length: 32 })
  farmingCycleId: string;

  @Column({ name: 'ref_task_id', type: 'varchar', length: 32 })
  taskId: string;

  @Column({ name: 'task_code', type: 'varchar', length: 50 })
  taskCode: string;

  @Column({ name: 'task_name', type: 'text' })
  taskName: string;

  @Column({ name: 'manual_trigger', type: 'varchar', length: 50 })
  manualTrigger: number;

  @Column({ name: 'manual_deadline', type: 'double precision' })
  manualDeadline: number;

  @Column({ name: 'instruction', type: 'text' })
  instruction: string;

  @Column({ name: 'only_this_cycle', type: 'smallint', transformer: new BoolSmallIntTransformer() })
  onlyThisCycle: boolean;

  @Column({ name: 'execute_count', type: 'int' })
  executeCount: number;

  @Column({ name: 'remarks', type: 'text' })
  remarks: string;

  @Column({ name: 'status', type: 'smallint', transformer: new BoolSmallIntTransformer() })
  status: boolean;

  @OneToMany(() => TaskTicket, (taskTicket) => taskTicket.farmingCycleTask)
  @JoinColumn({ name: 'id', referencedColumnName: 'ref_farmingcycletask_id' })
  taskTicket: TaskTicket[];
}
