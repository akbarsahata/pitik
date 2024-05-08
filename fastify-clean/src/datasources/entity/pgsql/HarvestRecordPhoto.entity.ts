import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { HarvestRealizationRecord } from './HarvestRealizationRecord.entity';

@Entity('harvest_record_photo')
export class HarvestRecordPhoto {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  id: string;

  @Column({ name: 'harvest_record_id', type: 'varchar', length: 50 })
  harvestRecordId: string;

  @Column({ name: 'image_url', type: 'varchar' })
  imageUrl: string;

  @OneToOne(() => HarvestRealizationRecord)
  @JoinColumn({ name: 'harvest_record_id', referencedColumnName: 'id' })
  harvestRecord: HarvestRealizationRecord;
}
