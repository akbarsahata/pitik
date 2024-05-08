import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { User } from '../User.entity';
import { OperationUnit } from './OperationUnit.entity';
import { ProductsInManufacture } from './ProductsInManufacture.entity';

/* eslint-disable no-unused-vars */
export enum ManufactureStatusEnum {
  INPUT_DRAFT = 'INPUT_DRAFT',
  INPUT_CONFIRMED = 'INPUT_CONFIRMED',
  INPUT_BOOKED = 'INPUT_BOOKED',
  OUTPUT_DRAFT = 'OUTPUT_DRAFT',
  OUTPUT_CONFIRMED = 'OUTPUT_CONFIRMED',
  CANCELLED = 'CANCELLED',
}

@Entity({ name: 'manufacture', schema: 'sales' })
export class Manufacture {
  @Column({ primary: true, type: 'varchar', length: 36 })
  id: string;

  @Column({ name: 'status', type: 'enum', enum: ManufactureStatusEnum })
  status: ManufactureStatusEnum;

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

  @Column({ name: 'output_total_weight', type: 'decimal' })
  outputTotalWeight: number | undefined;

  @OneToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  userCreator: User | null;

  @OneToOne(() => User)
  @JoinColumn({ name: 'modified_by' })
  userModifier: User | null;

  @OneToMany(() => ProductsInManufacture, (spim) => spim.salesManufacture)
  @JoinColumn({ referencedColumnName: 'id' })
  salesProductsInManufacture: ProductsInManufacture[];
}
