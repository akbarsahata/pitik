import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { User } from '../User.entity';
import { OperationUnit } from './OperationUnit.entity';
import { ProductsInStockOpname } from './ProductsInStockOpname.entity';

/* eslint-disable no-unused-vars */
export enum StockOpnameStatusEnum {
  CANCELLED = 'CANCELLED',
  DRAFT = 'DRAFT',
  CONFIRMED = 'CONFIRMED',
  FINISHED = 'FINISHED',
  REJECTED = 'REJECTED',
}

@Entity({ name: 'stock_opname', schema: 'sales' })
export class StockOpname {
  @Column({ primary: true, type: 'varchar', length: 36 })
  id: string;

  @Column({ name: 'status', type: 'enum', enum: StockOpnameStatusEnum })
  status: StockOpnameStatusEnum;

  @Column({ name: 'confirmed_date', type: 'timestamp', nullable: true })
  confirmedDate: Date | null;

  @Column({ name: 'ref_reviewer_id', type: 'varchar', length: 50, nullable: true })
  reviewerId: string | null;

  @Column({ name: 'reviewed_date', type: 'timestamp', nullable: true })
  reviewedDate: Date | null;

  @Column({ name: 'ref_sales_operation_unit_id', type: 'varchar', length: 36 })
  salesOperationUnitId: string;

  @Column({ name: 'total_weight', type: 'decimal', nullable: true })
  totalWeight: number | null;

  @OneToOne(() => OperationUnit)
  @JoinColumn({ name: 'ref_sales_operation_unit_id', referencedColumnName: 'id' })
  salesOperationUnit: OperationUnit;

  @Column({ name: 'created_by', type: 'varchar', length: 50 })
  createdBy: string;

  @Column({ name: 'created_date', type: 'timestamp' })
  createdDate: Date;

  @Column({ name: 'modified_by', type: 'varchar', length: 50 })
  modifiedBy: string;

  @Column({ name: 'modified_date', type: 'timestamp' })
  modifiedDate: Date;

  @OneToOne(() => User)
  @JoinColumn({ name: 'ref_reviewer_id' })
  reviewer: User | null;

  @OneToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  userCreator: User | null;

  @OneToOne(() => User)
  @JoinColumn({ name: 'modified_by' })
  userModifier: User | null;

  @OneToMany(() => ProductsInStockOpname, (spiso) => spiso.salesStockOpname)
  @JoinColumn({ referencedColumnName: 'id' })
  salesProductsInStockOpname: ProductsInStockOpname[];
}
