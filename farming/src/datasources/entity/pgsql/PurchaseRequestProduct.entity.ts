import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { PurchaseRequest } from './PurchaseRequest.entity';

@Entity('purchaserequestproduct')
export class PurchaseRequestProduct {
  @PrimaryColumn({ name: 'id', type: 'varchar', length: 32 })
  id: string;

  @Column({ name: 'purchaserequest_id', type: 'varchar', length: 32 })
  purchaseRequestId: string;

  @Column({ name: 'category_code', type: 'varchar', length: 50 })
  categoryCode: string;

  @Column({ name: 'category_name', type: 'varchar', length: 50 })
  categoryName: string;

  @Column({ name: 'subcategory_code', type: 'varchar', length: 50 })
  subcategoryCode: string;

  @Column({ name: 'subcategory_name', type: 'varchar', length: 50 })
  subcategoryName: string;

  @Column({ name: 'product_code', type: 'varchar', length: 50 })
  productCode: string;

  @Column({ name: 'product_name', type: 'varchar', length: 50 })
  productName: string;

  @Column({ name: 'quantity', type: 'int' })
  quantity: number;

  /**
   * purchase UOM
   */
  @Column({ name: 'uom', type: 'varchar', length: 50 })
  uom: string;

  @ManyToOne(() => PurchaseRequest, (pr) => pr.products)
  @JoinColumn({ name: 'purchaserequest_id', referencedColumnName: 'id' })
  purchaseRequest: PurchaseRequest;
}
