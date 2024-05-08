import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { User } from '../User.entity';
import { OperationUnit } from './OperationUnit.entity';

@Entity({ name: 'users_in_operation_unit', schema: 'sales' })
export class UsersInOperationUnit {
  @PrimaryColumn({ name: 'ref_user_id', type: 'varchar', length: 36 })
  userId: string;

  @PrimaryColumn({ name: 'ref_sales_operation_unit_id', type: 'varchar', length: 36 })
  salesOperationUnitId: string;

  @Column({ name: 'created_by', type: 'varchar', length: 50 })
  createdBy: string;

  @Column({ name: 'created_date', type: 'timestamp' })
  createdDate: Date;

  @Column({ name: 'modified_by', type: 'varchar', length: 50 })
  modifiedBy: string;

  @Column({ name: 'modified_date', type: 'timestamp' })
  modifiedDate: Date;

  @DeleteDateColumn({ name: 'deleted_date', type: 'timestamp', nullable: true })
  deletedDate: Date | null;

  @ManyToOne(() => OperationUnit, (sou) => sou.salesUsersInOperationUnit)
  @JoinColumn({ name: 'ref_sales_operation_unit_id', referencedColumnName: 'id' })
  salesOperationUnit: OperationUnit;

  @OneToOne(() => User)
  @JoinColumn({ name: 'ref_user_id', referencedColumnName: 'id' })
  user: User;
}
