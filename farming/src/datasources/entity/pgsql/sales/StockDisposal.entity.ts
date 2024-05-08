import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { User } from '../User.entity';
import { OperationUnit } from './OperationUnit.entity';
import { ProductsInStockDisposal } from './ProductsInStockDisposal.entity';

/* eslint-disable no-unused-vars */
export enum StockDisposalStatusEnum {
  DRAFT = 'DRAFT',
  CONFIRMED = 'CONFIRMED',
  BOOKED = 'BOOKED',
  REJECTED = 'REJECTED',
  FINISHED = 'FINISHED',
  CANCELLED = 'CANCELLED',
}

@Entity({ name: 'stock_disposal', schema: 'sales' })
export class StockDisposal {
  @Column({ primary: true, type: 'varchar', length: 36 })
  id: string;

  @Column({ name: 'status', type: 'enum', enum: StockDisposalStatusEnum })
  status: StockDisposalStatusEnum;

  @Column({ name: 'image_link', type: 'text' })
  imageLink: string;

  @Column({ name: 'ref_reviewer_id', type: 'varchar', length: 50, nullable: true })
  reviewerId: string | null;

  @Column({ name: 'reviewed_date', type: 'timestamp' })
  reviewedDate: Date;

  @Column({ name: 'ref_sales_operation_unit_id', type: 'varchar', length: 36 })
  salesOperationUnitId: string;

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

  @OneToMany(() => ProductsInStockDisposal, (spisd) => spisd.salesStockDisposal)
  @JoinColumn({ referencedColumnName: 'id' })
  salesProductsInStockDisposal: ProductsInStockDisposal[];
}
