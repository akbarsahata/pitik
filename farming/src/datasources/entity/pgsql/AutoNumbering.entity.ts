import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('t_autonumbering')
export class AutoNumbering {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'transaction_type', type: 'varchar', length: 250 })
  transactionType: string;

  @Column({ name: 'prefix', type: 'varchar', length: 250 })
  prefix: string;

  @Column({ name: 'digit_count', type: 'int' })
  digitCount: number;

  @Column({ name: 'last_number', type: 'bigint' })
  lastNumber: number;

  @Column({ name: 'created_date', type: 'timestamp' })
  createdDate: Date;

  @Column({ name: 'modified_date', type: 'timestamp' })
  modifiedDate: Date;
}
