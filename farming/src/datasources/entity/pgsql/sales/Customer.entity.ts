import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { CMSBase } from '../Base.entity';
import { Branch } from '../Branch.entity';
import { City } from '../City.entity';
import { District } from '../District.entity';
import { Province } from '../Province.entity';
import { User } from '../User.entity';
import { SalesCustomerVisit } from './CustomerVisit.entity';
import { ProductsInCustomer } from './ProductsInCustomer.entity';

/* eslint-disable no-unused-vars */
export enum CustomerSupplierEnum {
  PASAR = 'PASAR',
  JAGAL = 'JAGAL',
  KERABAT = 'KERABAT',
  LAINNYA = 'LAINNYA',
}

@Entity({
  name: 'sales_customer',
  schema: 'sales',
})
export class SalesCustomer extends CMSBase {
  @Column({ primary: true, generated: 'uuid' })
  id: string;

  @Column({ name: 'business_name', type: 'varchar', length: 120 })
  businessName: string;

  @Column({ name: 'business_type', type: 'varchar', length: 32 })
  businessType: string;

  @Column({ name: 'owner_name', type: 'varchar', length: 50 })
  ownerName: string;

  @Column({ name: 'phone_number', type: 'varchar', length: 50 })
  phoneNumber: string;

  @Column({ name: 'ref_province_id', type: 'int' })
  provinceId: number;

  @Column({ name: 'ref_city_id', type: 'int' })
  cityId: number;

  @Column({ name: 'ref_district_id', type: 'int' })
  districtId: number;

  @Column({ name: 'ref_branch_id', type: 'varchar', length: 36, nullable: true })
  branchId: string | null;

  @Column({ name: 'plus_code', type: 'varchar', length: 120 })
  plusCode: string;

  @Column({ name: 'latitude', type: 'float4' })
  latitude: number;

  @Column({ name: 'longitude', type: 'float4' })
  longitude: number;

  @Column({ name: 'is_archived', type: 'bool' })
  isArchived: boolean;

  @Column({ name: 'supplier', type: 'enum', enum: CustomerSupplierEnum })
  supplier: CustomerSupplierEnum;

  @Column({ name: 'supplier_detail', type: 'text' })
  supplierDetail: string;

  @Column({ name: 'ref_salesperson_id', type: 'varchar', length: 32 })
  salespersonId: string;

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
  branch: Branch | null;

  @OneToOne(() => User)
  @JoinColumn({ name: 'ref_salesperson_id', referencedColumnName: 'id' })
  salesperson: User;

  @OneToMany(() => SalesCustomerVisit, (scv) => scv.salesCustomer)
  @JoinColumn({ referencedColumnName: 'id' })
  salesCustomerVisits: SalesCustomerVisit[];

  @OneToMany(() => ProductsInCustomer, (scv) => scv.salesCustomer)
  @JoinColumn({ referencedColumnName: 'id' })
  salesProducts: ProductsInCustomer[];
}
