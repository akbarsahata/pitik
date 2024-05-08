import { Column, Entity } from 'typeorm';
import { BoolSmallIntTransformer } from '../../../libs/utils/transformers';
import { CMSBase } from './Base.entity';

@Entity('t_harvesttask_d')
export class HarvestTaskD extends CMSBase {
  @Column({ name: 'ref_harvest_id', type: 'varchar', length: 32 })
  harvestId: string;

  @Column({ name: 'ref_task_id', type: 'varchar', length: 32 })
  taskId: string;

  @Column({ name: 'task_code', type: 'varchar', length: 50 })
  taskCode: string;

  @Column({ name: 'task_name', type: 'text' })
  taskName: string;

  @Column({ name: 'manual_trigger', type: 'smallint', transformer: new BoolSmallIntTransformer() })
  manualTrigger: boolean;

  @Column({ name: 'manual_deadline', type: 'double precision' })
  manualDeadline: number;

  @Column({ name: 'instruction', type: 'text' })
  instruction: string;

  @Column({ name: 'only_this_cycle', type: 'smallint', transformer: new BoolSmallIntTransformer() })
  onlyThisCycle: boolean;

  @Column({ name: 'execute_count', type: 'int' })
  executeCount: number;
}
