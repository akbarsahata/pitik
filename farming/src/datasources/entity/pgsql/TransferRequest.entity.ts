/* eslint-disable no-unused-vars */
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { CMSBase } from './Base.entity';
import { Branch } from './Branch.entity';
import { Coop } from './Coop.entity';
import { FarmingCycle } from './FarmingCycle.entity';
import { GoodsReceipt } from './GoodsReceipt.entity';
import { PurchaseRequest } from './PurchaseRequest.entity';
import { TransferRequestPhoto } from './TransferRequestPhoto.entity';
import { TransferRequestProduct } from './TransferRequestProduct.entity';
import { User } from './User.entity';

export enum LogisticOptionEnum {
  Pribadi = 'Pribadi',
  DisediakanProcurement = 'DisediakanProcurement',
}

@Entity('transferrequest')
export class TransferRequest extends CMSBase {
  @Column({ name: 'erp_code', type: 'varchar', length: 50 })
  erpCode: string;

  @Column({ name: 'farmingcycle_id', type: 'varchar', length: 32 })
  farmingCycleId: string;

  @Column({ name: 'coopsource_id', type: 'varchar', nullable: true })
  coopSourceId: string | null;

  @Column({ name: 'cooptarget_id', type: 'varchar', nullable: true })
  coopTargetId: string | null;

  @Column({ name: 'branchsource_id', type: 'varchar', nullable: true })
  branchSourceId: string | null;

  @Column({ name: 'branchtarget_id', type: 'varchar', nullable: true })
  branchTargetId: string | null;

  @Column({ name: 'farmingcycle_target_id', type: 'varchar', length: 32 })
  farmingCycleTargetId: string | null;

  @Column({
    name: 'route',
    type: 'enum',
    enum: ['COOP-TO-COOP', 'COOP-TO-BRANCH', 'BRANCH-TO-COOP'],
  })
  route: 'COOP-TO-COOP' | 'COOP-TO-BRANCH' | 'BRANCH-TO-COOP';

  @Column({ name: 'date_planned', type: 'date' })
  datePlanned: string;

  @Column({ name: 'logistic_option', type: 'varchar', length: 50 })
  logisticOption: keyof typeof LogisticOptionEnum;

  @Column({ name: 'subcategory_code', type: 'varchar', length: 50 })
  subcategoryCode: string;

  @Column({ name: 'subcategory_name', type: 'varchar', length: 50 })
  subcategoryName: string;

  @Column({ name: 'quantity', type: 'int8' })
  quantity: number;

  @Column({ name: 'is_approved', type: 'bool' })
  isApproved: boolean;

  @Column({ name: 'remarks', type: 'text' })
  remarks: string;

  @Column({ name: 'approved_by', type: 'varchar', length: 32 })
  approvedBy: string;

  @Column({ name: 'notes', type: 'text' })
  notes: string;

  @Column({ name: 'cancellation_request_by', type: 'varchar', length: 32 })
  cancellationRequestBy: string | null;

  @Column({ name: 'product_name', type: 'varchar' })
  productName: string | null;

  @Column({ name: 'type', type: 'enum', enum: ['pakan', 'ovk'] })
  type: 'pakan' | 'ovk';

  @Column({ name: 'product_code', type: 'varchar', length: 50 })
  productCode: string | null;

  @ManyToOne(() => FarmingCycle, (fc) => fc.transferRequestsExit)
  @JoinColumn({ name: 'farmingcycle_id' })
  farmingCycle: FarmingCycle;

  @ManyToOne(() => FarmingCycle, (fc) => fc.transferRequestsExit)
  @JoinColumn({ name: 'farmingcycle_target_id' })
  farmingCycleTarget: FarmingCycle;

  @ManyToOne(() => Coop, (c) => c.exitingTransferRequests)
  @JoinColumn({ name: 'coopsource_id' })
  coopSource?: Coop;

  @ManyToOne(() => Coop, (c) => c.enteringTransferRequests)
  @JoinColumn({ name: 'cooptarget_id' })
  coopTarget?: Coop;

  @ManyToOne(() => Branch, (b) => b.enteringTransferRequests)
  @JoinColumn({ name: 'branchsource_id' })
  branchSource?: Branch;

  @ManyToOne(() => Branch, (b) => b.exitingTransferRequest)
  @JoinColumn({ name: 'branchtarget_id' })
  branchTarget?: Branch;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'approved_by' })
  userApprover: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  userRequester: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'cancellation_request_by' })
  cancellationRequester: User | null;

  @OneToMany(() => TransferRequestProduct, (trp) => trp.transferRequest)
  @JoinColumn({ referencedColumnName: 'id' })
  transferRequestProducts: TransferRequestProduct[];

  @OneToMany(() => TransferRequestPhoto, (trp) => trp.transferRequest)
  @JoinColumn({ referencedColumnName: 'id' })
  photos: TransferRequestPhoto[];

  @OneToMany(() => GoodsReceipt, (gr) => gr.transferRequest)
  @JoinColumn({ referencedColumnName: 'id' })
  goodsReceipts: GoodsReceipt[];

  @OneToMany(() => PurchaseRequest, (pr) => pr.internalOvkTransferRequest)
  @JoinColumn({ referencedColumnName: 'id' })
  purchaseRequests: PurchaseRequest[];
}
