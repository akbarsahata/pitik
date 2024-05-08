import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { CMSBase } from './Base.entity';
import { Task } from './Task.entity';

@Entity('t_tasktrigger_d')
export class TaskTriggerD extends CMSBase {
  @Column({ name: 'ref_task_id', type: 'varchar', length: 32 })
  taskId: string;

  @Column({ name: 'day', type: 'integer' })
  day: number;

  @Column({ name: 'trigger_time', type: 'time' })
  triggerTime: string;

  @Column({ name: 'deadline', type: 'integer' })
  deadline: number;

  @OneToOne(() => Task)
  @JoinColumn({ name: 'ref_task_id', referencedColumnName: 'id' })
  task: Task;
}
