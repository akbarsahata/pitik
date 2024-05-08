import { Column, Entity, JoinColumn, OneToMany, PrimaryColumn } from 'typeorm';
import { ProductInHarvestEgg } from './ProductInHarvestEgg.entity';

@Entity({
  name: 'harvest_egg',
  schema: 'layer',
})
export class HarvestEgg {
  @PrimaryColumn({ name: 'id', type: 'varchar', length: 36 })
  id: string;

  @Column({ name: 'farmingcycle_id', type: 'varchar', length: 32 })
  farmingCycleId: string;

  @Column({ name: 'date', type: 'timestamp' })
  date: Date;

  @Column({ name: 'total_quantity', type: 'int' })
  totalQuantity: number;

  @Column({ name: 'total_weight', type: 'float4' })
  totalWeight: number;

  @Column({ name: 'is_abnormal', type: 'boolean' })
  isAbnormal: boolean;

  @Column({ name: 'disposal', type: 'float4' })
  disposal: number;

  @Column({ name: 'created_by', type: 'varchar', length: 32 })
  createdBy: string;

  @Column({ name: 'created_date', type: 'timestamp' })
  createdDate: Date;

  @Column({ name: 'modified_by', type: 'varchar', length: 32 })
  modifiedBy: string;

  @Column({ name: 'modified_date', type: 'timestamp' })
  modifiedDate: Date;

  @OneToMany(() => ProductInHarvestEgg, (p) => p.harvest)
  @JoinColumn({ name: 'id', referencedColumnName: 'harvest_egg_id' })
  productInHarvestEgg: ProductInHarvestEgg[];
}
