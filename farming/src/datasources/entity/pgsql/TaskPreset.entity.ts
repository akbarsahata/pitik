import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { BoolSmallIntTransformer } from '../../../libs/utils/transformers';
import { CMSBase } from './Base.entity';
import { CoopType } from './CoopType.entity';
import { TaskPresetD } from './TaskPresetD.entity';
import { User } from './User.entity';

@Entity('t_taskpreset')
export class TaskPreset extends CMSBase {
  @Column({ name: 'taskpreset_code', type: 'varchar', length: 50 })
  taskPresetCode: string;

  @Column({ name: 'taskpreset_name', type: 'text' })
  taskPresetName: string;

  @Column({ name: 'status', type: 'smallint', transformer: new BoolSmallIntTransformer() })
  status: boolean;

  @Column({ name: 'remarks', type: 'text' })
  remarks: string;

  @Column({ name: 'ref_cooptype_id', type: 'varchar', length: 32 })
  coopTypeId: string;

  @Column({ name: 'ref_chicktype_id', type: 'varchar', length: 32 })
  chickTypeId: string;

  @OneToOne(() => CoopType)
  @JoinColumn({ name: 'ref_cooptype_id', referencedColumnName: 'id' })
  coopType: CoopType;

  @OneToMany(() => TaskPresetD, (tpd) => tpd.taskPreset)
  @JoinColumn({ referencedColumnName: 'id' })
  tasks: TaskPresetD[];

  @OneToOne(() => User)
  @JoinColumn({ name: 'modified_by' })
  userModifier: User | null;
}
