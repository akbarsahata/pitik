import { Column, Entity } from 'typeorm';
import { CMSBase } from './Base.entity';

@Entity('t_farmingcycletasktrigger_d')
export class FarmingCycleTaskTriggerD extends CMSBase {
  @Column({ name: 'ref_farmingcycletask_id', type: 'varchar', length: 32 })
  farmingCycleTaskId: string;

  @Column({ name: 'day', type: 'int' })
  day: number;

  @Column({ name: 'trigger_time', type: 'time' })
  triggerTime: string;

  @Column({ name: 'deadline', type: 'float' })
  deadline: number;
}
