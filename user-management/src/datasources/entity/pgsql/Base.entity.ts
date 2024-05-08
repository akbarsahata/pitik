/* eslint-disable max-classes-per-file */
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export abstract class Base {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'created_by', type: 'varchar', length: 50 })
  createdBy: string;

  @Column({ name: 'created_date', type: 'timestamp' })
  createdDate: Date;

  @Column({ name: 'modified_by', type: 'varchar', length: 50 })
  modifiedBy: string;

  @Column({ name: 'modified_date', type: 'timestamp' })
  modifiedDate: Date;

  @Column({ name: 'additional', type: 'json' })
  additional: any;
}
