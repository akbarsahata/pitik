import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { City } from '../City.entity';
import { Province } from '../Province.entity';
import { User } from '../User.entity';
import { ProductCategory } from './ProductCategory.entity';

@Entity({
  name: 'product_category_price',
  schema: 'sales',
})
export class ProductCategoryPrice {
  @PrimaryColumn({ name: 'id', type: 'varchar', length: 36 })
  id: string;

  @Column({ name: 'ref_sales_product_category_id', type: 'varchar', length: 36 })
  salesProductCategoryId: string;

  @Column({ name: 'ref_province_id', type: 'int' })
  provinceId: number;

  @Column({ name: 'ref_city_id', type: 'int' })
  cityId: number;

  @Column({ name: 'price', type: 'float4' })
  price: number;

  @Column({ name: 'created_by', type: 'varchar', length: 50 })
  createdBy: string;

  @Column({ name: 'created_date', type: 'timestamp' })
  createdDate: Date;

  @Column({ name: 'modified_by', type: 'varchar', length: 50 })
  modifiedBy: string;

  @Column({ name: 'modified_date', type: 'timestamp' })
  modifiedDate: Date;

  @OneToOne(() => ProductCategory)
  @JoinColumn({ name: 'ref_sales_product_category_id', referencedColumnName: 'id' })
  salesProductCategory: ProductCategory;

  @OneToOne(() => Province)
  @JoinColumn({ name: 'ref_province_id', referencedColumnName: 'id' })
  province: Province;

  @OneToOne(() => City)
  @JoinColumn({ name: 'ref_city_id', referencedColumnName: 'id' })
  city: City;

  @OneToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  userCreator: User | null;

  @OneToOne(() => User)
  @JoinColumn({ name: 'modified_by' })
  userModifier: User | null;
}
