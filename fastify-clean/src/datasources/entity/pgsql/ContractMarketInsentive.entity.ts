import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Contract } from './Contract.entity';

@Entity('contract_market_insentive')
export class ContractMarketInsentive {
  @Column({ primary: true, type: 'varchar' })
  id: string;

  @Column({ name: 'seq_no', type: 'int' })
  seqNo: number;

  @Column({ name: 'range_ip', type: 'varchar' })
  rangeIp: string | null;

  @Column({ name: 'insentive_precentage', type: 'int' })
  insentivePrecentage: number | null;

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
