/* eslint-disable no-unused-vars */
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { ProductCategory } from './ProductCategory.entity';
import { SalesOrder } from './SalesOrder.entity';

export enum ProductNotesInSalesOrderCutType {
  BEKAKAK = 'BEKAKAK',
  REGULAR = 'REGULAR',
  UTUH = 'UTUH',
}

@Entity({ name: 'product_notes_in_sales_order', schema: 'sales' })
export class ProductNotesInSalesOrder {
  @PrimaryColumn({ name: 'ref_product_category_id', type: 'varchar', length: 36 })
  productCategoryId: string;

  @PrimaryColumn({ name: 'ref_sales_order_id', type: 'varchar', length: 36 })
  salesOrderId: string;

  @Column({ name: 'cut_type', type: 'enum', enum: ProductNotesInSalesOrderCutType })
  cutType: ProductNotesInSalesOrderCutType;

  @Column({ name: 'number_of_cuts', type: 'int' })
  numberOfCuts: number;

  @Column({ name: 'quantity', type: 'float4' })
  quantity: number;

  @Column({ name: 'weight', type: 'float4' })
  weight: number;

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

  @ManyToOne(() => SalesOrder, (so) => so.products)
  @JoinColumn({ name: 'ref_sales_order_id', referencedColumnName: 'id' })
  salesOrder: SalesOrder;

  @OneToOne(() => ProductCategory)
  @JoinColumn({ name: 'ref_product_category_id', referencedColumnName: 'id' })
  productcategory: ProductCategory;
}
