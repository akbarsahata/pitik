import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { CMSBase } from './Base.entity';
import { HarvestRealization } from './HarvestRealization.entity';
import { HarvestRecordPhoto } from './HarvestRecordPhoto.entity';

@Entity('harvest_realization_record')
export class HarvestRealizationRecord extends CMSBase {
  @Column({ name: 'harvest_realization_id', type: 'varchar', length: 50 })
  harvestRealizationId: string;

  @Column({ name: 'weighing_number', type: 'varchar', length: 50 })
  weighingNumber: string;

  @Column({ name: 'tonnage', type: 'float' })
  tonnage: number;

  @Column({ name: 'average_weight', type: 'float' })
  averageWeight: number;

  @Column({ name: 'quantity', type: 'int' })
  quantity: number;

  @ManyToOne(() => HarvestRealization)
  @JoinColumn({ name: 'harvest_realization_id', referencedColumnName: 'id' })
  harvestRealization: HarvestRealization;

  @OneToOne(() => HarvestRecordPhoto)
  @JoinColumn({ name: 'id', referencedColumnName: 'harvestRecordId' })
  harvestRecordPhoto?: HarvestRecordPhoto;
}
