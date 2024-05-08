/* eslint-disable no-unused-vars */
import { Column, DeleteDateColumn, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { SalesOrder } from './SalesOrder.entity';

export enum STOCK_STATUS {
  RESERVED = 'RESERVED',
  CANCELLED = 'CANCELLED',
  FINAL = 'FINAL',
}

export enum STOCK_OPERATOR {
  PLUS = '+',
  MINUS = '-',
}

@Entity({
  name: 'operation_unit_stock',
  schema: 'sales',
})
export class OperationUnitStock {
  @PrimaryColumn({ name: 'id', type: 'varchar', length: 36 })
  id: string;

  @Column({ name: 'ref_operation_unit_id', type: 'varchar', length: 36 })
  operationUnitId: string;

  @Column({ name: 'ref_product_item_id', type: 'varchar', length: 36 })
  productItemId: string;

  @Column({ name: 'ref_goods_received_id', type: 'varchar', length: 36 })
  goodsReceivedId: string | null;

  @Column({ name: 'ref_stock_disposal_id', type: 'varchar', length: 36 })
  stockDisposalId: string | null;

  @Column({ name: 'ref_internal_transfer_id', type: 'varchar', length: 36 })
  internalTransferId: string | null;

  @Column({ name: 'ref_sales_order_id', type: 'varchar', length: 36 })
  salesOrderId: string | null;

  @Column({ name: 'ref_manufacturing_id', type: 'varchar', length: 36 })
  manufacturingId: string | null;

  @Column({ name: 'ref_opname_id', type: 'varchar', length: 36 })
  opnameId: string | null;

  @Column({ name: 'ref_parent_id', type: 'varchar', length: 36 })
  parentId: string | null;

  @Column({ name: 'quantity', type: 'int' })
  quantity: number;

  @Column({ name: 'weight', type: 'float4' })
  weight: number;

  @Column({ name: 'city_based_price', type: 'float4', nullable: true })
  cityBasedPrice: number | null;

  @Column({ name: 'price', type: 'float4', nullable: true })
  price: number | null;

  @Column({ name: 'available_quantity', type: 'int' })
  availableQuantity: number;

  @Column({ name: 'available_weight', type: 'float4' })
  availableWeight: number;

  @Column({ name: 'operator', type: 'varchar' })
  operator: STOCK_OPERATOR;

  @Column({ name: 'status', type: 'varchar', length: 36 })
  status: STOCK_STATUS;

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

  @OneToOne(() => SalesOrder)
  @JoinColumn({ name: 'ref_sales_order_id', referencedColumnName: 'id' })
  salesOrder: SalesOrder | null;
}
