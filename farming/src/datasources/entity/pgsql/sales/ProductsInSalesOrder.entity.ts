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
import { ProductItem } from './ProductItem.entity';
import { SalesOrder } from './SalesOrder.entity';

export enum ProductsInSalesOrderCutType {
  BEKAKAK = 'BEKAKAK',
  REGULAR = 'REGULAR',
  UTUH = 'UTUH',
}

@Entity({ name: 'products_in_sales_order', schema: 'sales' })
export class ProductsInSalesOrder {
  @PrimaryColumn({ name: 'ref_product_item_id', type: 'varchar', length: 36 })
  productItemId: string;

  @PrimaryColumn({ name: 'ref_sales_order_id', type: 'varchar', length: 36 })
  salesOrderId: string;

  @PrimaryColumn({ name: 'number_of_cuts', type: 'int' })
  numberOfCuts: number;

  @Column({ name: 'cut_type', type: 'enum', enum: ProductsInSalesOrderCutType })
  cutType: ProductsInSalesOrderCutType;

  @Column({ name: 'quantity', type: 'float4' })
  quantity: number;

  @Column({ name: 'price', type: 'float4' })
  price: number;

  @Column({ name: 'weight', type: 'float4' })
  weight: number;

  @Column({ name: 'return_quantity', type: 'float4' })
  returnQuantity: number | null;

  @Column({ name: 'return_weight', type: 'float4' })
  returnWeight: number | null;

  @Column({ name: 'booked_weight', type: 'float4' })
  bookedWeight: number | null;

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

  @OneToOne(() => ProductItem)
  @JoinColumn({ name: 'ref_product_item_id', referencedColumnName: 'id' })
  productItem: ProductItem;
}
