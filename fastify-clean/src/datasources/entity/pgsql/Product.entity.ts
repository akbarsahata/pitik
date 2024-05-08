/* eslint-disable no-unused-vars */
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ProductCategoryCodeEnum } from '../elasticsearch/Product.entity';

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'category_code', type: 'varchar' })
  categoryCode: keyof typeof ProductCategoryCodeEnum;

  @Column({ name: 'category_name', type: 'varchar' })
  categoryName: string;

  @Column({ name: 'subcategory_code', type: 'varchar' })
  subcategoryCode: string;

  @Column({ name: 'subcategory_name', type: 'varchar' })
  subcategoryName: string;

  @Column({ name: 'product_code', type: 'varchar' })
  productCode: string;

  @Column({ name: 'product_name', type: 'varchar' })
  productName: string;

  @Column({ name: 'uom', type: 'varchar' })
  uom: string;

  @Column({ name: 'purchase_uom', type: 'varchar' })
  purchaseUOM: string;

  @Column({ name: 'purchase_multiply', type: 'varchar' })
  purchaseMultiply: number;

  @Column({ name: 'is_active', type: 'varchar' })
  isActive: boolean;

  @Column({ name: 'order', type: 'varchar' })
  order: number;
}
