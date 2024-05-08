import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BoolSmallIntTransformer } from '../../../libs/utils/transformers';
import { Alert } from './Alert.entity';
import { AlertFormD } from './AlertFormD.entity';
import { AlertInstructionCoopTypeD } from './AlertInstructionCoopTypeD.entity';
import { CMSBase } from './Base.entity';

@Entity('t_alertinstruction')
export class AlertInstruction extends CMSBase {
  @Column({ name: 'ref_alert_id', type: 'varchar', length: 32 })
  alertId: string;

  @Column({ name: 'instruction', type: 'text' })
  instruction: string;

  @Column({ name: 'deadline', type: 'float' })
  deadline: number;

  @Column({ name: 'status', type: 'smallint', transformer: new BoolSmallIntTransformer() })
  status: boolean;

  @ManyToOne(() => Alert, (a) => a.instructions)
  @JoinColumn({ name: 'ref_alert_id', referencedColumnName: 'id' })
  alert: Alert;

  @OneToMany(() => AlertInstructionCoopTypeD, (aictd) => aictd.alertInstruction)
  @JoinColumn({ referencedColumnName: 'id' })
  instructionCoopType: AlertInstructionCoopTypeD[];

  @OneToMany(() => AlertFormD, (alertFormD) => alertFormD.alertInstruction)
  @JoinColumn({ referencedColumnName: 'id' })
  forms: AlertFormD[];
}
