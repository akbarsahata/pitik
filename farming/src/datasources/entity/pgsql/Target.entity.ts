import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { BoolSmallIntTransformer } from '../../../libs/utils/transformers';
import { CMSBase } from './Base.entity';
import { ChickType } from './ChickType.entity';
import { CoopType } from './CoopType.entity';
import { TargetDaysD } from './TargetDaysD.entity';
import { User } from './User.entity';
import { Variable } from './Variable.entity';

@Entity('t_target')
export class Target extends CMSBase {
  @Column({ name: 'target_code', type: 'varchar', length: 50 })
  targetCode: string;

  @Column({ name: 'target_name', type: 'text' })
  targetName: string;

  @Column({ name: 'target_days_count', type: 'int' })
  targetDaysCount: number;

  @Column({ name: 'ref_cooptype_id', type: 'varchar', length: 32 })
  coopTypeId: string;

  @Column({ name: 'ref_chicktype_id', type: 'varchar', length: 32 })
  chickTypeId: string;

  @Column({ name: 'ref_variable_id', type: 'varchar', length: 32 })
  variableId: string;

  @Column({ name: 'status', type: 'smallint', transformer: new BoolSmallIntTransformer() })
  status: boolean;

  @Column({ name: 'remarks', type: 'text' })
  remarks: string;

  @OneToOne(() => CoopType)
  @JoinColumn({ name: 'ref_cooptype_id', referencedColumnName: 'id' })
  coopType: CoopType;

  @OneToOne(() => ChickType)
  @JoinColumn({ name: 'ref_chicktype_id', referencedColumnName: 'id' })
  chickType: ChickType;

  @OneToOne(() => Variable)
  @JoinColumn({ name: 'ref_variable_id', referencedColumnName: 'id' })
  variable: Variable;

  @OneToMany(() => TargetDaysD, (tdd) => tdd.target)
  @JoinColumn({ referencedColumnName: 'id' })
  targetDays: TargetDaysD[];

  @OneToOne(() => User)
  @JoinColumn({ name: 'modified_by' })
  userModifier: User | null;
}
