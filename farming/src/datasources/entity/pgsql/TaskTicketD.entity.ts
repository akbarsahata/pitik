import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { DataRequiredEnum } from '../../../dto/task.dto';
import { TaskFormDataTypeEnum } from '../../../libs/enums/taskTicketDetail.enum';
import { BoolSmallIntTransformer } from '../../../libs/utils/transformers';
import { CMSBase } from './Base.entity';
import { TaskTicket } from './TaskTicket.entity';
import { TaskTicketPhotoD } from './TaskTicketPhotoD.entity';
import { TaskTicketVideoD } from './TaskTicketVideoD.entity';
import { Variable } from './Variable.entity';

@Entity('t_taskticket_d')
export class TaskTicketD extends CMSBase {
  @Column({ name: 'ref_taskticket_id', type: 'varchar', length: 32 })
  taskTicketId: string;

  @Column({ name: 'instruction_title', type: 'varchar', length: 50 })
  instructionTitle: string;

  @Column({ name: 'data_required', type: 'smallint' })
  dataRequired: DataRequiredEnum;

  @Column({ name: 'data_instruction', type: 'text' })
  dataInstruction: string | null;

  @Column({ name: 'data_type', type: 'varchar', length: 50 })
  dataType: keyof typeof TaskFormDataTypeEnum;

  @Column({ name: 'data_option', type: 'varchar', length: 8000 })
  dataOption: string;

  @Column({ name: 'data_option_chosen', type: 'varchar', length: 50 })
  dataOptionChoosen: string;

  @Column({ name: 'harvest_qty', type: 'int' })
  harvestQty: number;

  @Column({ name: 'ref_variable_id', type: 'varchar', length: 32 })
  variableId: string;

  @Column({ name: 'ref_feedbrand_id', type: 'varchar', length: 32 })
  feedBrandId: string;

  @Column({ name: 'data_value', type: 'text' })
  dataValue: string | null;

  @Column({ name: 'data_operator', type: 'varchar', length: 1 })
  dataOperator: string | null;

  @Column({ name: 'photo_required', type: 'smallint' })
  photoRequired: DataRequiredEnum;

  @Column({ name: 'photo_instruction', type: 'text' })
  photoInstruction: string | null;

  @Column({ name: 'video_required', type: 'smallint' })
  videoRequired: DataRequiredEnum;

  @Column({ name: 'video_instruction', type: 'text' })
  videoInstruction: string | null;

  @Column({
    name: 'need_additional_detail',
    type: 'smallint',
    transformer: new BoolSmallIntTransformer(),
  })
  needAdditionalDetail: boolean;

  @Column({ name: 'additional_detail', type: 'text' })
  additionalDetail: string | null;

  @Column({ name: 'check_data_correctness', type: 'bool', default: false })
  checkDataCorrectness: boolean;

  @Column({ name: 'executed_date', type: 'timestamp' })
  executedDate: Date;

  @OneToOne(() => Variable)
  @JoinColumn({ name: 'ref_variable_id', referencedColumnName: 'id' })
  variable: Variable;

  @OneToMany(() => TaskTicketPhotoD, (ttpd) => ttpd.taskTicketD)
  @JoinColumn({ referencedColumnName: 'id' })
  photos: TaskTicketPhotoD[];

  @OneToMany(() => TaskTicketVideoD, (ttvd) => ttvd.taskTicketD)
  @JoinColumn({ referencedColumnName: 'id' })
  videos: TaskTicketVideoD[];

  @ManyToOne(() => TaskTicket, (tt) => tt.details)
  @JoinColumn({ name: 'ref_taskticket_id', referencedColumnName: 'id' })
  taskTicket: TaskTicket;
}
