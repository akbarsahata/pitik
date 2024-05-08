import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { ProductCategory } from './ProductCategory.entity';

@Entity({
  name: 'manufacture_output_preset',
  schema: 'sales',
})
export class ManufactureOutputPreset {
  @PrimaryColumn({ name: 'id', type: 'varchar', length: 36 })
  id: string;

  @Column({ name: 'ref_product_category_input_id', type: 'varchar', length: 36 })
  salesProductCategoryInputId: string;

  @Column('text', { name: 'ref_product_category_ouput_ids', array: true, default: {} })
  salesProductCategoryOutputIds: string[];

  @OneToOne(() => ProductCategory)
  @JoinColumn({ name: 'ref_product_category_input_id' })
  salesProductCategoryInput: ProductCategory;
}
