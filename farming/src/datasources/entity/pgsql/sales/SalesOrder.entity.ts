/* eslint-disable no-unused-vars */
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';
import { User } from '../User.entity';
import { SalesCustomer } from './Customer.entity';
import { GoodsReceived } from './GoodsReceived.entity';
import { OperationUnit } from './OperationUnit.entity';
import { OperationUnitStock } from './OperationUnitStock.entity';
import { ProductNotesInSalesOrder } from './ProductNotesInSalesOrder.entity';
import { ProductsInSalesOrder } from './ProductsInSalesOrder.entity';

export enum SalesOrderStatusEnum {
  DRAFT = 'DRAFT',
  CONFIRMED = 'CONFIRMED',
  ALLOCATED = 'ALLOCATED',
  CANCELLED = 'CANCELLED',
  BOOKED = 'BOOKED', // booking stock from operation unit
  READY_TO_DELIVER = 'READY_TO_DELIVER', // driver is assigned, ready to deliver product to customer.
  ON_DELIVERY = 'ON_DELIVERY',
  DELIVERED = 'DELIVERED',
  REJECTED = 'REJECTED',
}

export enum SalesOrderGrStatusEnum {
  NONE = 'NONE',
  REJECTED = 'REJECTED',
  RECEIVED = 'RECEIVED',
}

export enum SalesOrderReturnStatusEnum {
  PARTIAL = 'PARTIAL',
  FULL = 'FULL',
}

export enum SalesOrderPaymentMethod {
  CASH = 'CASH',
  TRANSFER = 'TRANSFER',
}

export enum SalesOrderType {
  LB = 'LB',
  NON_LB = 'NON_LB',
}

export enum SalesOrderCategory {
  INBOUND = 'INBOUND',
  OUTBOUND = 'OUTBOUND',
}

@Entity({ name: 'sales_order', schema: 'sales' })
export class SalesOrder {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  id: string;

  @Column({ name: 'ref_customer_id', type: 'varchar', length: 36, nullable: true })
  customerId: string | null;

  @Column({ name: 'ref_salesperson_id', type: 'varchar', length: 36 })
  salespersonId: string;

  @Column({ name: 'ref_driver_id', type: 'varchar', length: 36 })
  driverId: string | null;

  @Column({ name: 'ref_operation_unit_id', type: 'varchar', length: 36, nullable: true })
  operationUnitId: string | null;

  @Column({ name: 'type', type: 'varchar', length: 10 })
  type: SalesOrderType;

  @Column({ name: 'category', type: 'enum', enum: SalesOrderCategory })
  category: SalesOrderCategory;

  @Column({ name: 'customer_name', type: 'varchar', length: 256, nullable: true })
  customerName: string | null;

  @Column({ name: 'remarks', type: 'text', nullable: true })
  remarks: string | null;

  @Column({ name: 'delivery_time', type: 'timestamp', nullable: true })
  deliveryTime: Date | null;

  @Column({ name: 'driver_remarks', type: 'text', nullable: true })
  driverRemarks: string | null;

  @Column({ name: 'status', type: 'enum', enum: SalesOrderStatusEnum })
  status: SalesOrderStatusEnum;

  @Column({ name: 'gr_status', type: 'enum', enum: SalesOrderGrStatusEnum })
  grStatus: SalesOrderGrStatusEnum;

  @Column({ name: 'return_status', type: 'varchar', nullable: true })
  returnStatus: SalesOrderReturnStatusEnum | null;

  @Column({ name: 'total_weight', type: 'float4' })
  totalWeight: number;

  @Column({ name: 'total_quantity', type: 'float4' })
  totalQuantity: number;

  @Column({ name: 'total_price', type: 'float4' })
  totalPrice: number;

  @Column({ name: 'delivery_fee', type: 'float4' })
  deliveryFee: number;

  @Column({ name: 'payment_method', type: 'varchar', length: 36 })
  paymentMethod: SalesOrderPaymentMethod | null;

  @Column({ name: 'payment_amount', type: 'float4' })
  paymentAmount: number | null;

  @Column({ name: 'return_reason', type: 'varchar' })
  returnReason: string | null;

  @Column({ name: 'created_by', type: 'varchar', length: 50 })
  createdBy: string;

  @Column({ name: 'created_date', type: 'timestamp' })
  createdDate: Date;

  @Column({ name: 'modified_by', type: 'varchar', length: 50 })
  modifiedBy: string;

  @Column({ name: 'modified_date', type: 'timestamp' })
  modifiedDate: Date;

  @Column({ name: 'latitude', type: 'numeric', nullable: true })
  latitude: number | null;

  @Column({ name: 'longitude', type: 'numeric', nullable: true })
  longitude: number | null;

  @Column({ name: 'check_in_distance', type: 'numeric', nullable: true })
  checkInDistance: number | null;

  @OneToOne(() => SalesCustomer)
  @JoinColumn({ name: 'ref_customer_id', referencedColumnName: 'id' })
  customer: SalesCustomer;

  @OneToOne(() => User)
  @JoinColumn({ name: 'ref_salesperson_id', referencedColumnName: 'id' })
  salesperson: User;

  @OneToOne(() => User)
  @JoinColumn({ name: 'ref_driver_id', referencedColumnName: 'id' })
  driver: User | null;

  @OneToOne(() => OperationUnit)
  @JoinColumn({ name: 'ref_operation_unit_id', referencedColumnName: 'id' })
  operationUnit: OperationUnit;

  @OneToMany(() => ProductsInSalesOrder, (piso) => piso.salesOrder)
  @JoinColumn({ referencedColumnName: 'id' })
  products: ProductsInSalesOrder[];

  @OneToMany(() => ProductNotesInSalesOrder, (pniso) => pniso.salesOrder)
  @JoinColumn({ referencedColumnName: 'id' })
  productNotes: ProductNotesInSalesOrder[];

  @OneToMany(() => GoodsReceived, (gr) => gr.salesOrder)
  @JoinColumn({ referencedColumnName: 'id' })
  goodsReceived: GoodsReceived[];

  @OneToOne(() => User)
  @JoinColumn({ name: 'modified_by', referencedColumnName: 'id' })
  userModifier: User;

  @OneToOne(() => User)
  @JoinColumn({ name: 'created_by', referencedColumnName: 'id' })
  userCreator: User;

  @OneToMany(() => OperationUnitStock, (ous) => ous.salesOrder)
  @JoinColumn({ referencedColumnName: 'ref_sales_order_id' })
  operationUnitStocks: OperationUnitStock[];
}
