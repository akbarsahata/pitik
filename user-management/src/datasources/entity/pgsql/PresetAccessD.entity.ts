import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Base } from './Base.entity';
import { PresetAccess } from './PresetAccess.entity';

@Entity('presetaccessd')
export class PresetAccessD extends Base {
  @Column({ name: 'ref_preset_id', type: 'uuid' })
  presetId: string;

  @Column({ name: 'ref_api_id', type: 'uuid' })
  apiId: string;

  @ManyToOne(() => PresetAccess, (presetAccess) => presetAccess.presetAccessD)
  @JoinColumn({ name: 'ref_preset_id' })
  presetAccess: PresetAccess;
}
