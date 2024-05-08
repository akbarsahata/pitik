import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, UpdateDateColumn } from 'typeorm';
import { B2BSmartScaleWeighing } from './B2BSmartScaleWeighings.entity';

@Entity({
  name: 'b2b_smart_scale_weighing_data',
  schema: 'b2b',
})
export class B2BSmartScaleWeighingData {
  @Column({ primary: true, generated: 'uuid' })
  id: string;

  @Column({ name: 'ref_weighing_id', type: 'uuid' })
  weighingId: string;

  @Column({ name: 'count', type: 'int' })
  count: number;

  @Column({ name: 'weight', type: 'decimal' })
  weight: number;

  @CreateDateColumn({ name: 'created_date', type: 'timestamp' })
  createdDate: Date;

  @UpdateDateColumn({ name: 'modified_date', type: 'timestamp' })
  modifiedDate: Date;

  @Column({ name: 'created_by', type: 'varchar', length: 50 })
  createdBy: string;

  @Column({ name: 'modified_by', type: 'varchar', length: 50 })
  modifiedBy: string;

  @ManyToOne(() => B2BSmartScaleWeighing, (w) => w.b2bDataInSmartScaleWeighing)
  @JoinColumn({ name: 'ref_weighing_id', referencedColumnName: 'id' })
  weighing: B2BSmartScaleWeighing;
}
