import { Column, Entity } from 'typeorm';

@Entity('t_contract')
export class ContractType {
  @Column({ name: 'id', type: 'varchar', primary: true })
  id: string;

  @Column({ name: 'contract_name', type: 'varchar', length: 100 })
  contractName: string;

  @Column({ name: 'status', type: 'varchar', length: 4 })
  status: string;
}
