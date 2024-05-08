import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BoolSmallIntTransformer } from '../../../libs/utils/transformers';
import { CMSBase } from './Base.entity';
import { FarmingCycleAlertD } from './FarmingCycleAlertD.entity';

@Entity('t_alerttriggered')
export class AlertTriggered extends CMSBase {
  @Column({ name: 'ref_farmingcycle_id', type: 'varchar', length: 32 })
  farmingCycleId: string;

  @Column({ name: 'ref_farmingcyclealert_id', type: 'varchar', length: 32 })
  farmingCycleAlertId: string;

  @Column({ name: 'ref_issue_id', type: 'varchar', length: 32 })
  issueId: string;

  @Column({ name: 'dismissed', type: 'varchar', transformer: new BoolSmallIntTransformer() })
  dismissed: boolean;

  @Column({ name: 'add_to_task', type: 'varchar', transformer: new BoolSmallIntTransformer() })
  addToTask: boolean;

  @OneToOne(() => FarmingCycleAlertD)
  @JoinColumn({ name: 'ref_farmingcyclealert_id', referencedColumnName: 'id' })
  farmingCycleAlert: FarmingCycleAlertD;
}
