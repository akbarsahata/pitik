/* eslint-disable no-unused-vars */
import { Column, Entity, PrimaryColumn } from 'typeorm';

export enum VIRTUAL_ACCOUNT_STATUS {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING = 'PENDING',
}

export enum BANK_CODE {
  BCA = 'BCA',
  BRI = 'BRI',
}

@Entity({ schema: 'payment', name: 'virtual_account' })
export class VirtualAccount {
  @PrimaryColumn({ name: 'id' })
  id: string;

  @Column({ name: 'partner_id', type: 'varchar', length: 36 })
  partnerId: string;

  @Column({ name: 'merchant_code', type: 'varchar', length: 36 })
  merchantCode: string;

  @Column({ name: 'account_number', type: 'varchar', length: 50 })
  accountNumber: string;

  @Column({ name: 'bank_code', type: 'varchar', length: 36 })
  bankCode: BANK_CODE;

  @Column({ name: 'name', type: 'varchar', length: 255 })
  name: string;

  @Column({ name: 'is_closed', type: 'boolean' })
  isClosed: boolean;

  @Column({ name: 'is_single_use', type: 'boolean' })
  isSingleUse: boolean;

  @Column({ name: 'expiration_date', type: 'timestamp' })
  expirationDate: Date;

  @Column({ name: 'status', type: 'varchar', length: 255 })
  status: VIRTUAL_ACCOUNT_STATUS;

  @Column({ name: 'created_date', type: 'timestamp' })
  createdDate: Date;

  @Column({ name: 'modified_date', type: 'timestamp' })
  modifiedDate: Date;
}
