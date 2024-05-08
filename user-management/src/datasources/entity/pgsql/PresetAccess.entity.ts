import { Column, Entity, JoinColumn, OneToMany } from 'typeorm';
import { PRESET_TYPE_ENUM } from '../../../libs/enums';
import { Base } from './Base.entity';
import { PresetAccessD } from './PresetAccessD.entity';

@Entity('presetaccess')
export class PresetAccess extends Base {
  @Column({ name: 'preset_name', type: 'varchar', length: 255 })
  presetName: string;

  @Column({ name: 'preset_type', type: 'enum', enum: ['ROLE', 'PRIVILEGE'] })
  presetType: keyof typeof PRESET_TYPE_ENUM;

  @OneToMany(() => PresetAccessD, (presetAccessD) => presetAccessD.presetAccess)
  @JoinColumn({ referencedColumnName: 'id' })
  presetAccessD: PresetAccessD[];
}
