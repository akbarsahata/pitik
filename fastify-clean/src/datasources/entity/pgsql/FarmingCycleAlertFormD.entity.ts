import { Column, Entity } from 'typeorm';
import { BoolSmallIntTransformer } from '../../../libs/utils/transformers';
import { DataRequiredEnum } from '../../../dto/task.dto';
import { CMSBase } from './Base.entity';

@Entity('t_farmingcyclealertform_d')
export class FarmingCycleAlertFormD extends CMSBase {
  @Column({ name: 'ref_farmingcyclealertinstruction_id', type: 'varchar', length: 32 })
  farmingCycleAlertInstructionId: string;

  @Column({ name: 'instruction_title', type: 'varchar', length: 50 })
  instructionTitle: string;

  @Column({ name: 'data_required', type: 'smallint' })
  dataRequired: DataRequiredEnum;

  @Column({ name: 'data_instruction', type: 'text' })
  dataInstruction: string;

  @Column({ name: 'data_type', type: 'varchar', length: 50 })
  dataType: string;

  @Column({ name: 'data_option', type: 'varchar', length: 8000 })
  dataOption: string;

  @Column({ name: 'ref_variable_id', type: 'varchar', length: 32 })
  variableId: string;

  @Column({ name: 'ref_feedbrand_id', type: 'varchar', length: 32 })
  feedBrandId: string;

  @Column({ name: 'data_operator', type: 'varchar', length: 1 })
  dataOperator: string;

  @Column({ name: 'photo_required', type: 'smallint' })
  photoRequired: DataRequiredEnum;

  @Column({ name: 'photo_instruction', type: 'text' })
  photoInstruction: string;

  @Column({ name: 'video_required', type: 'smallint' })
  videoRequired: DataRequiredEnum;

  @Column({ name: 'video_instruction', type: 'text' })
  videoInstruction: string;

  @Column({
    name: 'need_additional_detail',
    type: 'smallint',
    transformer: new BoolSmallIntTransformer(),
  })
  needAdditionalDetail: boolean;

  @Column({ name: 'additional_detail', type: 'text' })
  additionalDetail: string;
}
