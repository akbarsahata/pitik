import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { CMSBase } from './Base.entity';
import { Target } from './Target.entity';

@Entity('t_targetdays_d')
export class TargetDaysD extends CMSBase {
  @Column({ name: 'ref_target_id', type: 'varchar', length: 32 })
  targetId: string;

  @Column({ name: 'day', type: 'int' })
  day: number;

  @Column({ name: 'min_value', type: 'float' })
  minValue: number;

  @Column({ name: 'max_value', type: 'float' })
  maxValue: number;

  @OneToOne(() => Target)
  @JoinColumn({ name: 'ref_target_id', referencedColumnName: 'id' })
  target: Target;
}
