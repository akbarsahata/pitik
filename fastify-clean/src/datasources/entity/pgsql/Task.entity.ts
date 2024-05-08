import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { BoolSmallIntTransformer } from '../../../libs/utils/transformers';
import { CMSBase } from './Base.entity';
import { TaskTriggerD } from './TaskTriggerD.entity';
import { TaskFormD } from './TaskFormD.entity';
import { User } from './User.entity';

@Entity('t_task')
export class Task extends CMSBase {
  @Column({ name: 'task_code', type: 'varchar', length: 50 })
  taskCode: string;

  @Column({ name: 'task_name', type: 'text' })
  taskName: string;

  @Column({
    name: 'only_for_harvest',
    type: 'smallint',
    transformer: new BoolSmallIntTransformer(),
  })
  harvestOnly: boolean;

  @Column({ name: 'manual_trigger', type: 'smallint', transformer: new BoolSmallIntTransformer() })
  manualTrigger: boolean;

  @Column({ name: 'manual_deadline', type: 'double precision' })
  manualDeadline: number;

  @Column({ name: 'status', type: 'smallint', transformer: new BoolSmallIntTransformer() })
  status: boolean;

  @Column({ name: 'instruction', type: 'text' })
  instruction: string;

  @Column({ name: 'remarks', type: 'text' })
  remarks: string;

  @OneToMany(() => TaskTriggerD, (ttd) => ttd.task)
  @JoinColumn({ referencedColumnName: 'id' })
  triggers: TaskTriggerD[];

  @OneToMany(() => TaskFormD, (tfd) => tfd.task)
  @JoinColumn({ referencedColumnName: 'id' })
  instructions: TaskFormD[];

  @OneToOne(() => User)
  @JoinColumn({ name: 'modified_by' })
  userModifier: User | null;
}
