import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { CMSBase } from './Base.entity';
import { FarmingCycleAlertD } from './FarmingCycleAlertD.entity';

@Entity('t_farmingcyclealertinstructioncooptype_d')
export class FarmingCycleAlertInstructionCoopTypeD extends CMSBase {
  @Column({ name: 'ref_farmingcyclealertinstruction_id', type: 'varchar', length: 32 })
  farmingCycleAlertInstructionId: string;

  @Column({ name: 'ref_cooptype_id', type: 'varchar', length: 32 })
  coopTypeId: string;

  @OneToOne(() => FarmingCycleAlertD)
  @JoinColumn({ name: 'ref_farmingcyclealertinstruction_id', referencedColumnName: 'id' })
  alertInstruction: FarmingCycleAlertD;
}
