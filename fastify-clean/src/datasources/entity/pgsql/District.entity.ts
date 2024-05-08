import { Column, Entity } from 'typeorm';

@Entity('t_district')
export class District {
  @Column({ name: 'id', type: 'int', primary: true })
  id: number;

  @Column({ name: 'district_name', type: 'varchar', length: 100 })
  districtName: string;

  @Column({ name: 'ref_city_id', type: 'varchar', length: 32 })
  cityId: number;
}
