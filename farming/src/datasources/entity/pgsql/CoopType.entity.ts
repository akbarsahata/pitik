import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BoolSmallIntTransformer } from '../../../libs/utils/transformers';
import { CMSBase } from './Base.entity';
import { User } from './User.entity';

@Entity('t_cooptype')
export class CoopType extends CMSBase {
  @Column({ name: 'cooptype_code', type: 'varchar', length: 50 })
  coopTypeCode: string;

  @Column({ name: 'cooptype_name', type: 'varchar', length: 50 })
  coopTypeName: string;

  @Column({ name: 'status', type: 'smallint', transformer: new BoolSmallIntTransformer() })
  status: boolean;

  @Column({ name: 'remarks', type: 'text' })
  remarks: string;

  @Column({ name: 'avg_body_weight_target', type: 'float' })
  avgBodyWeightTarget: number;

  @Column({ name: 'mortality_target', type: 'float' })
  mortalityTarget: number;

  @Column({ name: 'chickfeed_consumption_target', type: 'float' })
  chickFeedConsumptionTarget: number;

  @OneToOne(() => User)
  @JoinColumn({ name: 'modified_by' })
  userModifier: User | null;
}
