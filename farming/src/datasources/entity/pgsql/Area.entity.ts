import { Column, Entity, JoinColumn, OneToMany } from 'typeorm';
import { CMSBase } from './Base.entity';
import { Branch } from './Branch.entity';

@Entity('area')
export class Area extends CMSBase {
  @Column({ name: 'code', type: 'varchar', length: 50 })
  code: string;

  @Column({ name: 'name', type: 'varchar', length: 50 })
  name: string;

  @Column({ name: 'is_active', type: 'bool', default: false })
  isActive: boolean;

  @OneToMany(() => Branch, (b) => b.area)
  @JoinColumn({ referencedColumnName: 'id' })
  branches: Branch[];
}
