/* eslint-disable no-unused-vars */
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { VirtualAccount } from './virtualAccount.entity';

@Entity({ schema: 'payment', name: 'virtual_account_payment' })
export class VirtualAccountPayment {
  @PrimaryColumn({ name: 'id' })
  id: string;

  @Column({ name: 'virtual_account_id', type: 'varchar', length: 36 })
  virtualAccountId: string;

  @Column({ name: 'payment_id', type: 'varchar', length: 36 })
  paymentId: string;

  @Column({ name: 'amount', type: 'numeric', precision: 20, scale: 2 })
  amount: number;

  @Column({ name: 'transaction_timestamp', type: 'timestamp' })
  transactionTimestamp: Date;

  @Column({ name: 'currency', type: 'varchar', length: 3 })
  currency: string;

  @Column({ name: 'remark', type: 'varchar', length: 255, nullable: true })
  remark: string | null;

  @Column({ name: 'reference', type: 'varchar', length: 255, nullable: true })
  reference: string | null;

  @Column({ name: 'created_date', type: 'timestamp' })
  createdDate: Date;

  @Column({ name: 'modified_date', type: 'timestamp' })
  modifiedDate: Date;

  @Column({ name: 'failed_date', type: 'timestamp', nullable: true })
  failedDate: Date | null;

  @Column({ name: 'retry_date', type: 'timestamp', nullable: true })
  retryDate: Date | null;

  @Column({ name: 'retry_attempt', type: 'int' })
  retryAttempt: number;

  // flag to indicate if the payment has been consumed by Odoo
  @Column({ name: 'consumed_date', type: 'timestamp', nullable: true })
  consumedDate: Date | null;

  @OneToOne(() => VirtualAccount)
  @JoinColumn({ name: 'virtual_account_id' })
  virtualAccount: VirtualAccount;
}
