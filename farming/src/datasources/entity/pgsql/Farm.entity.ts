/* eslint-disable no-unused-vars */
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { BoolSmallIntTransformer } from '../../../libs/utils/transformers';
import { B2BFarmInfrastructure } from './b2b/B2BFarmInfrastructure.entity';
import { CMSBase } from './Base.entity';
import { Branch } from './Branch.entity';
import { City } from './City.entity';
import { District } from './District.entity';
import { Province } from './Province.entity';
import { User } from './User.entity';

export enum FarmChickCategory {
  BROILER = 'BROILER',
  LAYER = 'LAYER',
}

@Entity('t_farm')
export class Farm extends CMSBase {
  @Column({ name: 'farm_code', type: 'varchar', length: 50 })
  farmCode: string;

  @Column({ name: 'farm_name', type: 'varchar', length: 50 })
  farmName: string;

  @Column({ name: 'ref_user_owner_id', type: 'varchar', length: 32 })
  userOwnerId: string;

  @Column({ name: 'ref_province_id', type: 'int' })
  provinceId: number;

  @Column({ name: 'ref_city_id', type: 'int' })
  cityId: number;

  @Column({ name: 'ref_district_id', type: 'int' })
  districtId: number;

  @Column({ name: 'ref_branch_id', type: 'varchar', length: 32 })
  branchId: string;

  @Column({ name: 'zip_code', type: 'varchar', length: 50 })
  zipCode: string;

  @Column({ name: 'address_name', type: 'varchar', length: 50 })
  addressName: string;

  @Column({ name: 'address_1', type: 'text' })
  address1: string;

  @Column({ name: 'address_2', type: 'text' })
  address2: string;

  @Column({ name: 'lat', type: 'varchar', length: 150 })
  latitude: string;

  @Column({ name: 'long', type: 'varchar', length: 150 })
  longitude: string;

  @Column({ name: 'remarks', type: 'text' })
  remarks: string;

  @Column({ name: 'status', type: 'smallint', transformer: new BoolSmallIntTransformer() })
  status: boolean;

  @Column({ name: 'category', type: 'varchar' })
  category: FarmChickCategory;

  @OneToOne(() => User)
  @JoinColumn({ name: 'ref_user_owner_id', referencedColumnName: 'id' })
  owner: User;

  @OneToOne(() => Branch)
  @JoinColumn({ name: 'ref_branch_id', referencedColumnName: 'id' })
  branch: Branch | null;

  @OneToOne(() => District)
  @JoinColumn({ name: 'ref_district_id', referencedColumnName: 'id' })
  district: District;

  @OneToOne(() => City)
  @JoinColumn({ name: 'ref_city_id', referencedColumnName: 'id' })
  city: City;

  @OneToOne(() => Province)
  @JoinColumn({ name: 'ref_province_id', referencedColumnName: 'id' })
  province: Province;

  @OneToOne(() => User)
  @JoinColumn({ name: 'modified_by' })
  userModifier: User | null;

  @OneToMany(() => B2BFarmInfrastructure, (fi) => fi.farm)
  @JoinColumn({ referencedColumnName: 'id' })
  b2bFarmInfrastructures: B2BFarmInfrastructure[];
}
