import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Contract } from './Contract.entity';

@Entity('contract_deduction_fc_bop')
export class ContractDeductionFcBop {
  @Column({ primary: true, type: 'varchar' })
  id: string;

  @Column({ name: 'seq_no', type: 'int' })
  seqNo: number;

  @Column({ name: 'loss_deduction_profit', type: 'int' })
  lossDeductionProfit: number;

  @Column({ name: 'loss_deduction_bop', type: 'int' })
  lossDeductionBop: number;

  @Column({ name: 'uom_loss', type: 'varchar' })
  uomLoss: string;

  @Column({ name: 'uom_bop', type: 'varchar' })
  uomBop: string;

  @Column({ name: 'bop', type: 'varchar' })
  bop: string;

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
