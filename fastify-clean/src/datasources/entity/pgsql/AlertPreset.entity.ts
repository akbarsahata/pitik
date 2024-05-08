import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { BoolSmallIntTransformer } from '../../../libs/utils/transformers';
import { AlertPresetD } from './AlertPresetD.entity';
import { CMSBase } from './Base.entity';
import { ChickType } from './ChickType.entity';
import { CoopType } from './CoopType.entity';
import { User } from './User.entity';

@Entity('t_alertpreset')
export class AlertPreset extends CMSBase {
  @Column({ name: 'alertpreset_code', type: 'varchar', length: 50 })
  alertPresetCode: string;

  @Column({ name: 'alertpreset_name', type: 'text' })
  alertPresetName: string;

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

  @OneToOne(() => ChickType)
  @JoinColumn({ name: 'ref_chicktype_id', referencedColumnName: 'id' })
  chickType: ChickType;

  @OneToMany(() => AlertPresetD, (apd) => apd.alertPreset)
  @JoinColumn({ referencedColumnName: 'id' })
  alerts: AlertPresetD[];

  @OneToOne(() => User)
  @JoinColumn({ name: 'modified_by' })
  userModifier: User | null;
}
