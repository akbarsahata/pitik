/* eslint-disable no-unused-vars */
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { FarmingCycle } from './FarmingCycle.entity';
import { FarmingCycleFeedStockSummary } from './FarmingCycleFeedStockSummary.entity';

export enum FeedStockAdjustmentTypeEnum {
  Penambahan = 'Penambahan',
  Pengurangan = 'Pengurangan',
}

@Entity('farmingcycle_feedstock_adjustment')
export class FarmingCycleFeedStockAdjustment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'farmingcycle_feedstock_summary_id', type: 'varchar' })
  feedStockSummaryId: string;

  @Column({ name: 'farmingcycle_id', type: 'varchar' })
  farmingCycleId: string;

  @Column({ name: 'adjustment_quantity', type: 'float8' })
  adjustmentQuantity: number;

  @Column({ name: 'type', type: 'text' })
  type: keyof typeof FeedStockAdjustmentTypeEnum;

  @Column({ name: 'remarks', type: 'text' })
  remarks: string;

  @Column({ name: 'uom', type: 'varchar' })
  uom: string;

  @Column({ name: 'created_by', type: 'varchar', length: 50 })
  createdBy: string;

  @Column({ name: 'created_date', type: 'timestamp' })
  createdDate: Date;

  @Column({ name: 'modified_by', type: 'varchar', length: 50 })
  modifiedBy: string;

  @Column({ name: 'modified_date', type: 'timestamp' })
  modifiedDate: Date;

  @OneToOne(() => FarmingCycle)
  @JoinColumn({ name: 'farmingcycle_id', referencedColumnName: 'id' })
  farmingCycle: FarmingCycle;

  @OneToOne(() => FarmingCycleFeedStockSummary)
  @JoinColumn({ name: 'farmingcycle_feedstock_summary_id', referencedColumnName: 'id' })
  feedStockSummary: FarmingCycleFeedStockSummary;
}
