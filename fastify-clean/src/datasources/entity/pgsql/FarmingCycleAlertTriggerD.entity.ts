import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { CMSBase } from './Base.entity';
import { FarmingCycleAlertD } from './FarmingCycleAlertD.entity';
import { Variable } from './Variable.entity';

@Entity('t_farmingcyclealerttrigger_d')
export class FarmingCycleAlertTriggerD extends CMSBase {
  @Column({ name: 'ref_farmingcyclealert_id', type: 'varchar', length: 32 })
  farmingCycleAlertId: string;

  @Column({ name: 'ref_variable_id', type: 'varchar', length: 32 })
  variableId: string;

  @Column({ name: 'measurement_unit', type: 'varchar', length: 50 })
  measurementUnit: string;

  @Column({ name: 'measurement_condition', type: 'varchar', length: 50 })
  measurementCondition: string;

  @Column({ name: 'measurement_value', type: 'int' })
  measurementValue: number;

  @OneToOne(() => FarmingCycleAlertD)
  @JoinColumn({ name: 'ref_farmingcyclealert_id', referencedColumnName: 'id' })
  farmingCycleAlert: FarmingCycleAlertD;

  @OneToOne(() => Variable)
  @JoinColumn({ name: 'ref_variable_id', referencedColumnName: 'id' })
  variable: Variable;
}
