import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { FarmingCycle } from './FarmingCycle.entity';
import { FarmingCycleFeedStockAdjustment } from './FarmingCycleFeedStockAdjustment.entity';

@Entity('farmingcycle_ovkstock_summary')
export class FarmingCycleOvkStockSummary {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'farmingcycle_id', type: 'varchar' })
  farmingCycleId: string;

  @Column({ name: 'subcategory_code', type: 'varchar' })
  subcategoryCode: string;

  @Column({ name: 'subcategory_name', type: 'varchar' })
  subcategoryName: string;

  @Column({ name: 'product_code', type: 'varchar' })
  productCode: string;

  @Column({ name: 'product_name', type: 'varchar' })
  productName: string;

  @Column({ name: 'remaining_quantity', type: 'float4' })
  remainingQuantity: number;

  @Column({ name: 'booked_quantity', type: 'float4' })
  bookedQuantity: number;

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

  @OneToMany(() => FarmingCycleFeedStockAdjustment, (ffa) => ffa.feedStockSummary)
  @JoinColumn({ referencedColumnName: 'id' })
  feedstockAdjustments: FarmingCycleFeedStockAdjustment[];

  purchaseUom: string;
}
