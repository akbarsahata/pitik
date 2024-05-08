import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { PurchaseOrder } from './PurchaseOrder.entity';

@Entity('purchaseorderproduct')
export class PurchaseOrderProduct {
  @PrimaryColumn({ name: 'id', type: 'varchar', length: 32 })
  id: string;

  @Column({ name: 'purchaseorder_id', type: 'varchar', length: 32 })
  purchaseOrderId: string;

  @Column({ name: 'category_code', type: 'varchar', length: 50, nullable: true })
  categoryCode: string | null;

  @Column({ name: 'category_name', type: 'varchar', length: 50, nullable: true })
  categoryName: string | null;

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

  @Column({ name: 'uom', type: 'varchar', length: 15 })
  uom: string;

  @Column({ name: 'returned_date', type: 'timestamp', nullable: true })
  returnedDate: Date | null;

  @ManyToOne(() => PurchaseOrder, (pr) => pr.purchaseOrderProducts)
  @JoinColumn({ name: 'purchaseorder_id' })
  purchasOrder: PurchaseOrder;
}
