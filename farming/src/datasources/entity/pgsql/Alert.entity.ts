import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { BoolSmallIntTransformer } from '../../../libs/utils/transformers';
import { AlertInstruction } from './AlertInstruction.entity';
import { AlertTriggerD } from './AlertTriggerD.entity';
import { CMSBase } from './Base.entity';
import { User } from './User.entity';

@Entity('t_alert')
export class Alert extends CMSBase {
  @Column({ name: 'alert_code', type: 'varchar', length: 50 })
  alertCode: string;

  @Column({ name: 'alert_name', type: 'text' })
  alertName: string;

  @Column({ name: 'alert_description', type: 'text' })
  alertDescription: string;

  @Column({ name: 'eligible_manual', type: 'smallint', transformer: new BoolSmallIntTransformer() })
  eligibleManual: boolean;

  @Column({ name: 'status', type: 'smallint', transformer: new BoolSmallIntTransformer() })
  status: boolean;

  @Column({ name: 'remarks', type: 'text' })
  remarks: string;

  @OneToMany(() => AlertInstruction, (ai) => ai.alert)
  @JoinColumn({ referencedColumnName: 'id' })
  instructions: AlertInstruction[];

  @OneToMany(() => AlertTriggerD, (ad) => ad.alert)
  @JoinColumn({ referencedColumnName: 'id' })
  triggers: AlertTriggerD[];

  @OneToOne(() => User)
  @JoinColumn({ name: 'modified_by' })
  userModifier: User | null;
}
