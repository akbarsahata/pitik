import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BoolSmallIntTransformer } from '../../../libs/utils/transformers';
import { CMSBase } from './Base.entity';
import { GoodsReceipt } from './GoodsReceipt.entity';
import { PurchaseOrderProduct } from './PurchaseOrderProduct.entity';
import { PurchaseRequest } from './PurchaseRequest.entity';

@Entity('purchaseorder')
export class PurchaseOrder extends CMSBase {
  @Column({ name: 'erp_code', type: 'varchar', length: 50 })
  erpCode: string;

  @Column({ name: 'type', type: 'enum', enum: ['doc', 'pakan', 'ovk'] })
  type: string;

  @Column({ name: 'farmingcycle_id', type: 'varchar', length: 32 })
  farmingCycleId: string;

  @Column({ name: 'purchaserequest_id', type: 'varchar', length: 32 })
  purchaseRequestId: string;

  @Column({ name: 'date_planned', type: 'date' })
  datePlanned: string;

  @Column({ name: 'is_doc', type: 'bool' })
  isDoc: boolean;

  @Column({ name: 'is_fulfilled', type: 'smallint', transformer: new BoolSmallIntTransformer() })
  isFulfilled: boolean;

  @Column({ name: 'is_approved', type: 'bool' })
  isApproved: boolean;

  @Column({ name: 'remarks', type: 'text' })
  remarks: string;

  @Column({ name: 'approved_by', type: 'varchar', length: 32 })
  approvedBy: string;

  @Column({ name: 'notes', type: 'text' })
  notes: string;

  @ManyToOne(() => PurchaseRequest, (pr) => pr.purchaseOrders)
  @JoinColumn({ referencedColumnName: 'id', name: 'purchaserequest_id' })
  purchaseRequest: PurchaseRequest;

  @OneToMany(() => PurchaseOrderProduct, (prp) => prp.purchasOrder)
  @JoinColumn({ referencedColumnName: 'id' })
  purchaseOrderProducts: PurchaseOrderProduct[];

  @OneToMany(() => GoodsReceipt, (gr) => gr.purchaseOrder)
  @JoinColumn({ referencedColumnName: 'id' })
  goodsReceipts: GoodsReceipt[];
}
