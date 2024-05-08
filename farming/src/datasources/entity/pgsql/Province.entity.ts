import { Column, Entity } from 'typeorm';

@Entity('t_province')
export class Province {
  @Column({ name: 'id', type: 'int', primary: true })
  id: number;

  @Column({ name: 'province_name', type: 'varchar', length: 50 })
  provinceName: string;
}
