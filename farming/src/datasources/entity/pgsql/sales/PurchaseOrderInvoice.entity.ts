import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { User } from '../User.entity';
import { ProductsInPurchaseOrderInvoice } from './ProductsInPurchaseOrderInvoice.entity';
import { PurchaseOrder } from './PurchaseOrder.entity';

/* eslint-disable no-unused-vars */
export enum InvoiceStatusEnum {
  DRAFT = 'DRAFT',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
}

@Entity({ name: 'purchase_order_invoice', schema: 'sales' })
export class PurchaseOrderInvoice {
  @Column({ primary: true, type: 'varchar', length: 36 })
  id: string;

  @Column({ name: 'status', type: 'enum', enum: InvoiceStatusEnum })
  status: InvoiceStatusEnum;

  @Column({ name: 'date', type: 'date' })
  date: Date;

  @Column({ name: 'ref_sales_purchase_order_id', type: 'varchar', length: 36 })
  salesPurchaseOrderId: string;

  @OneToOne(() => PurchaseOrder)
  @JoinColumn({ name: 'ref_sales_purchase_order_id', referencedColumnName: 'id' })
  salesPurchaseOrder: PurchaseOrder;

  @Column({ name: 'created_by', type: 'varchar', length: 50 })
  createdBy: string;

  @Column({ name: 'created_date', type: 'timestamp' })
  createdDate: Date;

  @Column({ name: 'modified_by', type: 'varchar', length: 50 })
  modifiedBy: string;

  @Column({ name: 'modified_date', type: 'timestamp' })
  modifiedDate: Date;

  @OneToMany(() => ProductsInPurchaseOrderInvoice, (spipoi) => spipoi.salesPurchaseOrderInvoice)
  @JoinColumn({ referencedColumnName: 'id' })
  salesProductsInPurchaseOrderInvoice: ProductsInPurchaseOrderInvoice[];

  @ManyToOne(() => User)
  @JoinColumn({ name: 'modified_by', referencedColumnName: 'id' })
  userModifier: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by', referencedColumnName: 'id' })
  userCreator: User;
}
