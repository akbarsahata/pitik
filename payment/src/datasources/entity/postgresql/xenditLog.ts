import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity({ schema: 'payment', name: 'xendit_log' })
export class XenditLog {
  @PrimaryColumn({ name: 'id' })
  id: string;

  @Column({ name: 'action_name', type: 'varchar', length: 255 })
  actionName: string;

  @Column({ name: 'log', type: 'jsonb' })
  log: any;

  @CreateDateColumn({ name: 'created_date', type: 'timestamp' })
  createdDate: Date;

  @UpdateDateColumn({ name: 'modified_date', type: 'timestamp' })
  modifiedDate: Date;
}
