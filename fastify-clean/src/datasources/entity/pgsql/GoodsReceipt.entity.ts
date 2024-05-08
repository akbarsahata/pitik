import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { CMSBase } from './Base.entity';
import { GoodsReceiptPhoto } from './GoodsReceiptPhoto.entity';
import { GoodsReceiptProduct } from './GoodsReceiptProduct.entity';
import { PurchaseOrder } from './PurchaseOrder.entity';
import { TransferRequest } from './TransferRequest.entity';
import { User } from './User.entity';

@Entity('goodsreceipt')
export class GoodsReceipt extends CMSBase {
  @Column({ name: 'erp_code', type: 'varchar', length: 50 })
  erpCode: string;

  @Column({ name: 'received_date', type: 'date' })
  receivedDate: string;

  @Column({ name: 'remarks', type: 'text' })
  remarks: string;

  @Column({ name: 'purchaseorder_id', type: 'varchar', length: 32 })
  purchaseOrderId: string;

  @Column({ name: 'transferrequest_id', type: 'varchar', length: 32 })
  transferRequestId: string;

  @Column({ name: 'notes', type: 'text' })
  notes: string;

  @OneToOne(() => PurchaseOrder)
  @JoinColumn({ name: 'purchaseorder_id', referencedColumnName: 'id' })
  purchaseOrder: PurchaseOrder;

  @OneToOne(() => TransferRequest)
  @JoinColumn({ name: 'transferrequest_id', referencedColumnName: 'id' })
  transferRequest: TransferRequest;

  @OneToMany(() => GoodsReceiptProduct, (grp) => grp.goodsReceipt)
  @JoinColumn({ referencedColumnName: 'id' })
  goodsReceiptProducts: GoodsReceiptProduct[];

  @OneToMany(() => GoodsReceiptPhoto, (grp) => grp.goodsReceipt)
  @JoinColumn({ referencedColumnName: 'id' })
  photos: GoodsReceiptPhoto[];

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  userReporter: User;
}
