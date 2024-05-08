import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { Area } from './Area.entity';
import { CMSBase } from './Base.entity';
import { BranchCity } from './BranchCity.entity';
import { BranchSapronakStock } from './BranchSapronakStock.entity';
import { OperationUnit } from './sales/OperationUnit.entity';
import { TransferRequest } from './TransferRequest.entity';

@Entity('branch')
export class Branch extends CMSBase {
  @Column({ name: 'code', type: 'varchar', length: 50 })
  code: string;

  @Column({ name: 'name', type: 'varchar', length: 50 })
  name: string;

  @Column({ name: 'is_active', type: 'bool', default: false })
  isActive: boolean;

  @Column({ name: 'area_id', type: 'varchar', length: 32 })
  areaId: string;

  @OneToOne(() => Area)
  @JoinColumn({ name: 'area_id', referencedColumnName: 'id' })
  area: Area;

  @OneToMany(() => TransferRequest, (tr) => tr.branchSource)
  @JoinColumn({ name: 'id', referencedColumnName: 'branchsource_id' })
  enteringTransferRequests: TransferRequest[];

  @OneToMany(() => TransferRequest, (tr) => tr.branchSource)
  @JoinColumn({ name: 'id', referencedColumnName: 'branchtarget_id' })
  exitingTransferRequest: TransferRequest[];

  @OneToMany(() => BranchSapronakStock, (bsp) => bsp.branch)
  @JoinColumn({ referencedColumnName: 'id' })
  sapronakStocks: BranchSapronakStock[];

  @OneToMany(() => OperationUnit, (b) => b.branch)
  @JoinColumn({ referencedColumnName: 'ref_branch_id' })
  operationUnits: OperationUnit[] | null;

  @OneToMany(() => BranchCity, (b) => b.branch)
  @JoinColumn({ referencedColumnName: 'ref_branch_id' })
  branchCities: BranchCity[];
}
