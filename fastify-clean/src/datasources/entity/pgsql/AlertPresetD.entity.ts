import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { Alert } from './Alert.entity';
import { AlertPreset } from './AlertPreset.entity';
import { CMSBase } from './Base.entity';

@Entity('t_alertpreset_d')
export class AlertPresetD extends CMSBase {
  @Column({ name: 'ref_alertpreset_id', type: 'varchar', length: 32 })
  alertPresetId: string;

  @Column({ name: 'ref_alert_id', type: 'varchar', length: 32 })
  alertId: string;

  @ManyToOne(() => AlertPreset, (ap) => ap.alerts)
  @JoinColumn({ name: 'ref_alertpreset_id', referencedColumnName: 'id' })
  alertPreset: AlertPreset;

  @OneToOne(() => Alert)
  @JoinColumn({ name: 'ref_alert_id', referencedColumnName: 'id' })
  alert: Alert;
}
