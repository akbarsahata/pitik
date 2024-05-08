import { Column, Entity, JoinColumn, OneToMany, PrimaryColumn } from 'typeorm';
import { ProductItem } from './ProductItem.entity';

/* eslint-disable no-unused-vars */
export enum ProductCategoryCodeEnum {
  FEET = 'CK',
  LIVE_BIRD = 'LB',
  AYAM_UTUH = 'AU',
  CARCASS = 'CR',
  HEAD = 'HD',
  INNARDS = 'IN',
  BRANKAS = 'BR',
}

@Entity({
  name: 'sales_product_category',
  schema: 'sales',
})
export class ProductCategory {
  @PrimaryColumn({ name: 'id', type: 'varchar', length: 36 })
  id: string;

  @Column({ name: 'name', type: 'varchar', length: 120 })
  name: string;

  @Column({ name: 'code', type: 'enum', enum: ProductCategoryCodeEnum })
  code: ProductCategoryCodeEnum;

  @Column({ name: 'ratio', type: 'double precision' })
  ratio: number;

  @Column({ name: 'quantity_uom', type: 'varchar' })
  quantityUOM: string | null;

  @Column({ name: 'weight_uom', type: 'varchar' })
  weightUOM: string | null;

  @Column({ name: 'is_manufacturable', type: 'boolean' })
  isManufacturable: boolean;

  @Column({ name: 'is_active', type: 'boolean' })
  isActive: boolean;

  @OneToMany(() => ProductItem, (p) => p.category)
  @JoinColumn({ referencedColumnName: 'id' })
  items: ProductItem[];
}
