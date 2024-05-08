import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Alert } from './Alert.entity';
import { CMSBase } from './Base.entity';

@Entity('t_alerttrigger_d')
export class AlertTriggerD extends CMSBase {
  @Column({ name: 'ref_alert_id', type: 'varchar', length: 32 })
  alertId: string;

  @Column({ name: 'ref_variable_id', type: 'varchar', length: 32 })
  variableId: string;

  @Column({ name: 'measurement_unit', type: 'varchar', length: 50 })
  measurementUnit: string;

  @Column({ name: 'measurement_condition', type: 'varchar', length: 50 })
  measurementCondition: string;

  @Column({ name: 'measurement_value', type: 'int' })
  measurementValue: number;

  @ManyToOne(() => Alert, (a) => a.triggers)
  @JoinColumn({ name: 'ref_alert_id', referencedColumnName: 'id' })
  alert: Alert;
}
