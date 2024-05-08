import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { ProductItem } from '../sales/ProductItem.entity';
import { HarvestEgg } from './HarvestEgg.entity';

@Entity({
  name: 'product_in_harvest_egg',
  schema: 'layer',
})
export class ProductInHarvestEgg {
  @PrimaryColumn({ name: 'id', type: 'varchar', length: 36 })
  id: string;

  @Column({ name: 'harvest_egg_id', type: 'varchar', length: 36 })
  harvestEggId: string;

  @Column({ name: 'product_item_id', type: 'varchar', length: 32 })
  productItemId: string;

  @Column({ name: 'quantity', type: 'int' })
  quantity: number;

  @Column({ name: 'weight', type: 'float4' })
  weight: number;

  @Column({ name: 'created_by', type: 'varchar', length: 32 })
  createdBy: string;

  @Column({ name: 'created_date', type: 'timestamp' })
  createdDate: Date;

  @Column({ name: 'modified_by', type: 'varchar', length: 32 })
  modifiedBy: string;

  @Column({ name: 'modified_date', type: 'timestamp' })
  modifiedDate: Date;

  @DeleteDateColumn({ name: 'deleted_date', type: 'timestamp' })
  deletedDate: Date | null;

  @ManyToOne(() => HarvestEgg, (h) => h.productInHarvestEgg)
  @JoinColumn({ name: 'harvest_egg_id' })
  harvest: HarvestEgg;

  @OneToOne(() => ProductItem)
  @JoinColumn({ name: 'product_item_id', referencedColumnName: 'id' })
  productItem: ProductItem;
}
