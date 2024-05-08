import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AlertInstruction } from './AlertInstruction.entity';
import { CMSBase } from './Base.entity';

@Entity('t_alertinstructioncooptype_d')
export class AlertInstructionCoopTypeD extends CMSBase {
  @Column({ name: 'ref_alertinstruction_id', type: 'varchar', length: 32 })
  alertInstructionId: string;

  @Column({ name: 'ref_cooptype_id', type: 'varchar', length: 32 })
  coopTypeId: string;

  @ManyToOne(() => AlertInstruction, (ai) => ai.instructionCoopType)
  @JoinColumn({ name: 'ref_alertinstruction_id', referencedColumnName: 'id' })
  alertInstruction: AlertInstruction;
}
