import { Column, Entity, PrimaryColumn } from 'typeorm';
import { FarmChickCategory } from './Farm.entity';

@Entity('room_type')
export class RoomType {
  @PrimaryColumn()
  id: string;

  @Column({ name: 'name', type: 'varchar', length: 50 })
  name: string;

  @Column({ name: 'is_active', type: 'boolean' })
  isActive: boolean;

  @Column({ name: 'level', type: 'int' })
  level: number;

  @Column({ name: 'farm_category', type: 'varchar', length: 50 })
  farmCategory: FarmChickCategory;
}
