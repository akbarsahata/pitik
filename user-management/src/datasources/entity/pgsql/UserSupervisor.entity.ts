import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { ROLE_RANK_CONTEXT } from '../../../libs/constants';
import { User } from './User.entity';

@Entity('usersupervisor')
export class UserSupervisor {
  @PrimaryColumn({ name: 'subordinate_id', type: 'uuid' })
  subordinateId: string;

  @PrimaryColumn({ name: 'supervisor_id', type: 'uuid' })
  supervisorId: string;

  @PrimaryColumn({ name: 'context', type: 'varchar' })
  context: ROLE_RANK_CONTEXT;

  @Column({ name: 'created_by', type: 'varchar', length: 50 })
  createdBy: string;

  @Column({ name: 'created_date', type: 'timestamp' })
  createdDate: Date;

  @Column({ name: 'modified_by', type: 'varchar', length: 50 })
  modifiedBy: string;

  @Column({ name: 'modified_date', type: 'timestamp' })
  modifiedDate: Date;

  @DeleteDateColumn({ name: 'deleted_date' })
  deletedDate: Date | null;

  @ManyToOne(() => User, (u) => u.subordinates)
  @JoinColumn({ name: 'subordinate_id' })
  subordinate: User;

  @ManyToOne(() => User, (u) => u.supervisors)
  @JoinColumn({ name: 'supervisor_id' })
  supervisor: User;
}
