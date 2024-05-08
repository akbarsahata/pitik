/* eslint-disable no-unused-vars */
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { CMSBase } from './Base.entity';
import { ChickInRequest } from './ChickInRequest.entity';
import { FarmingCycle } from './FarmingCycle.entity';
import { LogisticInfo } from './LogisticInfo.entity';
import { PurchaseOrder } from './PurchaseOrder.entity';
import { PurchaseRequestProduct } from './PurchaseRequestProduct.entity';
import { TransferRequest } from './TransferRequest.entity';
import { User } from './User.entity';

export enum PurchaseRequestTypeEnum {
  doc = 'doc',
  pakan = 'pakan',
  ovk = 'ovk',
}

@Entity('purchaserequest')
export class PurchaseRequest extends CMSBase {
  @Column({ name: 'erp_code', type: 'varchar', length: 50 })
  erpCode: string;

  @Column({ name: 'type', type: 'enum', enum: PurchaseRequestTypeEnum })
  type: keyof typeof PurchaseRequestTypeEnum;

  @Column({ name: 'farmingcycle_id', type: 'varchar', length: 32 })
  farmingCycleId: string;

  @Column({ name: 'chickinrequest_id', type: 'varchar', length: 32 })
  chickInRequestId: string;

  @Column({ name: 'request_schedule', type: 'date' })
  requestSchedule: string;

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

  @Column({ name: 'merged_logistic', type: 'boolean' })
  mergedLogistic: boolean;

  @Column({ name: 'logistic_info_id', type: 'varchar', length: 32 })
  logisticInfoId: string;

  @Column({ name: 'internal_ovk_transfer_request_id', type: 'varchar', nullable: true })
  internalOvkTransferRequestId: string | null;

  @OneToMany(() => PurchaseOrder, (po) => po.purchaseRequest)
  @JoinColumn({ referencedColumnName: 'id' })
  purchaseOrders: PurchaseOrder[];

  @OneToOne(() => FarmingCycle)
  @JoinColumn({ name: 'farmingcycle_id', referencedColumnName: 'id' })
  farmingCycle: FarmingCycle;

  @OneToOne(() => ChickInRequest)
  @JoinColumn({ name: 'chickinrequest_id', referencedColumnName: 'id' })
  chickInRequest: ChickInRequest;

  @OneToOne(() => User)
  @JoinColumn({ name: 'approved_by', referencedColumnName: 'id' })
  userApprover: User;

  @OneToOne(() => User)
  @JoinColumn({ name: 'created_by', referencedColumnName: 'id' })
  userCreator: User;

  @OneToMany(() => PurchaseRequestProduct, (prd) => prd.purchaseRequest)
  @JoinColumn({ referencedColumnName: 'id' })
  products: PurchaseRequestProduct[];

  @OneToOne(() => LogisticInfo)
  @JoinColumn({ name: 'logistic_info_id', referencedColumnName: 'id' })
  logisticInfo: LogisticInfo;

  @OneToOne(() => TransferRequest)
  @JoinColumn({ name: 'internal_ovk_transfer_request_id', referencedColumnName: 'id' })
  internalOvkTransferRequest?: TransferRequest;
}
