import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { Branch } from '../Branch.entity';
import { City } from '../City.entity';
import { District } from '../District.entity';
import { Province } from '../Province.entity';
import { ProductsInVendor } from './ProductsInVendor.entity';

/* eslint-disable no-unused-vars */
export enum VendorPriceBasisEnum {
  INVOICE = 'INVOICE',
  PO = 'PO',
  GR = 'GR',
}

export enum VendorTypeEnum {
  INTERNAL = 'INTERNAL',
  EXTERNAL = 'EXTERNAL',
}

@Entity({ name: 'vendor', schema: 'sales' })
export class Vendor {
  @Column({ primary: true, generated: 'uuid' })
  id: string;

  @Column({ name: 'vendor_name', type: 'varchar', length: 120 })
  vendorName: string;

  @Column({ name: 'price_basis', type: 'enum', enum: VendorPriceBasisEnum })
  priceBasis: VendorPriceBasisEnum;

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

  @Column({ name: 'status', type: 'bool' })
  status: boolean;

  @Column({ name: 'type', type: 'varchar' })
  type: VendorTypeEnum;

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

  @OneToMany(() => ProductsInVendor, (spv) => spv.salesVendor)
  @JoinColumn({ referencedColumnName: 'id' })
  salesProductsInVendor: ProductsInVendor[];
}
