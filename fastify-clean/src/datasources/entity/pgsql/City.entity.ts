import { Column, Entity } from 'typeorm';

@Entity('t_city')
export class City {
  @Column({ name: 'id', type: 'int', primary: true })
  id: number;

  @Column({ name: 'city_name', type: 'varchar', length: 100 })
  cityName: string;

  @Column({ name: 'ref_province_id', type: 'varchar', length: 32 })
  provinceId: number;
}
