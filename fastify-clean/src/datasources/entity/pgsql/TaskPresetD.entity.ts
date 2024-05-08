import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { CMSBase } from './Base.entity';
import { Task } from './Task.entity';
import { TaskPreset } from './TaskPreset.entity';

@Entity('t_taskpreset_d')
export class TaskPresetD extends CMSBase {
  @Column({ name: 'ref_taskpreset_id', type: 'varchar', length: 32 })
  taskPresetId: string;

  @Column({ name: 'ref_task_id', type: 'varchar', length: 32 })
  taskId: string;

  @ManyToOne(() => TaskPreset, (tp) => tp.tasks)
  @JoinColumn({ name: 'ref_taskpreset_id', referencedColumnName: 'id' })
  taskPreset: TaskPreset;

  @OneToOne(() => Task)
  @JoinColumn({ name: 'ref_task_id', referencedColumnName: 'id' })
  task: Task;
}
