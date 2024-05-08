import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { BoolSmallIntTransformer } from '../../../libs/utils/transformers';
import { Alert } from './Alert.entity';
import { CMSBase } from './Base.entity';
import { FarmingCycleAlertTriggerD } from './FarmingCycleAlertTriggerD.entity';

@Entity('t_farmingcyclealert_d')
export class FarmingCycleAlertD extends CMSBase {
  @Column({ name: 'ref_farmingcycle_id', type: 'varchar', length: 32 })
  farmingCycleId: string;

  @Column({ name: 'ref_alert_id', type: 'varchar', length: 32 })
  alertId: string;

  @Column({ name: 'alert_code', type: 'varchar', length: 50 })
  alertCode: string;

  @Column({ name: 'alert_name', type: 'text' })
  alertName: string;

  @Column({ name: 'alert_description', type: 'text' })
  alertDescription: string;

  @Column({ name: 'manual_trigger', type: 'smallint', transformer: new BoolSmallIntTransformer() })
  manualTrigger: boolean;

  @Column({ name: 'only_this_cycle', type: 'smallint', transformer: new BoolSmallIntTransformer() })
  onlyThisCycle: boolean;

  @Column({ name: 'execute_count', type: 'int' })
  executeCount: number;

  @Column({ name: 'remarks', type: 'text' })
  remarks: string;

  @OneToMany(() => FarmingCycleAlertTriggerD, (fcAlert) => fcAlert.farmingCycleAlert)
  @JoinColumn({ referencedColumnName: 'id' })
  triggers: FarmingCycleAlertD[] | null;

  @OneToOne(() => Alert)
  @JoinColumn({ name: 'ref_alert_id', referencedColumnName: 'id' })
  alert: Alert;
}
