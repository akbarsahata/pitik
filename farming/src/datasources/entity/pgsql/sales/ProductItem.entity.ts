import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { ProductCategory } from './ProductCategory.entity';

@Entity({
  name: 'sales_product_item',
  schema: 'sales',
})
export class ProductItem {
  @PrimaryColumn({ name: 'id', type: 'varchar', length: 36 })
  id: string;

  @Column({ name: 'ref_category_id', type: 'varchar', length: 36 })
  categoryId: string;

  @Column({ name: 'product_name', type: 'varchar', length: 120 })
  name: string;

  @Column({ name: 'uom', type: 'varchar', length: 16, nullable: true })
  uom: string | null;

  @Column({ name: 'value', type: 'float4', nullable: true })
  value: number | null;

  @Column({ name: 'min_value', type: 'float4', nullable: true })
  minValue: number | null;

  @Column({ name: 'max_value', type: 'float4', nullable: true })
  maxValue: number | null;

  @OneToOne(() => ProductCategory)
  @JoinColumn({ name: 'ref_category_id', referencedColumnName: 'id' })
  category: ProductCategory;
}
