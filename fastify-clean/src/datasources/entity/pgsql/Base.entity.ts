/* eslint-disable max-classes-per-file */
import { Entity, PrimaryColumn, Generated, Column } from 'typeorm';

@Entity()
export abstract class CMSBase {
  @PrimaryColumn()
  id: string;

  @Column({ name: 'seq_no', type: 'int' })
  @Generated('increment')
  seqNo: number;

  @Column({ name: 'created_by', type: 'varchar', length: 50 })
  createdBy: string;

  @Column({ name: 'created_date', type: 'timestamp' })
  createdDate: Date;

  @Column({ name: 'modified_by', type: 'varchar', length: 50 })
  modifiedBy: string;

  @Column({ name: 'modified_date', type: 'timestamp' })
  modifiedDate: Date;
}

@Entity()
export abstract class CMSBaseSimple {
  @PrimaryColumn()
  @Generated('uuid')
  id: string;

  @Column({ name: 'seq_no', type: 'int' })
  @Generated('increment')
  seqNo: number;

  @Column({ name: 'created_date', type: 'timestamp' })
  createdDate: Date;

  @Column({ name: 'modified_date', type: 'timestamp' })
  modifiedDate: Date;
}
