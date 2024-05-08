/* eslint-disable no-unused-vars */
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { User } from '../User.entity';
import { InternalTransfer } from './InternalTransfer.entity';
import { Manufacture } from './Manufacture.entity';
import { OperationUnit } from './OperationUnit.entity';
import { ProductsInGoodsReceived } from './ProductsInGoodsReceived.entity';
import { PurchaseOrder } from './PurchaseOrder.entity';
import { SalesOrder } from './SalesOrder.entity';

export enum GR_TYPE {
  PURCHASE_ORDER = 'PURCHASE_ORDER',
  SALES_ORDER = 'SALES_ORDER',
  INTERNAL_TRANSFER = 'INTERNAL_TRANSFER',
}

export enum GR_STATUS {
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
}

@Entity({ name: 'goods_received', schema: 'sales' })
export class GoodsReceived {
  @Column({ primary: true, type: 'varchar', length: 36 })
  id: string;

  @Column({ name: 'total_weight', type: 'decimal', nullable: true })
  totalWeight: number | null;

  @Column({ name: 'ref_operation_unit_id', type: 'varchar', length: 36 })
  operationUnitId: string;

  @OneToOne(() => OperationUnit)
  @JoinColumn({ name: 'ref_operation_unit_id', referencedColumnName: 'id' })
  operationUnit: OperationUnit;

  @Column({ nullable: true, name: 'ref_sales_purchase_order_id', type: 'varchar', length: 36 })
  salesPurchaseOrderId: string | null;

  @OneToOne(() => PurchaseOrder)
  @JoinColumn({ name: 'ref_sales_purchase_order_id', referencedColumnName: 'id' })
  salesPurchaseOrder: PurchaseOrder | null;

  @Column({ nullable: true, name: 'ref_sales_internal_transfer_id', type: 'varchar', length: 36 })
  salesInternalTransferId: string | null;

  @OneToOne(() => InternalTransfer)
  @JoinColumn({ name: 'ref_sales_internal_transfer_id', referencedColumnName: 'id' })
  salesInternalTransfer: InternalTransfer;

  @Column({ nullable: true, name: 'ref_sales_manufacturing_id', type: 'varchar', length: 36 })
  salesManufacturingId: string | null;

  @OneToOne(() => Manufacture)
  @JoinColumn({ name: 'ref_sales_manufacturing_id', referencedColumnName: 'id' })
  salesManufacturing: Manufacture;

  @Column({ nullable: true, name: 'ref_sales_order_id', type: 'varchar', length: 36 })
  salesOrderId: string | null;

  @OneToOne(() => SalesOrder)
  @JoinColumn({ name: 'ref_sales_order_id', referencedColumnName: 'id' })
  salesOrder: SalesOrder;

  @Column({ name: 'status', type: 'varchar', length: 10, default: GR_STATUS.CONFIRMED })
  status: GR_STATUS;

  @Column({ name: 'remarks', type: 'text', nullable: true })
  remarks: string | null;

  @Column({ name: 'created_by', type: 'varchar', length: 50 })
  createdBy: string;

  @Column({ name: 'created_date', type: 'timestamp' })
  createdDate: Date;

  @Column({ name: 'modified_by', type: 'varchar', length: 50 })
  modifiedBy: string;

  @Column({ name: 'modified_date', type: 'timestamp' })
  modifiedDate: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'modified_by', referencedColumnName: 'id' })
  userModifier: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by', referencedColumnName: 'id' })
  userCreator: User;

  @OneToMany(() => ProductsInGoodsReceived, (spigr) => spigr.salesGoodsReceived)
  @JoinColumn({ referencedColumnName: 'id' })
  salesProductsInGoodsReceived: ProductsInGoodsReceived[];
}
