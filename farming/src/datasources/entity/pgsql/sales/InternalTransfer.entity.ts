/* eslint-disable no-unused-vars */
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { User } from '../User.entity';
import { GoodsReceived } from './GoodsReceived.entity';
import { OperationUnit } from './OperationUnit.entity';
import { ProductsInInternalTransfer } from './ProductsInInternalTransfer.entity';

export enum InternalTransferStatusEnum {
  DRAFT = 'DRAFT',
  CONFIRMED = 'CONFIRMED',
  BOOKED = 'BOOKED',
  READY_TO_DELIVER = 'READY_TO_DELIVER',
  ON_DELIVERY = 'ON_DELIVERY',
  DELIVERED = 'DELIVERED',
  RECEIVED = 'RECEIVED',
  CANCELLED = 'CANCELLED',
}

@Entity({ name: 'internal_transfer', schema: 'sales' })
export class InternalTransfer {
  @Column({ primary: true, type: 'varchar', length: 36 })
  id: string;

  @Column({ name: 'ref_target_operation_unit_id', type: 'varchar', length: 36 })
  targetOperationUnitId: string;

  @Column({ name: 'ref_source_operation_unit_id', type: 'varchar', length: 36 })
  sourceOperationUnitId: string;

  @Column({
    name: 'status',
    type: 'varchar',
    length: 36,
    enum: InternalTransferStatusEnum,
    default: InternalTransferStatusEnum.DRAFT,
  })
  status: InternalTransferStatusEnum;

  @Column({ name: 'ref_driver_id', type: 'varchar', length: 32 })
  driverId: string | null;

  @Column({ name: 'check_in_latitude', type: 'float8', nullable: true })
  checkInLatitude: number | null;

  @Column({ name: 'check_in_longitude', type: 'float8', nullable: true })
  checkInLongitude: number | null;

  @Column({ name: 'check_in_distance', type: 'numeric', nullable: true })
  checkInDistance: number | null;

  @Column({ name: 'remarks', type: 'text', nullable: true })
  remarks: string | null;

  @Column({ name: 'driver_remarks', type: 'text', nullable: true })
  driverRemarks: string | null;

  @Column({ name: 'created_by', type: 'varchar', length: 32 })
  createdBy: string;

  @Column({ name: 'created_date', type: 'timestamp' })
  createdDate: Date;

  @Column({ name: 'modified_by', type: 'varchar', length: 32 })
  modifiedBy: string;

  @Column({ name: 'modified_date', type: 'timestamp' })
  modifiedDate: Date;

  @OneToOne(() => OperationUnit)
  @JoinColumn({ name: 'ref_target_operation_unit_id', referencedColumnName: 'id' })
  targetOperationUnit: OperationUnit;

  @OneToOne(() => OperationUnit)
  @JoinColumn({ name: 'ref_source_operation_unit_id', referencedColumnName: 'id' })
  sourceOperationUnit: OperationUnit;

  @OneToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  userCreator: User;

  @OneToOne(() => User)
  @JoinColumn({ name: 'modified_by' })
  userModifier: User;

  @OneToOne(() => User)
  @JoinColumn({ name: 'ref_driver_id' })
  driver: User | null;

  @OneToMany(() => ProductsInInternalTransfer, (p) => p.internalTransfer)
  @JoinColumn({ referencedColumnName: 'ref_internal_transfer_id' })
  products: ProductsInInternalTransfer[];

  @OneToMany(() => GoodsReceived, (gr) => gr.salesInternalTransfer)
  @JoinColumn({ referencedColumnName: 'id' })
  goodsReceived: GoodsReceived[];
}
