import { Column, Entity } from 'typeorm';

@Entity('contract_history')
export class ContractHistory {
  @Column({ name: 'id', type: 'varchar', primary: true })
  id: string;

  @Column({ name: 'seq_no', type: 'int' })
  seqNo: number;

  @Column({ name: 'ref_contract_id', type: 'varchar' })
  refContractId: string;

  @Column({ name: 'changed_items', type: 'json' })
  changedItems: Object;

  @Column({ name: 'modified_by', type: 'varchar', length: 50 })
  modifiedBy: string;

  @Column({ name: 'modified_date', type: 'timestamp' })
  modifiedDate: Date;
}
