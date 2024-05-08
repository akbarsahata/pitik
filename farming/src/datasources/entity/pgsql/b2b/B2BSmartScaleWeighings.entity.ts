import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';
import { Room } from '../Room.entity';
import { B2BSmartScaleWeighingData } from './B2BSmartScaleWeighingData.entity';

@Entity({
  name: 'b2b_smart_scale_weighing',
  schema: 'b2b',
})
export class B2BSmartScaleWeighing {
  @Column({ primary: true, generated: 'uuid' })
  id: string;

  @Column({ name: 'ref_room_id', type: 'uuid' })
  roomId: string;

  @Column({ name: 'total_count', type: 'int' })
  totalCount: number;

  @Column({ name: 'average_weight', type: 'decimal' })
  averageWeight: number;

  @Column({ name: 'execution_date', type: 'timestamp' })
  executionDate: Date;

  @Column({ name: 'start_date', type: 'timestamp' })
  startDate: Date;

  @CreateDateColumn({ name: 'created_date', type: 'timestamp' })
  createdDate: Date;

  @UpdateDateColumn({ name: 'modified_date', type: 'timestamp' })
  modifiedDate: Date;

  @Column({ name: 'created_by', type: 'varchar', length: 50 })
  createdBy: string;

  @Column({ name: 'modified_by', type: 'varchar', length: 50 })
  modifiedBy: string;

  @ManyToOne(() => Room, (r) => r.b2bSmartScaleWeighings)
  @JoinColumn({ name: 'ref_room_id', referencedColumnName: 'id' })
  room: Room;

  @OneToMany(() => B2BSmartScaleWeighingData, (d) => d.weighing)
  @JoinColumn({ referencedColumnName: 'ref_weighing_id' })
  b2bDataInSmartScaleWeighing: B2BSmartScaleWeighingData[];
}
