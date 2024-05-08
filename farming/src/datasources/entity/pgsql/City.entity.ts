import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { Province } from './Province.entity';
import { ProductCategoryPrice } from './sales/ProductCategoryPrice.entity';

@Entity('t_city')
export class City {
  @Column({ name: 'id', type: 'int', primary: true })
  id: number;

  @Column({ name: 'city_name', type: 'varchar', length: 100 })
  cityName: string;

  @Column({ name: 'ref_province_id', type: 'int' })
  provinceId: number;

  @OneToOne(() => Province)
  @JoinColumn({ name: 'ref_province_id', referencedColumnName: 'id' })
  province: Province;

  @OneToMany(() => ProductCategoryPrice, (spcp) => spcp.city)
  @JoinColumn({ referencedColumnName: 'ref_city_id' })
  salesProductCategoryPrices: ProductCategoryPrice[];
}
