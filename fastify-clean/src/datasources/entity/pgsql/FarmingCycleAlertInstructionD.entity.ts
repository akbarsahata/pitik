import { Column, Entity, JoinColumn, OneToMany } from 'typeorm';
import { BoolSmallIntTransformer } from '../../../libs/utils/transformers';
import { CMSBase } from './Base.entity';
import { FarmingCycleAlertInstructionCoopTypeD } from './FarmingCycleAlertInstructionCoopTypeD.entity';

@Entity('t_farmingcyclealertinstruction_d')
export class FarmingCycleAlertInstructionD extends CMSBase {
  @Column({ name: 'ref_farmingcyclealert_id', type: 'varchar', length: 32 })
  farmingCycleAlertId: string;

  @Column({ name: 'instruction', type: 'text' })
  instruction: string;

  @Column({ name: 'deadline', type: 'float' })
  deadline: number;

  @Column({ name: 'status', type: 'smallint', transformer: new BoolSmallIntTransformer() })
  status: boolean;

  @OneToMany(() => FarmingCycleAlertInstructionCoopTypeD, (fcai) => fcai.alertInstruction)
  @JoinColumn({ referencedColumnName: 'id' })
  alertInstructionCoopType: FarmingCycleAlertInstructionCoopTypeD[] | null;
}
