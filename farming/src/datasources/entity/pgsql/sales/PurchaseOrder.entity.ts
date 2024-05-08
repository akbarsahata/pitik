import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { User } from '../User.entity';
import { GoodsReceived } from './GoodsReceived.entity';
import { OperationUnit } from './OperationUnit.entity';
import { ProductsInPurchaseOrder } from './ProductsInPurchaseOrder.entity';
import { Vendor } from './Vendor.entity';

/* eslint-disable no-unused-vars */
export enum PurchaseOrderStatusEnum {
  DRAFT = 'DRAFT',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  RECEIVED = 'RECEIVED',
}

export enum PurchaseOrderSourceEnum {
  VENDOR = 'VENDOR',
  JAGAL = 'JAGAL',
}

@Entity({ name: 'purchase_order', schema: 'sales' })
export class PurchaseOrder {
  @Column({ primary: true, type: 'varchar', length: 36 })
  id: string;

  @Column({ name: 'ref_sales_operation_unit_id', type: 'varchar', length: 36 })
  salesOperationUnitId: string;

  @Column({ name: 'ref_sales_jagal_id', type: 'varchar', length: 36, nullable: true })
  salesJagalId: string | null;

  @Column({ name: 'ref_sales_vendor_id', type: 'varchar', length: 36, nullable: true })
  salesVendorId: string | null;

  @Column({ name: 'status', type: 'enum', enum: PurchaseOrderStatusEnum })
  status: PurchaseOrderStatusEnum;

  @Column({ name: 'total_weight', type: 'decimal', nullable: true })
  totalWeight: number | null;

  @Column({ name: 'created_by', type: 'varchar', length: 50 })
  createdBy: string;

  @Column({ name: 'created_date', type: 'timestamp' })
  createdDate: Date;

  @Column({ name: 'modified_by', type: 'varchar', length: 50 })
  modifiedBy: string;

  @Column({ name: 'modified_date', type: 'timestamp' })
  modifiedDate: Date;

  @Column({ name: 'lb_total_quantity', type: 'int4' })
  lbTotalQuantity: number | null;

  @Column({ name: 'lb_total_weight', type: 'float4' })
  lbTotalWeight: number | null;

  @Column({ name: 'lb_available_quantity', type: 'int4' })
  lbAvailableQuantity: number | null;

  @Column({ name: 'lb_available_weight', type: 'float4' })
  lbAvailableWeight: number | null;

  @Column({ name: 'lb_reserved_quantity', type: 'int4' })
  lbReservedQuantity: number | null;

  @Column({ name: 'lb_reserved_weight', type: 'float4' })
  lbReservedWeight: number | null;

  @Column({ name: 'remarks', type: 'text', nullable: true })
  remarks: string | null;

  @OneToOne(() => Vendor)
  @JoinColumn({ name: 'ref_sales_vendor_id', referencedColumnName: 'id' })
  salesVendor: Vendor | null;

  @OneToOne(() => OperationUnit)
  @JoinColumn({ name: 'ref_sales_operation_unit_id', referencedColumnName: 'id' })
  salesOperationUnit: OperationUnit;

  @OneToOne(() => OperationUnit)
  @JoinColumn({ name: 'ref_sales_jagal_id', referencedColumnName: 'id' })
  salesJagal: OperationUnit | null;

  @OneToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  userCreator: User | null;

  @OneToOne(() => User)
  @JoinColumn({ name: 'modified_by' })
  userModifier: User | null;

  @OneToMany(() => ProductsInPurchaseOrder, (spipo) => spipo.salesPurchaseOrder)
  @JoinColumn({ referencedColumnName: 'id' })
  salesProductsInPurchaseOrder: ProductsInPurchaseOrder[];

  @OneToMany(() => GoodsReceived, (gr) => gr.salesPurchaseOrder)
  @JoinColumn({ referencedColumnName: 'id' })
  goodsReceived: GoodsReceived[];
}
