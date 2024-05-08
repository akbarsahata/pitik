import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Branch } from './Branch.entity';
import { ContractType } from './ContractType.entity';
import { Coop } from './Coop.entity';
import { User } from './User.entity';

@Entity('contract')
export class Contract {
  @Column({ primary: true, type: 'varchar' })
  id: string;

  @Column({ name: 'seq_no', type: 'int' })
  seqNo: number;

  @Column({ name: 'code', type: 'varchar' })
  code: string;

  @Column({ name: 'contract_tag', type: 'varchar' })
  contractTag: string;

  @Column({ name: 'customize', type: 'bool' })
  customize: boolean;

  @Column({ name: 'branch_id', type: 'varchar' })
  branchId: string;

  @Column({ name: 'coop_id', type: 'varchar' })
  coopId: string;

  @Column({ name: 'ref_contract_type_id', type: 'varchar' })
  refContractTypeId: string;

  @Column({ name: 'effective_start_date', type: 'date' })
  effectiveStartDate: string;

  @Column({ name: 'status', type: 'varchar' })
  status: string;

  @Column({ name: 'ref_contract_parent', type: 'varchar' })
  refContractParent: string;

  @Column({ name: 'created_by', type: 'varchar', length: 50 })
  createdBy: string;

  @Column({ name: 'created_date', type: 'timestamp' })
  createdDate: Date;

  @Column({ name: 'modified_by', type: 'varchar', length: 50 })
  modifiedBy: string;

  @Column({ name: 'modified_date', type: 'timestamp' })
  modifiedDate: Date;

  @ManyToOne(() => Branch)
  @JoinColumn({ name: 'branch_id', referencedColumnName: 'id' })
  branch: Branch;

  @ManyToOne(() => ContractType)
  @JoinColumn({ name: 'ref_contract_type_id', referencedColumnName: 'id' })
  contractType: ContractType;

  @ManyToOne(() => Coop)
  @JoinColumn({ name: 'coop_id', referencedColumnName: 'id' })
  coop: Coop;

  @ManyToOne(() => Contract, (cp) => cp.children)
  @JoinColumn({ name: 'ref_contract_parent', referencedColumnName: 'id' })
  parent: Contract;

  @OneToMany(() => Contract, (cc) => cc.parent)
  @JoinColumn({ name: 'ref_contract_parent', referencedColumnName: 'id' })
  children: Contract[];

  @ManyToOne(() => User)
  @JoinColumn({ name: 'modified_by', referencedColumnName: 'id' })
  userModifier: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by', referencedColumnName: 'id' })
  userCreator: User;
}
