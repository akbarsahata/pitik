import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Area } from './Area.entity';
import { CMSBase } from './Base.entity';

@Entity('branch')
export class Branch extends CMSBase {
  @Column({ name: 'code', type: 'varchar', length: 50 })
  code: string;

  @Column({ name: 'name', type: 'varchar', length: 50 })
  name: string;

  @Column({ name: 'is_active', type: 'bool', default: false })
  isActive: boolean;

  @Column({ name: 'area_id', type: 'varchar', length: 32 })
  areaId: string;

  @OneToOne(() => Area)
  @JoinColumn({ name: 'area_id', referencedColumnName: 'id' })
  area: Area;
}
