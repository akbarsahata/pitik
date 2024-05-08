/* eslint-disable no-unused-vars */
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { FarmingCycle } from './FarmingCycle.entity';
import { FarmingCycleOvkStockSummary } from './FarmingCycleOvkStockSummary.entity';

export enum OvkStockAdjustmentTypeEnum {
  Penambahan = 'Penambahan',
  Pengurangan = 'Pengurangan',
}

@Entity('farmingcycle_ovkstock_adjustment')
export class FarmingCycleOvkStockAdjustment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'farmingcycle_ovkstock_summary_id', type: 'varchar' })
  ovkStockSummaryId: string;

  @Column({ name: 'farmingcycle_id', type: 'varchar' })
  farmingCycleId: string;

  @Column({ name: 'adjustment_quantity', type: 'float8' })
  adjustmentQuantity: number;

  @Column({ name: 'type', type: 'text' })
  type: keyof typeof OvkStockAdjustmentTypeEnum;

  @Column({ name: 'remarks', type: 'text' })
  remarks: string;

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

  @OneToOne(() => FarmingCycleOvkStockSummary)
  @JoinColumn({ name: 'farmingcycle_ovkstock_summary_id', referencedColumnName: 'id' })
  ovkStockSummary: FarmingCycleOvkStockSummary;
}
