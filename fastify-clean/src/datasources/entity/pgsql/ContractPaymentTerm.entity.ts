import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Contract } from './Contract.entity';

@Entity('contract_payment_term')
export class ContractPaymentTerm {
  @Column({ primary: true, type: 'varchar' })
  id: string;

  @Column({ name: 'seq_no', type: 'int' })
  seqNo: number;

  @Column({ name: 'amount', type: 'int' })
  amount: number;

  @Column({ name: 'payment_term', type: 'varchar' })
  paymentTerm: string;

  @Column({ name: 'uom', type: 'varchar' })
  uom: string;

  @Column({ name: 'ref_contract_id', type: 'varchar' })
  refContractId: string;

  @Column({ name: 'created_by', type: 'varchar', length: 50 })
  createdBy: string;

  @Column({ name: 'created_date', type: 'timestamp' })
  createdDate: Date;

  @Column({ name: 'modified_by', type: 'varchar', length: 50 })
  modifiedBy: string;

  @Column({ name: 'modified_date', type: 'timestamp' })
  modifiedDate: Date;

  @ManyToOne(() => Contract)
  @JoinColumn({ name: 'ref_contract_id', referencedColumnName: 'id' })
  contractType: Contract;
}
