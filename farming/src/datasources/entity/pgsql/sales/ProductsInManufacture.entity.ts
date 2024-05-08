import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { Manufacture } from './Manufacture.entity';
import { ProductItem } from './ProductItem.entity';

/* eslint-disable no-unused-vars */
export enum ProductsInManufactureTypeEnum {
  IN = 'IN',
  OUT = 'OUT',
}

@Entity({ name: 'products_in_manufacture', schema: 'sales' })
export class ProductsInManufacture {
  @PrimaryColumn({ name: 'ref_sales_product_item_id', type: 'varchar', length: 36 })
  salesProductItemId: string;

  @PrimaryColumn({ name: 'ref_sales_manufacture_id', type: 'varchar', length: 36 })
  salesManufactureId: string;

  @Column({ name: 'type', type: 'enum', enum: ProductsInManufactureTypeEnum })
  type: ProductsInManufactureTypeEnum;

  @Column({ name: 'quantity', type: 'int' })
  quantity: number;

  @Column({ name: 'weight', type: 'float4' })
  weight: number;

  @Column({ name: 'city_based_price', type: 'float4', nullable: true })
  cityBasedPrice: number | null;

  @Column({ name: 'price', type: 'float4', nullable: true })
  price: number | null;

  @Column({ name: 'created_by', type: 'varchar', length: 50 })
  createdBy: string;

  @Column({ name: 'created_date', type: 'timestamp' })
  createdDate: Date;

  @Column({ name: 'modified_by', type: 'varchar', length: 50 })
  modifiedBy: string;

  @Column({ name: 'modified_date', type: 'timestamp' })
  modifiedDate: Date;

  @DeleteDateColumn({ name: 'deleted_date', type: 'timestamp', nullable: true })
  deletedDate: Date | null;

  @ManyToOne(() => Manufacture, (sm) => sm.salesProductsInManufacture)
  @JoinColumn({ name: 'ref_sales_manufacture_id', referencedColumnName: 'id' })
  salesManufacture: Manufacture;

  @OneToOne(() => ProductItem)
  @JoinColumn({ name: 'ref_sales_product_item_id', referencedColumnName: 'id' })
  salesProductItem: ProductItem;
}
