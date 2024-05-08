/* eslint-disable no-unused-vars */
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';
import { Branch } from '../Branch.entity';
import { City } from '../City.entity';
import { District } from '../District.entity';
import { Province } from '../Province.entity';
import { User } from '../User.entity';
import { ProductsInOperationUnit } from './ProductsInOperationUnit.entity';
import { UsersInOperationUnit } from './UsersInOperationUnit.entity';

export enum OperationUnitTypeEnum {
  LAPAK = 'LAPAK',
  JAGAL = 'JAGAL',
}

export enum OperationUnitCategoryEnum {
  INTERNAL = 'INTERNAL',
  EXTERNAL = 'EXTERNAL',
}

export enum OperationUnitJagalPriceBasisEnum {
  INVOICE = 'INVOICE',
  PO = 'PO',
  GR = 'GR',
}

@Entity({
  name: 'operation_unit',
  schema: 'sales',
})
export class OperationUnit {
  @PrimaryColumn({ name: 'id', type: 'varchar', length: 36 })
  id: string;

  @Column({ name: 'operation_unit_name', type: 'varchar', length: 256 })
  operationUnitName: string;

  @Column({ name: 'ref_province_id', type: 'int' })
  provinceId: number;

  @Column({ name: 'ref_city_id', type: 'int' })
  cityId: number;

  @Column({ name: 'ref_district_id', type: 'int' })
  districtId: number;

  @Column({ name: 'ref_branch_id', type: 'varchar', length: 36 })
  branchId: string;

  @Column({ name: 'plus_code', type: 'varchar', length: 120 })
  plusCode: string;

  @Column({ name: 'latitude', type: 'float4' })
  latitude: number;

  @Column({ name: 'longitude', type: 'float4' })
  longitude: number;

  @Column({ name: 'status', type: 'bool' })
  status: boolean;

  @Column({ name: 'type', type: 'enum', enum: OperationUnitTypeEnum })
  type: OperationUnitTypeEnum;

  @Column({ name: 'category', type: 'enum', enum: OperationUnitCategoryEnum })
  category: OperationUnitCategoryEnum;

  // NOTE: Inventory prices not available in external jagal
  @Column({ name: 'innards_price', type: 'float8', nullable: true })
  innardsPrice: number | null;

  @Column({ name: 'head_price', type: 'float8', nullable: true })
  headPrice: number | null;

  @Column({ name: 'feet_price', type: 'float8', nullable: true })
  feetPrice: number | null;

  // Jagal related ↓

  @Column({
    name: 'price_basis',
    type: 'enum',
    enum: OperationUnitJagalPriceBasisEnum,
    nullable: true,
  })
  priceBasis: OperationUnitJagalPriceBasisEnum | null;

  @Column({ name: 'lb_quantity', type: 'int', nullable: true })
  lbQuantity: number | null;

  @Column({ name: 'lb_weight', type: 'float4', nullable: true })
  lbWeight: number | null;

  @Column({ name: 'lb_price', type: 'float8', nullable: true })
  lbPrice: number | null;

  @Column({ name: 'lb_loss', type: 'float4', nullable: true, comment: '0-100%' })
  lbLoss: number | null;

  @Column({ name: 'operational_days', type: 'int', nullable: true })
  operationalDays: number | null;

  @Column({ name: 'operational_expenses', type: 'float8', nullable: true })
  operationalExpenses: number | null;

  // Jagal related ↑

  @Column({ name: 'created_by', type: 'varchar', length: 50 })
  createdBy: string;

  @Column({ name: 'created_date', type: 'timestamp' })
  createdDate: Date;

  @Column({ name: 'modified_by', type: 'varchar', length: 50 })
  modifiedBy: string;

  @Column({ name: 'modified_date', type: 'timestamp' })
  modifiedDate: Date;

  @OneToOne(() => Province)
  @JoinColumn({ name: 'ref_province_id', referencedColumnName: 'id' })
  province: Province;

  @OneToOne(() => City)
  @JoinColumn({ name: 'ref_city_id', referencedColumnName: 'id' })
  city: City;

  @OneToOne(() => District)
  @JoinColumn({ name: 'ref_district_id', referencedColumnName: 'id' })
  district: District;

  @OneToOne(() => Branch)
  @JoinColumn({ name: 'ref_branch_id', referencedColumnName: 'id' })
  branch: Branch;

  @OneToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  userCreator: User | null;

  @OneToOne(() => User)
  @JoinColumn({ name: 'modified_by' })
  userModifier: User | null;

  @OneToMany(() => UsersInOperationUnit, (suiou) => suiou.salesOperationUnit)
  @JoinColumn({ referencedColumnName: 'id' })
  salesUsersInOperationUnit: UsersInOperationUnit[];

  @OneToMany(() => ProductsInOperationUnit, (spiou) => spiou.salesOperationUnit)
  @JoinColumn({ referencedColumnName: 'id' })
  salesProductsInOperationUnit: ProductsInOperationUnit[];
}
