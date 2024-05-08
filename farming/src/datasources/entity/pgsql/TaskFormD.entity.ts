/* eslint-disable no-unused-vars */
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BoolSmallIntTransformer } from '../../../libs/utils/transformers';
import { CMSBase } from './Base.entity';
import { Task } from './Task.entity';
import { Variable } from './Variable.entity';
import { FeedBrand } from './FeedBrand.entity';
import { TaskFormDataTypeEnum } from '../../../libs/enums/taskTicketDetail.enum';

@Entity('t_taskform_d')
export class TaskFormD extends CMSBase {
  @Column({ name: 'ref_task_id', type: 'varchar', length: 32 })
  taskId: string;

  @Column({ name: 'ref_variable_id', type: 'varchar', length: 32 })
  variableId: string;

  @Column({ name: 'ref_feedbrand_id', type: 'varchar', length: 32 })
  feedbrandId: string;

  @Column({ name: 'instruction_title', type: 'varchar', length: 255 })
  instructionTitle: string;

  @Column({ name: 'data_required', type: 'int2' })
  dataRequired: number;

  @Column({ name: 'data_instruction', type: 'text' })
  dataInstruction: string;

  @Column({ name: 'data_type', type: 'varchar', length: 50 })
  dataType: keyof typeof TaskFormDataTypeEnum;

  @Column({ name: 'data_option', type: 'varchar', length: 8000 })
  dataOption: string;

  @Column({ name: 'harvest_qty', type: 'integer' })
  harvestQty: number;

  @Column({ name: 'data_operator', type: 'varchar', length: 1 })
  dataOperator: string;

  @Column({ name: 'photo_required', type: 'int2' })
  photoRequired: number;

  @Column({ name: 'photo_instruction', type: 'text' })
  photoInstruction: string;

  @Column({ name: 'video_required', type: 'int2' })
  videoRequired: number;

  @Column({ name: 'video_instruction', type: 'text' })
  videoInstruction: string;

  @Column({
    name: 'need_additional_detail',
    type: 'integer',
    transformer: new BoolSmallIntTransformer(),
  })
  needAdditionalDetail: boolean;

  @Column({ name: 'additional_detail', type: 'text' })
  additionalDetail: string;

  @Column({ name: 'check_data_correctness', type: 'bool' })
  checkDataCorrectness: boolean;

  @OneToOne(() => Task)
  @JoinColumn({ name: 'ref_task_id', referencedColumnName: 'id' })
  task: Task;

  @OneToOne(() => Variable)
  @JoinColumn({ name: 'ref_variable_id', referencedColumnName: 'id' })
  variable: Variable | null;

  @OneToOne(() => FeedBrand)
  @JoinColumn({ name: 'ref_feedbrand_id', referencedColumnName: 'id' })
  feedbrand: FeedBrand | null;
}
